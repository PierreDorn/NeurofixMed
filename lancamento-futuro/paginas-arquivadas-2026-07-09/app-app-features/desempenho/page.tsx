import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

interface RetencaoMateria {
  materia: string;
  ciclo: string | null;
  total: number;
  faceis: number;
  dificeis: number;
  errei: number;
  pct_retencao: number; // 0–100
}

export default async function DesempenhoPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Busca revisões concluídas com desempenho registrado nos últimos 90 dias
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  const { data: revs } = await supabase
    .from('review_schedule')
    .select('conteudo_tipo, conteudo_id, desempenho, data_concluida')
    .eq('user_id', user.id)
    .eq('status', 'concluida')
    .gte('data_concluida', cutoff.toISOString())
    .not('desempenho', 'is', null);

  // Para resolver matéria/ciclo, buscamos os conteúdos
  const summaryIds = (revs ?? []).filter(r => r.conteudo_tipo === 'study_summary').map(r => r.conteudo_id);
  const flashIds = (revs ?? []).filter(r => r.conteudo_tipo === 'flashcard').map(r => r.conteudo_id);

  const [{ data: summaries }, { data: flashes }] = await Promise.all([
    summaryIds.length > 0
      ? supabase.from('study_summaries').select('id, materia, ciclo').in('id', summaryIds)
      : { data: [] as Array<{ id: string; materia: string | null; ciclo: string | null }> },
    flashIds.length > 0
      ? supabase.from('flashcards').select('id, materia, ciclo').in('id', flashIds)
      : { data: [] as Array<{ id: string; materia: string | null; ciclo: string | null }> },
  ]);

  const matMap = new Map<string, { materia: string; ciclo: string | null }>();
  for (const s of summaries ?? []) matMap.set(`study_summary:${s.id}`, { materia: s.materia ?? 'Sem matéria', ciclo: s.ciclo });
  for (const f of flashes ?? [])   matMap.set(`flashcard:${f.id}`, { materia: f.materia ?? 'Sem matéria', ciclo: f.ciclo });

  // Agrega por matéria
  const agg = new Map<string, RetencaoMateria>();
  for (const r of revs ?? []) {
    const key = `${r.conteudo_tipo}:${r.conteudo_id}`;
    const info = matMap.get(key);
    if (!info) continue;
    const aggKey = `${info.ciclo ?? ''}::${info.materia}`;
    if (!agg.has(aggKey)) {
      agg.set(aggKey, { materia: info.materia, ciclo: info.ciclo, total: 0, faceis: 0, dificeis: 0, errei: 0, pct_retencao: 0 });
    }
    const a = agg.get(aggKey)!;
    a.total += 1;
    if (r.desempenho === 'facil')   a.faceis += 1;
    if (r.desempenho === 'dificil') a.dificeis += 1;
    if (r.desempenho === 'errei')   a.errei += 1;
  }

  // Retenção = (faceis + dificeis) / total
  const lista = Array.from(agg.values()).map(r => ({
    ...r,
    pct_retencao: r.total > 0 ? Math.round(((r.faceis + r.dificeis) / r.total) * 100) : 0,
  }));
  lista.sort((a, b) => b.pct_retencao - a.pct_retencao);

  const totalRevs = lista.reduce((n, m) => n + m.total, 0);
  const totalAcertos = lista.reduce((n, m) => n + m.faceis + m.dificeis, 0);
  const retencaoGeral = totalRevs > 0 ? Math.round((totalAcertos / totalRevs) * 100) : 0;

  return (
    <main style={{ padding: '32px 24px 60px', maxWidth: 1100, margin: '0 auto', fontFamily: "'Atkinson Hyperlegible', 'Inter', sans-serif", color: '#F7F7F8' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', color: '#E8D08A' }}>
          Desempenho
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-.02em', margin: '6px 0 0' }}>
          Sua retenção, por matéria.
        </h1>
        <p style={{ color: 'rgba(247,247,248,.62)', fontSize: 13.5, lineHeight: 1.55, margin: '8px 0 0', maxWidth: 620 }}>
          Calculado sobre os últimos 90 dias de revisões concluídas. Conta como retido tudo que você marcou como
          <strong style={{ color: '#4ADE80' }}> fácil </strong>ou<strong style={{ color: '#fcd34d' }}> difícil</strong>.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
        <Stat label="Retenção geral" value={`${retencaoGeral}%`} color="#E8D08A" />
        <Stat label="Revisões concluídas" value={String(totalRevs)} color="#4AB3FF" />
        <Stat label="Matérias revisadas" value={String(lista.length)} color="#4ADE80" />
      </div>

      {lista.length === 0 ? (
        <div style={{ padding: 48, borderRadius: 18, border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(15,19,28,0.5)', textAlign: 'center', color: 'rgba(247,247,248,.55)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📈</div>
          <strong style={{ display: 'block', fontSize: 18, fontWeight: 800, color: '#F7F7F8', marginBottom: 6 }}>Sem dados ainda</strong>
          <p style={{ fontSize: 13.5, margin: 0, maxWidth: 380, marginInline: 'auto' }}>
            Comece a estudar resumos e flashcards. As revisões automáticas vão alimentar este painel.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lista.map((m, i) => (
            <div key={i} style={{ padding: 18, borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: '#0F131C' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{m.materia}</div>
                  {m.ciclo && <div style={{ fontSize: 11, color: 'rgba(247,247,248,.5)', fontWeight: 600, marginTop: 2 }}>{m.ciclo}</div>}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#E8D08A', fontVariantNumeric: 'tabular-nums' }}>
                  {m.pct_retencao}%
                </div>
              </div>

              <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${m.pct_retencao}%`, background: 'linear-gradient(90deg, #C9A84C, #E8D08A)', borderRadius: 999, transition: 'width .5s ease' }} />
              </div>

              <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 11.5, color: 'rgba(247,247,248,.55)', fontWeight: 600 }}>
                <span><b style={{ color: '#4ADE80' }}>{m.faceis}</b> fáceis</span>
                <span><b style={{ color: '#fcd34d' }}>{m.dificeis}</b> difíceis</span>
                <span><b style={{ color: '#fca5a5' }}>{m.errei}</b> errei</span>
                <span style={{ marginLeft: 'auto' }}>{m.total} revisões</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: 22, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: '#0F131C' }}>
      <div style={{ fontSize: 11, color: 'rgba(247,247,248,.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}
