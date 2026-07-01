import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import AgendaView from '@/components/agenda/AgendaView';
import DashboardAdvancedSettings from '@/components/dashboard/DashboardAdvancedSettings';

const SETTINGS_DEFAULTS = {
  revisao_automatica_ativa: true,
  horario_estudo_inicio: '08:00',
  horario_estudo_fim: '22:00',
  dias_semana_estudo: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'],
  intervalo_revisao_1: 1,
  intervalo_revisao_2: 24,
  intervalo_revisao_3: 168,
  intervalo_revisao_4: 720,
};

const discColorMap = ['gold','blue','emerald','magenta','cyan','rose','amber','violet'] as const;

const discColorVars: Record<string, string> = {
  gold:    '--c:#C9A84C;--c2:#E8D08A;--c-rgb:201,168,76',
  blue:    '--c:#4AB3FF;--c2:#7BC8FF;--c-rgb:74,179,255',
  emerald: '--c:#34D399;--c2:#6EE7B7;--c-rgb:52,211,153',
  magenta: '--c:#E879F9;--c2:#F0ABFC;--c-rgb:232,121,249',
  cyan:    '--c:#22D3EE;--c2:#67E8F9;--c-rgb:34,211,238',
  rose:    '--c:#FB7185;--c2:#FDA4AF;--c-rgb:251,113,133',
  amber:   '--c:#FBBF24;--c2:#FCD34D;--c-rgb:251,191,36',
  violet:  '--c:#A78BFA;--c2:#C4B5FD;--c-rgb:167,139,250',
};

const NeuronGlyph = ({ p = 0 }: { p?: number }) => (
  <svg className="neuron-glyph" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ '--p': p } as React.CSSProperties}>
    <circle className="nx-halo" cx="50" cy="50" r="44" fill="currentColor"/>
    <g className="nx-l4" stroke="currentColor" fill="none" strokeWidth="0.7" strokeLinecap="round">
      <path d="M50,50 L20,12"/><path d="M50,50 L80,12"/>
      <path d="M50,50 L8,38"/><path d="M50,50 L92,38"/>
      <path d="M50,50 L8,62"/><path d="M50,50 L92,62"/>
      <path d="M50,50 L25,90"/><path d="M50,50 L75,90"/>
    </g>
    <g className="nx-l3" stroke="currentColor" fill="none" strokeWidth="1.1" strokeLinecap="round">
      <path d="M50,50 Q35,32 26,18"/><path d="M50,50 Q65,32 74,18"/>
      <path d="M50,50 Q22,46 14,40"/><path d="M50,50 Q78,46 86,40"/>
      <path d="M50,50 Q22,56 14,62"/><path d="M50,50 Q78,56 86,62"/>
      <path d="M50,50 Q40,72 32,86"/><path d="M50,50 Q60,72 68,86"/>
    </g>
    <g className="nx-l2" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round">
      <path d="M50,50 L50,22"/><path d="M50,50 L50,78"/>
      <path d="M50,50 L26,50"/><path d="M50,50 L74,50"/>
    </g>
    <g className="nx-soma">
      <circle cx="50" cy="50" r="11" fill="currentColor" opacity="0.95"/>
      <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <circle cx="46" cy="46" r="3.5" fill="white" opacity="0.65"/>
    </g>
    <g className="nx-spark" fill="currentColor">
      <circle cx="20" cy="12" r="1.6"/><circle cx="80" cy="12" r="1.6"/>
      <circle cx="8" cy="38" r="1.4"/><circle cx="92" cy="38" r="1.4"/>
      <circle cx="8" cy="62" r="1.4"/><circle cx="92" cy="62" r="1.4"/>
      <circle cx="25" cy="90" r="1.6"/><circle cx="75" cy="90" r="1.6"/>
    </g>
  </svg>
);

