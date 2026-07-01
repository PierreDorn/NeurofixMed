'use client';

import { useState } from 'react';
import { Check, ChevronDown, FileText, Lightbulb, ListChecks } from 'lucide-react';
import type {
  ConteudoGerado,
  Flashcard,
  Questao,
} from '@/lib/prompts/preceptor-medicina';

type Aba = 'resumo' | 'flashcards' | 'questoes';

type Props = {
  conteudo: ConteudoGerado;
};

export default function ResultadoGeracao({ conteudo }: Props) {
  const abasDisponiveis: Aba[] = [];
  if (conteudo.resumo) abasDisponiveis.push('resumo');
  if (conteudo.flashcards && conteudo.flashcards.length > 0) abasDisponiveis.push('flashcards');
  if (conteudo.questoes && conteudo.questoes.length > 0) abasDisponiveis.push('questoes');

  const [aba, setAba] = useState<Aba>(abasDisponiveis[0] ?? 'resumo');

  if (abasDisponiveis.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted, #888)' }}>
        Nenhum conteúdo gerado.
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--surface, #161616)',
        border: '1px solid var(--border, #2a2a2a)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border, #2a2a2a)',
          background: 'var(--surface2, #1c1c1c)',
        }}
      >
        {abasDisponiveis.map((a) => {
          const ativa = a === aba;
          const label = a === 'resumo' ? 'Resumo' : a === 'flashcards' ? 'Flashcards' : 'Questões';
          const Icon = a === 'resumo' ? FileText : a === 'flashcards' ? Lightbulb : ListChecks;
          return (
            <button
              key={a}
              onClick={() => setAba(a)}
              style={{
                flex: 1,
                padding: '14px 16px',
                background: ativa ? 'var(--surface, #161616)' : 'transparent',
                border: 'none',
                borderBottom: ativa
                  ? '2px solid var(--gold, #d4af37)'
                  : '2px solid transparent',
                color: ativa ? 'var(--gold-light, #f5d77b)' : 'var(--soft, #c7c7c7)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 24 }}>
        {aba === 'resumo' && conteudo.resumo && <ResumoView resumo={conteudo.resumo} />}
        {aba === 'flashcards' && conteudo.flashcards && (
          <FlashcardsView flashcards={conteudo.flashcards} />
        )}
        {aba === 'questoes' && conteudo.questoes && (
          <QuestoesView questoes={conteudo.questoes} />
        )}
      </div>
    </div>
  );
}

function ResumoView({ resumo }: { resumo: NonNullable<ConteudoGerado['resumo']> }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, color: 'var(--text, #fafafa)' }}>
        {resumo.titulo}
      </h2>
      <div
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          color: 'var(--text, #fafafa)',
        }}
      >
        {resumo.resumo_markdown}
      </div>
      {resumo.pontos_chave.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: 'var(--gold-light, #f5d77b)',
              marginBottom: 12,
            }}
          >
            Pontos-chave
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {resumo.pontos_chave.map((p, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: 10,
                  background: 'var(--surface2, #1c1c1c)',
                  borderRadius: 10,
                  fontSize: 14,
                  color: 'var(--soft, #c7c7c7)',
                }}
              >
                <Check size={16} style={{ color: 'var(--gold, #d4af37)', flexShrink: 0, marginTop: 2 }} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FlashcardsView({ flashcards }: { flashcards: Flashcard[] }) {
  const [abertos, setAbertos] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    setAbertos((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ fontSize: 13, color: 'var(--muted, #888)', marginBottom: 6 }}>
        {flashcards.length} flashcards · clique para ver o verso
      </p>
      {flashcards.map((f, i) => {
        const aberto = abertos.has(i);
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            style={{
              background: 'var(--surface2, #1c1c1c)',
              border: '1px solid var(--border, #2a2a2a)',
              borderRadius: 12,
              padding: 16,
              textAlign: 'left',
              cursor: 'pointer',
              color: 'var(--text, #fafafa)',
              transition: 'border-color 0.15s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>{f.frente}</div>
              <BadgeDificuldade dificuldade={f.dificuldade} />
              <ChevronDown
                size={18}
                style={{
                  color: 'var(--muted, #888)',
                  transform: aberto ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                  flexShrink: 0,
                }}
              />
            </div>
            {aberto && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '1px dashed var(--border, #2a2a2a)',
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: 'var(--soft, #c7c7c7)',
                }}
              >
                {f.verso}
                {f.dica && (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color: 'var(--gold-light, #f5d77b)',
                      fontStyle: 'italic',
                    }}
                  >
                    💡 {f.dica}
                  </div>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function QuestoesView({ questoes }: { questoes: Questao[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ fontSize: 13, color: 'var(--muted, #888)' }}>
        {questoes.length} questões · escolha uma alternativa e veja a justificativa
      </p>
      {questoes.map((q, i) => (
        <QuestaoCard key={i} questao={q} indice={i + 1} />
      ))}
    </div>
  );
}

function QuestaoCard({ questao, indice }: { questao: Questao; indice: number }) {
  const [escolha, setEscolha] = useState<string | null>(null);
  const revelar = escolha !== null;

  return (
    <div
      style={{
        background: 'var(--surface2, #1c1c1c)',
        border: '1px solid var(--border, #2a2a2a)',
        borderRadius: 12,
        padding: 18,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: 'var(--gold-light, #f5d77b)', fontWeight: 700 }}>
          Questão {indice}
        </div>
        <BadgeDificuldade dificuldade={questao.dificuldade} />
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.65, marginBottom: 16, color: 'var(--text, #fafafa)' }}>
        {questao.enunciado}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {questao.alternativas.map((a) => {
          const eEscolha = escolha === a.letra;
          const eCorreta = a.letra === questao.resposta_correta;
          let cor = 'var(--border, #2a2a2a)';
          let fundo = 'var(--surface, #161616)';
          let textoCor = 'var(--text, #fafafa)';
          if (revelar) {
            if (eCorreta) {
              cor = 'rgba(34, 197, 94, 0.6)';
              fundo = 'rgba(34, 197, 94, 0.10)';
              textoCor = '#86efac';
            } else if (eEscolha && !eCorreta) {
              cor = 'rgba(239, 68, 68, 0.6)';
              fundo = 'rgba(239, 68, 68, 0.10)';
              textoCor = '#fca5a5';
            }
          } else if (eEscolha) {
            cor = 'var(--gold, #d4af37)';
            fundo = 'var(--gold-dim, rgba(212,175,55,0.08))';
          }
          return (
            <button
              key={a.letra}
              onClick={() => !revelar && setEscolha(a.letra)}
              disabled={revelar}
              style={{
                display: 'flex',
                gap: 12,
                padding: '10px 14px',
                background: fundo,
                border: `1px solid ${cor}`,
                borderRadius: 10,
                textAlign: 'left',
                cursor: revelar ? 'default' : 'pointer',
                color: textoCor,
                fontSize: 14,
                lineHeight: 1.5,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontWeight: 800, textTransform: 'uppercase' }}>{a.letra})</span>
              <span style={{ flex: 1 }}>{a.texto}</span>
              {revelar && eCorreta && <Check size={16} style={{ color: '#86efac', flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
      {revelar && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: 'var(--gold-dim, rgba(212,175,55,0.08))',
            border: '1px solid rgba(212,175,55,0.20)',
            borderRadius: 10,
            fontSize: 13.5,
            lineHeight: 1.65,
            color: 'var(--soft, #c7c7c7)',
          }}
        >
          <strong style={{ color: 'var(--gold-light, #f5d77b)' }}>Justificativa:</strong>{' '}
          {questao.justificativa}
        </div>
      )}
    </div>
  );
}

function BadgeDificuldade({ dificuldade }: { dificuldade: 'facil' | 'medio' | 'dificil' }) {
  const cor =
    dificuldade === 'facil'
      ? { fg: '#86efac', bg: 'rgba(34, 197, 94, 0.12)' }
      : dificuldade === 'medio'
        ? { fg: '#fcd34d', bg: 'rgba(245, 158, 11, 0.12)' }
        : { fg: '#fca5a5', bg: 'rgba(239, 68, 68, 0.12)' };
  const label = dificuldade === 'facil' ? 'Fácil' : dificuldade === 'medio' ? 'Médio' : 'Difícil';
  return (
    <span
      style={{
        padding: '3px 10px',
        background: cor.bg,
        color: cor.fg,
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        whiteSpace: 'nowrap',
        height: 'fit-content',
      }}
    >
      {label}
    </span>
  );
}
