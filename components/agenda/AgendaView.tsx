'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import EventoModal, { type EventoExistente } from './EventoModal';
import { toggleEventConcluido } from '@/app/(app)/agenda/actions';
import { expandRecurrence, type Frequencia } from '@/lib/recurrence';

interface EventoRow {
  id: string;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string | null;
  dia_todo: boolean;
  tipo: string;
  cor: string;
  local: string | null;
  origem: string;
  referencia_id: string | null;
  referencia_tipo: string | null;
  concluido: boolean;
}

interface RecurrenceRow {
  event_id: string;
  frequencia: string;
  intervalo: number;
  dias_semana: string[] | null;
  data_fim_recorrencia: string | null;
}

interface Props {
  events: EventoRow[];
  recurrences: RecurrenceRow[];
  windowStartISO: string;
  windowEndISO: string;
}

type ViewMode = 'day' | 'week' | 'month';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DIAS_NOMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DIAS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESES_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function startOfDay(d: Date): Date { const n = new Date(d); n.setHours(0,0,0,0); return n; }
function startOfWeek(d: Date): Date { const n = startOfDay(d); n.setDate(n.getDate() - n.getDay()); return n; }
function startOfMonth(d: Date): Date { const n = new Date(d.getFullYear(), d.getMonth(), 1); n.setHours(0,0,0,0); return n; }
function addDays(d: Date, n: number): Date { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function hourFraction(date: Date): number {
  return date.getHours() + date.getMinutes() / 60;
}

export default function AgendaView({ events: initialEvents, recurrences, windowStartISO, windowEndISO }: Props) {
  const router = useRouter();
  const [events] = useState<EventoRow[]>(initialEvents);
  const [view, setView] = useState<ViewMode>('week');
  const [anchor, setAnchor] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | undefined>(undefined);
  const [editing, setEditing] = useState<EventoExistente | null>(null);

  // Expande recorrências server-side window
  const expandedEvents = useMemo(() => {
    const all: EventoRow[] = [...events];
    const winStart = new Date(windowStartISO);
    const winEnd = new Date(windowEndISO);
    const recByEvent = new Map<string, RecurrenceRow>();
    for (const r of recurrences) recByEvent.set(r.event_id, r);

    for (const ev of events) {
      const rule = recByEvent.get(ev.id);
      if (!rule) continue;
      const firstStart = new Date(ev.data_inicio);
      const durMs = ev.data_fim ? new Date(ev.data_fim).getTime() - firstStart.getTime() : 0;

      const dates = expandRecurrence(
        firstStart,
        {
          frequencia: rule.frequencia as Frequencia,
          intervalo: rule.intervalo,
          dias_semana: rule.dias_semana,
          data_fim_recorrencia: rule.data_fim_recorrencia,
        },
        winStart,
        winEnd,
      );

      for (const d of dates) {
        all.push({
          ...ev,
          id: `${ev.id}::virtual::${d.getTime()}`,
          data_inicio: d.toISOString(),
          data_fim: durMs > 0 ? new Date(d.getTime() + durMs).toISOString() : null,
          concluido: false, // recorrências sempre re-aparecem
        });
      }
    }
    return all;
  }, [events, recurrences, windowStartISO, windowEndISO]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventoRow[]>();
    for (const e of expandedEvents) {
      const d = new Date(e.data_inicio);
      const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    }
    return map;
  }, [expandedEvents]);

  function dayKey(d: Date) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
  function dayEvents(d: Date): EventoRow[] { return eventsByDay.get(dayKey(d)) ?? []; }

  function openCreate(d?: Date) {
    setEditing(null);
    setModalDate(d ?? new Date());
    setModalOpen(true);
  }
  function openEdit(e: EventoRow) {
    // Eventos virtuais (recorrência expandida) editam o evento-mãe
    const realId = e.id.includes('::virtual::') ? e.id.split('::virtual::')[0] : e.id;
    setEditing({
      id: realId, titulo: e.titulo, descricao: e.descricao,
      data_inicio: e.data_inicio, data_fim: e.data_fim, dia_todo: e.dia_todo,
      tipo: e.tipo, cor: e.cor, local: e.local,
      origem: e.origem,
      referencia_id: e.referencia_id,
      referencia_tipo: e.referencia_tipo,
      concluido: e.concluido,
    });
    setModalOpen(true);
  }
  function handleSaved() { router.refresh(); }

  function shift(direction: -1 | 1) {
    const n = new Date(anchor);
    if (view === 'day')   n.setDate(n.getDate() + direction);
    if (view === 'week')  n.setDate(n.getDate() + direction * 7);
    if (view === 'month') n.setMonth(n.getMonth() + direction);
    setAnchor(n);
  }
  function goToday() { setAnchor(new Date()); }

  // Próximas revisões automáticas (sidebar direita)
  const upcomingRevisoes = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => e.origem === 'revisao_automatica' && !e.concluido && new Date(e.data_inicio) >= now)
      .slice(0, 8);
  }, [events]);

  const todayEvents = useMemo(() => dayEvents(new Date()), [eventsByDay]);

  const headerLabel = view === 'day'
    ? `${DIAS_FULL[anchor.getDay()]}, ${anchor.getDate()} de ${MESES_FULL[anchor.getMonth()]}`
    : view === 'week'
      ? (() => { const s = startOfWeek(anchor); const e = addDays(s, 6);
          if (s.getMonth() === e.getMonth()) return `${s.getDate()}–${e.getDate()} de ${MESES_FULL[s.getMonth()]} ${s.getFullYear()}`;
          return `${s.getDate()} ${MESES[s.getMonth()]} – ${e.getDate()} ${MESES[e.getMonth()]} ${s.getFullYear()}`;
        })()
      : `${MESES_FULL[anchor.getMonth()]} ${anchor.getFullYear()}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ag-toolbar">
        <div className="ag-toolbar-left">
          <div className="ag-kicker">Sua agenda</div>
          <div className="ag-title">{headerLabel}</div>
        </div>
        <div className="ag-toolbar-right">
          <div className="ag-view-switch">
            {(['day','week','month'] as ViewMode[]).map(v => (
              <button
                key={v}
                type="button"
                className={`ag-view-btn${view === v ? ' active' : ''}`}
                onClick={() => setView(v)}
              >
                {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>
          <button type="button" className="ag-nav-btn" onClick={() => shift(-1)} aria-label="Anterior">‹</button>
          <button type="button" className="ag-today-btn" onClick={goToday} title="Ir para hoje">
            {view === 'day' ? 'Dia' : view === 'week' ? 'Semana' : 'Mês'}
          </button>
          <button type="button" className="ag-nav-btn" onClick={() => shift(1)} aria-label="Próximo">›</button>
          <button type="button" className="ag-new-btn" onClick={() => openCreate(anchor)}>＋ Novo evento</button>
        </div>
      </div>

      <div className="ag-shell">
        <section className="ag-content">
          {view === 'day' && <DayView date={anchor} events={dayEvents(anchor)} onClickEvent={openEdit} onClickEmpty={() => openCreate(anchor)} />}
          {view === 'week' && <WeekView start={startOfWeek(anchor)} dayEvents={dayEvents} onClickEvent={openEdit} onClickDay={openCreate} />}
          {view === 'month' && <MonthView anchor={anchor} dayEvents={dayEvents} onClickDay={d => { setAnchor(d); setView('day'); }} />}
        </section>

        <aside className="ag-side">
          <div className="ag-side-card">
            <div className="ag-side-h">Hoje</div>
            {todayEvents.length === 0 ? (
              <p className="ag-empty">Nada agendado para hoje.</p>
            ) : todayEvents.map(e => (
              <button key={e.id} type="button" className={`ag-side-evt${e.concluido ? ' done' : ''}`} onClick={() => openEdit(e)}>
                <span className="ag-side-dot" style={{ background: e.cor }} />
                <div>
                  <strong>{e.titulo}</strong>
                  <span>{e.dia_todo ? 'Dia todo' : new Date(e.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="ag-side-card">
            <div className="ag-side-h">Próximas revisões 🧠</div>
            {upcomingRevisoes.length === 0 ? (
              <p className="ag-empty">Nenhuma revisão programada.</p>
            ) : upcomingRevisoes.map(e => {
              const d = new Date(e.data_inicio);
              return (
                <button key={e.id} type="button" className="ag-side-evt" onClick={() => openEdit(e)}>
                  <span className="ag-side-dot" style={{ background: '#4AB3FF' }} />
                  <div>
                    <strong>{e.titulo}</strong>
                    <span>{d.toLocaleDateString('pt-BR')} • {d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      <EventoModal
        open={modalOpen}
        initialDate={modalDate}
        editing={editing}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </>
  );
}

// ─── DAY VIEW ───────────────────────────────────────────────────────────
function DayView({ date, events, onClickEvent, onClickEmpty }: {
  date: Date; events: EventoRow[]; onClickEvent: (e: EventoRow) => void; onClickEmpty: () => void;
}) {
  const allDay = events.filter(e => e.dia_todo);
  const timed = events.filter(e => !e.dia_todo);

  return (
    <div className="dv">
      {allDay.length > 0 && (
        <div className="dv-allday">
          <div className="dv-allday-label">Dia todo</div>
          <div className="dv-allday-list">
            {allDay.map(e => (
              <button key={e.id} type="button" className={`dv-allday-pill${e.concluido ? ' done' : ''}`} style={{ borderColor: e.cor, color: e.cor }} onClick={() => onClickEvent(e)}>
                {e.titulo}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="dv-grid" onClick={onClickEmpty}>
        {HOURS.map(h => (
          <div key={h} className="dv-row">
            <div className="dv-hour">{String(h).padStart(2, '0')}:00</div>
            <div className="dv-cell" />
          </div>
        ))}
        {timed.map(e => {
          const start = new Date(e.data_inicio);
          const end = e.data_fim ? new Date(e.data_fim) : new Date(start.getTime() + 30 * 60 * 1000);
          const top = hourFraction(start) * 56;
          const height = Math.max(28, (hourFraction(end) - hourFraction(start)) * 56);
          return (
            <button
              key={e.id}
              type="button"
              onClick={ev => { ev.stopPropagation(); onClickEvent(e); }}
              className={`dv-event${e.concluido ? ' done' : ''}${e.origem === 'revisao_automatica' ? ' revisao' : ''}`}
              style={{
                top, height,
                background: `${e.cor}22`,
                borderLeft: `3px solid ${e.cor}`,
              }}
            >
              <strong>{e.origem === 'revisao_automatica' ? '🧠 ' : ''}{e.titulo}</strong>
              <span>{start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}{e.data_fim ? ' – ' + end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── WEEK VIEW ──────────────────────────────────────────────────────────
function WeekView({ start, dayEvents, onClickEvent, onClickDay }: {
  start: Date; dayEvents: (d: Date) => EventoRow[]; onClickEvent: (e: EventoRow) => void; onClickDay: (d: Date) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const today = new Date();

  return (
    <div className="wv">
      <div className="wv-head">
        <div className="wv-corner" />
        {days.map(d => {
          const isToday = sameDay(d, today);
          return (
            <button key={d.toISOString()} type="button" className={`wv-day-h${isToday ? ' today' : ''}`} onClick={() => onClickDay(d)}>
              <span className="wv-day-name">{DIAS_NOMES[d.getDay()]}</span>
              <span className="wv-day-num">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      <div className="wv-allday">
        <div className="wv-allday-label">Dia todo</div>
        {days.map(d => {
          const list = dayEvents(d).filter(e => e.dia_todo);
          return (
            <div key={d.toISOString()} className="wv-allday-cell">
              {list.map(e => (
                <button key={e.id} type="button" className={`wv-allday-pill${e.concluido ? ' done' : ''}`} style={{ background: `${e.cor}22`, borderLeft: `3px solid ${e.cor}`, color: e.cor }} onClick={() => onClickEvent(e)}>
                  {e.titulo}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <div className="wv-grid">
        <div className="wv-hours">
          {HOURS.map(h => (
            <div key={h} className="wv-hour">{String(h).padStart(2, '0')}</div>
          ))}
        </div>
        {days.map(d => {
          const timed = dayEvents(d).filter(e => !e.dia_todo);
          return (
            <div key={d.toISOString()} className="wv-col" onClick={() => onClickDay(d)}>
              {HOURS.map(h => <div key={h} className="wv-hour-cell" />)}
              {timed.map(e => {
                const start = new Date(e.data_inicio);
                const end = e.data_fim ? new Date(e.data_fim) : new Date(start.getTime() + 30 * 60 * 1000);
                const top = hourFraction(start) * 42;
                const height = Math.max(22, (hourFraction(end) - hourFraction(start)) * 42);
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={ev => { ev.stopPropagation(); onClickEvent(e); }}
                    className={`wv-event${e.concluido ? ' done' : ''}${e.origem === 'revisao_automatica' ? ' revisao' : ''}`}
                    style={{ top, height, background: `${e.cor}22`, borderLeft: `3px solid ${e.cor}` }}
                  >
                    <strong>{e.origem === 'revisao_automatica' ? '🧠 ' : ''}{e.titulo}</strong>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MONTH VIEW ─────────────────────────────────────────────────────────
function MonthView({ anchor, dayEvents, onClickDay }: {
  anchor: Date; dayEvents: (d: Date) => EventoRow[]; onClickDay: (d: Date) => void;
}) {
  const monthStart = startOfMonth(anchor);
  const gridStart = startOfWeek(monthStart);
  const weeks = 6;
  const today = new Date();

  return (
    <div className="mv">
      <div className="mv-head">
        {DIAS_NOMES.map(d => <div key={d} className="mv-head-cell">{d}</div>)}
      </div>
      <div className="mv-grid">
        {Array.from({ length: weeks * 7 }, (_, i) => {
          const d = addDays(gridStart, i);
          const inMonth = d.getMonth() === anchor.getMonth();
          const isToday = sameDay(d, today);
          const list = dayEvents(d);
          return (
            <button key={i} type="button" className={`mv-cell${inMonth ? '' : ' out'}${isToday ? ' today' : ''}`} onClick={() => onClickDay(d)}>
              <div className="mv-cell-num">{d.getDate()}</div>
              <div className="mv-cell-events">
                {list.slice(0, 3).map(e => (
                  <span key={e.id} className={`mv-evt${e.concluido ? ' done' : ''}`} style={{ background: `${e.cor}33`, color: e.cor, borderLeft: `2px solid ${e.cor}` }}>
                    {e.origem === 'revisao_automatica' ? '🧠 ' : '•'} {e.titulo}
                  </span>
                ))}
                {list.length > 3 && <span className="mv-evt-more">+{list.length - 3}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const CSS = `