export default async function Dashboard() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('perfil_cognitivo, semestre, foco')
    .eq('user_id', user.id)
    .single();

  const { data: materiais } = await supabase
    .from('materiais')
    .select('id, nome, descricao')
    .eq('ativo', true)
    .order('ordem');

  const hoje = new Date().toISOString().split('T')[0];

  const { count: flashcardsPendentes } = await supabase
    .from('flashcard_reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_review_date', hoje);

  const { data: reviewedRows } = await supabase
    .from('flashcard_reviews')
    .select('flashcard_id')
    .eq('user_id', user.id);
  const reviewedIds = (reviewedRows ?? []).map((r) => r.flashcard_id);

  let novosCountQuery = supabase
    .from('flashcards')
    .select('*', { count: 'exact', head: true });
  if (reviewedIds.length > 0) {
    novosCountQuery = novosCountQuery.not('id', 'in', `(${reviewedIds.join(',')})`);
  }
  const { count: flashcardsNovos } = await novosCountQuery;

  const { count: questoesRespondidas } = await supabase
    .from('question_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const totalHoje = (flashcardsPendentes ?? 0) + Math.min(flashcardsNovos ?? 0, 10);

  // ── AGENDA + SETTINGS para a nova seção embarcada no dashboard ──
  const agendaNow = new Date();
  const agendaStart = new Date(agendaNow); agendaStart.setDate(agendaNow.getDate() - 35);
  const agendaEnd = new Date(agendaNow);   agendaEnd.setDate(agendaNow.getDate() + 90);

  const [{ data: agendaEvents }, { data: agendaRecurrences }, { data: userSettingsRow }] = await Promise.all([
    supabase
      .from('events')
      .select('id, titulo, descricao, data_inicio, data_fim, dia_todo, tipo, cor, local, origem, referencia_id, referencia_tipo, concluido')
      .eq('user_id', user.id)
      .order('data_inicio'),
    supabase
      .from('event_recurrence')
      .select('event_id, frequencia, intervalo, dias_semana, data_fim_recorrencia'),
    supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
  ]);

  const mergedSettings = { ...SETTINGS_DEFAULTS, ...(userSettingsRow ?? {}) };

  const focoLabel: Record<string, string> = {
    faculdade: 'Provas da faculdade', enamed: 'ENAMED',
    residencia: 'Residência médica', revisao: 'Revisão geral',
  };

  const firstName = user.user_metadata?.full_name?.split(' ')[0]
    ?? user.email?.split('@')[0]
    ?? 'Estudante';

  const semestreLabel = profile?.semestre ? `${profile.semestre}º semestre` : 'Ciclo básico';
  const focoAtual = profile?.foco ? (focoLabel[profile.foco] ?? profile.foco) : 'Residência médica';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .nf-hub {
          --gold:       #C9A84C;
          --gold-light: #E8D08A;
          --gold-dark:  #8B6914;
          --gold-deep:  #4A3608;
          --blue:       #4AB3FF;
          --blue-mid:   #4A90C4;
          --blue-dark:  #1F70D0;
          --panel:      #0A0D14;
          --panel-2:    #0F131C;
          --panel-3:    #161B27;
          --line:       rgba(201,168,76,0.14);
          --line-blue:  rgba(74,179,255,0.14);
          --offwhite:   #F0EDE6;
          --muted:      rgba(240,237,230,0.55);
          --muted-2:    rgba(240,237,230,0.32);
          --muted-3:    rgba(240,237,230,0.18);
          --nf-green:   #4ADE80;
          --nf-rose:    #F87171;
          font-family: 'Montserrat', sans-serif;
          color: #F0EDE6;
          background: transparent;
          min-height: 100%;
          overflow-x: hidden;
          position: relative;
        }
        .nf-hub::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 50% -10%, rgba(74,179,255,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 30% 25% at 50% -5%, rgba(201,168,76,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 80% 60% at 50% 130%, rgba(31,112,208,0.08) 0%, transparent 60%);
          pointer-events: none; z-index: 0;
        }
        .nf-hub a { color: inherit; text-decoration: none; }
        .nf-hub button { font-family: inherit; cursor: pointer; }
        .nf-hub ::selection { background: rgba(201,168,76,.35); color: #fff; }

        .nf-shell { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; padding: 28px 32px 48px; }

        /* ── HERO ── */
        .nf-hero {
          margin-bottom: 28px;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: linear-gradient(180deg, rgba(15,19,28,0.9), rgba(10,13,20,0.9));
          padding: 36px 40px;
          position: relative; overflow: hidden;
          display: block;
        }
        .nf-hero::before {
          content: ''; position: absolute; right: -120px; top: -180px;
          width: 520px; height: 520px; border-radius: 50%;
          background: radial-gradient(circle, rgba(74,179,255,0.18) 0%, transparent 60%);
          pointer-events: none;
        }
        .nf-hero-l { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 18px; }
        .nf-hero-eyebrow {
          font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--gold); display: flex; align-items: center; gap: 10px;
        }
        .nf-hero-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--gold); opacity: .6; }
        .nf-hero-title {
          font-family: 'Raleway', sans-serif; font-weight: 300;
          font-size: 42px; line-height: 1.1; letter-spacing: -.5px; color: var(--offwhite);
        }
        .nf-hero-title b { font-weight: 700; color: var(--gold-light); }
        .nf-hero-title em { font-style: normal; color: var(--blue); font-weight: 600; }
        .nf-hero-sub { font-size: 13.5px; font-weight: 300; line-height: 1.65; color: var(--muted); max-width: 440px; }
        .nf-streak-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 12px; border-radius: 99px;
          background: linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.06));
          border: 1px solid rgba(201,168,76,.3);
          font-size: 10.5px; font-weight: 600; color: var(--gold-light); letter-spacing: .3px; width: fit-content;
        }
        .nf-hero-stats { display: flex; gap: 14px; margin-top: 6px; }
        .nf-h-stat {
          flex: 1; padding: 14px 16px;
          background: rgba(0,0,0,0.35); border: 1px solid var(--line); border-radius: 11px;
          display: flex; flex-direction: column; gap: 4px; position: relative;
        }
        .nf-h-stat-lbl { font-size: 9px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: var(--muted-2); }
        .nf-h-stat-val { font-family: 'Raleway', sans-serif; font-size: 24px; font-weight: 600; color: var(--offwhite); display: flex; align-items: baseline; gap: 6px; }
        .nf-h-stat-val .u { font-size: 11px; color: var(--muted-2); font-weight: 400; letter-spacing: 1px; text-transform: uppercase; }
        .nf-icon-l { position: absolute; top: 14px; right: 14px; width: 18px; height: 18px; opacity: .5; }

        .nf-hero-r {
          position: relative; z-index: 1;
          background: rgba(0,0,0,0.45); border: 1px solid var(--line); border-radius: 14px;
          padding: 24px; display: flex; flex-direction: column; gap: 18px;
        }
        .nf-continue-head { display: flex; align-items: center; justify-content: space-between; }
        .nf-continue-title {
          font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--gold); display: flex; align-items: center; gap: 8px;
        }
        .nf-continue-title svg { width: 14px; height: 14px; }
        .nf-continue-link { font-size: 11px; color: var(--muted); font-weight: 500; }
        .nf-cont-card {
          display: flex; gap: 16px; align-items: center; padding: 14px;
          background: linear-gradient(135deg, rgba(74,179,255,0.06), rgba(201,168,76,0.04));
          border: 1px solid var(--line-blue); border-radius: 11px;
          transition: transform .2s, border-color .2s;
        }
        .nf-cont-card:hover { transform: translateY(-2px); border-color: rgba(74,179,255,.3); }
        .nf-cont-thumb {
          width: 64px; height: 64px; border-radius: 9px; flex-shrink: 0;
          background: radial-gradient(circle at 35% 35%, rgba(74,179,255,0.5), rgba(31,112,208,0.15) 60%, transparent);
          border: 1px solid var(--line-blue);
          display: flex; align-items: center; justify-content: center;
        }
        .nf-cont-thumb svg { width: 36px; height: 36px; color: var(--blue); }
        .nf-cont-info { flex: 1; min-width: 0; }
        .nf-cont-meta { font-size: 9.5px; font-weight: 600; letter-spacing: 1.8px; text-transform: uppercase; color: var(--muted-2); margin-bottom: 4px; }
        .nf-cont-name { font-size: 14px; font-weight: 600; color: var(--offwhite); margin-bottom: 8px; line-height: 1.3; }
        .nf-cont-bar { height: 5px; border-radius: 99px; background: rgba(255,255,255,.05); overflow: hidden; }
        .nf-cont-bar > span { display: block; height: 100%; background: linear-gradient(90deg, var(--blue-dark), var(--blue)); border-radius: 99px; box-shadow: 0 0 8px rgba(74,179,255,.5); }
        .nf-cont-pct { font-size: 11px; color: var(--blue); font-weight: 600; margin-top: 4px; font-family: 'JetBrains Mono', monospace; }
        .nf-cont-go {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg,#8B6914,#E8D08A,#C9A84C);
          display: flex; align-items: center; justify-content: center;
          color: #000; box-shadow: 0 4px 18px rgba(201,168,76,.32); transition: transform .2s;
        }
        .nf-cont-card:hover .nf-cont-go { transform: translateX(3px); }
        .nf-hero-quick { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
        .nf-qa {
          display: flex; align-items: center; gap: 10px; padding: 11px 12px;
          background: rgba(0,0,0,0.35); border: 1px solid var(--line); border-radius: 9px;
          transition: all .2s;
        }
        .nf-qa:hover { border-color: rgba(201,168,76,.3); background: rgba(201,168,76,.04); }
        .nf-qa svg { width: 16px; height: 16px; color: var(--gold); flex-shrink: 0; }
        .nf-qa-name { font-size: 11.5px; font-weight: 600; color: var(--offwhite); }
        .nf-qa-extra { font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: var(--muted-2); margin-left: auto; }

        /* ── SECTION HEADERS ── */
        .nf-section { margin-bottom: 36px; position: relative; z-index: 1; }
        .nf-sec-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 18px; gap: 24px; }
        .nf-sec-head-l { display: flex; flex-direction: column; gap: 4px; }
        .nf-sec-eyebrow {
          font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--gold); display: flex; align-items: center; gap: 10px;
        }
        .nf-sec-eyebrow::before { content: ''; width: 18px; height: 1px; background: var(--gold); opacity: .6; }
        .nf-sec-title { font-family: 'Raleway', sans-serif; font-weight: 300; font-size: 26px; letter-spacing: -.3px; color: var(--offwhite); }
        .nf-sec-title b { font-weight: 600; color: var(--gold-light); }
        .nf-sec-actions { display: flex; align-items: center; gap: 10px; }
        .nf-chip {
          padding: 7px 12px; font-size: 10.5px; font-weight: 600; letter-spacing: .4px;
          border: 1px solid var(--line); border-radius: 7px; color: var(--muted); transition: all .2s;
          background: transparent;
        }
        .nf-chip.active { border-color: rgba(201,168,76,.4); color: var(--offwhite); background: rgba(201,168,76,.05); }

        /* ── TOOLS GRID ── */
        .nf-tools { display: grid; grid-template-columns: repeat(6,1fr); gap: 14px; }
        .nf-tool {
          position: relative; border: 1px solid var(--line);
          background: linear-gradient(180deg, var(--panel-2), var(--panel));
          border-radius: 14px; padding: 22px 18px;
          display: flex; flex-direction: column; gap: 14px;
          transition: transform .25s, border-color .25s, background .25s;
          overflow: hidden; min-height: 188px;
        }
        .nf-tool::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 50% -20%, rgba(201,168,76,0.12), transparent 60%);
          opacity: 0; transition: opacity .25s; pointer-events: none;
        }
        .nf-tool:hover { transform: translateY(-4px); border-color: rgba(201,168,76,.35); }
        .nf-tool:hover::before { opacity: 1; }
        .nf-tool-ico {
          width: 42px; height: 42px; border-radius: 11px;
          background: rgba(0,0,0,0.55); border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold); position: relative; z-index: 1;
        }
        .nf-tool-ico svg { width: 20px; height: 20px; }
        .nf-tool.blue .nf-tool-ico { color: var(--blue); border-color: var(--line-blue); }
        .nf-tool-name { font-size: 13.5px; font-weight: 700; letter-spacing: .3px; color: var(--offwhite); position: relative; z-index: 1; }
        .nf-tool-desc { font-size: 11px; font-weight: 300; line-height: 1.55; color: var(--muted); position: relative; z-index: 1; flex: 1; }
        .nf-tool-foot {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 10px; border-top: 1px solid var(--line); position: relative; z-index: 1;
        }
        .nf-tool-stat { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--muted-2); letter-spacing: .5px; }
        .nf-tool-stat b { color: var(--gold); font-weight: 500; }
        .nf-tool-arrow {
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(201,168,76,.1); display: flex; align-items: center; justify-content: center;
          color: var(--gold); transition: transform .2s;
        }
        .nf-tool:hover .nf-tool-arrow { transform: translateX(3px); background: rgba(201,168,76,.2); }
        .nf-tool-arrow svg { width: 11px; height: 11px; }

        /* ── DISCIPLINES ── */
        .nf-disc-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .nf-disc {
          position: relative; border: 1px solid var(--line);
          background: linear-gradient(180deg, var(--panel-2), var(--panel));
          border-radius: 14px; padding: 20px;
          display: flex; flex-direction: column; gap: 14px;
          transition: transform .25s, border-color .25s; overflow: hidden;
        }
        .nf-disc:hover { transform: translateY(-3px); border-color: rgba(201,168,76,.35); }
        .nf-disc-top { display: flex; gap: 14px; align-items: center; }
        .nf-disc-ico {
          width: 54px; height: 54px; border-radius: 13px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: radial-gradient(circle at 50% 50%, rgba(var(--c-rgb),0.10), rgba(0,0,0,0.5) 75%) !important;
          border: 1px solid rgba(var(--c-rgb),0.25) !important;
          box-shadow: 0 0 18px rgba(var(--c-rgb),0.12) inset;
          color: var(--c);
        }
        .nf-disc:hover .nf-disc-ico { box-shadow: 0 0 24px rgba(var(--c-rgb),0.25) inset, 0 0 18px rgba(var(--c-rgb),0.20); }
        .nf-disc-ico svg { width: 30px; height: 30px; }
        .nf-disc-info { flex: 1; min-width: 0; }
        .nf-disc-cycle { font-size: 9px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; color: var(--muted-2); margin-bottom: 4px; }
        .nf-disc-name { font-size: 14.5px; font-weight: 600; color: var(--offwhite); line-height: 1.25; }
        .nf-disc-prog { display: flex; flex-direction: column; gap: 6px; }
        .nf-disc-prog-row { display: flex; align-items: center; justify-content: space-between; font-size: 10.5px; }
        .nf-disc-prog-row .l { color: var(--muted-2); font-weight: 500; letter-spacing: .3px; }
        .nf-disc-prog-row .v { font-family: 'JetBrains Mono', monospace; color: var(--offwhite); font-weight: 500; }
        .nf-disc-bar { height: 5px; border-radius: 99px; background: rgba(255,255,255,.05); overflow: hidden; }
        .nf-disc-bar > span { display: block; height: 100%; border-radius: 99px; background: linear-gradient(90deg, color-mix(in srgb, var(--c) 60%, #000), var(--c)); box-shadow: 0 0 8px rgba(var(--c-rgb), .45); }
        .nf-disc-foot { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--line); }
        .nf-disc-tags { display: flex; gap: 6px; }
        .nf-disc-tag {
          font-size: 9px; font-weight: 600; letter-spacing: .6px; padding: 3px 7px; border-radius: 4px;
          background: rgba(74,179,255,.08); color: var(--blue); border: 1px solid var(--line-blue);
        }
        .nf-disc-tag.g { background: rgba(201,168,76,.08); color: var(--gold); border-color: var(--line); }
        .nf-disc-go {
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--c); display: flex; align-items: center; gap: 5px;
        }
        .nf-disc-go svg { width: 11px; height: 11px; }

        /* neuron glyph */
        .neuron-glyph { width: 100%; height: 100%; overflow: visible; }
        .neuron-glyph .nx-halo { opacity: clamp(0, calc(var(--p,0) * 0.18 + 0.05), 0.22); }
        .neuron-glyph .nx-soma { transform-origin: 50% 50%; transform: scale(calc(0.7 + var(--p,0) * 0.45)); transition: transform .6s ease; }
        .neuron-glyph .nx-l2 { opacity: clamp(0, calc((var(--p,0) - 0.10) * 5), 0.85); }
        .neuron-glyph .nx-l3 { opacity: clamp(0, calc((var(--p,0) - 0.30) * 3), 0.75); }
        .neuron-glyph .nx-l4 { opacity: clamp(0, calc((var(--p,0) - 0.55) * 3.5), 0.95); }
        .neuron-glyph .nx-spark { opacity: clamp(0, calc((var(--p,0) - 0.75) * 4), 1); }
        @keyframes nxFlicker { 0%,100% { opacity:1 } 50% { opacity:.4 } }
        .neuron-glyph .nx-spark circle { animation: nxFlicker 2.6s ease-in-out infinite; }
        .neuron-glyph .nx-spark circle:nth-child(2n) { animation-delay: .5s }
        .neuron-glyph .nx-spark circle:nth-child(3n) { animation-delay: 1.1s }

        /* ── THREE COLUMN ── */
        .nf-three-col { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 18px; }
        .nf-panel {
          background: linear-gradient(180deg, var(--panel-2), var(--panel));
          border: 1px solid var(--line); border-radius: 14px; padding: 22px 24px;
        }
        .nf-panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .nf-panel-title { font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold); display: flex; align-items: center; gap: 9px; }
        .nf-panel-title svg { width: 13px; height: 13px; }
        .nf-panel-link { font-size: 10.5px; color: var(--muted); font-weight: 500; }
        .nf-panel-link:hover { color: var(--gold); }

        .nf-prog-row { display: flex; gap: 22px; align-items: center; }
        .nf-ring-wrap { width: 120px; height: 120px; position: relative; flex-shrink: 0; }
        .nf-ring-pct { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; }
        .nf-ring-pct .v { font-family: 'Raleway', sans-serif; font-size: 30px; font-weight: 600; color: var(--offwhite); line-height: 1; }
        .nf-ring-pct .l { font-size: 8.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted-2); margin-top: 3px; }
        .nf-prog-info .lead { font-family: 'Raleway', sans-serif; font-size: 18px; font-weight: 600; color: var(--gold-light); margin-bottom: 6px; line-height: 1.2; }
        .nf-prog-info .copy { font-size: 11.5px; color: var(--muted); font-weight: 300; line-height: 1.5; }
        .nf-week-bars { display: flex; align-items: flex-end; gap: 6px; margin-top: 18px; height: 64px; }
        .nf-wb { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .nf-wb-bar { width: 100%; border-radius: 5px 5px 2px 2px; background: linear-gradient(180deg, var(--blue), var(--blue-dark)); opacity: .85; }
        .nf-wb-bar.g { background: linear-gradient(180deg, var(--gold-light), var(--gold-dark)); }
        .nf-wb-lbl { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--muted-2); }

        .nf-day-list { display: flex; flex-direction: column; gap: 10px; }
        .nf-day-item {
          display: flex; align-items: center; gap: 12px; padding: 12px;
          background: rgba(0,0,0,.35); border: 1px solid var(--line); border-radius: 10px;
          transition: border-color .2s;
        }
        .nf-day-item:hover { border-color: rgba(201,168,76,.3); }
        .nf-day-check {
          width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid var(--muted-3);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .nf-day-check.done { background: var(--gold); border-color: var(--gold); }
        .nf-day-check svg { width: 11px; height: 11px; color: transparent; }
        .nf-day-check.done svg { color: #000; }
        .nf-day-body { flex: 1; min-width: 0; }
        .nf-day-name { font-size: 12.5px; font-weight: 600; color: var(--offwhite); margin-bottom: 2px; }
        .nf-day-item.done .nf-day-name { color: var(--muted-2); text-decoration: line-through; }
        .nf-day-meta { font-size: 10px; color: var(--muted-2); display: flex; align-items: center; gap: 10px; font-family: 'JetBrains Mono', monospace; }
        .nf-day-meta .pill { padding: 2px 6px; border-radius: 4px; background: rgba(74,179,255,.1); color: var(--blue); font-size: 9px; font-weight: 600; letter-spacing: .4px; font-family: 'Montserrat', sans-serif; }
        .nf-day-meta .pill.g { background: rgba(201,168,76,.1); color: var(--gold); }

        .nf-agenda-list { display: flex; flex-direction: column; gap: 10px; }
        .nf-ag-item { display: flex; gap: 14px; align-items: flex-start; padding: 12px; background: rgba(0,0,0,.35); border: 1px solid var(--line); border-radius: 10px; }
        .nf-ag-date { width: 48px; flex-shrink: 0; text-align: center; padding: 6px 0; border-radius: 8px; background: rgba(201,168,76,.08); border: 1px solid var(--line); }
        .nf-ag-date .d { font-family: 'Raleway', sans-serif; font-size: 18px; font-weight: 600; color: var(--gold); line-height: 1; }
        .nf-ag-date .m { font-size: 8.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted-2); margin-top: 2px; }
        .nf-ag-body .ag-name { font-size: 12px; font-weight: 600; color: var(--offwhite); margin-bottom: 3px; line-height: 1.3; }
        .nf-ag-body .ag-meta { font-size: 10px; color: var(--muted-2); }

        /* ── PRO PROGRESS ── */
        .nf-pro-progress {
          position: relative; overflow: hidden;
          border: 1px solid var(--line);
          background: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(74,179,255,0.08), transparent 70%),
            linear-gradient(180deg, var(--panel-2), var(--panel));
          border-radius: 18px; padding: 34px 40px;
        }
        .nf-pro-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 32px; margin-bottom: 28px; flex-wrap: wrap; }
        .nf-pro-head-l { max-width: 520px; display: flex; flex-direction: column; gap: 8px; }
        .nf-pro-head-r { display: flex; gap: 12px; align-items: flex-start; flex-wrap: wrap; }
        .nf-pro-mega {
          background: rgba(0,0,0,0.4); border: 1px solid var(--line); border-radius: 11px;
          padding: 14px 18px; display: flex; flex-direction: column; gap: 3px; min-width: 130px;
        }
        .nf-pro-mega .lbl { font-size: 9px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: var(--muted-2); }
        .nf-pro-mega .val { font-family: 'Raleway', sans-serif; font-size: 24px; font-weight: 600; color: var(--offwhite); display: flex; align-items: baseline; gap: 5px; }
        .nf-pro-mega .val .u { font-size: 11px; color: var(--muted-2); font-weight: 400; letter-spacing: .5px; }
        .nf-pro-mega.gold .val { color: var(--gold-light); }
        .nf-pro-body { display: flex; flex-direction: column; gap: 10px; }
        .nf-pro-list { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; }
        .nf-pro-row {
          display: flex; align-items: center; gap: 12px; padding: 10px 12px;
          background: rgba(0,0,0,.35); border: 1px solid rgba(var(--c-rgb,255,255,255), 0.18);
          border-radius: 10px; transition: transform .2s, border-color .2s;
        }
        .nf-pro-row:hover { transform: translateX(3px); border-color: rgba(var(--c-rgb), 0.4); }
        .nf-pro-dot {
          width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
          background: radial-gradient(circle at 35% 35%, var(--c2), var(--c) 60%, color-mix(in srgb, var(--c) 30%, #000));
          box-shadow: 0 0 calc(6px + var(--p, 0) * 12px) rgba(var(--c-rgb), calc(0.3 + var(--p, 0) * 0.5));
          position: relative;
        }
        .nf-pro-dot::after {
          content: ''; position: absolute; inset: -3px; border-radius: 50%;
          border: 1px solid rgba(var(--c-rgb), 0.35);
          transform: scale(calc(0.6 + var(--p, 0) * 0.6)); opacity: var(--p, 0);
        }
        .nf-pro-row .pname { flex: 1; font-size: 12px; font-weight: 600; color: var(--offwhite); }
        .nf-pro-row .ppct { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: var(--c); }
        .nf-pro-legend { display: flex; align-items: center; gap: 18px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--line); flex-wrap: wrap; }
        .nf-pro-legend .lg { display: flex; align-items: center; gap: 8px; font-size: 10.5px; color: var(--muted); }
        .nf-pro-legend .sw { width: 14px; height: 14px; border-radius: 50%; }

        /* ── SIMULADO BANNER ── */
        .nf-simul {
          position: relative; overflow: hidden;
          border: 1px solid var(--line);
          background: linear-gradient(135deg, rgba(15,19,28,0.95), rgba(10,13,20,0.95)),
            radial-gradient(circle at 80% 50%, rgba(74,179,255,.2), transparent 60%);
          border-radius: 16px; padding: 30px 36px;
          display: grid; grid-template-columns: 1.4fr 1fr; gap: 36px; align-items: center;
        }
        .nf-simul::before {
          content: ''; position: absolute; right: -180px; top: 50%; transform: translateY(-50%);
          width: 520px; height: 520px; border-radius: 50%;
          background: radial-gradient(circle, rgba(74,179,255,0.25) 0%, transparent 60%);
          pointer-events: none;
        }
        .nf-simul-l { position: relative; z-index: 1; }
        .nf-simul-eyebrow {
          font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;
          color: var(--blue); margin-bottom: 12px; display: flex; align-items: center; gap: 10px;
        }
        .nf-simul-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--blue); }
        .nf-simul-title { font-family: 'Raleway', sans-serif; font-weight: 300; font-size: 30px; line-height: 1.1; color: var(--offwhite); margin-bottom: 10px; letter-spacing: -.4px; }
        .nf-simul-title b { font-weight: 700; color: var(--gold-light); }
        .nf-simul-copy { font-size: 13px; font-weight: 300; color: var(--muted); line-height: 1.6; max-width: 440px; margin-bottom: 20px; }
        .nf-simul-actions { display: flex; gap: 12px; }
        .nf-btn {
          padding: 12px 22px; border-radius: 9px; font-family: inherit;
          font-size: 11px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
          display: inline-flex; align-items: center; gap: 8px; transition: all .2s; border: none;
        }
        .nf-btn svg { width: 13px; height: 13px; }
        .nf-btn-gold {
          background: linear-gradient(135deg,#8B6914 0%,#E8D08A 40%,#C9A84C 75%,#8B6914 100%);
          background-size: 250% 250%;
          color: #000; box-shadow: 0 4px 24px rgba(201,168,76,.32);
          animation: nfGoldS 4s ease-in-out infinite;
        }
        @keyframes nfGoldS { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .nf-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(201,168,76,.5); }
        .nf-btn-ghost { background: transparent; border: 1px solid var(--line); color: var(--offwhite); }
        .nf-btn-ghost:hover { border-color: rgba(201,168,76,.4); background: rgba(201,168,76,.05); }
        .nf-simul-r { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 10px; }
        .nf-sim-stat { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: rgba(0,0,0,0.45); border: 1px solid var(--line); border-radius: 11px; }
        .nf-sim-stat svg { width: 18px; height: 18px; color: var(--blue); flex-shrink: 0; }
        .nf-sim-stat .info { flex: 1; }
        .nf-sim-stat .v { font-family: 'Raleway', sans-serif; font-size: 18px; font-weight: 600; color: var(--offwhite); line-height: 1; margin-bottom: 4px; }
        .nf-sim-stat .l { font-size: 10px; font-weight: 500; color: var(--muted-2); letter-spacing: .3px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1180px) {
          .nf-tools { grid-template-columns: repeat(3,1fr); }
          .nf-disc-grid { grid-template-columns: repeat(2,1fr); }
          .nf-three-col { grid-template-columns: 1fr; }
          .nf-hero { grid-template-columns: 1fr; }
          .nf-hero-title { font-size: 34px; }
          .nf-pro-list { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .nf-shell { padding: 16px 18px 32px; }
          .nf-tools { grid-template-columns: repeat(2,1fr); }
          .nf-disc-grid { grid-template-columns: 1fr; }
          .nf-simul { grid-template-columns: 1fr; padding: 24px; }
          .nf-hero { padding: 24px; }
          .nf-hero-title { font-size: 28px; }
        }
      `}} />

      <div className="nf-hub">
        <div className="nf-shell">

          {/* ── HERO ── */}
          <section className="nf-hero" style={{ marginBottom: '28px' }}>
            <div className="nf-hero-l">
              <span className="nf-hero-eyebrow">{semestreLabel} · {focoAtual}</span>
              <h1 className="nf-hero-title">
                Olá, <b>{firstName}.</b><br />O que você vai <em>fixar</em><br />hoje?
              </h1>
              <p className="nf-hero-sub">
                {totalHoje > 0
                  ? `Você tem ${totalHoje} flashcard${totalHoje > 1 ? 's' : ''} para revisar hoje. Cada revisão que você faz agora se torna memória de longo prazo.`
                  : 'Você está em dia com todas as revisões! Explore novos conteúdos ou treine com questões.'}
              </p>
              <span className="nf-streak-pill"><span>🔥</span>NeuroFix cuida do seu plano</span>
              <div className="nf-hero-stats">
                <div className="nf-h-stat">
                  <span className="nf-h-stat-lbl">Para revisar hoje</span>
                  <span className="nf-h-stat-val">{totalHoje}<span className="u">cards</span></span>
                  <svg className="nf-icon-l" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <div className="nf-h-stat">
                  <span className="nf-h-stat-lbl">Pendentes</span>
                  <span className="nf-h-stat-val">{flashcardsPendentes ?? 0}<span className="u">cards</span></span>
                  <svg className="nf-icon-l" viewBox="0 0 24 24" fill="none" stroke="#4AB3FF" strokeWidth="1.8"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z"/></svg>
                </div>
                <div className="nf-h-stat">
                  <span className="nf-h-stat-lbl">Questões respondidas</span>
                  <span className="nf-h-stat-val">{questoesRespondidas ?? 0}<span className="u">total</span></span>
                  <svg className="nf-icon-l" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
              </div>
            </div>

          </section>

          {/* MVP: agenda e configurações avançadas desconectadas. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
          {false && (
            <>
              <section className="nf-section">
                <AgendaView
                  events={agendaEvents ?? []}
                  recurrences={agendaRecurrences ?? []}
                  windowStartISO={agendaStart.toISOString()}
                  windowEndISO={agendaEnd.toISOString()}
                />
              </section>
              <DashboardAdvancedSettings settings={mergedSettings} />
            </>
          )}

          {/* ── TOOLS ── */}
          <section className="nf-section">
            <div className="nf-sec-head">
              <div className="nf-sec-head-l">
                <span className="nf-sec-eyebrow">Ferramentas de estudo</span>
                <h2 className="nf-sec-title">Aprenda. Conecte. <b>Fixe.</b> Evolua.</h2>
              </div>
            </div>
            <div className="nf-tools">
              <Link className="nf-tool" href="/biblioteca">
                <div className="nf-tool-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
                <div><div className="nf-tool-name">Resumos</div><div className="nf-tool-desc">Conteúdo destilado, focado no que cai na prova.</div></div>
                <div className="nf-tool-foot">
                  <span className="nf-tool-stat"><b>{materiais?.length ?? 0}</b> disciplinas</span>
                  <span className="nf-tool-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
                </div>
              </Link>
              <Link className="nf-tool blue" href="/biblioteca">
                <div className="nf-tool-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
                <div><div className="nf-tool-name">Questões</div><div className="nf-tool-desc">Banco nível prova com gabarito comentado.</div></div>
                <div className="nf-tool-foot">
                  <span className="nf-tool-stat"><b>{questoesRespondidas ?? 0}</b> respondidas</span>
                  <span className="nf-tool-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
                </div>
              </Link>
              <Link className="nf-tool" href="/flashcards">
                <div className="nf-tool-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="6" width="14" height="12" rx="2"/><rect x="7" y="3" width="14" height="12" rx="2"/></svg></div>
                <div><div className="nf-tool-name">Flashcards</div><div className="nf-tool-desc">Repetição espaçada que fixa de verdade.</div></div>
                <div className="nf-tool-foot">
                  <span className="nf-tool-stat"><b>{totalHoje}</b> p/ revisar hoje</span>
                  <span className="nf-tool-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
                </div>
              </Link>
              <Link className="nf-tool blue" href="/biblioteca">
                <div className="nf-tool-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></div>
                <div><div className="nf-tool-name">Aulas</div><div className="nf-tool-desc">Vídeo aulas objetivas com transcrição e marcações.</div></div>
                <div className="nf-tool-foot">
                  <span className="nf-tool-stat">em breve</span>
                  <span className="nf-tool-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
                </div>
              </Link>
              <Link className="nf-tool" href="/tarefas">
                <div className="nf-tool-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
                <div><div className="nf-tool-name">Tarefas</div><div className="nf-tool-desc">Lembretes e plano pessoal de estudos.</div></div>
                <div className="nf-tool-foot">
                  <span className="nf-tool-stat">plano pessoal</span>
                  <span className="nf-tool-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
                </div>
              </Link>
              <Link className="nf-tool blue" href="/perfil">
                <div className="nf-tool-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></div>
                <div><div className="nf-tool-name">Perfil</div><div className="nf-tool-desc">Ajuste suas preferências e perfil cognitivo.</div></div>
                <div className="nf-tool-foot">
                  <span className="nf-tool-stat">{profile?.perfil_cognitivo ?? 'padrão'}</span>
                  <span className="nf-tool-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></span>
                </div>
              </Link>
            </div>
          </section>

          {/* ── DISCIPLINES ── */}
          {materiais && materiais.length > 0 && (
            <section className="nf-section">
              <div className="nf-sec-head">
                <div className="nf-sec-head-l">
                  <span className="nf-sec-eyebrow">Suas disciplinas · {semestreLabel}</span>
                  <h2 className="nf-sec-title">Organizadas para você <b>aprender de verdade.</b></h2>
                </div>
              </div>
              <div className="nf-disc-grid">
                {materiais.map((s, i) => {
                  const colorKey = discColorMap[i % discColorMap.length];
                  const vars = discColorVars[colorKey];
                  return (
                    <Link key={s.id} className={`nf-disc ${colorKey}`} href="/biblioteca" style={{ [vars.split(';')[0].split(':')[0].slice(2)]: vars.split(';')[0].split(':')[1], ...Object.fromEntries(vars.split(';').filter(Boolean).map(v => { const [k, val] = v.trim().split(':'); return [k.trim(), val?.trim()]; })) } as React.CSSProperties}>
                      <div className="nf-disc-top">
                        <div className="nf-disc-ico" style={Object.fromEntries(vars.split(';').filter(Boolean).map(v => { const [k, val] = v.trim().split(':'); return [k.trim(), val?.trim()]; })) as React.CSSProperties}>
                          <NeuronGlyph p={0.3} />
                        </div>
                        <div className="nf-disc-info">
                          <div className="nf-disc-cycle">{semestreLabel}</div>
                          <div className="nf-disc-name">{s.nome}</div>
                        </div>
                      </div>
                      {s.descricao && (
                        <div className="nf-disc-prog">
                          <div className="nf-disc-prog-row">
                            <span className="l">Descrição</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--muted-2)', fontWeight: 300 }}>{s.descricao}</p>
                        </div>
                      )}
                      <div className="nf-disc-foot">
                        <div className="nf-disc-tags">
                          <span className="nf-disc-tag g">Estudar</span>
                        </div>
                        <span className="nf-disc-go">
                          Acessar{' '}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── THREE COLUMN ── */}
          <section className="nf-section">
            <div className="nf-three-col">

              {/* PERFORMANCE */}
              <div className="nf-panel">
                <div className="nf-panel-head">
                  <span className="nf-panel-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    Seu desempenho
                  </span>
                  <Link className="nf-panel-link" href="/biblioteca">Ver detalhes →</Link>
                </div>
                <div className="nf-prog-row">
                  <div className="nf-ring-wrap">
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <defs>
                        <linearGradient id="nfRingG" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1F70D0"/>
                          <stop offset="100%" stopColor="#4AB3FF"/>
                        </linearGradient>
                      </defs>
                      <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.06)" strokeWidth="9" fill="none"/>
                      <circle cx="60" cy="60" r="50" stroke="url(#nfRingG)" strokeWidth="9" fill="none"
                        strokeLinecap="round" strokeDasharray="314"
                        strokeDashoffset={questoesRespondidas && questoesRespondidas > 0 ? Math.max(20, 314 - Math.min((questoesRespondidas / 100) * 314, 280)) : 280}
                        transform="rotate(-90 60 60)"/>
                    </svg>
                    <div className="nf-ring-pct">
                      <span className="v">{questoesRespondidas ?? 0}</span>
                      <span className="l">questões</span>
                    </div>
                  </div>
                  <div className="nf-prog-info">
                    <div className="lead">
                      {(questoesRespondidas ?? 0) > 50 ? 'Ótimo ritmo!' : (questoesRespondidas ?? 0) > 10 ? 'Bom começo!' : 'Vamos começar!'}
                    </div>
                    <div className="copy">
                      {(flashcardsPendentes ?? 0) > 0
                        ? `Você tem ${flashcardsPendentes} flashcard${flashcardsPendentes! > 1 ? 's' : ''} pendente${flashcardsPendentes! > 1 ? 's' : ''} para revisar hoje.`
                        : 'Todas as revisões em dia. Continue explorando novos conteúdos!'}
                    </div>
                  </div>
                </div>
                <div className="nf-week-bars">
                  {['SEG','TER','QUA','QUI','SEX','SAB','DOM'].map((day, i) => (
                    <div key={day} className="nf-wb">
                      <div className={`nf-wb-bar${i === 3 ? ' g' : ''}`} style={{ height: `${[48,78,62,88,38,20,20][i]}%`, opacity: i > 3 ? 0.35 : 0.85 }} />
                      <span className="nf-wb-lbl" style={i === 3 ? { color: 'var(--gold)' } : {}}>{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TODAY — MVP: oculto. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
              {false && (
              <div className="nf-panel">
                <div className="nf-panel-head">
                  <span className="nf-panel-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Agenda Semanal
                  </span>
                  <Link className="nf-panel-link" href="/tarefas">Editar</Link>
                </div>
                <div className="nf-day-list">
                  {totalHoje > 0 ? (
                    <>
                      <div className="nf-day-item">
                        <span className="nf-day-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                        <div className="nf-day-body">
                          <div className="nf-day-name">Revisar flashcards pendentes</div>
                          <div className="nf-day-meta"><span className="pill g">Revisão</span><span>{flashcardsPendentes ?? 0} cards</span></div>
                        </div>
                      </div>
                      <div className="nf-day-item">
                        <span className="nf-day-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                        <div className="nf-day-body">
                          <div className="nf-day-name">Estudar cards novos</div>
                          <div className="nf-day-meta"><span className="pill">Novo conteúdo</span><span>{Math.min(flashcardsNovos ?? 0, 10)} cards</span></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="nf-day-item done">
                      <span className="nf-day-check done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                      <div className="nf-day-body">
                        <div className="nf-day-name">Revisões do dia concluídas!</div>
                        <div className="nf-day-meta"><span className="pill g">Completo</span></div>
                      </div>
                    </div>
                  )}
                  <div className="nf-day-item">
                    <span className="nf-day-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                    <div className="nf-day-body">
                      <div className="nf-day-name">Praticar questões</div>
                      <div className="nf-day-meta"><span className="pill">Treino</span><span>banco de questões</span></div>
                    </div>
                  </div>
                  <div className="nf-day-item">
                    <span className="nf-day-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></span>
                    <div className="nf-day-body">
                      <div className="nf-day-name">Explorar resumos</div>
                      <div className="nf-day-meta"><span className="pill">Biblioteca</span><span>{materiais?.length ?? 0} disciplinas</span></div>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* AGENDA — MVP: oculto. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
              {false && (
              <div className="nf-panel">
                <div className="nf-panel-head">
                  <span className="nf-panel-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Próximos eventos
                  </span>
                  <Link className="nf-panel-link" href="/tarefas">Calendário →</Link>
                </div>
                <div className="nf-agenda-list">
                  {[
                    { d: '17', m: 'Mai', name: 'Simulado semanal', meta: '60 questões · 90 min' },
                    { d: '20', m: 'Mai', name: 'Revisão programada — Anatomia', meta: 'Sequência inteligente' },
                    { d: '25', m: 'Mai', name: 'Live: Como fixar mais rápido', meta: 'Técnica de memória ativa' },
                    { d: '31', m: 'Mai', name: 'Avaliação de progresso mensal', meta: 'Relatório completo' },
                  ].map(ev => (
                    <div key={ev.d + ev.name} className="nf-ag-item">
                      <div className="nf-ag-date">
                        <div className="d">{ev.d}</div>
                        <div className="m">{ev.m}</div>
                      </div>
                      <div className="nf-ag-body">
                        <div className="ag-name">{ev.name}</div>
                        <div className="ag-meta">{ev.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              )}

            </div>
          </section>

          {/* ── PRO PROGRESS ── */}
          {materiais && materiais.length > 0 && (
            <section className="nf-section">
              <div className="nf-sec-head">
                <div className="nf-sec-head-l">
                  <span className="nf-sec-eyebrow">Progresso profissional</span>
                  <h2 className="nf-sec-title">Seu <b>cérebro médico</b> em construção.</h2>
                </div>
              </div>
              <div className="nf-pro-progress">
                <div className="nf-pro-head">
                  <div className="nf-pro-head-l">
                    <p style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 300, lineHeight: 1.65 }}>
                      Cada disciplina é um neurônio. Quanto mais você aprende e fixa, mais o neurônio cresce e ganha conexões. Veja o seu <b style={{ color: 'var(--gold-light)', fontWeight: 600 }}>conhecimento total</b> formando uma rede.
                    </p>
                  </div>
                  <div className="nf-pro-head-r">
                    <div className="nf-pro-mega gold">
                      <span className="lbl">Disciplinas ativas</span>
                      <span className="val">{materiais.length}<span className="u">total</span></span>
                    </div>
                    <div className="nf-pro-mega">
                      <span className="lbl">Questões respondidas</span>
                      <span className="val">{questoesRespondidas ?? 0}</span>
                    </div>
                    <div className="nf-pro-mega">
                      <span className="lbl">Cards revisados</span>
                      <span className="val">{reviewedIds.length}</span>
                    </div>
                  </div>
                </div>
                <div className="nf-pro-body">
                  <div className="nf-pro-list">
                    {materiais.map((s, i) => {
                      const colorKey = discColorMap[i % discColorMap.length];
                      const vars = discColorVars[colorKey];
                      const styleObj = Object.fromEntries(vars.split(';').filter(Boolean).map(v => { const [k, val] = v.trim().split(':'); return [k.trim(), val?.trim()]; }));
                      return (
                        <div key={s.id} className={`nf-pro-row ${colorKey}`} style={{ ...styleObj, '--p': '0.2' } as React.CSSProperties}>
                          <div className="nf-pro-dot" />
                          <div className="pname">{s.nome}</div>
                          <div className="ppct">Em progresso</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="nf-pro-legend">
                    <span className="lg" style={{ color: 'var(--muted)' }}>Tamanho do neurônio = conhecimento fixado</span>
                    <span className="lg"><span className="sw" style={{ background: '#FB7185', opacity: .5 }} />Iniciando</span>
                    <span className="lg"><span className="sw" style={{ background: '#FBBF24' }} />Crescendo</span>
                    <span className="lg"><span className="sw" style={{ background: '#C9A84C', boxShadow: '0 0 8px #C9A84C' }} />Dominado</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── SIMULADO BANNER ── */}
          <section className="nf-section">
            <div className="nf-simul">
              <div className="nf-simul-l">
                <span className="nf-simul-eyebrow">Pronto para o teste real?</span>
                <h2 className="nf-simul-title">Simulado <b>NeuroFix</b><br />da semana disponível.</h2>
                <p className="nf-simul-copy">Questões nível prova · todas as disciplinas. Cronômetro real, gabarito comentado e relatório de fixação por tópico ao final.</p>
                <div className="nf-simul-actions">
                  <Link href="/biblioteca" className="nf-btn nf-btn-gold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/></svg>
                    Começar agora
                  </Link>
                  <Link href="/perfil" className="nf-btn nf-btn-ghost">
                    Ver meu perfil
                  </Link>
                </div>
              </div>
              <div className="nf-simul-r">
                <div className="nf-sim-stat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <div className="info"><div className="v">Banco completo</div><div className="l">Todas as disciplinas disponíveis</div></div>
                </div>
                <div className="nf-sim-stat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <div className="info"><div className="v">Repetição espaçada</div><div className="l">Algoritmo que fixa de verdade</div></div>
                </div>
                <div className="nf-sim-stat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  <div className="info"><div className="v">Relatório completo</div><div className="l">Progresso por tópico ao final</div></div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
