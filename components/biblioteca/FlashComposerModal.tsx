'use client';

import { useState, useEffect } from 'react';
import type { FlashItem } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: FlashItem) => void;
  existingFlashcards: FlashItem[];
}

function normalize(v: string) {
  return String(v || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function unique(list: string[]) {
  return [...new Set(list.map(v => String(v || '').trim()).filter(Boolean))];
}

export default function FlashComposerModal({ isOpen, onClose, onSubmit, existingFlashcards }: Props) {
  const [matter, setMatter] = useState('');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [subsubtopic, setSubsubtopic] = useState('');
  const [cardCount, setCardCount] = useState(20);
  const [style, setStyle] = useState('');
  const [content, setContent] = useState('');
  const [youtube, setYoutube] = useState('');
  const [fileName, setFileName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => document.getElementById('flash-matter')?.focus(), 120);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.classList.add('flash-modal-open');
    else document.body.classList.remove('flash-modal-open');
    return () => document.body.classList.remove('flash-modal-open');
  }, [isOpen]);

  const matters = unique(existingFlashcards.map(i => i.matter));
  const topics = unique(
    existingFlashcards.filter(i => normalize(i.matter) === normalize(matter)).map(i => i.topic)
  );
  const subtopics = unique(
    existingFlashcards
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
      cardCount,
      style: style.trim(),
    });
    setMatter(''); setTopic(''); setSubtopic(''); setSubsubtopic('');
    setContent(''); setYoutube(''); setFileName(''); setInstructions('');
    setFile(null); setCardCount(20); setStyle('');
  }

  if (!isOpen) return null;

  return (
    <div
      className="summary-modal-overlay flash-modal-accent open"
      id="flash-composer-modal"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="summary-modal-panel" role="dialog" aria-modal="true">
        <div className="summary-modal-header">
          <div>
            <div className="section-kicker">Gerador de flashcards</div>
            <h2>Criar <strong>novo baralho</strong></h2>
            <p>Escolha uma matéria, tópico e subtópico já existentes ou crie novos nomes. O subsubtópico é opcional e sempre fica dentro do subtópico escolhido.</p>
          </div>
          <button className="summary-close-btn" type="button" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <form className="summary-form" id="flash-form" onSubmit={handleSubmit}>
          <div className="summary-form-grid">
            <div className="summary-field">
              <label htmlFor="flash-matter">Nome da matéria</label>
              <input className="summary-input" id="flash-matter" type="text"
                list="flash-matter-list" placeholder="Escolha uma matéria existente ou crie uma nova"
                required value={matter}
                onChange={e => { setMatter(e.target.value); setTopic(''); setSubtopic(''); }}
              />
              <datalist id="flash-matter-list">
                {matters.map(m => <option key={m} value={m} />)}
              </datalist>
              <span className="summary-field-hint">
                {!matter.trim()
                  ? 'Ao digitar, aparecem as matérias que você já criou nos flashcards.'
                  : matterExists
                    ? `Matéria existente encontrada. Você pode usar "${matter}" ou alterar o nome.`
                    : 'Matéria nova: ela será criada quando você gerar os flashcards.'
                }
              </span>
            </div>

            <div className="summary-field">
              <label htmlFor="flash-topic">Nome do tópico</label>
              <input className="summary-input" id="flash-topic" type="text"
                list="flash-topic-list" placeholder="Escolha um tópico existente ou crie um novo"
                required value={topic}
                onChange={e => { setTopic(e.target.value); setSubtopic(''); }}
              />
              <datalist id="flash-topic-list">
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
              <label htmlFor="flash-subtopic">Nome do subtópico</label>
              <input className="summary-input" id="flash-subtopic" type="text"
                list="flash-subtopic-list" placeholder="Escolha um subtópico existente ou crie um novo"
                required value={subtopic} onChange={e => setSubtopic(e.target.value)}
              />
              <datalist id="flash-subtopic-list">
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
              <label htmlFor="flash-subsubtopic">Subsubtópico <small>(opcional)</small></label>
              <input className="summary-input" id="flash-subsubtopic" type="text"
                placeholder="Ex: Fases do potencial de ação"
                value={subsubtopic} onChange={e => setSubsubtopic(e.target.value)}
              />
              <span className="summary-field-hint">Aqui não aparece lista: o subsubtópico sempre fica dentro do subtópico escolhido.</span>
            </div>

            <div className="summary-field">
              <label htmlFor="flash-card-count">Quantidade de cards</label>
              <input className="summary-input" id="flash-card-count" type="number"
                min={1} max={200} value={cardCount}
                onChange={e => setCardCount(Number(e.target.value))}
              />
              <span className="summary-field-hint">Quantidade sugerida para gerar o baralho.</span>
            </div>

            <div className="summary-field">
              <label htmlFor="flash-style">Estilo dos cards</label>
              <input className="summary-input" id="flash-style" type="text"
                placeholder="Ex: pergunta e resposta, cloze, caso clínico..."
                value={style} onChange={e => setStyle(e.target.value)}
              />
              <span className="summary-field-hint">Você pode pedir cards objetivos, clínicos ou de prova.</span>
            </div>

            <div className="summary-field full">
              <label htmlFor="flash-content">Colar o conteúdo</label>
              <textarea className="summary-textarea" id="flash-content"
                placeholder="Cole aqui o conteúdo da aula, transcrição, apostila ou anotações que deseja transformar em flashcards."
                value={content} onChange={e => setContent(e.target.value)}
              />
            </div>
          </div>

          <div className="summary-source-grid">
            <div className="summary-field">
              <label htmlFor="flash-youtube">URL do YouTube</label>
              <input className="summary-input" id="flash-youtube" type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtube} onChange={e => setYoutube(e.target.value)}
              />
            </div>
            <div className="summary-field">
              <label>Arquivo para gerar flashcards</label>
              <label className="summary-upload-box">
                <input id="flash-file" type="file"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.png,.jpg,.jpeg"
                  onChange={e => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                    setFileName(f ? f.name : '');
                  }}
                />
                <strong>Enviar arquivo</strong>
                <span>PDF, DOCX, TXT, imagem ou slide da aula</span>
                <em className="summary-file-name" id="flash-file-name">{fileName || 'Nenhum arquivo selecionado'}</em>
              </label>
            </div>
          </div>

          <div className="summary-field">
            <label htmlFor="flash-instructions">Especificações dos flashcards</label>
            <textarea className="summary-textarea" id="flash-instructions"
              placeholder="Ex: criar cards curtos, focar em prova, usar perguntas diretas, criar cloze deletion, incluir pegadinhas..."
              value={instructions} onChange={e => setInstructions(e.target.value)}
            />
          </div>

          <div className="summary-modal-footer">
            <p>Este protótipo organiza o baralho criado nos Flashcards. Em produção, esta ação pode ser conectada ao backend/IA para gerar os cards automaticamente.</p>
            <button className="summary-main-btn" type="submit">Gerar flashcards →</button>
          </div>
        </form>
      </div>
    </div>
  );
}
