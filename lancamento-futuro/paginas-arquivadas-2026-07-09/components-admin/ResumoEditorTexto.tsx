'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';

interface Props {
  content: string;
  onChange: (html: string) => void;
  onInsertImageRequest: () => void;
}

export default function ResumoEditorTexto({ content, onChange, onInsertImageRequest }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'adm-editor-area',
        spellcheck: 'false',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  if (!editor) return null;

  const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const charCount = editor.getText().length;
  const readTime = `~${Math.max(1, Math.ceil(wordCount / 200))} min`;

  return (
    <div>
      <div className="adm-toolbar">
        <select
          className="adm-tool-select"
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'p') editor.chain().focus().setParagraph().run();
            else if (v === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (v === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (v === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
        >
          <option value="p">Parágrafo</option>
          <option value="h1">Título H1</option>
          <option value="h2">Tópico H2</option>
          <option value="h3">Subtópico H3</option>
        </select>
        <div className="adm-tool-sep" />
        <button type="button" className={`adm-tool-btn${editor.isActive('bold') ? ' is-active' : ''}`} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
        <button type="button" className={`adm-tool-btn${editor.isActive('italic') ? ' is-active' : ''}`} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
        <button type="button" className={`adm-tool-btn${editor.isActive('underline') ? ' is-active' : ''}`} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
        <div className="adm-tool-sep" />
        <button type="button" className="adm-tool-btn" onClick={() => editor.chain().focus().toggleBulletList().run()}>≡</button>
        <button type="button" className="adm-tool-btn" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
        <div className="adm-tool-sep" />
        <button type="button" className="adm-tool-btn" onClick={onInsertImageRequest} title="Imagem">🖼</button>
        <button type="button" className="adm-tool-btn" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divisor">—</button>
        <div className="adm-tool-sep" />
        <button type="button" className="adm-tool-btn" style={{ fontSize: '10px' }} onClick={() => editor.chain().focus().unsetAllMarks().run()}>✕F</button>
      </div>
      <EditorContent editor={editor} />
      <div className="adm-word-count">
        <span>Palavras: <b>{wordCount}</b></span>
        <span>Chars: <b>{charCount}</b></span>
        <span>Leitura: <b>{readTime}</b></span>
      </div>
    </div>
  );
}
