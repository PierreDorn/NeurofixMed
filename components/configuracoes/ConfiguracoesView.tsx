'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { updateUserSettings, updateStudentProfile, updateUserMetadata } from '@/app/(app)/configuracoes/actions';

type Section = 'conta' | 'perfil' | 'notificacoes' | 'aparencia';

interface SettingsState {
  revisao_automatica_ativa: boolean;
  notificacoes_push_ativas: boolean;
  notificacoes_email_ativas: boolean;
  notificacoes_som_ativo: boolean;
  horario_estudo_inicio: string;
  horario_estudo_fim: string;
  dias_semana_estudo: string[];
  intervalo_revisao_1: number;
  intervalo_revisao_2: number;
  intervalo_revisao_3: number;
  intervalo_revisao_4: number;
  tema_preferido: string;
}

interface ProfileState {
  semestre: string | null;
  foco: string | null;
  nome_faculdade: string | null;
  perfil_cognitivo: string | null;
}

interface Props {
  email: string;
  fullName: string;
  settings: SettingsState;
  profile: ProfileState;
}

const SECOES: Array<{ key: Section; label: string; icon: string }> = [
  { key: 'conta',        label: 'Conta',        icon: '👤' },
  { key: 'perfil',       label: 'Perfil',       icon: '🎓' },
  { key: 'notificacoes', label: 'Notificações', icon: '🔔' },
  { key: 'aparencia',    label: 'Aparência',    icon: '🎨' },
];

