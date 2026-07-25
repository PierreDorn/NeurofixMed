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

function parseBreadcrumb(breadcrumb: string | null): { subject: string; area: string } {
  if (!breadcrumb) return { subject: '', area: '' };
  const parts = breadcrumb.split('·').map((p) => p.trim()).filter(Boolean);
  const subject = parts[0] ?? '';
  const areaCandidates = parts.slice(1).filter((p) => !/^aula\s/i.test(p));
  const area = areaCandidates[areaCandidates.length - 1] ?? '';
  return { subject, area };
}

export default function FavoritesView({ subjects, notes }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const isEmpty = subjects.length === 0 && notes.length === 0;

  return (
    <Shell breadcrumb="Favoritos">
      <section className="page active" id="page-favorites">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 22,
          }}
        >
          <div>
            <div
              style={{
                color: '#8a6020',
                letterSpacing: '.14em',
                fontWeight: 900,
                fontSize: 11,
              }}
            >
              SEU ACESSO RÁPIDO
            </div>
            <h1 style={{ font: '500 44px Georgia,serif', margin: '4px 0 6px' }}>Favoritos</h1>
            <p style={{ color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              Notas, questões e revisões que você decidiu guardar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/subjects')}
            style={{
              padding: '10px 18px',
              borderRadius: 12,
              border: '1px solid #e5e0d7',
              background: '#fff',
              color: '#0F172A',
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(15,23,42,.04)',
            }}
          >
            Explorar matérias
          </button>
        </div>

        {isEmpty ? (
          <div
            className="card"
            style={{
              padding: '48px 26px',
              borderRadius: 20,
              textAlign: 'center',
              border: '1px solid #E8E4DB',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: '#F6EFE1',
                display: 'inline-grid',
                placeItems: 'center',
                marginBottom: 18,
              }}
            >
              <span style={{ fontSize: 28, color: '#0F172A' }}>☆</span>
            </div>
            <h2 style={{ font: '700 22px Inter,sans-serif', margin: '0 0 8px', letterSpacing: '-.01em' }}>
              Nenhum favorito ainda
            </h2>
            <p
              style={{
                color: 'var(--muted)',
                margin: '0 auto 22px',
                lineHeight: 1.55,
                maxWidth: 520,
              }}
            >
              Salve notas importantes para acessar rapidamente durante a revisão e antes da prova.
            </p>
            <button
              type="button"
              onClick={() => router.push('/subjects')}
              style={{
                padding: '10px 22px',
                borderRadius: 12,
                background: '#0A0A0A',
                color: '#fff',
                border: 'none',
                fontWeight: 800,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Abrir uma nota
            </button>
          </div>
        ) : (
          <>
            {notes.length > 0 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 14,
                  marginBottom: subjects.length > 0 ? 28 : 0,
                }}
              >
                {notes.map((n) => {
                  const { subject: subj, area } = parseBreadcrumb(n.breadcrumb);
                  const subtitle = [area, 'Nota NeuroFix Ouro'].filter(Boolean).join(' · ');
                  return (
                    <article
                      key={n.slug}
                      onClick={() => router.push(`/notes/${n.slug}/start`)}
                      style={{
                        background: '#fff',
                        border: '1px solid #E8E4DB',
                        borderRadius: 16,
                        padding: '16px 18px',
                        display: 'grid',
                        gap: 10,
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(15,23,42,.04)',
                        transition: '.15s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            padding: '4px 10px',
                            borderRadius: 999,
                            background: '#EAF2FF',
                            color: '#286ED8',
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          {subj || 'Nota autoral'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            start(() => toggleFavorite('note', n.slug));
                          }}
                          disabled={pending}
                          aria-label="Desfavoritar"
                          style={{
                            background: '#FBF4E3',
                            border: '1px solid #E1C77F',
                            borderRadius: 999,
                            width: 28,
                            height: 28,
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                            fontSize: 14,
                            color: '#C9A24E',
                            padding: 0,
                          }}
                        >
                          ★
                        </button>
                      </div>
                      <h3 style={{ font: '600 20px Georgia,serif', margin: 0, color: '#0F172A' }}>
                        {n.title}
                      </h3>
                      {subtitle && (
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{subtitle}</div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/notes/${n.slug}/start`);
                        }}
                        style={{
                          justifySelf: 'start',
                          padding: '8px 16px',
                          borderRadius: 10,
                          background: '#0A0A0A',
                          color: '#fff',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: 13,
                          cursor: 'pointer',
                          marginTop: 4,
                        }}
                      >
                        Abrir nota
                      </button>
                    </article>
                  );
                })}
              </div>
            )}

            {subjects.length > 0 && (
              <>
                <div style={{ marginTop: notes.length > 0 ? 8 : 0, marginBottom: 12 }}>
                  <h2 style={{ font: '600 18px Georgia,serif', margin: 0 }}>Matérias favoritas</h2>
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
          </>
        )}
      </section>
    </Shell>
  );
}
