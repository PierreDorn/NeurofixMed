'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications, playAlertBeep } from '@/lib/hooks/useNotifications';
import {
  fetchPendingReminders, markReminderDispatched,
  listNotifications, markNotificationsRead,
  type NotificationRow, type PendingReminder,
} from '@/app/notifications-actions';

const POLL_MS = 60_000; // verifica reminders a cada 60s
const REFRESH_LIST_MS = 90_000; // recarrega histórico

export default function NotificationCenter() {
  const router = useRouter();
  const { sendNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [criticalAlarm, setCriticalAlarm] = useState<PendingReminder | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Registra o Service Worker uma vez
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw-notifications.js').catch(() => { /* ignore */ });
  }, []);

  // Carrega histórico
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const list = await listNotifications(20);
      if (!cancelled) setItems(list);
    }
    load();
    const t = setInterval(load, REFRESH_LIST_MS);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  // Polling de lembretes vencidos
  useEffect(() => {
    let cancelled = false;
    const dispatched = new Set<string>();

    async function tick() {
      if (cancelled) return;
      try {
        const pending = await fetchPendingReminders();
        for (const r of pending) {
          if (dispatched.has(r.reminder_id)) continue;
          dispatched.add(r.reminder_id);

          const data = new Date(r.data_inicio);
          const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          await sendNotification(`⏰ ${r.evento_titulo}`, {
            body: `${hora}${r.evento_descricao ? ' • ' + r.evento_descricao : ''}`,
            tag: `evento-${r.event_id}`,
            data: { url: '/agenda' },
            som: r.som_ativo,
          });

          await markReminderDispatched(r.reminder_id, {
            titulo: `Lembrete: ${r.evento_titulo}`,
            corpo: r.evento_descricao ?? `Evento às ${hora}`,
            tipo: 'lembrete_evento',
            referencia_id: r.event_id,
            referencia_tipo: 'event',
          });

          // Eventos críticos (prova) abrem modal full-screen
          if (r.evento_tipo === 'prova') {
            setCriticalAlarm(r);
          }
        }
        if (pending.length > 0) {
          // Atualiza badge
          const list = await listNotifications(20);
          setItems(list);
        }
      } catch {
        /* offline ou sessão expirada — silencioso */
      }
    }

    tick();
    const t = setInterval(tick, POLL_MS);
    return () => { cancelled = true; clearInterval(t); };
  }, [sendNotification]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const unread = items.filter(i => !i.lida).length;

  async function handleOpen() {
    setOpen(prev => !prev);
    if (!open && unread > 0) {
      await markNotificationsRead();
      setItems(prev => prev.map(i => ({ ...i, lida: true })));
    }
  }

  function clickItem(n: NotificationRow) {
    setOpen(false);
    if (n.referencia_tipo === 'event') router.push('/agenda');
    else router.push('/agenda');
  }

  async function dismissCritical() {
    setCriticalAlarm(null);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BELL_CSS }} />

      <div className="nc-wrap" ref={dropdownRef}>
        <button type="button" className="nc-bell" onClick={handleOpen} aria-label={`Notificações ${unread > 0 ? `(${unread} não lidas)` : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          {unread > 0 && <span className="nc-badge">{unread > 9 ? '9+' : unread}</span>}
        </button>

        {open && (
          <div className="nc-drop">
            <div className="nc-drop-h">
              <strong>Notificações</strong>
              <span>{items.length === 0 ? 'Sem alertas' : `${items.length} ${items.length === 1 ? 'item' : 'itens'}`}</span>
            </div>
            <div className="nc-drop-list">
              {items.length === 0 && (
                <p className="nc-empty">Você está em dia. Os lembretes da agenda aparecerão aqui. 🛎</p>
              )}
              {items.map(n => (
                <button key={n.id} type="button" className={`nc-item${n.lida ? '' : ' unread'}`} onClick={() => clickItem(n)}>
                  <strong>{n.titulo}</strong>
                  {n.corpo && <span>{n.corpo}</span>}
                  <time>{new Date(n.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</time>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {criticalAlarm && (
        <div className="nc-crit-overlay">
          <div className="nc-crit">
            <div className="nc-crit-pulse" />
            <div className="nc-crit-ic" style={{ background: `${criticalAlarm.evento_cor}22`, color: criticalAlarm.evento_cor }}>📝</div>
            <div className="nc-crit-kicker">PROVA AGENDADA</div>
            <h2>{criticalAlarm.evento_titulo}</h2>
            {criticalAlarm.evento_descricao && <p>{criticalAlarm.evento_descricao}</p>}
            <div className="nc-crit-time">
              {new Date(criticalAlarm.data_inicio).toLocaleString('pt-BR', {
                day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit',
              })}
            </div>
            <div className="nc-crit-actions">
              <button type="button" className="nc-crit-btn ghost" onClick={dismissCritical}>Descartar</button>
              <button type="button" className="nc-crit-btn primary" onClick={() => { dismissCritical(); router.push('/agenda'); }}>Ver na agenda</button>
            </div>
            <button type="button" className="nc-crit-snooze" onClick={() => { playAlertBeep(0.2); }}>🔔 Repetir som</button>
          </div>
        </div>
      )}
    </>
  );
}

const BELL_CSS = `
.nc-wrap{position:fixed;top:16px;right:18px;z-index:90;font-family:'Atkinson Hyperlegible','Inter',sans-serif}
.nc-bell{position:relative;width:40px;height:40px;border-radius:12px;background:rgba(15,19,28,0.85);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.08);color:#F7F7F8;cursor:pointer;display:grid;place-items:center;transition:all .15s}
.nc-bell:hover{background:rgba(22,27,39,0.9);border-color:rgba(201,168,76,0.22)}
.nc-badge{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#ef4444;color:#fff;font-size:10px;font-weight:800;display:grid;place-items:center;border:2px solid #050505}
.nc-drop{position:absolute;top:48px;right:0;width:340px;max-width:calc(100vw - 36px);background:#0F131C;border:1px solid rgba(255,255,255,0.08);border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,.6);overflow:hidden;color:#F7F7F8;animation:nc-fade .15s ease}
@keyframes nc-fade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.nc-drop-h{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.06)}
.nc-drop-h strong{font-size:14px;font-weight:800}
.nc-drop-h span{font-size:11px;color:rgba(247,247,248,.5);font-weight:600}
.nc-drop-list{max-height:60vh;overflow-y:auto}
.nc-empty{padding:24px 18px;text-align:center;font-size:12.5px;color:rgba(247,247,248,.5);font-style:italic;margin:0}
.nc-item{display:flex;flex-direction:column;gap:3px;padding:11px 16px;border:none;background:transparent;text-align:left;cursor:pointer;width:100%;font-family:inherit;color:#F7F7F8;border-bottom:1px solid rgba(255,255,255,0.04);transition:background .15s}
.nc-item:hover{background:rgba(255,255,255,0.03)}
.nc-item.unread{background:rgba(201,168,76,0.05);border-left:3px solid #C9A84C}
.nc-item strong{font-size:13px;font-weight:700;line-height:1.3}
.nc-item span{font-size:12px;color:rgba(247,247,248,.6);line-height:1.4}
.nc-item time{font-size:10.5px;color:rgba(247,247,248,.4);margin-top:2px}

.nc-crit-overlay{position:fixed;inset:0;background:rgba(0,0,0,.86);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(8px);padding:24px;animation:nc-fade .25s ease}
.nc-crit{background:#0F131C;border:2px solid #ef4444;border-radius:24px;padding:36px 30px;max-width:460px;width:100%;text-align:center;font-family:'Atkinson Hyperlegible','Inter',sans-serif;color:#F7F7F8;box-shadow:0 0 80px rgba(239,68,68,.3);position:relative}
.nc-crit-pulse{position:absolute;inset:-4px;border-radius:26px;border:2px solid rgba(239,68,68,.4);animation:nc-pulse 1.6s ease-in-out infinite;pointer-events:none}
@keyframes nc-pulse{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:0;transform:scale(1.04)}}
.nc-crit-ic{width:64px;height:64px;border-radius:18px;display:grid;place-items:center;font-size:30px;margin:0 auto 16px}
.nc-crit-kicker{font-size:11px;font-weight:800;letter-spacing:.2em;color:#ef4444;margin-bottom:6px}
.nc-crit h2{font-size:24px;font-weight:900;letter-spacing:-.02em;margin:0 0 8px}
.nc-crit p{font-size:13.5px;color:rgba(247,247,248,.7);line-height:1.5;margin:0 0 14px}
.nc-crit-time{font-size:14px;font-weight:700;color:#E8D08A;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.22);padding:9px 16px;border-radius:10px;display:inline-block;margin-bottom:18px}
.nc-crit-actions{display:flex;gap:10px;justify-content:center;margin-bottom:8px}
.nc-crit-btn{padding:10px 22px;border-radius:10px;font-size:13.5px;font-weight:800;cursor:pointer;font-family:inherit;border:1px solid rgba(255,255,255,0.1);transition:all .15s}
.nc-crit-btn.primary{background:#C9A84C;color:#000;border-color:#C9A84C}
.nc-crit-btn.primary:hover{background:#E8D08A}
.nc-crit-btn.ghost{background:transparent;color:rgba(247,247,248,.7)}
.nc-crit-btn.ghost:hover{background:rgba(255,255,255,0.05);color:#fff}
.nc-crit-snooze{background:transparent;border:none;color:rgba(247,247,248,.45);font-size:12px;font-family:inherit;cursor:pointer;padding:6px}
.nc-crit-snooze:hover{color:#fff}
`;
