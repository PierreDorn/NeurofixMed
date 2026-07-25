'use client';

import { useRef, useState } from 'react';

interface PDFFile {
  file: File;
  name: string;
  size: string;
  objectURL: string;
}

interface Props {
  value: PDFFile | null;
  onChange: (pdf: PDFFile | null) => void;
}

export default function ResumoPDFUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function loadPDF(file: File) {
    if (file.type !== 'application/pdf') return;
    const kb = file.size / 1024;
    const size = kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : Math.round(kb) + ' KB';
    const objectURL = URL.createObjectURL(file);
    if (value?.objectURL) URL.revokeObjectURL(value.objectURL);
    onChange({ file, name: file.name, size, objectURL });
  }

  function remove() {
    if (value?.objectURL) URL.revokeObjectURL(value.objectURL);
    onChange(null);
  }

  if (value) {
    return (
      <div className="adm-pdf-preview-wrap">
        <div className="adm-pdf-preview-header">
          <div className="adm-pdf-preview-name">
            <span>📄</span>
            <span>{value.name}</span>
            <span className="adm-pdf-badge">PDF</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{value.size}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => inputRef.current?.click()}>🔄 Trocar</button>
            <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={remove}>🗑 Remover</button>
          </div>
        </div>
        <div style={{ width: '100%', height: '520px', background: 'var(--bg)' }}>
          <iframe src={value.objectURL} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} title="Preview PDF" />
        </div>
        <div className="adm-pdf-student-note">
          ✅ O aluno verá este PDF completo — todas as páginas, imagens e formatação original preservadas.
        </div>
        <input ref={inputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) { loadPDF(e.target.files[0]); e.target.value = ''; } }} />
      </div>
    );
  }

  return (
    <div
      className={`adm-pdf-upload-zone${dragOver ? ' drag-over' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) loadPDF(f); }}
    >
      <span className="adm-upload-icon">📄</span>
      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--text)' }}>
        Arraste o PDF aqui ou clique para selecionar
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        O arquivo completo será exibido ao aluno exatamente como está
      </p>
      <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: '13px', fontWeight: 500 }}>
        📁 Selecionar PDF
      </div>
      <p style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
        Aceita apenas .pdf · Sem limite de páginas
      </p>
      <input ref={inputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) { loadPDF(e.target.files[0]); e.target.value = ''; } }} />
    </div>
  );
}
