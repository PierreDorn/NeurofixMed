// Gera SQL para popular curriculum_modules + curriculum_topics.
// Aplica as mesmas transformações do V70 (immunology filter, microbiology filter, ids compostos).

import fs from 'node:fs';

const pathology = JSON.parse(fs.readFileSync('pathology.json', 'utf8'));
const infectology = JSON.parse(fs.readFileSync('infectology.json', 'utf8'));

const immunology = infectology
  .filter((m) => m.id === 'imunologia-infecciosa')
  .map((m, i) => ({
    ...m,
    number: String(i + 1).padStart(2, '0'),
    blockKey: 'immunology',
    block: 'Imunologia',
  }));

const microbiology = infectology
  .filter((m) => ['bacterias', 'fungos'].includes(m.id))
  .map((m, i) => ({
    ...m,
    number: String(i + 1).padStart(2, '0'),
    blockKey: 'microbiology',
    block: 'Microbiologia',
  }));

const subjects = [
  { subjectId: 'pathology', modules: pathology },
  { subjectId: 'infectology', modules: infectology },
  { subjectId: 'immunology', modules: immunology },
  { subjectId: 'microbiology', modules: microbiology },
];

const esc = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
const jsonEsc = (obj) => `'${JSON.stringify(obj ?? []).replace(/'/g, "''")}'::jsonb`;

const lines = [];
lines.push('-- Seed dos currículos V70. Idempotente via ON CONFLICT.');
lines.push('BEGIN;');

for (const { subjectId, modules } of subjects) {
  modules.forEach((m, mi) => {
    const modId = `${subjectId}:${m.id}`;
    lines.push(
      `INSERT INTO public.curriculum_modules (id, subject_id, block_key, block, number, title, description, map, confusions, test_count, ordering) VALUES (${esc(modId)}, ${esc(subjectId)}, ${esc(m.blockKey)}, ${esc(m.block)}, ${esc(m.number)}, ${esc(m.title)}, ${esc(m.description)}, ${esc(m.map)}, ${jsonEsc(m.confusions)}, ${m.testCount ?? 'NULL'}, ${mi}) ON CONFLICT (id) DO UPDATE SET subject_id=EXCLUDED.subject_id, block_key=EXCLUDED.block_key, block=EXCLUDED.block, number=EXCLUDED.number, title=EXCLUDED.title, description=EXCLUDED.description, map=EXCLUDED.map, confusions=EXCLUDED.confusions, test_count=EXCLUDED.test_count, ordering=EXCLUDED.ordering;`,
    );
    (m.topics ?? []).forEach((t, ti) => {
      const topId = `${modId}:${t.id}`;
      lines.push(
        `INSERT INTO public.curriculum_topics (id, module_id, title, subtitle, question_count, flashcard_count, level, status, ordering) VALUES (${esc(topId)}, ${esc(modId)}, ${esc(t.title)}, ${esc(t.subtitle)}, ${t.questions ?? 'NULL'}, ${t.flashcards ?? 'NULL'}, ${esc(t.level)}, ${esc(t.status)}, ${ti}) ON CONFLICT (id) DO UPDATE SET module_id=EXCLUDED.module_id, title=EXCLUDED.title, subtitle=EXCLUDED.subtitle, question_count=EXCLUDED.question_count, flashcard_count=EXCLUDED.flashcard_count, level=EXCLUDED.level, status=EXCLUDED.status, ordering=EXCLUDED.ordering;`,
      );
    });
  });
}

lines.push('COMMIT;');
fs.writeFileSync('seed.sql', lines.join('\n'));
console.log(`Written ${lines.length} statements to seed.sql`);
console.log(`Total modules: ${subjects.reduce((a, s) => a + s.modules.length, 0)}`);
console.log(
  `Total topics: ${subjects.reduce(
    (a, s) => a + s.modules.reduce((b, m) => b + (m.topics?.length ?? 0), 0),
    0,
  )}`,
);
