'use client';

import { useState, useTransition } from 'react';
import { Sparkles, ClipboardPaste, X, Save, RefreshCcw } from 'lucide-react';
import { gerarConteudo, type ResultadoGeracao } from '@/app/(app)/ia/actions';
import type { TipoConteudo } from '@/lib/prompts/preceptor-medicina';
import { salvarKitGerado } from '@/lib/db/cliente-local';
import ContadorGeracoes from './ContadorGeracoes';
import ResultadoGeracaoView from './ResultadoGeracao';

type Props = {
  geracoesIniciais: number;
  limiteDiario: number;
};

const TIPOS_UI: { id: TipoConteudo; label: string; descricao: string; emoji: string }[] = [
  { id: 'resumo', label: 'Resumo', descricao: 'Material organizado pra revisão rápida', emoji: '📝' },
  { id: 'flashcards', label: 'Flashcards', descricao: 'Cartões pergunta-resposta', emoji: '🔁' },
  { id: 'questoes', label: 'Questões', descricao: 'Múltipla escolha estilo prova', emoji: '❓' },
];

export default function CriadorDeKit({ geracoesIniciais, limiteDiario }: Props) {
  const [conteudoBase, setConteudoBase] = useState('');
  const [tipos, setTipos] = useState<Set<TipoConteudo>>(new Set());
  const [instrucoesExtra, setInstrucoesExtra] = useState('');
  const [resultado, setResultado] = useState<ResultadoGeracao | null>(null);
  const [contador, setContador] = useState(geracoesIniciais);
  const [erro, setErro] = useState<string | null>(null);
  const [statusSalvar, setStatusSalvar] = useState<'idle' | 'salvando' | 'salvo'>('idle');
  const [pending, startTransition] = useTransition();

  function toggleTipo(t: TipoConteudo) {
    setTipos((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  function selecionarKitCompleto() {
    setTipos(new Set(['resumo', 'flashcards', 'questoes']));
  }

  async function colarDaArea() {
    try {
      const texto = await navigator.clipboard.readText();
      if (texto) setConteudoBase((prev) => (prev ? prev + '\n\n' + texto : texto));
    } catch {
      setErro('Não consegui acessar a área de transferência. Cole manualmente (Cmd+V).');
    }
  }

  function gerar() {
    setErro(null);
    setStatusSalvar('idle');
    setResultado(null);
    const arr = Array.from(tipos);
    startTransition(async () => {
      const res = await gerarConteudo({
        conteudoBase,
        tipos: arr,
        instrucoesExtra: instrucoesExtra.trim() || undefined,
      });
      setResultado(res);
      if (res.ok) {
        setContador(res.geracoesHoje);
      } else {
        setErro(res.erro);
        if (typeof res.geracoesHoje === 'number') setContador(res.geracoesHoje);
      }
    });
  }

  async function salvarLocal() {
    if (!resultado || !resultado.ok) return;
    setStatusSalvar('salvando');
    try {
      const titulo =
        resultado.conteudo.resumo?.titulo ??
        conteudoBase.slice(0, 60).split('\n')[0] ??
        'Kit sem título';
      await salvarKitGerado({
        titulo,
        conteudoBase,
        tipos: Array.from(tipos),
        resumo: resultado.conteudo.resumo,
        flashcards: resultado.conteudo.flashcards,
        questoes: resultado.conteudo.questoes,
      });
      setStatusSalvar('salvo');
    } catch (e) {
      setErro('Não consegui salvar no seu dispositivo. Verifique se o navegador permite armazenamento local.');
      setStatusSalvar('idle');
    }
  }

  function recomecar() {
    setResultado(null);
    setErro(null);
    setStatusSalvar('idle');
  }

  const podeGerar = conteudoBase.trim().length >= 20 && tipos.size > 0 && !pending;
  const limiteAtingido = contador >= limiteDiario;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text, #fafafa)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Sparkles size={24} style={{ color: 'var(--gold, #d4af37)' }} />
            Neuro IA
          </h1>
          <p style={{ color: 'var(--muted, #888)', fontSize: 13, marginTop: 4 }}>
            Cole seu material de estudo e a Neuro IA gera resumo, flashcards e questões.
          </p>
        </div>
        <ContadorGeracoes geracoesHoje={contador} limiteDiario={limiteDiario} />
      </header>

      {!resultado?.ok ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Secao titulo="1. Cole seu material de estudo">
            <div style={{ position: 'relative' }}>
              <textarea
                value={conteudoBase}
                onChange={(e) => setConteudoBase(e.target.value)}
                placeholder="Cole notas de aula, capítulo de livro, trecho de slide, transcrição de vídeo... A Neuro IA vai estudar o conteúdo e gerar material focado nele."
                rows={10}
                disabled={pending}
                style={{
                  width: '100%',
                  padding: 16,
                  background: 'var(--surface, #161616)',
                  border: '1px solid var(--border2, #333)',
                  borderRadius: 12,
                  color: 'var(--text, #fafafa)',
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 8,
                  fontSize: 12,
                  color: 'var(--muted, #888)',
                }}
              >
                <span>{conteudoBase.length.toLocaleString('pt-BR')} caracteres (mínimo 20)</span>
                <button
                  type="button"
                  onClick={colarDaArea}
                  disabled={pending}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    background: 'transparent',
                    border: '1px solid var(--border, #2a2a2a)',
                    borderRadius: 8,
                    color: 'var(--soft, #c7c7c7)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  <ClipboardPaste size={13} />
                  Colar da área de transferência
                </button>
              </div>
            </div>
          </Secao>

          <Secao
            titulo="2. O que você quer gerar?"
            acessorio={
              <button
                type="button"
                onClick={selecionarKitCompleto}
                style={{
                  fontSize: 12,
                  padding: '6px 12px',
                  background: 'var(--gold-dim, rgba(212,175,55,0.10))',
                  border: '1px solid var(--gold, #d4af37)',
                  color: 'var(--gold-light, #f5d77b)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ⚡ Kit completo
              </button>
            }
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 10,
              }}
            >
              {TIPOS_UI.map((t) => {
                const ativo = tipos.has(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTipo(t.id)}
                    disabled={pending}
                    style={{
                      padding: 14,
                      background: ativo ? 'var(--gold-dim, rgba(212,175,55,0.10))' : 'var(--surface, #161616)',
                      border: `1px solid ${ativo ? 'var(--gold, #d4af37)' : 'var(--border, #2a2a2a)'}`,
                      borderRadius: 12,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      color: 'var(--text, #fafafa)',
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{t.emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted, #888)', lineHeight: 1.4 }}>
                      {t.descricao}
                    </div>
                  </button>
                );
              })}
            </div>
          </Secao>

          <Secao titulo="3. Instruções extras (opcional)">
            <input
              type="text"
              value={instrucoesExtra}
              onChange={(e) => setInstrucoesExtra(e.target.value)}
              placeholder='Ex: "foque em fisiopatologia", "questões nível residência", "20 flashcards"'
              disabled={pending}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--surface, #161616)',
                border: '1px solid var(--border2, #333)',
                borderRadius: 12,
                color: 'var(--text, #fafafa)',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </Secao>

          {erro && (
            <div
              style={{
                padding: 12,
                background: 'rgba(239,68,68,0.10)',
                border: '1px solid rgba(239,68,68,0.30)',
                borderRadius: 10,
                color: '#fca5a5',
                fontSize: 13.5,
              }}
            >
              {erro}
            </div>
          )}

          <button
            type="button"
            onClick={gerar}
            disabled={!podeGerar || limiteAtingido}
            style={{
              padding: '14px 20px',
              background:
                podeGerar && !limiteAtingido
                  ? 'linear-gradient(135deg, #8A6020, var(--gold, #d4af37))'
                  : 'var(--surface, #161616)',
              color: podeGerar && !limiteAtingido ? '#050505' : 'var(--muted, #888)',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 800,
              cursor: podeGerar && !limiteAtingido ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Sparkles size={18} />
            {pending
              ? 'A Neuro IA está gerando...'
              : limiteAtingido
                ? 'Limite atingido — volte amanhã'
                : 'Gerar com a Neuro IA'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={salvarLocal}
              disabled={statusSalvar !== 'idle'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background:
                  statusSalvar === 'salvo'
                    ? 'rgba(34, 197, 94, 0.12)'
                    : 'linear-gradient(135deg, #8A6020, var(--gold, #d4af37))',
                color: statusSalvar === 'salvo' ? '#86efac' : '#050505',
                border: statusSalvar === 'salvo' ? '1px solid rgba(34, 197, 94, 0.4)' : 'none',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: statusSalvar === 'salvo' ? 'default' : 'pointer',
              }}
            >
              <Save size={14} />
              {statusSalvar === 'salvando'
                ? 'Salvando...'
                : statusSalvar === 'salvo'
                  ? 'Salvo no seu dispositivo'
                  : 'Salvar no meu dispositivo'}
            </button>
            <button
              type="button"
              onClick={recomecar}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: 'transparent',
                border: '1px solid var(--border, #2a2a2a)',
                color: 'var(--soft, #c7c7c7)',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RefreshCcw size={14} />
              Gerar outro
            </button>
          </div>

          <ResultadoGeracaoView conteudo={resultado.conteudo} />
        </div>
      )}
    </div>
  );
}

function Secao({
  titulo,
  acessorio,
  children,
}: {
  titulo: string;
  acessorio?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <h2
          style={{
            fontSize: 13,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: 'var(--soft, #c7c7c7)',
          }}
        >
          {titulo}
        </h2>
        {acessorio}
      </div>
      {children}
    </section>
  );
}
