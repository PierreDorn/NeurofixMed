'use client';

import { useState, useTransition } from 'react';
import Shell from '@/components/v73/Shell';
import type { Capture, ErrorItem, ExamItem } from './page';
import {
  addCapture,
  toggleCaptureResolved,
  deleteCapture,
  addError,
  toggleErrorResolved,
  deleteError,
  addExamItem,
  deleteExamItem,
} from './actions';

type Workspace = 'today' | 'inbox' | 'exam' | 'errors';

const WORKSPACES: Array<{ id: Workspace; label: string }> = [
  { id: 'today', label: 'Hoje' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'exam', label: 'Folha de prova' },
  { id: 'errors', label: 'Erros' },
];

type Props = { captures: Capture[]; errors: ErrorItem[]; exam: ExamItem[] };

function fmt(dateIso: string) {
  return new Date(dateIso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotebookView({ captures, errors, exam }: Props) {
  const [ws, setWs] = useState<Workspace>('today');

  return (
    <Shell breadcrumb="Meu caderno">
      <section className="page active" id="page-notebook">
        <div className="library-head">
          <div>
            <div className="eyebrow">Seu caderno pessoal</div>
            <h1>Meu caderno</h1>
            <p>Capture dúvidas, registre erros e monte sua folha de prova. Tudo salvo por usuário no banco.</p>
          </div>
        </div>

        <div className="subject-tabs" role="tablist" aria-label="Espaços do caderno" style={{ marginTop: 22 }}>
          {WORKSPACES.map((w) => (
            <button
              key={w.id}
              type="button"
              className={ws === w.id ? 'active' : undefined}
              onClick={() => setWs(w.id)}
              role="tab"
              aria-selected={ws === w.id}
            >
              {w.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          {ws === 'today' && <TodayView captures={captures} errors={errors} exam={exam} />}
          {ws === 'inbox' && <InboxView items={captures} />}
          {ws === 'errors' && <ErrorsView items={errors} />}
          {ws === 'exam' && <ExamView items={exam} />}
        </div>
      </section>
    </Shell>
  );
}

function TodayView({ captures, errors, exam }: Props) {
  const items: Array<{ kind: string; text: string; date: string }> = [
    ...captures.map((c) => ({ kind: 'Inbox', text: c.text, date: c.created_at })),
    ...errors.map((e) => ({ kind: 'Erro', text: e.topic, date: e.created_at })),
    ...exam.map((e) => ({ kind: 'Prova', text: e.label, date: e.created_at })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20);
  if (items.length === 0) {
    return (
      <div className="card" style={{ padding: 26 }}>
        <h2 style={{ font: '500 22px Georgia, serif', margin: 0 }}>Nada anotado ainda</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginTop: 6 }}>
          Use as abas <b>Inbox</b>, <b>Erros</b> e <b>Folha de prova</b> para começar. Tudo o que você criar
          aparece aqui por ordem de tempo.
        </p>
      </div>
    );
  }
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="review-list">
        {items.map((item, i) => (
          <div key={i} className="review-item">
            <div className="review-dot">{item.kind[0]}</div>
            <div>
              <b>{item.text}</b>
              <small>{item.kind} · {fmt(item.date)}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InboxView({ items }: { items: Capture[] }) {
  const [pending, start] = useTransition();
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <form
        className="card"
        style={{ padding: 20, display: 'grid', gap: 10 }}
        action={(fd) => start(() => addCapture(fd))}
      >
        <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 800, color: '#656565' }}>
          Anote uma dúvida rápida
          <textarea
            name="text"
            required
            maxLength={4000}
            placeholder="O que apareceu que você quer revisitar depois?"
            style={{ minHeight: 72, resize: 'vertical', border: '1px solid #ddd7cb', borderRadius: 10, padding: 10, fontSize: 14 }}
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={pending} style={{ justifySelf: 'start' }}>
          {pending ? 'Salvando…' : 'Salvar na inbox'}
        </button>
      </form>

      {items.length === 0 ? (
        <div className="card" style={{ padding: 22 }}>Nenhuma dúvida capturada.</div>
      ) : (
        items.map((it) => (
          <div key={it.id} className="card" style={{ padding: 18, display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <b style={{ textDecoration: it.resolved ? 'line-through' : 'none' }}>{it.text}</b>
              <small style={{ color: 'var(--muted)' }}>{fmt(it.created_at)}</small>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="mini-btn"
                onClick={() => start(() => toggleCaptureResolved(it.id, !it.resolved))}
              >
                {it.resolved ? 'Reabrir' : 'Marcar resolvida'}
              </button>
              <button
                type="button"
                className="mini-btn"
                onClick={() => start(() => deleteCapture(it.id))}
                style={{ color: '#b94a48' }}
              >
                Apagar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ErrorsView({ items }: { items: ErrorItem[] }) {
  const [pending, start] = useTransition();
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <form
        className="card"
        style={{ padding: 20, display: 'grid', gap: 10 }}
        action={(fd) => start(() => addError(fd))}
      >
        <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 800, color: '#656565' }}>
          Assunto que você errou
          <input
            name="topic"
            required
            maxLength={200}
            placeholder="Ex.: Hipersensibilidade tipo II × III"
            style={{ border: '1px solid #ddd7cb', borderRadius: 10, padding: '10px 12px', fontSize: 14 }}
          />
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 800, color: '#656565' }}>
            Por que errei
            <textarea name="why" placeholder="Confundi com…" style={{ minHeight: 60, border: '1px solid #ddd7cb', borderRadius: 10, padding: 10, fontSize: 14 }} />
          </label>
          <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 800, color: '#656565' }}>
            Regra que me salvaria
            <textarea name="rule" placeholder="Da próxima vez, lembrar…" style={{ minHeight: 60, border: '1px solid #ddd7cb', borderRadius: 10, padding: 10, fontSize: 14 }} />
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={pending} style={{ justifySelf: 'start' }}>
          {pending ? 'Salvando…' : 'Registrar erro'}
        </button>
      </form>

      {items.length === 0 ? (
        <div className="card" style={{ padding: 22 }}>Nenhum erro registrado ainda.</div>
      ) : (
        items.map((it) => (
          <div key={it.id} className="card" style={{ padding: 18, display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <b style={{ textDecoration: it.resolved ? 'line-through' : 'none' }}>{it.topic}</b>
              <small style={{ color: 'var(--muted)' }}>{fmt(it.created_at)}</small>
            </div>
            {it.why && <div style={{ fontSize: 13, color: '#555' }}><b>Por quê:</b> {it.why}</div>}
            {it.rule && <div style={{ fontSize: 13, color: '#555' }}><b>Regra:</b> {it.rule}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="mini-btn" onClick={() => start(() => toggleErrorResolved(it.id, !it.resolved))}>
                {it.resolved ? 'Reabrir' : 'Marcar resolvido'}
              </button>
              <button type="button" className="mini-btn" onClick={() => start(() => deleteError(it.id))} style={{ color: '#b94a48' }}>
                Apagar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ExamView({ items }: { items: ExamItem[] }) {
  const [pending, start] = useTransition();
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <form
        className="card"
        style={{ padding: 20, display: 'grid', gap: 10 }}
        action={(fd) => start(() => addExamItem(fd))}
      >
        <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 800, color: '#656565' }}>
          Item da folha de prova
          <input
            name="label"
            required
            maxLength={200}
            placeholder="Ex.: Tríade de Virchow"
            style={{ border: '1px solid #ddd7cb', borderRadius: 10, padding: '10px 12px', fontSize: 14 }}
          />
        </label>
        <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 800, color: '#656565' }}>
          Detalhe (opcional)
          <textarea name="text" style={{ minHeight: 60, border: '1px solid #ddd7cb', borderRadius: 10, padding: 10, fontSize: 14 }} />
        </label>
        <button type="submit" className="btn btn-primary" disabled={pending} style={{ justifySelf: 'start' }}>
          {pending ? 'Salvando…' : 'Adicionar à folha'}
        </button>
      </form>

      {items.length === 0 ? (
        <div className="card" style={{ padding: 22 }}>Sua folha de prova está vazia.</div>
      ) : (
        items.map((it) => (
          <div key={it.id} className="card" style={{ padding: 18, display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <b>{it.label}</b>
              <small style={{ color: 'var(--muted)' }}>{fmt(it.created_at)}</small>
            </div>
            {it.text && <div style={{ fontSize: 13, color: '#555' }}>{it.text}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="mini-btn" onClick={() => start(() => deleteExamItem(it.id))} style={{ color: '#b94a48' }}>
                Apagar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
