'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Accordion } from '@/components/ui/Accordion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getMatterAccent } from '@/lib/flashcards-utils';

const MATTERS = ['Neurologia', 'Farmacologia', 'Bioquímica', 'Anatomia', 'Cardiologia'];

const TOKENS = [
  { name: '--bg', usage: 'fundo base' },
  { name: '--surface', usage: 'cards, painéis' },
  { name: '--text', usage: 'texto principal' },
  { name: '--muted', usage: 'texto discreto' },
  { name: '--gold', usage: 'primária' },
  { name: '--gold-light', usage: 'destaque' },
  { name: '--steel', usage: 'azul médico' },
  { name: '--border', usage: 'divisor' },
];

export default function V73Preview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState('a');
  const [themeLight, setThemeLight] = useState(false);

  function toggleTheme() {
    const shell = document.querySelector('.app-shell');
    if (themeLight) shell?.classList.remove('tema-claro');
    else shell?.classList.add('tema-claro');
    setThemeLight(!themeLight);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section>
        <h1 style={{ marginTop: 0 }}>Fase 1 — Preview de primitives V73</h1>
        <p style={{ color: 'var(--muted)', maxWidth: '640px' }}>
          Página de referência viva. Todos os primitives criados na Fase 1 aparecem abaixo. Redimensione a
          janela para ≤768px para ver a barra inferior mobile.
        </p>
        <button className="btn btn-secondary" onClick={toggleTheme}>
          Alternar para tema {themeLight ? 'escuro' : 'claro'}
        </button>
      </section>

      <section>
        <h2>1. Tokens de cor</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px',
          }}
        >
          {TOKENS.map((t) => (
            <div key={t.name} className="card" style={{ padding: '12px' }}>
              <div
                style={{
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  background: `var(${t.name})`,
                  border: '1px solid var(--border)',
                  marginBottom: '8px',
                }}
              />
              <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>{t.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.usage}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>2. Cards (CSS existente)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Card padrão</h3>
            <p style={{ color: 'var(--soft)' }}>Use a classe <code>.card</code>.</p>
          </div>
          <div className="card card-green">
            <h3 style={{ marginTop: 0 }}>Card verde</h3>
            <p style={{ color: 'var(--soft)' }}>Classe <code>.card.card-green</code>.</p>
          </div>
          <div className="card card-blue">
            <h3 style={{ marginTop: 0 }}>Card azul</h3>
            <p style={{ color: 'var(--soft)' }}>Classe <code>.card.card-blue</code>.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>3. Badges e Pills</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge">Padrão</span>
          <span className="badge badge-green">Verde</span>
          <span className="badge badge-blue">Azul</span>
          <span className="badge badge-red">Vermelho</span>
          <span className="badge badge-yellow">Amarelo</span>
          <span className="pill">Pill</span>
          <span className="pill active">Pill ativa</span>
        </div>
      </section>

      <section>
        <h2>4. Botões</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-ghost">Ghost</button>
          <button className="btn btn-danger">Danger</button>
        </div>
      </section>

      <section>
        <h2>5. ProgressBar</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <ProgressBar value={0} label="Início" showValue />
          <ProgressBar value={33} label="Etiologia" showValue />
          <ProgressBar value={66} label="Patogênese" showValue />
          <ProgressBar value={100} label="Domínio" showValue />
        </div>
      </section>

      <section>
        <h2>6. Tabs</h2>
        <Tabs
          items={[
            { value: 'a', label: 'Explicação' },
            { value: 'b', label: 'Clínica' },
            { value: 'c', label: 'Questões' },
            { value: 'd', label: 'Flashcards', disabled: true },
          ]}
          value={tab}
          onChange={setTab}
          ariaLabel="Modo de estudo"
        >
          <div className="card">Conteúdo da aba: <strong>{tab}</strong></div>
        </Tabs>
      </section>

      <section>
        <h2>7. Accordion</h2>
        <Accordion
          items={[
            { id: 'a', title: 'O que é etiologia?', content: <p>Estudo das causas.</p> },
            { id: 'b', title: 'Diferença entre patogênese e patologia', content: <p>Mecanismo vs. resultado.</p> },
            { id: 'c', title: 'Necrose × Apoptose', content: <p>Duas formas de morte celular.</p> },
          ]}
          mode="single"
          defaultOpen={['a']}
        />
      </section>

      <section>
        <h2>8. Modal</h2>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          Abrir modal
        </button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Modal genérico V73"
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={() => setModalOpen(false)}>
                Confirmar
              </button>
            </>
          }
        >
          <p>Focus trap ativo. Feche com Esc, backdrop ou X. Foco retorna ao botão que abriu.</p>
          <input className="summary-input" placeholder="Campo teste" />
        </Modal>
      </section>

      <section>
        <h2>9. Cores por matéria (lib/flashcards-utils)</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {MATTERS.map((m) => {
            const accent = getMatterAccent(m);
            return (
              <span key={m} className={`pill accent-${accent}`}>
                {m} · {accent}
              </span>
            );
          })}
        </div>
      </section>
    </div>
  );
}
