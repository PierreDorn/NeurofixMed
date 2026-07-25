'use client';
import { useState } from 'react';

const focos = [
  { value: 'faculdade',  title: 'Ir bem nas provas da faculdade', desc: 'Manter média boa e passar tranquilo nas provas semestrais e internas' },
  { value: 'enamed',     title: 'Preparar para o ENAMED',         desc: 'Ir bem no Exame Nacional de Desempenho dos Estudantes de Medicina' },
  { value: 'residencia', title: 'Preparar para residência',       desc: 'Estudar pra prova de residência ao fim do curso' },
  { value: 'revisao',    title: 'Revisar e não esquecer',         desc: 'Consolidar o que já estudei nos ciclos anteriores' },
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