:root{--ag-gold:#C9A84C;--ag-gold-light:#E8D08A;--ag-blue:#4AB3FF;--ag-bg:#050505;--ag-surface:#0F131C;--ag-surface2:#161B27;--ag-border:rgba(255,255,255,0.08);--ag-text:#F7F7F8;--ag-text-dim:rgba(247,247,248,.62);--ag-text-muted:rgba(247,247,248,.42)}

.ag-toolbar{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin-bottom:20px;font-family:'Atkinson Hyperlegible','Inter',sans-serif;color:var(--ag-text);flex-wrap:wrap}
.ag-kicker{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--ag-gold-light)}
.ag-title{font-size:24px;line-height:1.1;font-weight:900;letter-spacing:-.02em;margin-top:4px}
.ag-toolbar-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ag-view-switch{display:inline-flex;background:var(--ag-surface);border:1px solid var(--ag-border);border-radius:10px;padding:3px;gap:2px}
.ag-view-btn{background:transparent;border:none;color:var(--ag-text-dim);font-size:13px;font-weight:600;padding:7px 14px;border-radius:8px;cursor:pointer;font-family:inherit;transition:all .15s}
.ag-view-btn:hover{color:var(--ag-text)}
.ag-view-btn.active{background:rgba(201,168,76,.12);color:var(--ag-gold-light)}
.ag-nav-btn{background:var(--ag-surface);border:1px solid var(--ag-border);color:var(--ag-text);width:34px;height:34px;border-radius:10px;cursor:pointer;font-size:18px;font-family:inherit;display:grid;place-items:center;transition:all .15s}
.ag-nav-btn:hover{background:var(--ag-surface2)}
.ag-today-btn{background:var(--ag-surface);border:1px solid var(--ag-border);color:var(--ag-text-dim);padding:8px 14px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
.ag-today-btn:hover{color:var(--ag-text)}
.ag-new-btn{background:var(--ag-gold);color:#000;border:none;padding:9px 16px;border-radius:10px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;transition:all .15s;letter-spacing:.01em}
.ag-new-btn:hover{background:var(--ag-gold-light)}

.ag-shell{display:grid;grid-template-columns:1fr 280px;gap:18px;font-family:'Atkinson Hyperlegible','Inter',sans-serif;color:var(--ag-text)}
@media(max-width:980px){.ag-shell{grid-template-columns:1fr}}
.ag-content{background:var(--ag-surface);border:1px solid var(--ag-border);border-radius:16px;overflow:hidden;min-width:0}

.ag-side{display:flex;flex-direction:column;gap:12px}
.ag-side-card{background:var(--ag-surface);border:1px solid var(--ag-border);border-radius:14px;padding:16px}
.ag-side-h{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--ag-text-dim);margin-bottom:12px}
.ag-empty{font-size:12.5px;color:var(--ag-text-muted);font-style:italic;margin:0}
.ag-side-evt{display:flex;align-items:flex-start;gap:10px;padding:9px 10px;border-radius:10px;border:none;background:transparent;text-align:left;cursor:pointer;font-family:inherit;width:100%;transition:background .15s;color:var(--ag-text);margin-bottom:4px}
.ag-side-evt:hover{background:rgba(255,255,255,0.03)}
.ag-side-evt.done{opacity:.5;text-decoration:line-through}
.ag-side-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:6px}
.ag-side-evt strong{display:block;font-size:13px;font-weight:700;line-height:1.3}
.ag-side-evt span{display:block;font-size:11.5px;color:var(--ag-text-dim);margin-top:2px}

