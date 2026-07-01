'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import BibliotecaView from '@/components/biblioteca/BibliotecaView';
import DisciplinePanel from '@/components/biblioteca/DisciplinePanel';
import SummaryComposerModal from '@/components/biblioteca/SummaryComposerModal';
import SummaryLibraryModal from '@/components/biblioteca/SummaryLibraryModal';
import FlashComposerModal from '@/components/biblioteca/FlashComposerModal';
import FlashLibraryModal from '@/components/biblioteca/FlashLibraryModal';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { MaterialDB, TopicDB, SubtopicDB, SubSubtopicDB } from '@/lib/biblioteca';
import type { PanelMode, DeepLink, SummaryItem, FlashItem } from '@/components/biblioteca/types';
import { INITIAL_SUMMARIES, INITIAL_FLASHCARDS } from '@/components/biblioteca/data';

function unique(list: string[]) {
  return [...new Set(list.map(v => String(v || '').trim()).filter(Boolean))];
}

export default function BibliotecaPage() {
  const [disciplinePanel, setDisciplinePanel] = useState<{ isOpen: boolean; key: string; mode: PanelMode; deepLink?: DeepLink }>({
    isOpen: false, key: '', mode: 'library',
  });

  const [summaryComposerOpen, setSummaryComposerOpen] = useState(false);
  const [summaryLibraryOpen, setSummaryLibraryOpen] = useState(false);
  const [flashComposerOpen, setFlashComposerOpen] = useState(false);
  const [flashLibraryOpen, setFlashLibraryOpen] = useState(false);

  const [summaries, setSummaries] = useState<SummaryItem[]>(INITIAL_SUMMARIES);
  const [flashcards, setFlashcards] = useState<FlashItem[]>(INITIAL_FLASHCARDS);
  const [materiais, setMateriais] = useState<MaterialDB[]>([]);
  const [dbSummaryCount, setDbSummaryCount] = useState(0);
  const panelRestored = useRef(false);

  const fetchAll = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowserClient();

      const [matsRes, topsRes, subsRes, subsubsRes, sumRes] = await Promise.all([
        supabase.from('materiais').select('id, nome, ciclo, descricao, icone_url, ordem').eq('ativo', true).order('ordem'),
        supabase.from('topics').select('id, material_id, nome, ordem').order('ordem'),
        supabase.from('subtopics').select('id, topic_id, nome, ordem').order('ordem'),
        supabase.from('sub_subtopics').select('id, subtopic_id, nome, ordem').order('ordem'),
        supabase.from('study_summaries').select('*', { count: 'exact', head: true }),
      ]);

      if (sumRes.count !== null) setDbSummaryCount(sumRes.count);

      // Build nested hierarchy in JS using Maps (avoids unreliable PostgREST joins)
      const subsubsBySubId = new Map<string, SubSubtopicDB[]>();
      for (const ss of (subsubsRes.data ?? []) as Array<{ id: string; subtopic_id: string; nome: string; ordem: number }>) {
        const list = subsubsBySubId.get(ss.subtopic_id) ?? [];
        list.push({ id: ss.id, nome: ss.nome, ordem: ss.ordem });
        subsubsBySubId.set(ss.subtopic_id, list);
      }

      const subsByTopicId = new Map<string, SubtopicDB[]>();
      for (const s of (subsRes.data ?? []) as Array<{ id: string; topic_id: string; nome: string; ordem: number }>) {
        const list = subsByTopicId.get(s.topic_id) ?? [];
        list.push({ id: s.id, nome: s.nome, ordem: s.ordem, sub_subtopics: subsubsBySubId.get(s.id) ?? [] });
        subsByTopicId.set(s.topic_id, list);
      }

      const topsByMatId = new Map<string, TopicDB[]>();
      for (const t of (topsRes.data ?? []) as Array<{ id: string; material_id: string; nome: string; ordem: number }>) {
        const list = topsByMatId.get(t.material_id) ?? [];
        list.push({ id: t.id, nome: t.nome, ordem: t.ordem, subtopics: subsByTopicId.get(t.id) ?? [] });
        topsByMatId.set(t.material_id, list);
      }

      const built: MaterialDB[] = (matsRes.data ?? []).map((m: any) => ({
        id: m.id,
        nome: m.nome,
        ciclo: m.ciclo ?? '',
        descricao: m.descricao ?? null,
        icone_url: m.icone_url ?? null,
        ordem: m.ordem ?? 0,
        topics: topsByMatId.get(m.id) ?? [],
      }));

      setMateriais(built);
    } catch { /* silently keep last value */ }
  }, []);

  // Initial fetch + refetch on window focus
  useEffect(() => {
    fetchAll();
    window.addEventListener('focus', fetchAll);
    return () => window.removeEventListener('focus', fetchAll);
  }, [fetchAll]);

  // Restaura painel após voltar de um resumo
  useEffect(() => {
    if (materiais.length === 0 || panelRestored.current) return;
    const raw = sessionStorage.getItem('biblioteca-panel-restore');
    if (!raw) return;
    panelRestored.current = true;
    sessionStorage.removeItem('biblioteca-panel-restore');
    try {
      const { materialId, subtopicId, subSubtopicId } = JSON.parse(raw);
      setDisciplinePanel({
        isOpen: true,
        key: materialId,
        mode: 'library',
        deepLink: subSubtopicId
          ? { subSubtopicId }
          : subtopicId
          ? { subtopicId }
          : undefined,
      });
    } catch {}
  }, [materiais]);

  // Supabase Realtime — update library when admin creates/edits/deletes hierarchy
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel('biblioteca-hierarchy')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'materiais' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'topics' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subtopics' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sub_subtopics' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_summaries' }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchAll]);

  const anyOpen = disciplinePanel.isOpen || summaryComposerOpen || summaryLibraryOpen || flashComposerOpen || flashLibraryOpen;

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (summaryComposerOpen) { setSummaryComposerOpen(false); return; }
    if (summaryLibraryOpen) { setSummaryLibraryOpen(false); return; }
    if (flashComposerOpen) { setFlashComposerOpen(false); return; }
    if (flashLibraryOpen) { setFlashLibraryOpen(false); return; }
    if (disciplinePanel.isOpen) { setDisciplinePanel(p => ({ ...p, isOpen: false })); return; }
  }, [disciplinePanel.isOpen, summaryComposerOpen, summaryLibraryOpen, flashComposerOpen, flashLibraryOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  function openDiscipline(key: string, deepLink?: DeepLink) {
    setDisciplinePanel({ isOpen: true, key, mode: 'library', deepLink });
  }

  function closeDisciplinePanel() {
    setDisciplinePanel(p => ({ ...p, isOpen: false }));
  }

  function handleSummarySubmit(item: SummaryItem) {
    setSummaries(prev => [...prev, item]);
    setSummaryComposerOpen(false);
  }

  function handleFlashSubmit(item: FlashItem) {
    setFlashcards(prev => [...prev, item]);
    setFlashComposerOpen(false);
  }

  const selectedMaterial = materiais.find(m => m.id === disciplinePanel.key) ?? null;
  const dbMateriaCount = materiais.length;

  return (
    <main className="biblioteca-page">

      <BibliotecaView
        summaryCount={dbSummaryCount}
        matterCount={dbMateriaCount}
        dbMateriaCount={dbMateriaCount}
        dbSummaryCount={dbSummaryCount}
        materiais={materiais}
        onOpenDiscipline={(key, deepLink) => openDiscipline(key, deepLink)}
        onOpenSummaryComposer={() => setSummaryComposerOpen(true)}
        onOpenSummaryLibrary={() => setSummaryLibraryOpen(true)}
        isBlurred={anyOpen}
      />

      <DisciplinePanel
        isOpen={disciplinePanel.isOpen}
        material={selectedMaterial}
        mode={disciplinePanel.mode}
        onClose={closeDisciplinePanel}
        deepLink={disciplinePanel.deepLink}
      />

      <SummaryComposerModal
        isOpen={summaryComposerOpen}
        onClose={() => setSummaryComposerOpen(false)}
        onSubmit={handleSummarySubmit}
        existingSummaries={summaries}
      />

      <SummaryLibraryModal
        isOpen={summaryLibraryOpen}
        onClose={() => setSummaryLibraryOpen(false)}
        summaries={summaries}
      />

      <FlashComposerModal
        isOpen={flashComposerOpen}
        onClose={() => setFlashComposerOpen(false)}
        onSubmit={handleFlashSubmit}
        existingFlashcards={flashcards}
      />

      <FlashLibraryModal
        isOpen={flashLibraryOpen}
        onClose={() => setFlashLibraryOpen(false)}
        flashcards={flashcards}
      />
    </main>
  );
}
