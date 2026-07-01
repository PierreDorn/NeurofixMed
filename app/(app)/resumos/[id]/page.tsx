import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import BackButton from './BackButton';
import AgendarRevisaoButton from './AgendarRevisaoButton';

export const dynamic = 'force-dynamic';

export default async function ResumoAlunoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: resumo } = await supabase
    .from('study_summaries')
    .select('id, titulo, content_type, content_html, pdf_url, materia, ciclo, topico')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (!resumo) notFound();

  // Verifica se já tem revisões agendadas (para estado inicial do botão)
  const { data: { user } } = await supabase.auth.getUser();
  let jaAgendado = false;
  if (user) {
    const { data: jaExiste } = await supabase.rpc('ja_tem_revisoes', {
      p_user_id: user.id,
      p_conteudo_tipo: 'study_summary',
      p_conteudo_id: resumo.id,
    });
    jaAgendado = jaExiste === true;
  }

  /* ── PDF: ocupa toda a área main-content, botão voltar na barra acima ── */
  if (resumo.content_type === 'pdf' && resumo.pdf_url) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: `
          .resumo-pdf-shell {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            background: #ffffff;
          }
          .resumo-pdf-topbar {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 0 20px;
            height: 48px;
            background: #0a0d14;
            border-bottom: 1px solid rgba(201,168,76,0.18);
            flex-shrink: 0;
          }
          .resumo-pdf-sep {
            width: 1px;
            height: 18px;
            background: rgba(201,168,76,0.18);
            flex-shrink: 0;
          }
          .resumo-pdf-title {
            font-size: 13px;
            font-weight: 600;
            color: rgba(241,245,249,0.55);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            letter-spacing: 0.01em;
          }
          .resumo-pdf-shell iframe {
            flex: 1;
            border: none;
            display: block;
            width: 100%;
            min-height: 0;
          }
          .main-content {
            overflow: hidden;
            position: relative;
          }
        `}} />
        <div className="resumo-pdf-shell">
          <div className="resumo-pdf-topbar">
            <BackButton />
            <div className="resumo-pdf-sep" />
            <span className="resumo-pdf-title">{resumo.titulo}</span>
            {/* MVP: AgendarRevisaoButton desconectado. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
            {false && (
              <div style={{ marginLeft: 'auto' }}>
                <AgendarRevisaoButton resumoId={resumo!.id} jaAgendado={jaAgendado} />
              </div>
            )}
          </div>
          <iframe
            src={resumo.pdf_url}
            title={resumo.titulo ?? 'Resumo'}
          />
        </div>
      </>
    );
  }

  /* ── Texto: fundo branco, tipografia confortável para leitura ── */
  return (
    <div style={{ flex: 1, background: '#ffffff', minHeight: '100%' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .main-content { background: #ffffff !important; }
        .resumo-content { font-size: 15px; line-height: 1.9; color: #334155; }
        .resumo-content h1, .resumo-content h2 {
          font-size: 12px; font-weight: 800; color: #1d4ed8;
          margin: 28px 0 10px; text-transform: uppercase; letter-spacing: .5px;
          padding-bottom: 6px; border-bottom: 2px solid #dbeafe;
        }
        .resumo-content h3 { font-size: 15px; font-weight: 700; color: #0f172a; margin: 20px 0 8px; }
        .resumo-content p { margin-bottom: 14px; }
        .resumo-content ul, .resumo-content ol { padding-left: 22px; margin-bottom: 14px; }
        .resumo-content li { margin-bottom: 6px; }
        .resumo-content strong { color: #0f172a; font-weight: 700; }
        .resumo-content img { max-width: 100%; border-radius: 10px; margin: 18px 0; box-shadow: 0 2px 16px rgba(0,0,0,.1); }
        .resumo-content figure { margin: 18px 0; text-align: center; }
        .resumo-content figcaption { font-size: 12px; color: #94a3b8; margin-top: 6px; font-style: italic; }
        .resumo-content hr { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
        .resumo-content blockquote {
          border-left: 4px solid #bfdbfe; padding: 10px 16px;
          background: #f0f9ff; border-radius: 0 8px 8px 0;
          color: #1e40af; margin: 16px 0; font-style: italic;
        }
        .resumo-content code {
          background: #f1f5f9; color: #0f172a;
          padding: 2px 6px; border-radius: 4px;
          font-size: 13px; font-family: monospace;
        }
      `}} />

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '36px 28px 80px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <BackButton />
          {/* MVP: AgendarRevisaoButton desconectado. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
          {false && <AgendarRevisaoButton resumoId={resumo!.id} jaAgendado={jaAgendado} />}
        </div>

        <p style={{
          fontSize: '11px',
          color: '#94a3b8',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          fontWeight: 600,
        }}>
          {resumo.ciclo} › {resumo.materia} › {resumo.topico}
        </p>

        <h1 style={{
          fontSize: '26px',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '36px',
          lineHeight: 1.25,
          letterSpacing: '-0.03em',
        }}>
          {resumo.titulo}
        </h1>

        <div
          className="resumo-content"
          dangerouslySetInnerHTML={{ __html: resumo.content_html ?? '' }}
        />

      </div>
    </div>
  );
}