/* DAY VIEW */
.dv{padding:0;display:flex;flex-direction:column;max-height:65vh;overflow:hidden}
.dv-allday{display:flex;gap:12px;padding:12px 18px;border-bottom:1px solid var(--ag-border);align-items:center}
.dv-allday-label{font-size:11px;color:var(--ag-text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.06em;flex-shrink:0;width:72px}
.dv-allday-list{display:flex;gap:6px;flex-wrap:wrap}
.dv-allday-pill{padding:5px 12px;border-radius:999px;border:1.5px solid;background:transparent;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit}
.dv-allday-pill.done{opacity:.5;text-decoration:line-through}
.dv-grid{position:relative;padding:8px 0;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:rgba(201,168,76,0.3) transparent}
.dv-grid::-webkit-scrollbar{width:8px}
.dv-grid::-webkit-scrollbar-track{background:transparent}
.dv-grid::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.25);border-radius:99px}
.dv-grid::-webkit-scrollbar-thumb:hover{background:rgba(201,168,76,0.45)}
.dv-row{display:flex;height:56px;border-top:1px solid rgba(255,255,255,0.03)}
.dv-hour{width:72px;flex-shrink:0;padding:4px 12px;font-size:11px;color:var(--ag-text-muted);text-align:right}
.dv-cell{flex:1;cursor:pointer}
.dv-event{position:absolute;left:84px;right:18px;border-radius:8px;padding:6px 10px;font-family:inherit;text-align:left;cursor:pointer;color:var(--ag-text);transition:transform .12s;overflow:hidden;border:1px solid transparent}
.dv-event:hover{transform:translateY(-1px)}
.dv-event.done{opacity:.5;text-decoration:line-through}
.dv-event strong{display:block;font-size:13px;font-weight:700;line-height:1.2}
.dv-event span{display:block;font-size:11px;color:var(--ag-text-dim);margin-top:2px}

