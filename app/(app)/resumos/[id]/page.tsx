import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

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

  if (resumo.content_type === 'pdf' && resumo.pdf_url) {
    return (
      <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>{resumo.ciclo} › {resumo.materia} › {resumo.topico}</span>
          <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{resumo.titulo}</h1>
        </div>
        <iframe src={resumo.pdf_url} style={{ flex: 1, border: 'none', display: 'block', width: '100%' }} title={resumo.titulo ?? 'Resumo'} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {resumo.ciclo} › {resumo.materia} › {resumo.topico}
        </p>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{resumo.titulo}</h1>
      </div>
      <div
        className="resumo-content"
        dangerouslySetInnerHTML={{ __html: resumo.content_html ?? '' }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .resumo-content{font-size:15px;line-height:1.8;color:#374151}
        .resumo-content h1,.resumo-content h2{font-size:14px;font-weight:700;color:#1d4ed8;margin:24px 0 10px;text-transform:uppercase;letter-spacing:.3px}
        .resumo-content h3{font-size:14px;font-weight:700;color:#111827;margin:18px 0 8px}
        .resumo-content p{margin-bottom:14px}
        .resumo-content ul,.resumo-content ol{padding-left:22px;margin-bottom:14px}
        .resumo-content li{margin-bottom:6px}
        .resumo-content strong{color:#111827;font-weight:600}
        .resumo-content img{max-width:100%;border-radius:8px;margin:16px 0;box-shadow:0 2px 12px rgba(0,0,0,.1)}
        .resumo-content figure{margin:16px 0;text-align:center}
        .resumo-content figcaption{font-size:12px;color:#9ca3af;margin-top:6px;font-style:italic}
        .resumo-content hr{border:none;border-top:1px solid #e5e7eb;margin:24px 0}
      `}} />
    </div>
  );
}
