'use client';
import { useState } from 'react';

const focos = [
  { value: 'faculdade',  title: 'Provas da faculdade', desc: 'Gabaritar provas semestrais e internas' },
  { value: 'enamed',     title: 'ENAMED',              desc: 'Preparação para o Exame Nacional de Desempenho' },
  { value: 'residencia', title: 'Residência médica',   desc: 'Concursos de residência' },
  { value: 'revisao',    title: 'Revisão geral',       desc: 'Consolidar e não esquecer o que já estudei' },
];

export default function FocoSelector() {
  const [selected, setSelected] = useState('');
  return (
    <>
      <input type="hidden" name="foco" value={selected} />
      <div className="ob-options">
        {focos.map(({ value, title, desc }) => (
          <div
            key={value}
            className={`ob-opt${selected === value ? ' selected' : ''}`}
            onClick={() => setSelected(value)}
          >
            <div className="ob-radio">
              <div className="ob-radio-dot" />
            </div>
            <div>
              <div className="ob-opt-title">{title}</div>
              <div className="ob-opt-desc">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