/* WEEK VIEW */
.wv{display:flex;flex-direction:column;min-width:0}
.wv-head{display:grid;grid-template-columns:56px repeat(7,1fr);border-bottom:1px solid var(--ag-border)}
.wv-corner{}
.wv-day-h{padding:10px 0;background:transparent;border:none;color:var(--ag-text-dim);font-family:inherit;cursor:pointer;text-align:center;border-left:1px solid rgba(255,255,255,0.04);transition:background .15s}
.wv-day-h:hover{background:rgba(255,255,255,0.03)}
.wv-day-h.today .wv-day-num{background:var(--ag-gold);color:#000}
.wv-day-name{display:block;font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.wv-day-num{display:inline-block;font-size:16px;font-weight:800;color:var(--ag-text);margin-top:4px;padding:2px 9px;border-radius:8px;line-height:1.2}

.wv-allday{display:grid;grid-template-columns:56px repeat(7,1fr);border-bottom:1px solid var(--ag-border);min-height:32px}
.wv-allday-label{font-size:10px;color:var(--ag-text-muted);text-transform:uppercase;font-weight:700;padding:8px 4px 0;text-align:right}
.wv-allday-cell{padding:4px;display:flex;flex-direction:column;gap:2px;border-left:1px solid rgba(255,255,255,0.04)}
.wv-allday-pill{padding:3px 8px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;text-align:left;border:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wv-allday-pill.done{opacity:.5;text-decoration:line-through}

.wv-grid{display:grid;grid-template-columns:56px repeat(7,1fr);position:relative;overflow:auto;max-height:60vh;scrollbar-width:thin;scrollbar-color:rgba(201,168,76,0.3) transparent}
.wv-grid::-webkit-scrollbar{width:8px;height:8px}
.wv-grid::-webkit-scrollbar-track{background:transparent}
.wv-grid::-webkit-scrollbar-thumb{background:rgba(201,168,76,0.25);border-radius:99px}
.wv-grid::-webkit-scrollbar-thumb:hover{background:rgba(201,168,76,0.45)}
.wv-hours{display:flex;flex-direction:column}
.wv-hour{height:42px;font-size:10.5px;color:var(--ag-text-muted);text-align:right;padding:1px 6px}
.wv-col{position:relative;border-left:1px solid rgba(255,255,255,0.04);cursor:pointer;min-width:0}
.wv-hour-cell{height:42px;border-top:1px solid rgba(255,255,255,0.03)}
.wv-event{position:absolute;left:2px;right:2px;padding:3px 6px;border-radius:6px;font-family:inherit;text-align:left;cursor:pointer;color:var(--ag-text);border:1px solid transparent;overflow:hidden;transition:transform .12s}
.wv-event:hover{transform:translateY(-1px);z-index:5}
.wv-event.done{opacity:.5;text-decoration:line-through}
.wv-event strong{display:block;font-size:11px;font-weight:700;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* MONTH VIEW */
.mv{padding:0}
.mv-head{display:grid;grid-template-columns:repeat(7,1fr);background:var(--ag-surface2)}
.mv-head-cell{padding:10px;font-size:11px;font-weight:800;color:var(--ag-text-dim);text-align:center;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid var(--ag-border)}
.mv-grid{display:grid;grid-template-columns:repeat(7,1fr);grid-auto-rows:minmax(96px,1fr)}
.mv-cell{padding:6px;background:transparent;border:none;border-top:1px solid rgba(255,255,255,0.04);border-left:1px solid rgba(255,255,255,0.04);text-align:left;cursor:pointer;font-family:inherit;color:var(--ag-text);min-height:96px;display:flex;flex-direction:column;gap:4px;transition:background .15s;overflow:hidden}
.mv-cell:hover{background:rgba(255,255,255,0.02)}
.mv-cell.out{color:var(--ag-text-muted);opacity:.5}
.mv-cell.today .mv-cell-num{background:var(--ag-gold);color:#000;border-radius:7px;padding:0 6px}
.mv-cell-num{font-size:12.5px;font-weight:700;line-height:1.2;align-self:flex-start}
.mv-cell-events{display:flex;flex-direction:column;gap:2px;overflow:hidden}
.mv-evt{font-size:10.5px;font-weight:600;padding:2px 6px;border-radius:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mv-evt.done{opacity:.5;text-decoration:line-through}
.mv-evt-more{font-size:10px;color:var(--ag-text-dim);padding:1px 6px}

/* EVENT MODAL */
.evt-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px);padding:20px}
.evt-modal{background:#0F131C;border:1px solid rgba(201,168,76,0.22);border-radius:18px;max-width:560px;width:100%;max-height:92vh;display:flex;flex-direction:column;box-shadow:0 24px 60px rgba(0,0,0,.5);font-family:'Atkinson Hyperlegible','Inter',sans-serif;color:#F7F7F8}
.evt-modal-h{display:flex;justify-content:space-between;align-items:flex-start;padding:22px 24px 12px;gap:16px;border-bottom:1px solid var(--ag-border)}
.evt-modal-kicker{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#E8D08A;margin-bottom:4px}
.evt-modal-h h2{margin:0;font-size:18px;font-weight:800;letter-spacing:-.01em;line-height:1.2}
.evt-close{background:transparent;border:none;color:var(--ag-text-dim);font-size:24px;cursor:pointer;width:32px;height:32px;border-radius:8px;font-family:inherit;line-height:1;transition:all .15s}
.evt-close:hover{background:rgba(255,255,255,0.05);color:var(--ag-text)}
.evt-modal-body{padding:18px 24px;overflow-y:auto;display:flex;flex-direction:column;gap:14px}
.evt-field{display:flex;flex-direction:column;gap:5px}
.evt-field label{font-size:11px;color:var(--ag-text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.evt-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:540px){.evt-grid2{grid-template-columns:1fr}}
.evt-inp{width:100%;background:var(--ag-bg);border:1px solid var(--ag-border);border-radius:10px;padding:10px 13px;color:var(--ag-text);font-size:14px;font-family:inherit;outline:none;transition:border-color .15s;resize:vertical}
.evt-inp:focus{border-color:var(--ag-gold);box-shadow:0 0 0 3px rgba(201,168,76,.14)}
.evt-toggle-row{display:flex;justify-content:space-between;align-items:center;padding:6px 0}
.evt-toggle-row label{font-size:13.5px;font-weight:700;color:var(--ag-text);text-transform:none;letter-spacing:0}
.evt-toggle{width:42px;height:22px;border-radius:999px;border:1px solid var(--ag-border);background:rgba(255,255,255,0.04);cursor:pointer;position:relative;transition:background .2s,border-color .2s;padding:0}
.evt-toggle.on{background:var(--ag-gold);border-color:var(--ag-gold)}
.evt-toggle-dot{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s,background .2s}
.evt-toggle.on .evt-toggle-dot{transform:translateX(20px);background:#000}
.evt-cor-row{display:flex;gap:6px}
.evt-cor{width:28px;height:28px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:transform .12s}
.evt-cor:hover{transform:scale(1.1)}
.evt-cor.on{border-color:#fff;transform:scale(1.1)}
.evt-rem-row{display:flex;gap:6px;flex-wrap:wrap}
.evt-rem{background:transparent;border:1px solid var(--ag-border);color:var(--ag-text-dim);padding:5px 11px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
.evt-rem:hover{color:var(--ag-text)}
.evt-rem.on{background:rgba(74,179,255,.1);color:var(--ag-blue);border-color:rgba(74,179,255,.3)}
.evt-rec-box{margin-top:8px;padding:12px;border-radius:10px;background:rgba(5,7,11,.4);border:1px solid var(--ag-border);display:flex;flex-direction:column;gap:10px}
.evt-rec-row{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ag-text-dim);font-weight:600}
.evt-rec-num{width:64px;text-align:center;padding:6px 8px}
.evt-rec-dias{display:flex;gap:5px;flex-wrap:wrap}
.evt-rec-dia{padding:6px 11px;border-radius:7px;border:1px solid var(--ag-border);background:transparent;color:var(--ag-text-dim);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s}
.evt-rec-dia:hover{color:var(--ag-text)}
.evt-rec-dia.on{background:rgba(201,168,76,.12);color:var(--ag-gold-light);border-color:rgba(201,168,76,.3)}
.evt-rec-clear{background:transparent;border:none;color:var(--ag-text-muted);font-size:11px;cursor:pointer;font-family:inherit;text-decoration:underline}
.evt-rec-clear:hover{color:var(--ag-text)}
.evt-rec-hint{display:block;font-size:11px;color:var(--ag-text-muted);font-style:italic}
.evt-error{padding:10px 12px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);color:#fca5a5;border-radius:8px;font-size:12.5px}
.evt-modal-footer{display:flex;gap:8px;padding:14px 24px 18px;border-top:1px solid var(--ag-border)}
.evt-btn{padding:9px 18px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid var(--ag-border);transition:all .15s}
.evt-btn.primary{background:var(--ag-gold);color:#000;border-color:var(--ag-gold)}
.evt-btn.primary:hover:not(:disabled){background:var(--ag-gold-light)}
.evt-btn.ghost{background:transparent;color:var(--ag-text-dim)}
.evt-btn.ghost:hover:not(:disabled){background:rgba(255,255,255,0.04);color:var(--ag-text)}
.evt-btn.danger{background:rgba(239,68,68,.1);color:#fca5a5;border-color:rgba(239,68,68,.3)}
.evt-btn.danger:hover:not(:disabled){background:rgba(239,68,68,.2)}
.evt-btn.success{background:rgba(74,222,128,.1);color:#86efac;border-color:rgba(74,222,128,.3)}
.evt-btn.success:hover:not(:disabled){background:rgba(74,222,128,.2)}
.evt-btn:disabled{opacity:.6;cursor:not-allowed}

.evt-srs-box{margin:0 24px 14px;padding:14px;border-radius:12px;background:linear-gradient(135deg,rgba(74,179,255,.06),rgba(201,168,76,.04));border:1px solid rgba(74,179,255,.18)}
.evt-srs-h{display:flex;flex-direction:column;font-size:13px;font-weight:800;color:var(--ag-text);margin-bottom:10px;letter-spacing:-.01em}
.evt-srs-h span{display:block;font-size:11.5px;color:var(--ag-text-dim);font-weight:500;margin-top:3px;letter-spacing:0}
.evt-srs-btns{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.evt-srs-btn{padding:12px 8px;border-radius:10px;background:rgba(5,7,11,.5);border:1.5px solid var(--ag-border);font-family:inherit;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;color:var(--ag-text);transition:all .15s;font-size:18px}
.evt-srs-btn strong{font-size:13px;font-weight:800;margin-top:2px}
.evt-srs-btn small{font-size:10.5px;color:var(--ag-text-muted);font-weight:600}
.evt-srs-btn:hover:not(:disabled){transform:translateY(-2px)}
.evt-srs-btn:disabled{opacity:.5;cursor:not-allowed}
.evt-srs-btn.errei:hover:not(:disabled){border-color:rgba(239,68,68,.5);background:rgba(239,68,68,.08)}
.evt-srs-btn.dificil:hover:not(:disabled){border-color:rgba(245,158,11,.5);background:rgba(245,158,11,.08)}
.evt-srs-btn.facil:hover:not(:disabled){border-color:rgba(74,222,128,.5);background:rgba(74,222,128,.08)}
.evt-srs-done{margin:0 24px 14px;padding:11px 14px;border-radius:10px;background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.25);color:#86efac;font-size:13px;font-weight:700;text-align:center}
@media(max-width:540px){.evt-srs-btns{grid-template-columns:1fr}}

/* Confirm Delete Modal */
.evt-confirm-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;z-index:1100;backdrop-filter:blur(4px);padding:20px}
.evt-confirm-box{background:#0F131C;border:1px solid rgba(239,68,68,.3);border-radius:14px;padding:24px 22px;max-width:380px;width:100%;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.5)}
.evt-confirm-ic{font-size:36px;margin-bottom:8px}
.evt-confirm-box h3{margin:0 0 8px;font-size:17px;font-weight:800;color:var(--ag-text)}
.evt-confirm-box p{margin:0 0 18px;font-size:13.5px;color:var(--ag-text-dim);line-height:1.5}
.evt-confirm-box strong{color:var(--ag-text);font-weight:700}
.evt-confirm-actions{display:flex;gap:8px;justify-content:center}

/* Tema Claro — Agenda */
.tema-claro{
  --ag-bg:#f5f7fa;--ag-surface:#ffffff;--ag-surface2:#f3f6f9;
  --ag-border:rgba(201,168,76,0.18);
  --ag-text:#111827;--ag-text-dim:rgba(17,24,39,0.65);--ag-text-muted:rgba(17,24,39,0.44);
}
.tema-claro .ag-side-evt:hover{background:rgba(0,0,0,0.04)}
.tema-claro .ag-new-btn{background:var(--ag-gold);color:#000}
.tema-claro .ag-view-btn.active{background:rgba(201,168,76,0.12);color:#7a4f0c}
.tema-claro .dv-row{border-top-color:rgba(0,0,0,0.05)}
.tema-claro .ev-modal{background:var(--ag-surface);border-color:var(--ag-border)}
.tema-claro .evt-srs-box{background:linear-gradient(135deg,rgba(107,158,196,.06),rgba(201,168,76,.04));border-color:rgba(107,158,196,.18)}
.tema-claro .evt-srs-btn{background:rgba(240,244,248,.8);border-color:rgba(17,24,39,0.12)}
.tema-claro .evt-btn.ghost:hover:not(:disabled){background:rgba(0,0,0,0.04);color:#111827}
`;

// Marca o eventoConcluido para uso futuro (evita warning sobre import não usado)
void toggleEventConcluido;
