'use client';

import { useRouter } from 'next/navigation';
import Shell from '@/components/v73/Shell';
import type { Subject } from '@/lib/subjects-catalog';
import type { CurriculumModule, CurriculumTopic } from '@/lib/curriculum';

type Props = {
  subject: Subject;
  module: CurriculumModule;
  topic: CurriculumTopic;
};

export default function TopicBlueprintView({ subject, module, topic }: Props) {
  const router = useRouter();

  return (
    <Shell breadcrumb={`${subject.title} · ${module.title} · ${topic.title}`}>
      <section className="page active" id="page-blueprint">
        <div className="note-header">
          <div className="crumb">
            {subject.title} · Aula {module.number} · {module.title}
          </div>
          <h1>{topic.title}</h1>
          {topic.subtitle && <p>{topic.subtitle}</p>}
          <div className="note-tools">
            {topic.question_count != null && (
              <button type="button">{topic.question_count} questões</button>
            )}
            {topic.flashcard_count != null && (
              <button type="button">{topic.flashcard_count} flashcards</button>
            )}
            {topic.level && <button type="button">{topic.level}</button>}
          </div>
        </div>

        <div className="study-path">
          {['Entenda', 'Fixe', 'Treine', 'Corrija', 'Revise', 'Prove', 'Domine'].map((step, i) => (
            <div key={step} className={`path-step${i === 0 ? ' active' : ''}`}>
              {step}
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 26, marginTop: 20 }}>
          <div className="eyebrow" style={{ color: subject.accent }}>
            EM CONSTRUÇÃO
          </div>
          <h2 style={{ font: '500 27px Georgia, serif', margin: '6px 0 8px' }}>
            Conteúdo autoral em produção
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
            A explicação do zero, pegadinhas de prova, questões comentadas, flashcards e revisão de véspera
            desta aula estão sendo estruturados. Assim que o markup autoral desta nota for importado do V70,
            você vai ver aqui as 9 abas completas (Antes de começar → Explicação → Aprendizado → Clínico →
            Confusões → Questões → Flashcards → Eve → Domínio).
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push(`/subjects/${subject.id}`)}
            >
              ← Voltar para {subject.title}
            </button>
            <button type="button" className="btn btn-dark" onClick={() => router.push('/dashboard')}>
              Ir para o dashboard
            </button>
          </div>
        </div>

        {module.confusions.length > 0 && (
          <div className="callout gold" style={{ marginTop: 16 }}>
            <b>Confusões frequentes nesta aula</b>
            {module.confusions.join(' · ')}
          </div>
        )}
      </section>
    </Shell>
  );
}
