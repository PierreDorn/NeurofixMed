'use client';

import { useState, useEffect } from 'react';
import type { SummaryItem } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: SummaryItem) => void;
  existingSummaries: SummaryItem[];
}

function normalize(v: string) {
  return String(v || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function unique(list: string[]) {
  return [...new Set(list.map(v => String(v || '').trim()).filter(Boolean))];
}

export default function SummaryComposerModal({ isOpen, onClose, onSubmit, existingSummaries }: Props) {
  const [matter, setMatter] = useState('');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [subsubtopic, setSubsubtopic] = useState('');
  const [content, setContent] = useState('');
  const [youtube, setYoutube] = useState('');
  const [fileName, setFileName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => document.getElementById('summary-matter')?.focus(), 120);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.classList.add('summary-modal-open');
    else document.body.classList.remove('summary-modal-open');
    return () => document.body.classList.remove('summary-modal-open');
  }, [isOpen]);

  const matters = unique(existingSummaries.map(i => i.matter));
  const topics = unique(
    existingSummaries.filter(i => normalize(i.matter) === normalize(matter)).map(i => i.topic)
  );
  const subtopics = unique(
    existingSummaries
      .filter(i => normalize(i.matter) === normalize(matter) && normalize(i.topic) === normalize(topic))
      .map(i => i.subtopic)
  );

  const matterExists = matters.some(m => normalize(m) === normalize(matter));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      matter: matter.trim() || 'Matéria sem nome',
      topic: topic.trim() || 'Tópico sem nome',
      subtopic: subtopic.trim() || 'Subtópico sem nome',
      subsubtopic: subsubtopic.trim(),
      content: content.trim(),
      youtube: youtube.trim(),
      fileName: file ? file.name : fileName,
      instructions: instructions.trim(),
    });
    setMatter(''); setTopic(''); setSubtopic(''); setSubsubtopic('');
    setContent(''); setYoutube(''); setFileName(''); setInstructions('');
    setFile(null);
  }

  if (!isOpen) return null;

  return (
    <div
      className="summary-modal-overlay open"
      id="summary-composer-modal"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="summary-modal-panel" role="dialog" aria-modal="true">
        <div className="summary-modal-header">
          <div>
            <div className="section-kicker">Gerador de resumos</div>
            <h2>Criar <strong>novo resumo</strong></h2>
            <p>Escolha uma matéria, tópico e subtópico já existentes ou crie novos nomes. O termo correto para "sub do subtópico" é <strong>subsubtópico</strong>, também chamado de subtópico de segundo nível.</p>
          </div>
          <button className="summary-close-btn" type="button" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <form className="summary-form" id="summary-form" onSubmit={handleSubmit}>
          <div className="summary-form-grid">
            <div className="summary-field">
              <label htmlFor="summary-matter">Nome da matéria</label>
              <input className="summary-input" id="summary-matter" type="text"
                list="summary-matter-list" placeholder="Escolha uma matéria existente ou crie uma nova"
                required value={matter}
                onChange={e => { setMatter(e.target.value); setTopic(''); setSubtopic(''); }}
              />
              <datalist id="summary-matter-list">
                {matters.map(m => <option key={m} value={m} />)}
              </datalist>
              <span className="summary-field-hint">
                {!matter.trim()
                  ? 'Ao digitar, aparecem as matérias que você já criou.'
                  : matterExists
                    ? `Matéria existente encontrada. Você pode usar "${matter}" ou alterar o nome.`
                    : 'Matéria nova: ela será criada quando você gerar o resumo.'
                }
              </span>
            </div>

            <div className="summary-field">
              <label htmlFor="summary-topic">Nome do tópico</label>
              <input className="summary-input" id="summary-topic" type="text"
                list="summary-topic-list" placeholder="Escolha um tópico existente ou crie um novo"
                required value={topic}
                onChange={e => { setTopic(e.target.value); setSubtopic(''); }}
              />
              <datalist id="summary-topic-list">
                {topics.map(t => <option key={t} value={t} />)}
              </datalist>
              <span className="summary-field-hint">
                {!matter.trim()
                  ? 'Escolha uma matéria primeiro para ver os tópicos existentes.'
                  : topics.length
                    ? `${topics.length} tópico(s) existente(s) nesta matéria.`
                    : 'Essa matéria existe, mas ainda não tem tópicos salvos.'
                }
              </span>
            </div>

            <div className="summary-field">
              <label htmlFor="summary-subtopic">Nome do subtópico</label>
              <input className="summary-input" id="summary-subtopic" type="text"
                list="summary-subtopic-list" placeholder="Escolha um subtópico existente ou crie um novo"
                required value={subtopic} onChange={e => setSubtopic(e.target.value)}
              />
              <datalist id="summary-subtopic-list">
                {subtopics.map(s => <option key={s} value={s} />)}
              </datalist>
              <span className="summary-field-hint">
                {!topic.trim()
                  ? 'Escolha um tópico primeiro para ver os subtópicos existentes.'
                  : subtopics.length
                    ? `${subtopics.length} subtópico(s) existente(s) neste tópico.`
                    : 'Esse tópico existe, mas ainda não tem subtópicos salvos.'
                }
              </span>
            </div>

            <div className="summary-field">
              <label htmlFor="summary-subsubtopic">Subsubtópico <small>(subtópico de segundo nível)</small></label>
              <input className="summary-input" id="summary-subsubtopic" type="text"
                placeholder="Opcional. Ex: Mediadores químicos"
                value={subsubtopic} onChange={e => setSubsubtopic(e.target.value)}
              />
              <span className="summary-field-hint">Aqui não aparece lista: o subsubtópico sempre fica dentro do subtópico escolhido.</span>
            </div>

            <div className="summary-field full">
              <label htmlFor="summary-content">Colar o conteúdo</label>
              <textarea className="summary-textarea" id="summary-content"
                placeholder="Cole aqui o conteúdo da aula, transcrição, apostila ou anotações que deseja transformar em resumo."
                value={content} onChange={e => setContent(e.target.value)}
              />
            </div>
          </div>

          <div className="summary-source-grid">
            <div className="summary-field">
              <label htmlFor="summary-youtube">URL do YouTube</label>
              <input className="summary-input" id="summary-youtube" type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtube} onChange={e => setYoutube(e.target.value)}
              />
            </div>
            <div className="summary-field">
              <label>Arquivo para resumo</label>
              <label className="summary-upload-box">
                <input id="summary-file" type="file"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.png,.jpg,.jpeg"
                  onChange={e => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                    setFileName(f ? f.name : '');
                  }}
                />
                <strong>Enviar arquivo</strong>
                <span>PDF, DOCX, TXT, imagem ou slide da aula</span>
                <em className="summary-file-name">{fileName || 'Nenhum arquivo selecionado'}</em>
              </label>
            </div>
          </div>

          <div className="summary-field">
            <label htmlFor="summary-instructions">Especificações do resumo</label>
            <textarea className="summary-textarea" id="summary-instructions"
              placeholder="Escreva algo que você quer que tenha no resumo. Ex: deixar mais didático, destacar pontos de prova, criar exemplos clínicos..."
              value={instructions} onChange={e => setInstructions(e.target.value)}
            />
          </div>

          <div className="summary-modal-footer">
            <p>Este protótipo organiza o resumo criado na Biblioteca. Em produção, esta ação pode ser conectada ao backend/IA para gerar o conteúdo final automaticamente.</p>
            <button className="summary-main-btn" type="submit">Gerar resumo →</button>
          </div>
        </form>
      </div>
    </div>
  );
}
