'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/v73/Shell';
import type { Subject } from '@/lib/subjects-catalog';
import { toggleFavorite } from './actions';

export type FavoriteNote = {
  slug: string;
  title: string;
  subtitle: string | null;
  subject_id: string;
  breadcrumb: string | null;
};

type Props = { subjects: Subject[]; notes: FavoriteNote[] };

export default function FavoritesView({ subjects, notes }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const isEmpty = subjects.length === 0 && notes.length === 0;

  return (
    <Shell breadcrumb="Favoritos">
      <section className="page active" id="page-favorites">
        <div className="library-head">
          <div>
            <div className="eyebrow">Suas notas destacadas</div>
            <h1>Favoritos</h1>
            <p>Matérias e notas que você marcou com estrela.</p>
          </div>
        </div>

        {isEmpty ? (
          <div className="card" style={{ marginTop: 22, padding: 26 }}>
            <h2 style={{ font: '500 22px Georgia, serif', margin: 0 }}>Nenhum favorito ainda</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginTop: 6 }}>
              Marque uma matéria (na página <b>Matérias</b>) ou uma nota autoral com estrela pra ela aparecer aqui.
            </p>
          </div>
        ) : (
          <>
            {subjects.length > 0 && (
              <>
                <div className="nf70-semester-head" style={{ marginTop: 22 }}>
                  <div>
                    <h2 style={{ fontSize: 20 }}>Matérias favoritas</h2>
                  </div>
                </div>
                <div className="subject-directory-grid nf70-subject-grid">
                  {subjects.map((s) => (
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
                      <div className="subject-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className={`subject-status ${s.status === 'live' ? 'live' : 'building'}`}>
                          {s.statusLabel}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            start(() => toggleFavorite('subject', s.id));
                          }}
                          disabled={pending}
                          aria-label="Desfavoritar"
                          style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 20, color: s.accent, padding: 0 }}
                        >
                          ★
                        </button>
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
              </>
            )}

            {notes.length > 0 && (
              <>
                <div className="nf70-semester-head" style={{ marginTop: 30 }}>
                  <div>
                    <h2 style={{ fontSize: 20 }}>Notas favoritas</h2>
                  </div>
                </div>
                <div className="grid grid-3" style={{ marginTop: 12 }}>
                  {notes.map((n) => (
                    <div
                      key={n.slug}
                      className="card"
                      onClick={() => router.push(`/notes/${n.slug}/start`)}
                      style={{ cursor: 'pointer', padding: 20 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span className="pill">Nota autoral</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            start(() => toggleFavorite('note', n.slug));
                          }}
                          disabled={pending}
                          aria-label="Desfavoritar"
                          style={{ background: 'transparent', border: 0, cursor: 'pointer', fontSize: 20, color: 'var(--gold)', padding: 0 }}
                        >
                          ★
                        </button>
                      </div>
                      <h3 style={{ marginTop: 8 }}>{n.title}</h3>
                      {n.breadcrumb && (
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                          {n.breadcrumb}
                        </div>
                      )}
                      {n.subtitle && (
                        <p style={{ marginTop: 10, fontSize: 14, color: '#333', lineHeight: 1.55 }}>
                          {n.subtitle}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </Shell>
  );
}
