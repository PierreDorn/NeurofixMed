'use client';

import { useState } from 'react';
import { cadernoIndex } from './caderno-index';
import { useCaderno } from './CadernoContext';

type Ciclo = { id: string; label: string; disabled?: boolean; materias: typeof cadernoIndex };
const ciclos: Ciclo[] = [
  { id: 'basico', label: 'Ciclo Básico', materias: cadernoIndex },
  { id: 'clinico', label: 'Ciclo Clínico', disabled: true, materias: [] },
];

function Chev({ open, hidden }: { open: boolean; hidden?: boolean }) {
  return (
    <svg className={`cad-chev${open ? ' open' : ''}${hidden ? ' hidden' : ''}`}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

export default function CadernoTree() {
  const { selectedTema, setSelectedTema, setSelectedSubtema, setPainel } = useCaderno();
  const [expandedCiclos, setExpandedCiclos] = useState<Record<string, boolean>>({ basico: true });
  const [expandedMaterias, setExpandedMaterias] = useState<Record<string, boolean>>({});

  function toggleCiclo(id: string, disabled?: boolean) {
    if (disabled) return;
    setExpandedCiclos(s => ({ ...s, [id]: !s[id] }));
  }
  function toggleMateria(materia: string) {
    setExpandedMaterias(s => ({ ...s, [materia]: !s[materia] }));
  }
  function selectTema(materia: string, tema: string) {
    setSelectedTema({ materia, tema });
    const materiaEntry = cadernoIndex.find(m => m.nome === materia);
    const temaEntry = materiaEntry?.temas.find(t => t.nome === tema);
    setSelectedSubtema(temaEntry?.subtemas[0] ?? null);
    setPainel('aula');
  }

  return (
    <div className="cad-tree">
      {/* Botão Início — decorativo, sem função */}
      <button type="button" className="cad-inicio-sb" aria-label="Início">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" />
        </svg>
        <span>Início</span>
      </button>

      <div className="cad-tree-title">Bloco de notas</div>

      {ciclos.map(ciclo => (
        <div key={ciclo.id} className="cad-node">
          <button
            className={`cad-row${ciclo.disabled ? ' disabled' : ''}`}
            onClick={() => toggleCiclo(ciclo.id, ciclo.disabled)}
            disabled={ciclo.disabled}
          >
            <Chev open={!!expandedCiclos[ciclo.id]} hidden={ciclo.disabled} />
            <span className="cad-ico">📁</span>
            <span className="cad-label">{ciclo.label}</span>
            {ciclo.disabled
              ? <span className="cad-badge soon">Em breve</span>
              : <span className="cad-badge gold">{ciclo.materias.length}</span>}
          </button>

          {!ciclo.disabled && expandedCiclos[ciclo.id] && (
            <div className="cad-children">
              {ciclo.materias.map(mat => {
                const totalTemas = mat.temas.length;
                const isOpen = !!expandedMaterias[mat.nome];
                return (
                  <div key={mat.nome} className="cad-node">
                    <button className="cad-row" onClick={() => toggleMateria(mat.nome)}>
                      <Chev open={isOpen} hidden={totalTemas === 0} />
                      <span className="cad-ico">{isOpen ? '📂' : '📁'}</span>
                      <span className="cad-label">{mat.nome}</span>
                      <span className="cad-badge">{totalTemas || 'em breve'}</span>
                    </button>

                    {isOpen && totalTemas > 0 && (
                      <div className="cad-children deep">
                        {mat.temas.map(tema => {
                          const active = selectedTema?.materia === mat.nome && selectedTema.tema === tema.nome;
                          return (
                            <button
                              key={tema.nome}
                              className={`cad-row${active ? ' active' : ''}`}
                              onClick={() => selectTema(mat.nome, tema.nome)}
                            >
                              <Chev open={false} hidden />
                              <span className="cad-ico">📄</span>
                              <span className="cad-label">{tema.nome}</span>
                              <span className="cad-badge">{tema.subtemas.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
