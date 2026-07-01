'use client';

import { useState, useRef } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { MaterialDB } from '@/lib/biblioteca';
import type { CycleKey, DeepLink } from './types';

type Suggestion = {
  nome: string;
  tipo: string;
  disciplineKey?: string;
  topicId?: string;
  subtopicId?: string;
  subSubtopicId?: string;
};

interface Props {
  summaryCount: number;
  matterCount: number;
  dbMateriaCount: number;
  dbSummaryCount: number;
  materiais: MaterialDB[];
  onOpenDiscipline: (key: string, deepLink?: DeepLink) => void;
  onOpenSummaryComposer: () => void;
  onOpenSummaryLibrary: () => void;
  isBlurred: boolean;
}

const CARD_COLORS = ['gold', 'blue', 'green'] as const;

function normalizeText(v: string) {
  return String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isCicloBasico(ciclo: string): boolean {
  return normalizeText(ciclo).includes('basico');
}

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

export default function BibliotecaView({
  summaryCount, matterCount,
  dbMateriaCount, dbSummaryCount,
  materiais,
  onOpenDiscipline, onOpenSummaryComposer, onOpenSummaryLibrary,
  isBlurred,
}: Props) {
  const [selectedCycle, setSelectedCycle] = useState<CycleKey>('basico');
  const [search, setSearch] = useState('');
  const [searchHint, setSearchHint] = useState('');
  const [searchFoundKey, setSearchFoundKey] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePill, setActivePill] = useState('todos');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const basicoMats = materiais.filter(m => isCicloBasico(m.ciclo));
  const clinicoMats = materiais.filter(m => !isCicloBasico(m.ciclo));

  const visibleMateriais = materiais.filter(mat => {
    const matCycle = isCicloBasico(mat.ciclo) ? 'basico' : 'clinico';
    if (matCycle !== selectedCycle) return false;
    if (searchFoundKey && mat.id !== searchFoundKey) return false;
    if (activePill !== 'todos' && mat.id !== activePill) return false;
    return true;
  });

  // Resolve material ID from a material name string (used by search)
  function resolveDK(matNome: string): string | undefined {
    const n = normalizeText(matNome);
    return materiais.find(m => {
      const mn = normalizeText(m.nome);
      return mn === n || mn.includes(n) || n.includes(mn);
    })?.id;
  }

  // Match user query to a material ID (local, no network)
  function findDisciplineKey(query: string): string | null {
    const q = normalizeText(query);
    if (q.length < 2) return null;
    return materiais.find(m => {
      const n = normalizeText(m.nome);
      return n === q || (q.length >= 3 && (n.startsWith(q) || n.includes(q) || q.includes(n)));
    })?.id ?? null;
  }

  function applyFoundKey(matId: string) {
    const mat = materiais.find(m => m.id === matId);
    if (!mat) return;
    setSelectedCycle(isCicloBasico(mat.ciclo) ? 'basico' : 'clinico');
    setSearchFoundKey(matId);
  }

  function handleSearch(value: string, force = false) {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearch(value);
    setSearchHint('');
    setSuggestions([]);
    setShowDropdown(false);
    if (value.length < 2) {
      setSearchFoundKey(null);
      return;
    }

    searchTimer.current = setTimeout(async () => {
      const q = value.trim();
      const collected: Suggestion[] = [];

      // Local match first (instant, no network)
      const localKey = findDisciplineKey(value);
      if (localKey) {
        const mat = materiais.find(m => m.id === localKey);
        if (mat) collected.push({ nome: mat.nome, tipo: 'matéria', disciplineKey: localKey });
      }

      const supabase = createSupabaseBrowserClient();

      // Wave 1 — ilike searches in all 4 tables, no joins
      const [matRes, topRes, subRes, subsubRes] = await Promise.all([
        supabase.from('materiais').select('id, nome').ilike('nome', `%${q}%`).eq('ativo', true).limit(5),
        supabase.from('topics').select('id, nome, material_id').ilike('nome', `%${q}%`).limit(5),
        supabase.from('subtopics').select('id, nome, topic_id').ilike('nome', `%${q}%`).limit(5),
        supabase.from('sub_subtopics').select('id, nome, subtopic_id').ilike('nome', `%${q}%`).limit(5),
      ]);

      // Collect parent IDs that need resolution
      const topicIdsForSubs = [...new Set(
        (subRes.data ?? []).map((s: any) => s.topic_id as string).filter(Boolean)
      )];
      const subtopicIdsForSubsubs = [...new Set(
        (subsubRes.data ?? []).map((ss: any) => ss.subtopic_id as string).filter(Boolean)
      )];

      // Wave 2 — resolve parent rows in parallel
      const [subsTopicsRes, subsubSubtopicsRes] = await Promise.all([
        topicIdsForSubs.length > 0
          ? supabase.from('topics').select('id, material_id').in('id', topicIdsForSubs)
          : Promise.resolve({ data: [] as Array<{ id: string; material_id: string }> }),
        subtopicIdsForSubsubs.length > 0
          ? supabase.from('subtopics').select('id, topic_id').in('id', subtopicIdsForSubsubs)
          : Promise.resolve({ data: [] as Array<{ id: string; topic_id: string }> }),
      ]);

      // Wave 3 — resolve topic_ids from sub_subtopics chain
      const topicIdsForSubsubs = [...new Set(
        (subsubSubtopicsRes.data ?? []).map((s: any) => s.topic_id as string).filter(Boolean)
      )];
      const subsubTopicsRes = topicIdsForSubsubs.length > 0
        ? await supabase.from('topics').select('id, material_id').in('id', topicIdsForSubsubs)
        : { data: [] as Array<{ id: string; material_id: string }> };

      // Build lookup maps
      const topicToMatId = new Map<string, string>();
      (topRes.data ?? []).forEach((t: any) => topicToMatId.set(t.id, t.material_id));
      (subsTopicsRes.data ?? []).forEach((t: any) => topicToMatId.set(t.id, t.material_id));
      (subsubTopicsRes.data ?? []).forEach((t: any) => topicToMatId.set(t.id, t.material_id));

      const subtopicToTopicId = new Map<string, string>();
      (subsubSubtopicsRes.data ?? []).forEach((s: any) => subtopicToTopicId.set(s.id, s.topic_id));

      // Wave 4 — batch fetch material names for topics/subtopics/sub_subtopics
      const allMatIds = new Set<string>([
        ...(topRes.data ?? []).map((t: any) => t.material_id as string),
        ...(subsTopicsRes.data ?? []).map((t: any) => t.material_id as string),
        ...(subsubTopicsRes.data ?? []).map((t: any) => t.material_id as string),
      ].filter(Boolean));

      const matById = new Map<string, string>();
      if (allMatIds.size > 0) {
        const { data } = await supabase.from('materiais').select('id, nome').in('id', [...allMatIds]);
        (data ?? []).forEach((m: any) => matById.set(m.id, m.nome));
      }

      // Build suggestions (materiais first, then deeper levels)
      for (const m of matRes.data ?? []) {
        if (collected.length >= 5) break;
        const dk = resolveDK(m.nome);
        if (!collected.find(c => c.disciplineKey === dk && c.tipo === 'matéria'))
          collected.push({ nome: m.nome, tipo: 'matéria', disciplineKey: dk });
      }
      for (const t of topRes.data ?? []) {
        if (collected.length >= 5) break;
        const matNome = t.material_id ? matById.get(t.material_id) ?? '' : '';
        collected.push({ nome: t.nome, tipo: 'tópico', disciplineKey: matNome ? resolveDK(matNome) : undefined, topicId: t.id });
      }
      for (const s of subRes.data ?? []) {
        if (collected.length >= 5) break;
        const matId = s.topic_id ? topicToMatId.get(s.topic_id) ?? '' : '';
        const matNome = matId ? matById.get(matId) ?? '' : '';
        collected.push({ nome: s.nome, tipo: 'subtópico', disciplineKey: matNome ? resolveDK(matNome) : undefined, subtopicId: s.id });
      }
      for (const ss of subsubRes.data ?? []) {
        if (collected.length >= 5) break;
        const topicId = ss.subtopic_id ? subtopicToTopicId.get(ss.subtopic_id) ?? '' : '';
        const matId = topicId ? topicToMatId.get(topicId) ?? '' : '';
        const matNome = matId ? matById.get(matId) ?? '' : '';
        collected.push({ nome: ss.nome, tipo: 'sub-subtópico', disciplineKey: matNome ? resolveDK(matNome) : undefined, subSubtopicId: ss.id });
      }

      if (collected.length > 0) {
        setSuggestions(collected.slice(0, 5));
        setShowDropdown(true);
        const firstDK = collected.find(c => c.disciplineKey)?.disciplineKey;
        if (firstDK) applyFoundKey(firstDK);
        else setSearchFoundKey(null);
      } else {
        setSearchHint('Não encontrado. Tente o nome de uma matéria, tópico ou subtópico.');
        setSearchFoundKey(null);
      }
    }, force ? 0 : 300);
  }

  function handleSuggestionClick(s: Suggestion) {
    setSearch(s.nome);
    setSuggestions([]);
    setShowDropdown(false);
    if (!s.disciplineKey) return;
    applyFoundKey(s.disciplineKey);

    const deepLink: DeepLink | undefined =
      s.topicId || s.subtopicId || s.subSubtopicId
        ? { topicId: s.topicId, subtopicId: s.subtopicId, subSubtopicId: s.subSubtopicId }
        : undefined;

    // Abre o painel com deep link para navegar automaticamente até o conteúdo
    setTimeout(() => onOpenDiscipline(s.disciplineKey!, deepLink), 80);
  }

  function handlePill(pillId: string) {
    setActivePill(pillId);
    if (pillId === 'todos') {
      setSearchFoundKey(null);
      setSelectedCycle('basico');
      document.getElementById('discipline-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const mat = materiais.find(m => m.id === pillId);
    if (mat) {
      setSelectedCycle(isCicloBasico(mat.ciclo) ? 'basico' : 'clinico');
      setTimeout(() => {
        const card = document.querySelector(`[data-subject-key="${mat.id}"]`) as HTMLElement | null;
        if (card) { card.classList.add('search-hit'); setTimeout(() => card.classList.remove('search-hit'), 1500); }
        onOpenDiscipline(mat.id);
      }, 360);
    }
  }

  return (
    <section
      id="biblioteca-view"
      className={`study-view active-view${isBlurred ? ' summary-blurred' : ''}`}
      aria-label="Biblioteca de resumos"
    >
      <div className="container">
        {/* ── HERO (full-width) ── */}
        <section className="hero hero-wide" aria-labelledby="hero-title">
          <div className="hero-full">
            <div className="section-kicker">Sua biblioteca médica</div>
            <h1 className="hero-title" id="hero-title">
              Construa sua base de conhecimento com <strong>resumos</strong> e <span className="blue">questões.</span>
            </h1>
            <p className="hero-subtitle">
              Acesse resumos por disciplina, ciclo e assunto. Cada tópico é conectado aos flashcards e às questões de prova, criando um ciclo completo de <b>fixação real</b>.
            </p>
            <div className="search-wrapper">
              <label className="search-card">
                <span className="search-icon">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                    <path d="M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8ZM16.3 16.3 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  id="library-search"
                  type="search"
                  placeholder="Buscar matéria, tópico ou subtópico…"
                  autoComplete="off"
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch(search, true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                  onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                />
              </label>
              {showDropdown && suggestions.length > 0 && (
                <ul className="search-dropdown" role="listbox">
                  {suggestions.map((s, i) => (
                    <li key={i} role="option" onMouseDown={() => handleSuggestionClick(s)}>
                      <span className="sug-nome">{s.nome}</span>
                      <span className="sug-tipo">{s.tipo}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {searchHint && (
              <span className="search-hint show" id="library-search-hint">
                {searchHint}
              </span>
            )}
            <div className="filters">
              <button
                className={`pill${activePill === 'todos' ? ' active' : ''}`}
                onClick={() => handlePill('todos')}
              >
                Todos
              </button>
              {materiais.map(mat => (
                <button
                  key={mat.id}
                  className={`pill${activePill === mat.id ? ' active' : ''}`}
                  onClick={() => handlePill(mat.id)}
                >
                  {mat.nome}
                </button>
              ))}
            </div>

            {/* ── Mini-stats — mesmo formato dos flashcards ── */}
            <div className="hero-mini-grid" style={{marginTop:'20px'}}>
              <div className="mini-stat mini-stat-gold">
                <div>
                  <strong>{dbMateriaCount} {dbMateriaCount === 1 ? 'matéria' : 'matérias'}</strong>
                  <span>disponíveis no catálogo</span>
                </div>
                <span className="mini-icon mini-icon-gold" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </span>
              </div>
              <div className="mini-stat mini-stat-blue">
                <div>
                  <strong>{dbSummaryCount} {dbSummaryCount === 1 ? 'resumo' : 'resumos'}</strong>
                  <span>prontos para estudo</span>
                </div>
                <span className="mini-icon mini-icon-blue" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="9" y1="13" x2="15" y2="13"/>
                    <line x1="9" y1="17" x2="13" y2="17"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CRIAÇÃO E ACESSO A RESUMOS ── */}
        <section className="summary-builder-section" id="summary-tools" aria-label="Gerador de resumos" style={{display:'none'}}>
          <div className="summary-builder-head">
            <div>
              <div className="section-kicker">Resumos personalizados</div>
              <h2>Crie e acesse seus <strong>resumos de estudo.</strong></h2>
              <p>Adicione conteúdo, cole transcrições, envie arquivos ou links do YouTube. O sistema organiza tudo por matéria, tópico e subtópico — com hierarquia completa.</p>
            </div>
            <span className="summary-ready-badge" id="summary-ready-badge">
              {summaryCount} {summaryCount === 1 ? 'resumo pronto' : 'resumos prontos'}
            </span>
          </div>
          <div className="summary-action-grid">
            <article className="summary-action-card">
              <div className="summary-action-top">
                <div className="summary-action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </div>
              <h3>Criar novo resumo</h3>
              <p>Escolha a matéria, o tópico, o subtópico e opcionalmente o subsubtópico. Cole o conteúdo, cole o vídeo do YouTube ou envie um arquivo.</p>
              <div className="summary-action-footer">
                <small>Estrutura hierárquica completa</small>
                <button className="summary-main-btn" type="button" onClick={onOpenSummaryComposer}>
                  Criar resumo →
                </button>
              </div>
            </article>
            <article className="summary-action-card">
              <div className="summary-action-top">
                <div className="summary-action-icon blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              </div>
              <h3>Acessar meus resumos</h3>
              <p>Veja todos os resumos que você criou, organizados por matéria, tópico e subtópico — na mesma hierarquia das disciplinas da Biblioteca.</p>
              <div className="summary-action-footer">
                <small id="summary-count-label">
                  {matterCount} {matterCount === 1 ? 'matéria criada' : 'matérias criadas'}
                </small>
                <button className="summary-link-btn" type="button" onClick={onOpenSummaryLibrary}>
                  Acessar meus resumos →
                </button>
              </div>
            </article>

            <article className="summary-action-card">
              <div className="summary-action-top">
                <div className="summary-action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7h18M6 12h12M9 17h6"/>
                    <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
                    <circle cx="6" cy="12" r="1.2" fill="currentColor"/>
                    <circle cx="9" cy="17" r="1.2" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <h3>Acessar hierarquia</h3>
              <p>Veja toda a árvore dos seus resumos pessoais: matérias, tópicos, subtópicos e textos. Exclua qualquer nível em cascata.</p>
              <div className="summary-action-footer">
                <small>Exclusão em cascata por nível</small>
                <a className="summary-link-btn" href="/biblioteca/hierarquia">
                  Acessar hierarquia →
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* ── ESCOLHA DE CICLO ── */}
        <section className="cycle-router" aria-labelledby="cycle-router-title">
          <div className="cycle-router-head">
            <div>
              <div className="section-kicker">Escolha seu ciclo</div>
              <h2 id="cycle-router-title">Acesse as matérias por <strong>etapa da formação.</strong></h2>
              <p>Primeiro escolha o ciclo. Depois a biblioteca mostra apenas as matérias daquele grupo, mantendo a navegação mais limpa e focada.</p>
            </div>
            <span className="cycle-router-note">Filtro inteligente</span>
          </div>
          <div className="cycle-options">
            <button
              className={`cycle-option${selectedCycle === 'basico' ? ' active' : ''}`}
              type="button"
              onClick={() => {
                setSelectedCycle('basico');
                setTimeout(() => document.getElementById('discipline-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
              }}
            >
              <span className="cycle-option-content">
                <span className="cycle-option-top">
                  <span className="cycle-option-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5c-2-2-5-2-6.5 0C3 5.5 2 8 3 10c-1 1-1 3 .5 4C3 16 4.5 17.5 6.5 17.5 7 19 8.5 20 10.5 19.5 11 20.5 12 21 12 21" />
                      <path d="M12 5c2-2 5-2 6.5 0C21 5.5 22 8 21 10c1 1 1 3-.5 4C21 16 19.5 17.5 17.5 17.5 17 19 15.5 20 13.5 19.5 13 20.5 12 21 12 21" />
                      <line x1="12" y1="5" x2="12" y2="21" />
                    </svg>
                  </span>
                  <span className="cycle-option-badge">
                    {basicoMats.length} {basicoMats.length === 1 ? 'matéria' : 'matérias'}
                  </span>
                </span>
                <span>
                  <span className="cycle-option-title">Ciclo Básico</span>
                  <span className="cycle-option-desc">Bases fundamentais para construir raciocínio médico desde o início.</span>
                </span>
                <span className="cycle-subjects">
                  {basicoMats.map(m => <span key={m.id}>{m.nome}</span>)}
                </span>
                <span className="cycle-option-footer">Ver matérias <span>›</span></span>
              </span>
            </button>
            <button
              className={`cycle-option blue${selectedCycle === 'clinico' ? ' active' : ''}`}
              type="button"
              onClick={() => {
                setSelectedCycle('clinico');
                setTimeout(() => document.getElementById('discipline-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
              }}
            >
              <span className="cycle-option-content">
                <span className="cycle-option-top">
                  <span className="cycle-option-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                    </svg>
                  </span>
                  <span className="cycle-option-badge">
                    {clinicoMats.length} {clinicoMats.length === 1 ? 'matéria' : 'matérias'}
                  </span>
                </span>
                <span>
                  <span className="cycle-option-title">Ciclo Clínico</span>
                  <span className="cycle-option-desc">Conteúdos aplicados à prática, diagnóstico, condutas e tomada de decisão.</span>
                </span>
                <span className="cycle-subjects">
                  {clinicoMats.map(m => <span key={m.id}>{m.nome}</span>)}
                </span>
                <span className="cycle-option-footer">Ver matérias <span>›</span></span>
              </span>
            </button>
          </div>
        </section>

        {/* ── DISCIPLINAS ── */}
        <section className="section-block" id="discipline-section">
          <div className="section-head">
            <div>
              <div className="section-kicker" id="cycle-section-kicker">
                Suas disciplinas · {selectedCycle === 'basico' ? 'Ciclo Básico' : 'Ciclo Clínico'}
              </div>
              <h2 id="cycle-section-title">
                {selectedCycle === 'basico'
                  ? <>{' '}Matérias do <strong>Ciclo Básico.</strong></>
                  : <>{' '}Matérias do <strong>Ciclo Clínico.</strong></>
                }
              </h2>
            </div>
            <span className="section-counter" id="cycle-section-counter">
              {visibleMateriais.length} {visibleMateriais.length === 1 ? 'disciplina' : 'disciplinas'} do ciclo {selectedCycle === 'basico' ? 'básico' : 'clínico'}
            </span>
          </div>

          <div className="discipline-grid">
            {visibleMateriais.map((mat, idx) => {
              const colorKey = CARD_COLORS[idx % CARD_COLORS.length];
              const temas = mat.topics.length;

              return (
                <article
                  key={mat.id}
                  className={`discipline-card${colorKey === 'blue' ? ' blue' : colorKey === 'green' ? ' green' : ''}`}
                  data-cycle={selectedCycle}
                  data-subject-key={mat.id}
                >
                  <div className="card-top">
                    <div className="discipline-icon">
                      {mat.icone_url
                        ? (mat.icone_url.trimStart().startsWith('<')
                          ? <div dangerouslySetInnerHTML={{ __html: mat.icone_url }} />
                          : <img src={mat.icone_url} alt={mat.nome} width={24} height={24} style={{ objectFit: 'contain' }} />)
                        : <DefaultIcon />
                      }
                    </div>
                    <span className="status blue">Novo</span>
                  </div>
                  <div className="review-alert none">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Em dia — sem revisões
                  </div>
                  <div className="discipline-label">{mat.ciclo}</div>
                  <h3>{mat.nome}</h3>
                  <p className="discipline-desc">{mat.descricao ?? ''}</p>
                  <div className="progress-info">
                    <span>Progresso</span>
                    <strong>0%</strong>
                  </div>
                  <div className="track">
                    <div className="fill blue" style={{ width: '2%' }} />
                  </div>
                  <div className="card-bottom">
                    <span className="themes">{temas} {temas === 1 ? 'tema' : 'temas'}</span>
                    <button className="access-link" onClick={() => onOpenDiscipline(mat.id)}>
                      Acessar ›
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
