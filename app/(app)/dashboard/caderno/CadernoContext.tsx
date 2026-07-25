'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type PainelKey = 'aula' | 'resumo' | 'pegadinhas' | 'questoes' | 'flashcards' | 'plano' | 'modelo';

type State = {
  selectedTema: { materia: string; tema: string } | null;
  selectedSubtema: string | null;
  painel: PainelKey;
  setSelectedTema: (v: { materia: string; tema: string } | null) => void;
  setSelectedSubtema: (v: string | null) => void;
  setPainel: (v: PainelKey) => void;
};

const CadernoContext = createContext<State | null>(null);

export function CadernoProvider({ children }: { children: ReactNode }) {
  const [selectedTema, setSelectedTema] = useState<State['selectedTema']>(null);
  const [selectedSubtema, setSelectedSubtema] = useState<string | null>(null);
  const [painel, setPainel] = useState<PainelKey>('aula');

  return (
    <CadernoContext.Provider value={{
      selectedTema, selectedSubtema, painel,
      setSelectedTema, setSelectedSubtema, setPainel,
    }}>
      {children}
    </CadernoContext.Provider>
  );
}

export function useCaderno() {
  const ctx = useContext(CadernoContext);
  if (!ctx) throw new Error('useCaderno deve ser usado dentro de <CadernoProvider>');
  return ctx;
}
