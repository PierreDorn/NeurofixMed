'use client';

import { useState, useRef, useCallback } from 'react';
import { updateUserSettings } from '@/app/(app)/configuracoes/actions';

interface SettingsState {
  revisao_automatica_ativa: boolean;
  horario_estudo_inicio: string;
  horario_estudo_fim: string;
  dias_semana_estudo: string[];
  intervalo_revisao_1: number;
  intervalo_revisao_2: number;
  intervalo_revisao_3: number;
  intervalo_revisao_4: number;
}

interface Props {
  settings: SettingsState;
}

const DIAS = [
  { key: 'seg', label: 'Seg' },
  { key: 'ter', label: 'Ter' },
  { key: 'qua', label: 'Qua' },
  { key: 'qui', label: 'Qui' },
  { key: 'sex', label: 'Sex' },
  { key: 'sab', label: 'Sáb' },
  { key: 'dom', label: 'Dom' },
];

function formatHoras(horas: number): string {
  if (horas < 24) return `${horas}h`;
  const dias = Math.floor(horas / 24);
  const resto = horas % 24;
  return resto === 0 ? `${dias}d` : `${dias}d ${resto}h`;
}

export default function DashboardAdvancedSettings({ settings: initial }: Props) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsState>(initial);
  const [toast, setToast] = useState<{ visible: boolean; msg: string; ok: boolean }>({ visible: false, msg: '', ok: true });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ visible: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2200);
  }

  const save = useCallback((patch: Partial<SettingsState>) => {
    setSettings(prev => ({ ...prev, ...patch }));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const res = await updateUserSettings(patch);
      if (res.ok) showToast('Preferências salvas');
      else showToast('Erro: ' + (res.error ?? 'falha'), false);
    }, 500);
  }, []);

  function toggleDia(key: string) {
    const has = settings.dias_semana_estudo.includes(key);
    const next = has
      ? settings.dias_semana_estudo.filter(d => d !== key)
      : [...settings.dias_semana_estudo, key];
    save({ dias_semana_estudo: next });
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <section className="das-shell">
        <button type="button" className="das-head" onClick={() => setOpen(v => !v)} aria-expanded={open}>
          <div className="das-head-l">
            <span className="das-ic">⚙️</span>
            <div>
              <div className="das-kicker">Configurações avançadas</div>
              <div className="das-title">Preferências de estudo &amp; revisão automática</div>
            </div>
          </div>
          <span className={`das-chev${open ? ' on' : ''}`}>▾</span>
        </button>

        {open && (
          <div className="das-body">
            {/* Preferências de estudo */}
            <div className="das-card">
              <div className="das-card-head">
                <h3>📚 Preferências de estudo</h3>
                <p>Quando você costuma estudar? Vamos respeitar essa janela ao agendar revisões.</p>
              </div>
              <div className="das-grid2">
                <div className="das-field">
                  <label>Horário inicial</label>
                  <input
                    className="das-inp"
                    type="time"
                    value={settings.horario_estudo_inicio.slice(0, 5)}
                    onChange={e => save({ horario_estudo_inicio: e.target.value })}
                  />
                </div>
                <div className="das-field">
                  <label>Horário final</label>
                  <input
                    className="das-inp"
                    type="time"
                    value={settings.horario_estudo_fim.slice(0, 5)}
                    onChange={e => save({ horario_estudo_fim: e.target.value })}
                  />
                </div>
              </div>
              <div className="das-field">
                <label>Dias da semana</label>
                <div className="das-dia-row">
                  {DIAS.map(d => {
                    const ativo = settings.dias_semana_estudo.includes(d.key);
                    return (
                      <button
                        key={d.key}
                        type="button"
                        className={`das-dia${ativo ? ' on' : ''}`}
                        onClick={() => toggleDia(d.key)}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
                <small>Revisões automáticas só serão agendadas nos dias e horários marcados.</small>
              </div>
            </div>

            {/* Revisão automática */}
            <div className="das-card">
              <div className="das-card-head">
                <h3>🧠 Revisão automática</h3>
                <p>Toda vez que você concluir um conteúdo, criamos revisões nos intervalos certos para fixar a memória.</p>
              </div>

              <div className="das-toggle-row">
                <div className="das-toggle-text">
                  <strong>Ativar revisão automática</strong>
                  <span>Cria 4 revisões na sua agenda toda vez que você concluir um resumo, flashcard ou subtópico.</span>
                </div>
                <button
                  type="button"
                  className={`das-toggle${settings.revisao_automatica_ativa ? ' on' : ''}`}
                  onClick={() => save({ revisao_automatica_ativa: !settings.revisao_automatica_ativa })}
                  aria-pressed={settings.revisao_automatica_ativa}
                >
                  <span className="das-toggle-dot" />
                </button>
              </div>

              <div className={`das-srs${settings.revisao_automatica_ativa ? '' : ' dim'}`}>
                <Slider label="1ª revisão" desc="Reforço imediato" min={1} max={12}
                  value={settings.intervalo_revisao_1}
                  onChange={v => save({ intervalo_revisao_1: v })}
                />
                <Slider label="2ª revisão" desc="Consolidação no dia seguinte" min={6} max={72}
                  value={settings.intervalo_revisao_2}
                  onChange={v => save({ intervalo_revisao_2: v })}
                />
                <Slider label="3ª revisão" desc="Memória de médio prazo" min={48} max={360}
                  value={settings.intervalo_revisao_3}
                  onChange={v => save({ intervalo_revisao_3: v })}
                />
                <Slider label="4ª revisão" desc="Memória de longo prazo" min={168} max={1440}
                  value={settings.intervalo_revisao_4}
                  onChange={v => save({ intervalo_revisao_4: v })}
                />
                <div className="das-preview">
                  <span className="das-preview-ic">⏱</span>
                  <div>
                    <strong>Próxima revisão</strong>
                    <span>Ao concluir um conteúdo agora, a 1ª revisão será em <b>{formatHoras(settings.intervalo_revisao_1)}</b>.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className={`das-toast${toast.visible ? ' show' : ''}${toast.ok ? ' ok' : ' err'}`}>
        {toast.ok ? '✅' : '⚠️'} {toast.msg}
      </div>
    </>
  );
}

function Slider({
  label, desc, value, min, max, onChange,
}: { label: string; desc: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="das-slider-row">
      <div className="das-slider-head">
        <div>
          <strong>{label}</strong>
          <span>{desc}</span>
        </div>
        <span className="das-slider-val">{formatHoras(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="das-range"
      />
    </div>
  );
}

const CSS = `
.das-shell{font-family:'Atkinson Hyperlegible','Inter',sans-serif;color:#F0EDE6;background:rgba(15,19,28,0.9);border:1px solid rgba(201,168,76,0.18);border-radius:18px;overflow:hidden;margin-bottom:28px}
.das-head{width:100%;display:flex;justify-content:space-between;align-items:center;padding:18px 24px;background:transparent;border:none;cursor:pointer;color:inherit;font-family:inherit;text-align:left}
.das-head:hover{background:rgba(255,255,255,0.02)}
.das-head-l{display:flex;align-items:center;gap:14px}
.das-ic{font-size:22px}
.das-kicker{font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#C9A84C}
.das-title{font-size:15px;font-weight:700;margin-top:3px}
.das-chev{font-size:18px;color:#C9A84C;transition:transform .2s}
.das-chev.on{transform:rotate(180deg)}
.das-body{padding:0 24px 24px;display:flex;flex-direction:column;gap:16px;border-top:1px solid rgba(255,255,255,0.06)}
.das-card{padding:18px;border-radius:14px;background:rgba(5,7,11,0.45);border:1px solid rgba(255,255,255,0.06);margin-top:16px}
.das-card-head h3{margin:0;font-size:15px;font-weight:800;color:#F7F7F8}
.das-card-head p{margin:5px 0 14px;font-size:12.5px;color:rgba(247,247,248,.62);line-height:1.5}
.das-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
@media(max-width:580px){.das-grid2{grid-template-columns:1fr}}
.das-field{display:flex;flex-direction:column;gap:6px;margin-top:6px}
.das-field label{font-size:10.5px;color:rgba(247,247,248,.62);font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.das-field small{font-size:11px;color:rgba(247,247,248,.42);margin-top:4px}
.das-inp{width:100%;background:#050505;border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:10px 12px;color:#F7F7F8;font-size:13.5px;font-family:inherit;outline:none}
.das-inp:focus{border-color:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,.14)}
.das-dia-row{display:flex;gap:6px;flex-wrap:wrap}
.das-dia{padding:7px 13px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:rgba(247,247,248,.62);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s}
.das-dia:hover{color:#F7F7F8}
.das-dia.on{background:rgba(201,168,76,0.12);color:#E8D08A;border-color:rgba(201,168,76,0.32)}
.das-toggle-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06)}
.das-toggle-text strong{display:block;font-size:13.5px;color:#F7F7F8;font-weight:700}
.das-toggle-text span{display:block;margin-top:3px;font-size:12px;color:rgba(247,247,248,.62);line-height:1.45}
.das-toggle{width:42px;height:22px;border-radius:999px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);cursor:pointer;position:relative;flex-shrink:0;transition:all .2s;padding:0}
.das-toggle.on{background:#C9A84C;border-color:#C9A84C}
.das-toggle-dot{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .2s,background .2s}
.das-toggle.on .das-toggle-dot{transform:translateX(20px);background:#000}
.das-srs{display:flex;flex-direction:column;gap:14px;margin-top:14px;padding:14px;border-radius:12px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.06);transition:opacity .2s}
.das-srs.dim{opacity:.4;pointer-events:none}
.das-slider-row{display:flex;flex-direction:column;gap:6px}
.das-slider-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.das-slider-head strong{display:block;font-size:13px;color:#F7F7F8;font-weight:700}
.das-slider-head span{display:block;margin-top:2px;font-size:11px;color:rgba(247,247,248,.62)}
.das-slider-val{font-size:12px;font-weight:800;color:#E8D08A;background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.22);padding:3px 9px;border-radius:8px;flex-shrink:0;font-variant-numeric:tabular-nums}
.das-range{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:999px;background:rgba(255,255,255,0.08);outline:none;cursor:pointer}
.das-range::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#C9A84C;border:2px solid #000;cursor:pointer}
.das-range::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#C9A84C;border:2px solid #000;cursor:pointer}
.das-preview{display:flex;align-items:center;gap:11px;padding:11px 14px;border-radius:10px;background:rgba(74,179,255,.06);border:1px solid rgba(74,179,255,.18)}
.das-preview-ic{font-size:18px}
.das-preview strong{display:block;font-size:11px;color:#4AB3FF;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:3px}
.das-preview span{font-size:12.5px;color:rgba(247,247,248,.62);line-height:1.5}
.das-preview b{color:#F7F7F8;font-weight:700}
.das-toast{position:fixed;bottom:24px;right:24px;background:#0F131C;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:11px 16px;font-size:13px;font-weight:600;font-family:'Atkinson Hyperlegible','Inter',sans-serif;color:#F7F7F8;box-shadow:0 12px 32px rgba(0,0,0,.5);opacity:0;transform:translateY(8px);pointer-events:none;transition:all .2s;z-index:9999}
.das-toast.show{opacity:1;transform:translateY(0)}
.das-toast.ok{border-color:rgba(74,222,128,.3)}
.das-toast.err{border-color:rgba(239,68,68,.3);color:#fca5a5}
`;
