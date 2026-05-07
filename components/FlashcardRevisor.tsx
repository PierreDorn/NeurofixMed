'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type Flashcard = {
  id: string;
  pergunta: string;
  resposta: string;
  subtopics?: { nome: string; topics?: { nome: string; subjects?: { nome: string } } };
};

type Review = {
  id: string;
  dificuldade: string;
  next_review_date: string;
  acertos_seguidos: number;
  flashcards: Flashcard;
};

interface Props {
  pendentes: Review[];
  novos: Flashcard[];
  userId: string;
}

// Intervalo de dias baseado na dificuldade (repetição espaçada simplificada)
function calcularProximaRevisao(dificuldade: 'errei' | 'dificil' | 'facil', acertos: number): string {
  const hoje = new Date();
  let dias = 1;
  if (dificuldade === 'errei')   dias = 1;
  if (dificuldade === 'dificil') dias = Math.max(2, acertos * 2);
  if (dificuldade === 'facil')   dias = Math.max(4, acertos * 4);
  hoje.setDate(hoje.getDate() + dias);
  return hoje.toISOString().split('T')[0];
}

export function FlashcardRevisor({ pendentes, novos, userId }: Props) {
  // Junta pendentes e novos em uma fila única
  const fila: Flashcard[] = [
    ...pendentes.map(p => p.flashcards),
    ...novos,
  ];

  const [indice, setIndice]         = useState(0);
  const [virado, setVirado]         = useState(false);
  const [concluidos, setConcluidos] = useState(0);
  const [carregando, setCarregando] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const card = fila[indice];
  const total = fila.length;
  const progresso = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  async function responder(dificuldade: 'errei' | 'dificil' | 'facil') {
    if (!card || carregando) return;
    setCarregando(true);

    // Busca review existente
    const { data: existing } = await supabase
      .from('flashcard_reviews')
      .select('id, acertos_seguidos')
      .eq('user_id', userId)
      .eq('flashcard_id', card.id)
      .single();

    const acertos = existing
      ? (dificuldade === 'errei' ? 0 : (existing.acertos_seguidos ?? 0) + 1)
      : (dificuldade === 'facil' ? 1 : 0);

    const nextDate = calcularProximaRevisao(dificuldade, acertos);

    if (existing) {
      await supabase.from('flashcard_reviews').update({
        dificuldade,
        acertos_seguidos: acertos,
        next_review_date: nextDate,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id);
    } else {
      await supabase.from('flashcard_reviews').insert({
        user_id:          userId,
        flashcard_id:     card.id,
        dificuldade,
        acertos_seguidos: acertos,
        next_review_date: nextDate,
        created_at:       new Date().toISOString(),
        updated_at:       new Date().toISOString(),
      });
    }

    setConcluidos(c => c + 1);
    setVirado(false);
    setIndice(i => i + 1);
    setCarregando(false);
  }

  // Fila concluída
  if (total === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Nenhuma revisão pendente!</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
          Você está em dia com suas revisões. Volte amanhã ou explore a{' '}
          <a href="/biblioteca">Biblioteca</a> para estudar algo novo.
        </p>
      </div>
    );
  }

  if (indice >= total) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Sessão concluída!</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
          Você revisou <strong style={{ color: 'var(--green)' }}>{concluidos} flashcard{concluidos > 1 ? 's' : ''}</strong> hoje.
          O sistema já agendou as próximas revisões para o momento certo.
        </p>
        <a href="/dashboard" className="btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
          Voltar ao início
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Progresso */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '700' }}>
            Card {indice + 1} de {total}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--green)', fontWeight: '800' }}>
            {progresso}% concluído
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progresso}%` }} />
        </div>
      </div>

      {/* Contexto */}
      {card.subtopics && (
        <div style={{ marginBottom: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {card.subtopics.topics?.subjects && (
            <span className="badge badge-blue">{card.subtopics.topics.subjects.nome}</span>
          )}
          {card.subtopics.topics && (
            <span className="badge badge-green">{card.subtopics.topics.nome}</span>
          )}
        </div>
      )}

      {/* Card */}
      <div
        className="flashcard"
        onClick={() => !virado && setVirado(true)}
        style={{
          minHeight: virado ? 'auto' : '220px',
          cursor: virado ? 'default' : 'pointer',
        }}
      >
        {!virado ? (
          <>
            <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: '700', marginBottom: '8px' }}>
              PERGUNTA — clique para ver a resposta
            </div>
            <p style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1.5', textAlign: 'center' }}>
              {card.pergunta}
            </p>
          </>
        ) : (
          <>
            <div style={{ width: '100%' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: '700', marginBottom: '8px' }}>
                PERGUNTA
              </div>
              <p style={{ fontSize: '14px', color: 'var(--soft)', marginBottom: '16px' }}>
                {card.pergunta}
              </p>
              <div style={{ fontSize: '11px', color: 'var(--green)', fontWeight: '700', marginBottom: '8px' }}>
                RESPOSTA
              </div>
              <p style={{ fontSize: '16px', fontWeight: '700', lineHeight: '1.6' }}>
                {card.resposta}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Botões de resposta */}
      {virado ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '14px' }}>
          <button
            onClick={() => responder('errei')}
            className="btn-errei"
            disabled={carregando}
            style={{ padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '14px' }}
          >
            ❌ Errei
            <span style={{ display: 'block', fontSize: '10px', fontWeight: '600', opacity: 0.7, marginTop: '2px' }}>
              Revisar em 1 dia
            </span>
          </button>
          <button
            onClick={() => responder('dificil')}
            className="btn-dificil"
            disabled={carregando}
            style={{ padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '14px' }}
          >
            😅 Difícil
            <span style={{ display: 'block', fontSize: '10px', fontWeight: '600', opacity: 0.7, marginTop: '2px' }}>
              Revisar em breve
            </span>
          </button>
          <button
            onClick={() => responder('facil')}
            className="btn-facil"
            disabled={carregando}
            style={{ padding: '14px', borderRadius: '12px', fontWeight: '800', fontSize: '14px' }}
          >
            ✅ Fácil
            <span style={{ display: 'block', fontSize: '10px', fontWeight: '600', opacity: 0.7, marginTop: '2px' }}>
              Revisar mais tarde
            </span>
          </button>
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', marginTop: '12px' }}>
          Tente lembrar a resposta antes de virar o card 👆
        </p>
      )}
    </div>
  );
}
