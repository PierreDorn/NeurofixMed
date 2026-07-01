'use client';

import { useState, useRef } from 'react';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { exportarTudo, importarTudo, limparTudo, listarKits } from '@/lib/db/cliente-local';

type Status = { tipo: 'idle' | 'ok' | 'erro'; msg?: string };

export default function BackupExportImport() {
  const [statusExp, setStatusExp] = useState<Status>({ tipo: 'idle' });
  const [statusImp, setStatusImp] = useState<Status>({ tipo: 'idle' });
  const [statusLimpar, setStatusLimpar] = useState<Status>({ tipo: 'idle' });
  const [confirmandoLimpeza, setConfirmandoLimpeza] = useState(false);
  const [qtdKits, setQtdKits] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function atualizarContagem() {
    const kits = await listarKits();
    setQtdKits(kits.length);
  }

  async function exportar() {
    setStatusExp({ tipo: 'idle' });
    try {
      const json = await exportarTudo();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const data = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `neurofix-med-backup-${data}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusExp({ tipo: 'ok', msg: 'Backup baixado.' });
    } catch (e) {
      setStatusExp({ tipo: 'erro', msg: 'Não consegui exportar. Tente recarregar a página.' });
    }
  }

  async function importarArquivo(file: File) {
    setStatusImp({ tipo: 'idle' });
    try {
      const texto = await file.text();
      const res = await importarTudo(texto);
      setStatusImp({
        tipo: 'ok',
        msg: `Restaurado: ${res.kits} kits, ${res.flashcards} flashcards, ${res.questoes} questões.`,
      });
      await atualizarContagem();
    } catch (e) {
      setStatusImp({
        tipo: 'erro',
        msg: e instanceof Error ? e.message : 'Falha ao importar.',
      });
    }
  }

  async function confirmarLimpeza() {
    setStatusLimpar({ tipo: 'idle' });
    try {
      await limparTudo();
      setStatusLimpar({ tipo: 'ok', msg: 'Tudo apagado do seu dispositivo.' });
      setConfirmandoLimpeza(false);
      await atualizarContagem();
    } catch {
      setStatusLimpar({ tipo: 'erro', msg: 'Não consegui apagar.' });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 720 }}>
      <header>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: 'var(--text, #fafafa)',
            marginBottom: 6,
          }}
        >
          Backup do seu material
        </h1>
        <p style={{ color: 'var(--muted, #888)', fontSize: 13.5, lineHeight: 1.6 }}>
          Seus kits, flashcards e questões ficam guardados <strong>só no seu dispositivo</strong>.
          Use o backup pra mover entre celular/computador ou pra não perder se limpar o navegador.
        </p>
      </header>

      <Card
        titulo="Exportar tudo"
        descricao="Baixa um arquivo .json com todo o seu conteúdo. Guarde em local seguro (Drive, Dropbox, pendrive)."
        icone={<Download size={18} />}
        botao={
          <button onClick={exportar} style={btnPrincipal}>
            <Download size={14} />
            Baixar backup
          </button>
        }
        status={statusExp}
      />

      <Card
        titulo="Importar backup"
        descricao="Restaura um backup baixado anteriormente. O conteúdo é ADICIONADO ao que já existe (não substitui)."
        icone={<Upload size={18} />}
        botao={
          <>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void importarArquivo(f);
                e.target.value = '';
              }}
            />
            <button onClick={() => fileRef.current?.click()} style={btnSecundario}>
              <Upload size={14} />
              Selecionar arquivo
            </button>
          </>
        }
        status={statusImp}
      />

      <Card
        titulo="Apagar tudo do dispositivo"
        descricao="Remove TODO o conteúdo salvo neste dispositivo. Esta ação não pode ser desfeita. Recomendamos fazer um backup antes."
        icone={<AlertTriangle size={18} style={{ color: '#fca5a5' }} />}
        botao={
          confirmandoLimpeza ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={confirmarLimpeza} style={btnPerigo}>
                <Trash2 size={14} />
                Confirmar exclusão
              </button>
              <button onClick={() => setConfirmandoLimpeza(false)} style={btnSecundario}>
                Cancelar
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmandoLimpeza(true)} style={btnSecundarioPerigo}>
              <Trash2 size={14} />
              Apagar tudo
            </button>
          )
        }
        status={statusLimpar}
        destrutivo
      />
    </div>
  );
}

function Card({
  titulo,
  descricao,
  icone,
  botao,
  status,
  destrutivo,
}: {
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  botao: React.ReactNode;
  status: Status;
  destrutivo?: boolean;
}) {
  return (
    <section
      style={{
        padding: 18,
        background: 'var(--surface, #161616)',
        border: `1px solid ${destrutivo ? 'rgba(239,68,68,0.20)' : 'var(--border, #2a2a2a)'}`,
        borderRadius: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: destrutivo ? 'rgba(239,68,68,0.10)' : 'var(--gold-dim, rgba(212,175,55,0.10))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: destrutivo ? '#fca5a5' : 'var(--gold-light, #f5d77b)',
            flexShrink: 0,
          }}
        >
          {icone}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text, #fafafa)' }}>
            {titulo}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--muted, #888)', lineHeight: 1.5, marginTop: 4 }}>
            {descricao}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {botao}
        {status.tipo !== 'idle' && (
          <span
            style={{
              fontSize: 13,
              color: status.tipo === 'ok' ? '#86efac' : '#fca5a5',
            }}
          >
            {status.msg}
          </span>
        )}
      </div>
    </section>
  );
}

const btnPrincipal: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 16px',
  background: 'linear-gradient(135deg, #8A6020, #d4af37)',
  color: '#050505',
  border: 'none',
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
};

const btnSecundario: React.CSSProperties = {
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
};

const btnSecundarioPerigo: React.CSSProperties = {
  ...btnSecundario,
  borderColor: 'rgba(239,68,68,0.40)',
  color: '#fca5a5',
};

const btnPerigo: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 16px',
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
};