export default function ConfiguracoesView({ email, fullName, settings: initialSettings, profile: initialProfile }: Props) {
  const [section, setSection] = useState<Section>('conta');
  const [settings, setSettings] = useState<SettingsState>(initialSettings);
  const [profile, setProfile] = useState<ProfileState>(initialProfile);
  const [name, setName] = useState(fullName);
  const [toast, setToast] = useState({ visible: false, msg: '', ok: true });
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>('default');

  const settingsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Aplica/remove classe tema-claro no app-shell ao mudar tema
  useEffect(() => {
    const shell = document.querySelector('.app-shell');
    if (!shell) return;
    if (settings.tema_preferido === 'light') {
      shell.classList.add('tema-claro');
    } else {
      shell.classList.remove('tema-claro');
    }
  }, [settings.tema_preferido]);
  const nameTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detecta seção via hash inicial (#notificacoes etc)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '');
    if (SECOES.some(s => s.key === hash)) setSection(hash as Section);
  }, []);

  // Detecta permissão de notificação
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) { setNotifPermission('unsupported'); return; }
    setNotifPermission(Notification.permission);
  }, []);

  function showToast(msg: string, ok = true) {
    setToast({ visible: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2400);
  }

  // ─── DEBOUNCED SAVE ────────────────────────────────────────────────
  const saveSettings = useCallback((patch: Partial<SettingsState>) => {
    setSettings(prev => ({ ...prev, ...patch }));
    if (settingsTimer.current) clearTimeout(settingsTimer.current);
    settingsTimer.current = setTimeout(async () => {
      const res = await updateUserSettings(patch);
      if (res.ok) showToast('Preferências salvas');
      else showToast('Erro: ' + (res.error ?? 'falha'), false);
    }, 500);
  }, []);

  const saveProfile = useCallback((patch: Partial<ProfileState>) => {
    setProfile(prev => ({ ...prev, ...patch }));
    if (profileTimer.current) clearTimeout(profileTimer.current);
    profileTimer.current = setTimeout(async () => {
      const res = await updateStudentProfile(patch);
      if (res.ok) showToast('Perfil atualizado');
      else showToast('Erro: ' + (res.error ?? 'falha'), false);
    }, 500);
  }, []);

  const saveName = useCallback((value: string) => {
    setName(value);
    if (nameTimer.current) clearTimeout(nameTimer.current);
    nameTimer.current = setTimeout(async () => {
      const res = await updateUserMetadata({ full_name: value });
      if (res.ok) showToast('Nome atualizado');
      else showToast('Erro: ' + (res.error ?? 'falha'), false);
    }, 500);
  }, []);

  async function requestNotifPermission() {
    if (!('Notification' in window)) {
      showToast('Navegador não suporta notificações', false);
      return;
    }
    const result = await Notification.requestPermission();
    setNotifPermission(result);
    if (result === 'granted') {
      new Notification('NeuroFix Med', { body: 'Notificações ativadas! ✅', icon: '/neurofix-logo.png' });
      showToast('Permissão concedida');
    } else if (result === 'denied') {
      showToast('Permissão negada. Habilite nas configs do navegador.', false);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="cfg-header">
        <div>
          <div className="cfg-kicker">Configurações</div>
          <h1 className="cfg-title">Sua experiência, do seu jeito.</h1>
          <p className="cfg-sub">Ajuste estudo, revisão automática, notificações e perfil. As mudanças são salvas automaticamente.</p>
        </div>
      </div>

      <div className="cfg-shell">
        {/* Sidebar interna */}
        <aside className="cfg-side">
          {SECOES.map(s => (
            <button
              key={s.key}
              type="button"
              className={`cfg-side-item${section === s.key ? ' active' : ''}`}
              onClick={() => setSection(s.key)}
            >
              <span className="cfg-side-ic">{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </aside>

        {/* Conteúdo */}
        <section className="cfg-main">
          {section === 'conta' && (
            <Card title="Conta" desc="Informações de acesso da sua conta.">
              <Field label="E-mail">
                <input className="cfg-inp" type="email" value={email} readOnly />
                <small className="cfg-hint">O e-mail vem do provedor de login (Google) e não pode ser alterado aqui.</small>
              </Field>
              <Field label="Senha">
                <button type="button" className="cfg-btn ghost" disabled>
                  Alterar senha (em breve)
                </button>
              </Field>
              <Field label="Zona de perigo">
                <button type="button" className="cfg-btn danger" disabled>
                  Excluir minha conta (em breve)
                </button>
                <small className="cfg-hint">Essa ação remove permanentemente todos os seus dados.</small>
              </Field>
            </Card>
          )}

          {section === 'perfil' && (
            <Card title="Perfil acadêmico" desc="Como podemos te chamar e em que momento da formação você está.">
              <Field label="Nome completo">
                <input
                  className="cfg-inp"
                  type="text"
                  value={name}
                  onChange={e => saveName(e.target.value)}
                  placeholder="Seu nome"
                />
              </Field>
              <div className="cfg-grid2">
                <Field label="Semestre">
                  <select
                    className="cfg-inp"
                    value={profile.semestre ?? ''}
                    onChange={e => saveProfile({ semestre: e.target.value || null })}
                  >
                    <option value="">Selecione</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={String(n)}>{n}º semestre</option>
                    ))}
                  </select>
                </Field>
                <Field label="Foco principal">
                  <select
                    className="cfg-inp"
                    value={profile.foco ?? ''}
                    onChange={e => saveProfile({ foco: e.target.value || null })}
                  >
                    <option value="">Selecione</option>
                    <option value="faculdade">Faculdade</option>
                    <option value="enamed">ENAMED</option>
                    <option value="residencia">Residência</option>
                  </select>
                </Field>
              </div>
              <Field label="Faculdade">
                <input
                  className="cfg-inp"
                  type="text"
                  value={profile.nome_faculdade ?? ''}
                  onChange={e => saveProfile({ nome_faculdade: e.target.value || null })}
                  placeholder="Nome da sua faculdade"
                />
              </Field>
              <Field label="Perfil cognitivo (acessibilidade)">
                <select
                  className="cfg-inp"
                  value={profile.perfil_cognitivo ?? ''}
                  onChange={e => saveProfile({ perfil_cognitivo: e.target.value || null })}
                >
                  <option value="">Nenhum ajuste</option>
                  <option value="tdah">TDAH</option>
                  <option value="dislexia">Dislexia</option>
                  <option value="tea">TEA</option>
                </select>
                <small className="cfg-hint">Ajusta tipografia e espaçamento para melhor leitura.</small>
              </Field>
            </Card>
          )}

          {section === 'notificacoes' && (
            <Card title="Notificações" desc="Controle como e quando você recebe alertas.">
              <ToggleField
                label="Notificações push (navegador)"
                desc="Receba alertas mesmo com a aba fechada."
                value={settings.notificacoes_push_ativas}
                onChange={v => saveSettings({ notificacoes_push_ativas: v })}
              />
              <ToggleField
                label="Notificações por e-mail"
                desc="Resumo diário e lembretes importantes."
                value={settings.notificacoes_email_ativas}
                onChange={v => saveSettings({ notificacoes_email_ativas: v })}
              />
              <ToggleField
                label="Som ao notificar"
                desc="Toca um som suave quando chega um alarme."
                value={settings.notificacoes_som_ativo}
                onChange={v => saveSettings({ notificacoes_som_ativo: v })}
              />

              <Field label="Permissão do navegador">
                <div className="cfg-perm-box">
                  <span className={`cfg-perm-badge ${notifPermission}`}>
                    {notifPermission === 'granted' && '✓ Concedida'}
                    {notifPermission === 'denied' && '✕ Negada'}
                    {notifPermission === 'default' && '○ Não solicitada'}
                    {notifPermission === 'unsupported' && '— Não suportado'}
                  </span>
                  <button
                    type="button"
                    className="cfg-btn primary"
                    onClick={requestNotifPermission}
                    disabled={notifPermission === 'granted' || notifPermission === 'unsupported' || notifPermission === 'denied'}
                  >
                    {notifPermission === 'granted' ? 'Já permitido' : 'Solicitar permissão'}
                  </button>
                </div>
                <small className="cfg-hint">
                  Se negada, é preciso habilitar manualmente nas configurações do navegador (ícone do cadeado na URL).
                </small>
              </Field>
            </Card>
          )}

          {section === 'aparencia' && (
            <Card title="Aparência" desc="Tema visual da plataforma.">
              <Field label="Tema">
                <div className="cfg-theme-grid">
                  <button
                    type="button"
                    className={`cfg-theme-card${settings.tema_preferido === 'dark' ? ' active' : ''}`}
                    onClick={() => saveSettings({ tema_preferido: 'dark' })}
                  >
                    <div className="cfg-theme-preview dark" />
                    <strong>Escuro</strong>
                    <small>Padrão NeuroFix Med</small>
                  </button>
                  <button
                    type="button"
                    className={`cfg-theme-card${settings.tema_preferido === 'light' ? ' active' : ''}`}
                    onClick={() => saveSettings({ tema_preferido: 'light' })}
                  >
                    <div className="cfg-theme-preview light" />
                    <strong>Claro</strong>
                    <small>Tema dia</small>
                  </button>
                </div>
              </Field>
            </Card>
          )}
        </section>
      </div>

      {/* Toast */}
      <div className={`cfg-toast${toast.visible ? ' show' : ''}${toast.ok ? ' ok' : ' err'}`}>
        {toast.ok ? '✅' : '⚠️'} {toast.msg}
      </div>
    </>
  );
}

// ─── Subcomponentes ─────────────────────────────────────────────────────

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="cfg-card">
      <div className="cfg-card-head">
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
      <div className="cfg-card-body">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="cfg-field">
      <label className="cfg-label">{label}</label>
      {children}
    </div>
  );
}

