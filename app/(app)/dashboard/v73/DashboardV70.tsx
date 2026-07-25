'use client';

import { useRouter } from 'next/navigation';
import Shell from '@/components/v73/Shell';
import type { Subject } from '@/lib/subjects-catalog';
import type { ActiveCycleSummary } from '@/lib/dashboard-data';

type LastStudy = {
  subject_id: string | null;
  note_id: string | null;
  tab: string | null;
  title: string | null;
  subject_label: string | null;
  updated_at: string;
} | null;

type Props = {
  semesterSubjects: Subject[];
  lastStudy: LastStudy;
  activeCycles: ActiveCycleSummary[];
};

export default function DashboardV70({
  semesterSubjects,
  lastStudy,
  activeCycles,
}: Props) {
  const router = useRouter();

  const continueTitle = lastStudy?.title ?? 'Escolha uma matéria para começar';
  const continueSubject = lastStudy?.subject_label ?? 'Seu próximo estudo';
  const continueMeta = lastStudy
    ? `Retomar de onde parou · ${new Date(lastStudy.updated_at).toLocaleDateString('pt-BR')}`
    : 'Nenhuma aula foi iniciada neste dispositivo';
  const continueButton = lastStudy ? 'Retomar daqui' : 'Escolher matéria';

  function resumeLast() {
    if (lastStudy?.note_id && lastStudy.tab) {
      router.push(`/notes/${lastStudy.note_id}/${lastStudy.tab}`);
    } else if (lastStudy?.subject_id) {
      router.push(`/subjects/${lastStudy.subject_id}`);
    } else {
      router.push('/subjects');
    }
  }

  return (
    <Shell breadcrumb="Hoje">
      <section className="page active" data-version="70" id="page-home">
        <main className="nf70-home" data-canonical-view="v70-home">
          <section className="nf70-home-hero">
            <div className="nf70-home-hero-copy">
              <div className="eyebrow">SEU PONTO DE PARTIDA PARA ESTUDAR</div>
              <h1>
                O caos já foi organizado.<br />Agora é só estudar.
              </h1>
              <p>
                Escolha uma matéria, abra uma aula e encontre o conteúdo organizado para aprender com
                clareza — do mecanismo básico à aplicação em questões.
              </p>
            </div>
          </section>

          <section className="nf70-continue">
            <div className="kicker">
              <div>
                <h2>Continue de onde parou</h2>
                <p>A NeuroFix salva a última etapa visitada dentro da página de estudo.</p>
              </div>
              <button type="button" className="text-link" onClick={resumeLast}>
                Abrir última etapa
              </button>
            </div>
            <div className="card continue-card">
              <div className="subject-icon">◉</div>
              <div>
                <span className="pill blue">{continueSubject}</span>
                <h3>{continueTitle}</h3>
                <div className="meta">{continueMeta}</div>
                <div className="progress">
                  <span style={{ width: lastStudy ? '25%' : '0%' }} />
                </div>
              </div>
              <button type="button" className="btn btn-dark" onClick={resumeLast}>
                {continueButton}
              </button>
            </div>
          </section>

          {activeCycles.length > 0 && (
            <section>
              <div className="nf70-semester-head">
                <div>
                  <h2>Ciclos ativos</h2>
                  <p>Notas que você começou e ainda não fechou os 6 estágios.</p>
                </div>
              </div>
              <div className="grid grid-3" style={{ marginTop: 12 }}>
                {activeCycles.map((c) => (
                  <div
                    key={c.note_slug}
                    className="card"
                    onClick={() => router.push(`/notes/${c.note_slug}/start`)}
                    style={{ cursor: 'pointer', padding: 20 }}
                  >
                    <span className="pill">Estágio: {c.stage}</span>
                    <h3 style={{ marginTop: 8 }}>{c.note_title}</h3>
                    <div className="progress" style={{ marginTop: 12 }}>
                      <span style={{ width: `${c.progress_pct}%` }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                      {c.progress_pct}% do ciclo
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="nf70-semester-head">
              <div>
                <h2>Matérias favoritas do semestre</h2>
                <p>
                  Entre direto nas matérias que você mais usa. As demais continuam organizadas na página
                  Matérias.
                </p>
              </div>
              <button
                type="button"
                className="nf70-all-subjects"
                onClick={() => router.push('/subjects')}
              >
                Ver todas as matérias →
              </button>
            </div>

            <div className="subject-directory-grid nf70-subject-grid">
              {semesterSubjects.slice(0, 6).map((s) => (
                <article
                  key={s.id}
                  className="subject-card"
                  onClick={() => router.push(`/subjects/${s.id}`)}
                  style={
                    {
                      ['--subject-accent' as string]: s.accent,
                      ['--subject-soft' as string]: s.soft,
                    } as React.CSSProperties
                  }
                >
                  <div className="subject-card-top">
                    <span className={`subject-status ${s.status === 'live' ? 'live' : 'building'}`}>
                      {s.statusLabel}
                    </span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <div className="subject-card-footer">
                    <small>{s.summary}</small>
                    <button
                      type="button"
                      className="subject-open"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/subjects/${s.id}`);
                      }}
                    >
                      Abrir disciplina →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </section>
    </Shell>
  );
}
