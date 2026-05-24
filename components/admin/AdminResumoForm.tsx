'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import ResumoPDFUpload from './ResumoPDFUpload';

const ResumoEditorTexto = dynamic(() => import('./ResumoEditorTexto'), { ssr: false });

function slugify(str: string) {
  return str
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

interface Material { id: string; nome: string; }
interface PDFFile { file: File; name: string; size: string; objectURL: string; }
interface ImgItem { name: string; size: string; dataUrl: string; file: File; }
interface InitialData {
  id?: string;
  titulo?: string;
  content_html?: string;
  content_type?: string;
  pdf_url?: string;
  pdf_filename?: string;
  pdf_size?: string;
  status?: string;
  ciclo?: string;
  materia?: string;
  topico?: string;
}

interface Props {
  materiais: Material[];
  initial?: InitialData;
}

const CICLOS = ['Ciclo Básico', 'Ciclo Clínico'];

function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      background: 'var(--surface)', border: '1px solid var(--green)', color: 'var(--green)',
      padding: '12px 18px', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: 500,
      display: visible ? 'flex' : 'none', alignItems: 'center', gap: '8px',
      zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,.4)',
    }}>
      ✅ {msg}
    </div>
  );
}

export default function AdminResumoForm({ materiais, initial }: Props) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const imgInputRef = useRef<HTMLInputElement>(null);

  const [titulo, setTitulo] = useState(initial?.titulo ?? '');
  const [tipo, setTipo] = useState<'texto' | 'pdf'>((initial?.content_type as 'texto' | 'pdf') ?? 'texto');
  const [htmlContent, setHtmlContent] = useState(initial?.content_html ?? '<p>Comece a escrever aqui...</p>');
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [ciclo, setCiclo] = useState(initial?.ciclo ?? '');
  const [materia, setMateria] = useState(initial?.materia ?? '');
  const [topico, setTopico] = useState(initial?.topico ?? '');
  const [status, setStatus] = useState(initial?.status ?? 'draft');
  const [imgList, setImgList] = useState<ImgItem[]>([]);
  const [toast, setToast] = useState({ visible: false, msg: '' });
  const [saving, setSaving] = useState(false);

  function showToast(msg: string) {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: '' }), 3000);
  }

  function addImages(files: FileList) {
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const kb = file.size / 1024;
      const size = kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : Math.round(kb) + ' KB';
      const reader = new FileReader();
      reader.onload = (e) => {
        setImgList(prev => [...prev, { name: file.name, size, dataUrl: e.target!.result as string, file }]);
        showToast('Imagem adicionada: ' + file.name.substring(0, 30));
      };
      reader.readAsDataURL(file);
    });
  }

  const handleInsertImageInEditor = useCallback((dataUrl: string) => {
    setHtmlContent(prev => prev + `<figure style="margin:16px 0;text-align:center"><img src="${dataUrl}" style="max-width:100%;border-radius:8px;border:1px solid #2a3344"><figcaption style="font-size:11px;color:#4a5568;margin-top:4px;font-style:italic">Legenda da imagem</figcaption></figure>`);
    showToast('Imagem inserida no editor!');
  }, []);

  async function uploadImages(): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    for (const img of imgList) {
      const path = `${Date.now()}_${slugify(img.file.name)}`;
      const { data } = await supabase.storage.from('resumos-imagens').upload(path, img.file, { upsert: true });
      if (data) {
        const { data: { publicUrl } } = supabase.storage.from('resumos-imagens').getPublicUrl(data.path);
        map.set(img.dataUrl, publicUrl);
      }
    }
    return map;
  }

  async function save(targetStatus: 'draft' | 'published') {
    if (!titulo.trim()) { showToast('Digite o título do resumo!'); return; }
    setSaving(true);
    try {
      let payload: Record<string, unknown> = { titulo, ciclo, materia, topico, status: targetStatus, updated_at: new Date().toISOString(), content: '' };

      if (tipo === 'pdf') {
        if (!pdfFile && !initial?.pdf_url) { showToast('Selecione um PDF!'); setSaving(false); return; }
        if (pdfFile) {
          const path = `${slugify(ciclo || 'geral')}/${slugify(materia || 'geral')}/${Date.now()}_${slugify(pdfFile.name)}`;
          const { data, error } = await supabase.storage.from('resumos-pdf').upload(path, pdfFile.file, { upsert: true });
          if (error) throw error;
          const { data: { publicUrl } } = supabase.storage.from('resumos-pdf').getPublicUrl(data.path);
          payload = { ...payload, content_type: 'pdf', pdf_url: publicUrl, pdf_filename: pdfFile.name, pdf_size: pdfFile.size };
        } else {
          payload = { ...payload, content_type: 'pdf', pdf_url: initial?.pdf_url, pdf_filename: initial?.pdf_filename, pdf_size: initial?.pdf_size };
        }
      } else {
        const imgMap = await uploadImages();
        let finalHtml = htmlContent;
        imgMap.forEach((publicUrl, dataUrl) => { finalHtml = finalHtml.replaceAll(dataUrl, publicUrl); });
        payload = { ...payload, content_type: 'text', content_html: finalHtml };
      }

      if (initial?.id) {
        const { error } = await supabase.from('study_summaries').update(payload).eq('id', initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('study_summaries').insert(payload);
        if (error) throw error;
      }

      showToast(targetStatus === 'published' ? 'Resumo publicado com sucesso!' : 'Rascunho salvo!');
      setTimeout(() => router.push('/admin/resumos'), 1500);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? String(err) ?? 'Erro ao salvar';
      showToast('Erro: ' + msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .adm-page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px}
        .adm-page-title{font-size:22px;font-weight:700;letter-spacing:-.5px}
        .adm-page-subtitle{font-size:13px;color:var(--text-dim);margin-top:3px}
        .adm-editor-layout{display:grid;grid-template-columns:1fr 360px;gap:20px;align-items:start}
        .adm-editor-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:16px}
        .adm-editor-card-header{padding:14px 18px;border-bottom:1px solid var(--border);font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;color:var(--text)}
        .adm-editor-card-body{padding:18px}
        .adm-tipo-toggle{display:flex;border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;margin-bottom:16px}
        .adm-tipo-btn{flex:1;padding:9px 0;font-size:12px;font-weight:600;border:none;background:transparent;color:var(--text-muted);cursor:pointer;font-family:'Sora',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
        .adm-tipo-btn.active{background:var(--primary);color:white}
        .adm-tipo-btn:not(.active):hover{background:var(--surface2);color:var(--text)}
        .adm-toolbar{display:flex;align-items:center;gap:4px;padding:10px 14px;background:var(--bg);border-bottom:1px solid var(--border);flex-wrap:wrap}
        .adm-tool-btn{width:30px;height:30px;border-radius:var(--radius-sm);border:none;background:transparent;color:var(--text-dim);cursor:pointer;font-size:13px;font-weight:600;display:flex;align-items:center;justify-content:center;transition:all .15s;font-family:'Sora',sans-serif}
        .adm-tool-btn:hover,.adm-tool-btn.is-active{background:var(--surface2);color:var(--text)}
        .adm-tool-sep{width:1px;height:20px;background:var(--border);margin:0 4px}
        .adm-tool-select{background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--text-dim);font-size:11px;padding:4px 8px;font-family:'Sora',sans-serif;outline:none;cursor:pointer}
        .adm-editor-area{min-height:420px;padding:24px 28px;background:var(--surface);font-size:14px;line-height:1.8;color:var(--text);outline:none;font-family:'Sora',sans-serif}
        .adm-editor-area:focus{outline:none}
        .adm-editor-area h1{font-size:18px;font-weight:700;color:var(--primary);margin:20px 0 8px;text-transform:uppercase;letter-spacing:.3px}
        .adm-editor-area h2{font-size:15px;font-weight:700;color:var(--primary);margin:20px 0 8px;text-transform:uppercase;letter-spacing:.3px}
        .adm-editor-area h3{font-size:13px;font-weight:700;color:var(--text);margin:16px 0 6px}
        .adm-editor-area p{margin-bottom:12px;color:var(--text-dim);line-height:1.8}
        .adm-editor-area ul,.adm-editor-area ol{padding-left:20px;margin-bottom:12px}
        .adm-editor-area li{margin-bottom:6px;color:var(--text-dim)}
        .adm-editor-area strong{color:var(--text);font-weight:600}
        .adm-editor-area img{max-width:100%;border-radius:8px;border:1px solid #2a3344}
        .adm-editor-area hr{border:none;border-top:1px solid #2a3344;margin:16px 0}
        .adm-word-count{padding:8px 18px;background:var(--bg);border-top:1px solid var(--border);font-size:11px;color:var(--text-muted);display:flex;gap:16px;font-family:'JetBrains Mono',monospace}
        .adm-form-group{margin-bottom:14px}
        .adm-label{display:block;font-size:11px;font-weight:600;color:var(--text-dim);margin-bottom:5px;text-transform:uppercase;letter-spacing:.4px}
        .adm-input,.adm-select{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 12px;font-size:13px;color:var(--text);font-family:'Sora',sans-serif;outline:none;transition:border-color .15s}
        .adm-input:focus,.adm-select:focus{border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-glow)}
        .adm-select option{background:var(--surface)}
        .adm-upload-zone{border:2px dashed var(--border);border-radius:var(--radius);padding:20px;text-align:center;cursor:pointer;transition:all .15s;color:var(--text-muted);font-size:13px}
        .adm-upload-zone:hover{border-color:var(--primary);color:var(--primary);background:var(--primary-glow)}
        .adm-pdf-upload-zone{border:2px dashed var(--border-bright);border-radius:var(--radius);padding:40px 24px;text-align:center;cursor:pointer;transition:all .2s;color:var(--text-dim);background:var(--bg)}
        .adm-pdf-upload-zone:hover,.adm-pdf-upload-zone.drag-over{border-color:var(--primary);background:var(--primary-glow);color:var(--primary)}
        .adm-upload-icon{font-size:36px;margin-bottom:10px;display:block}
        .adm-pdf-preview-wrap{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;background:var(--bg)}
        .adm-pdf-preview-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:var(--surface);border-bottom:1px solid var(--border)}
        .adm-pdf-preview-name{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--text)}
        .adm-pdf-badge{background:rgba(239,68,68,.15);color:#ef4444;border:1px solid rgba(239,68,68,.25);font-size:10px;font-weight:700;padding:2px 7px;border-radius:4px;letter-spacing:.5px}
        .adm-pdf-student-note{margin-top:10px;padding:10px 14px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:var(--radius-sm);font-size:12px;color:var(--green);display:flex;align-items:center;gap:8px}
        @media(max-width:900px){.adm-editor-layout{grid-template-columns:1fr}}
      `}} />

      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">{initial?.id ? 'Editando Resumo' : 'Novo Resumo'}</div>
          <div className="adm-page-subtitle">Escreva o conteúdo com formatação completa</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => router.push('/admin/resumos')}>← Voltar</button>
          <button type="button" className="adm-btn adm-btn-success" onClick={() => save('draft')} disabled={saving}>💾 Rascunho</button>
          <button type="button" className="adm-btn adm-btn-primary" onClick={() => save('published')} disabled={saving}>🚀 Publicar</button>
        </div>
      </div>

      <div className="adm-editor-layout">
        {/* COLUNA PRINCIPAL */}
        <div>
          <div className="adm-editor-card">
            <div className="adm-editor-card-header">✏️ Título do Resumo</div>
            <div className="adm-editor-card-body">
              <input
                className="adm-input"
                style={{ fontSize: '15px', fontWeight: 600 }}
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ex: Clínica Médica — Neurologia — Hidrocefalia"
              />
            </div>
          </div>

          <div className="adm-editor-card">
            <div className="adm-editor-card-header">📄 Conteúdo</div>
            <div style={{ padding: '14px 18px 0' }}>
              <div className="adm-label">Tipo de Conteúdo</div>
              <div className="adm-tipo-toggle">
                <button type="button" className={`adm-tipo-btn${tipo === 'texto' ? ' active' : ''}`} onClick={() => setTipo('texto')}>✏️ Texto Rico</button>
                <button type="button" className={`adm-tipo-btn${tipo === 'pdf' ? ' active' : ''}`} onClick={() => setTipo('pdf')}>📄 PDF Completo</button>
              </div>
            </div>

            {tipo === 'texto' && (
              <ResumoEditorTexto
                content={htmlContent}
                onChange={setHtmlContent}
                onInsertImageRequest={() => imgInputRef.current?.click()}
              />
            )}

            {tipo === 'pdf' && (
              <div style={{ padding: '18px' }}>
                <ResumoPDFUpload value={pdfFile} onChange={setPdfFile} />
              </div>
            )}
          </div>
        </div>

        {/* COLUNA LATERAL */}
        <div>
          <div className="adm-editor-card">
            <div className="adm-editor-card-header">⚙️ Configurações</div>
            <div className="adm-editor-card-body">
              <div className="adm-form-group">
                <label className="adm-label">Ciclo</label>
                <select className="adm-select" value={ciclo} onChange={e => setCiclo(e.target.value)}>
                  <option value="">Selecione...</option>
                  {CICLOS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Matéria</label>
                <select className="adm-select" value={materia} onChange={e => setMateria(e.target.value)}>
                  <option value="">Selecione...</option>
                  {materiais.map(m => <option key={m.id} value={m.nome}>{m.nome}</option>)}
                </select>
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Tópico</label>
                <input className="adm-input" value={topico} onChange={e => setTopico(e.target.value)} placeholder="Ex: Doenças do SNC" />
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Status</label>
                <select className="adm-select" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="draft">📝 Rascunho</option>
                  <option value="published">✅ Publicado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="adm-editor-card">
            <div className="adm-editor-card-header">🖼 Imagens</div>
            <div className="adm-editor-card-body">
              <div className="adm-upload-zone" onClick={() => imgInputRef.current?.click()}>
                ⬆️ Arrastar ou clicar para subir
                <div style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-muted)' }}>PNG, JPG, SVG até 5MB</div>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {imgList.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '8px' }}>Nenhuma imagem adicionada</p>
                ) : (
                  imgList.map((img, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                      <img src={img.dataUrl} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.name}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{img.size}</div>
                      </div>
                      <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => handleInsertImageInEditor(img.dataUrl)}>+ Inserir</button>
                      <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => setImgList(prev => prev.filter((_, i) => i !== idx))}>🗑</button>
                    </div>
                  ))
                )}
              </div>
              <input ref={imgInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => { if (e.target.files?.length) { addImages(e.target.files); e.target.value = ''; } }} />
            </div>
          </div>

          <div className="adm-editor-card">
            <div className="adm-editor-card-header">⚡ Ações Rápidas</div>
            <div className="adm-editor-card-body">
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>Gere flashcards automaticamente a partir deste resumo.</p>
              <button type="button" className="adm-btn adm-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>🤖 Gerar Flashcards</button>
              <div style={{ height: '10px' }} />
              <button type="button" className="adm-btn adm-btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>👁 Prévia do Aluno</button>
            </div>
          </div>
        </div>
      </div>

      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}