function ToggleField({
  label, desc, value, onChange,
}: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="cfg-toggle-row">
      <div className="cfg-toggle-text">
        <strong>{label}</strong>
        {desc && <span>{desc}</span>}
      </div>
      <button
        type="button"
        className={`cfg-toggle${value ? ' on' : ''}`}
        onClick={() => onChange(!value)}
        aria-pressed={value}
      >
        <span className="cfg-toggle-dot" />
      </button>
    </div>
  );
}

function SliderField({
  label, desc, value, min, max, onChange, formatValue,
}: {
  label: string; desc: string; value: number; min: number; max: number;
  onChange: (v: number) => void; formatValue: (v: number) => string;
}) {
  return (
    <div className="cfg-slider-row">
      <div className="cfg-slider-head">
        <div>
          <strong>{label}</strong>
          <span>{desc}</span>
        </div>
        <span className="cfg-slider-val">{formatValue(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="cfg-range"
      />
    </div>
  );
}

// ─── CSS ────────────────────────────────────────────────────────────────

const CSS = `
:root{
  --cfg-gold:#C9A84C; --cfg-gold-light:#E8D08A; --cfg-blue:#4AB3FF;
  --cfg-bg:#050505; --cfg-surface:#0F131C; --cfg-surface2:#161B27;
  --cfg-border:rgba(255,255,255,0.08); --cfg-border-gold:rgba(201,168,76,0.22);
  --cfg-text:#F7F7F8; --cfg-text-dim:rgba(247,247,248,.62); --cfg-text-muted:rgba(247,247,248,.42);
}
.cfg-header{margin-bottom:24px;font-family:'Atkinson Hyperlegible','Inter',sans-serif;color:var(--cfg-text)}
.cfg-kicker{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--cfg-gold-light);margin-bottom:6px}
.cfg-title{font-size:28px;line-height:1.1;font-weight:900;letter-spacing:-.02em;color:var(--cfg-text);margin:0}
.cfg-sub{color:var(--cfg-text-dim);font-size:13.5px;line-height:1.55;margin:8px 0 0;max-width:620px}

.cfg-shell{display:grid;grid-template-columns:240px 1fr;gap:20px;font-family:'Atkinson Hyperlegible','Inter',sans-serif;color:var(--cfg-text)}
@media(max-width:880px){.cfg-shell{grid-template-columns:1fr}}

.cfg-side{display:flex;flex-direction:column;gap:4px;align-content:flex-start;position:sticky;top:20px;height:max-content}
@media(max-width:880px){.cfg-side{position:static;flex-direction:row;flex-wrap:wrap;gap:6px}}
.cfg-side-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;border:1px solid transparent;background:transparent;color:var(--cfg-text-dim);font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit;text-align:left;transition:all .15s}
.cfg-side-item:hover{background:rgba(255,255,255,0.03);color:var(--cfg-text)}
.cfg-side-item.active{background:rgba(201,168,76,0.08);color:var(--cfg-gold-light);border-color:var(--cfg-border-gold)}
.cfg-side-ic{font-size:16px;width:20px;text-align:center;flex-shrink:0}

.cfg-main{display:flex;flex-direction:column;gap:18px;min-width:0}
.cfg-card{background:var(--cfg-surface);border:1px solid var(--cfg-border);border-radius:18px;overflow:hidden}
.cfg-card-head{padding:22px 24px 0}
.cfg-card-head h2{margin:0;font-size:18px;font-weight:800;letter-spacing:-.01em;color:var(--cfg-text)}
.cfg-card-head p{margin:6px 0 0;font-size:13px;color:var(--cfg-text-dim);line-height:1.5;max-width:600px}
.cfg-card-body{padding:18px 24px 24px;display:flex;flex-direction:column;gap:18px}

.cfg-field{display:flex;flex-direction:column;gap:6px}
.cfg-label{font-size:11px;color:var(--cfg-text-dim);font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.cfg-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:580px){.cfg-grid2{grid-template-columns:1fr}}

.cfg-inp{width:100%;background:var(--cfg-bg);border:1px solid var(--cfg-border);border-radius:10px;padding:11px 14px;color:var(--cfg-text);font-size:14px;font-family:inherit;outline:none;transition:border-color .15s}
.cfg-inp:focus{border-color:var(--cfg-gold);box-shadow:0 0 0 3px rgba(201,168,76,.14)}
.cfg-inp[readonly]{opacity:.7;cursor:not-allowed}
.cfg-hint{display:block;font-size:11.5px;color:var(--cfg-text-muted);line-height:1.5;margin-top:4px}

.cfg-btn{padding:10px 18px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid var(--cfg-border);transition:all .15s;color:var(--cfg-text)}
.cfg-btn.primary{background:var(--cfg-gold);color:#000;border-color:var(--cfg-gold)}
.cfg-btn.primary:hover:not(:disabled){background:var(--cfg-gold-light)}
.cfg-btn.ghost{background:transparent;color:var(--cfg-text-dim)}
.cfg-btn.ghost:hover:not(:disabled){background:rgba(255,255,255,0.04);color:#fff}
.cfg-btn.danger{background:rgba(239,68,68,.1);color:#fca5a5;border-color:rgba(239,68,68,.3)}
.cfg-btn.danger:hover:not(:disabled){background:rgba(239,68,68,.2)}
.cfg-btn:disabled{opacity:.5;cursor:not-allowed}

.cfg-toggle-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 0;border-bottom:1px solid var(--cfg-border)}
.cfg-toggle-row:last-child{border-bottom:none}
.cfg-toggle-text strong{display:block;font-size:14px;color:var(--cfg-text);font-weight:700}
.cfg-toggle-text span{display:block;margin-top:3px;font-size:12.5px;color:var(--cfg-text-dim);line-height:1.45}
.cfg-toggle{width:44px;height:24px;border-radius:999px;border:1px solid var(--cfg-border);background:rgba(255,255,255,0.04);cursor:pointer;position:relative;flex-shrink:0;transition:background .2s,border-color .2s;padding:0}
.cfg-toggle.on{background:var(--cfg-gold);border-color:var(--cfg-gold)}
.cfg-toggle-dot{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s,background .2s;box-shadow:0 1px 4px rgba(0,0,0,.4)}
.cfg-toggle.on .cfg-toggle-dot{transform:translateX(20px);background:#000}

.cfg-dia-row{display:flex;gap:6px;flex-wrap:wrap}
.cfg-dia{padding:8px 14px;border-radius:8px;border:1px solid var(--cfg-border);background:transparent;color:var(--cfg-text-dim);font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s}
.cfg-dia:hover{color:var(--cfg-text);background:rgba(255,255,255,0.03)}
.cfg-dia.on{background:rgba(201,168,76,0.12);color:var(--cfg-gold-light);border-color:var(--cfg-border-gold)}

.cfg-srs-block{display:flex;flex-direction:column;gap:18px;padding:16px;border-radius:14px;background:rgba(5,7,11,0.4);border:1px solid var(--cfg-border);transition:opacity .2s}
.cfg-srs-block.dim{opacity:.45;pointer-events:none}
.cfg-slider-row{display:flex;flex-direction:column;gap:8px}
.cfg-slider-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.cfg-slider-head strong{display:block;font-size:13.5px;color:var(--cfg-text);font-weight:700}
.cfg-slider-head span{display:block;margin-top:2px;font-size:11.5px;color:var(--cfg-text-dim)}
.cfg-slider-val{font-size:13px;font-weight:800;color:var(--cfg-gold-light);background:rgba(201,168,76,0.08);border:1px solid var(--cfg-border-gold);padding:4px 10px;border-radius:8px;flex-shrink:0;font-variant-numeric:tabular-nums}
.cfg-range{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:999px;background:rgba(255,255,255,0.08);outline:none;cursor:pointer}
.cfg-range::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--cfg-gold);border:2px solid #000;cursor:pointer;transition:transform .15s}
.cfg-range::-webkit-slider-thumb:hover{transform:scale(1.15)}
.cfg-range::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--cfg-gold);border:2px solid #000;cursor:pointer}

.cfg-preview{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:12px;background:rgba(74,179,255,.06);border:1px solid rgba(74,179,255,.18);margin-top:4px}
.cfg-preview-ic{font-size:22px;flex-shrink:0}
.cfg-preview strong{display:block;font-size:12px;color:var(--cfg-blue);font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px}
.cfg-preview span{font-size:13px;color:var(--cfg-text-dim);line-height:1.5}
.cfg-preview b{color:var(--cfg-text);font-weight:700}

.cfg-perm-box{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.cfg-perm-badge{font-size:12px;font-weight:700;padding:5px 12px;border-radius:999px;border:1px solid var(--cfg-border)}
.cfg-perm-badge.granted{color:#4ADE80;border-color:rgba(74,222,128,.3);background:rgba(74,222,128,.08)}
.cfg-perm-badge.denied{color:#fca5a5;border-color:rgba(239,68,68,.3);background:rgba(239,68,68,.08)}
.cfg-perm-badge.default{color:var(--cfg-text-dim)}
.cfg-perm-badge.unsupported{color:var(--cfg-text-muted)}

.cfg-theme-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}
.cfg-theme-card{padding:14px;border-radius:14px;border:1.5px solid var(--cfg-border);background:transparent;cursor:pointer;font-family:inherit;text-align:left;display:flex;flex-direction:column;gap:8px;transition:all .15s;color:var(--cfg-text)}
.cfg-theme-card:hover:not(.disabled){border-color:rgba(255,255,255,0.16)}
.cfg-theme-card.active{border-color:var(--cfg-gold);background:rgba(201,168,76,0.06)}
.cfg-theme-card.disabled{opacity:.4;cursor:not-allowed}
.cfg-theme-preview{height:60px;border-radius:8px;border:1px solid var(--cfg-border)}
.cfg-theme-preview.dark{background:linear-gradient(135deg,#050505 0%,#0F131C 100%)}
.cfg-theme-preview.light{background:linear-gradient(135deg,#f1f5f9 0%,#cbd5e1 100%)}
.cfg-theme-card strong{font-size:14px;font-weight:700}
.cfg-theme-card small{font-size:11.5px;color:var(--cfg-text-dim)}

.cfg-toast{position:fixed;bottom:24px;right:24px;background:var(--cfg-surface);border:1px solid var(--cfg-border);border-radius:12px;padding:12px 18px;font-size:13px;font-weight:600;font-family:'Atkinson Hyperlegible','Inter',sans-serif;color:var(--cfg-text);box-shadow:0 12px 32px rgba(0,0,0,.5);opacity:0;transform:translateY(8px);pointer-events:none;transition:all .2s;z-index:9999;display:flex;align-items:center;gap:8px}
.cfg-toast.show{opacity:1;transform:translateY(0)}
.cfg-toast.ok{border-color:rgba(74,222,128,.3)}
.cfg-toast.err{border-color:rgba(239,68,68,.3);color:#fca5a5}

/* Tema Claro — overrides para variáveis --cfg-* */
.tema-claro{
  --cfg-bg:#f5f7fa; --cfg-surface:#ffffff; --cfg-surface2:#f3f6f9;
  --cfg-border:rgba(201,168,76,0.18); --cfg-border-gold:rgba(201,168,76,0.34);
  --cfg-text:#111827; --cfg-text-dim:rgba(17,24,39,0.65); --cfg-text-muted:rgba(17,24,39,0.44);
}
.tema-claro .cfg-side-item:hover{background:rgba(0,0,0,0.04);color:#111827}
.tema-claro .cfg-side-item.active{background:rgba(201,168,76,0.10);color:#7a4f0c;border-color:rgba(201,168,76,0.32)}
.tema-claro .cfg-srs-block{background:rgba(240,244,248,0.9)}
.tema-claro .cfg-inp{background:#ffffff;color:#111827}
.tema-claro .cfg-range{background:rgba(0,0,0,0.10)}
.tema-claro .cfg-toggle{background:rgba(0,0,0,0.08)}
.tema-claro .cfg-toast{background:#ffffff;box-shadow:0 8px 24px rgba(0,0,0,0.12)}
.tema-claro .cfg-btn.ghost:hover:not(:disabled){background:rgba(0,0,0,0.05);color:#111827}
.tema-claro .cfg-dia:hover{background:rgba(0,0,0,0.04);color:#111827}
.tema-claro .cfg-preview{background:rgba(46,106,150,0.07);border-color:rgba(46,106,150,0.20)}
.tema-claro .cfg-theme-card{color:#111827}
.tema-claro .cfg-theme-card:hover:not(.disabled){border-color:rgba(17,24,39,0.22)}
`;
