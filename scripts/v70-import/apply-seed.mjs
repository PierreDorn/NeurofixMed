// Aplica o seed.sql (curriculum) no Supabase usando service role.
// Roda: node --env-file=../../.env.local apply-seed.mjs

import fs from 'node:fs';

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !KEY) {
  console.error('Missing env NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(URL_BASE, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const pathology = JSON.parse(fs.readFileSync('pathology.json', 'utf8'));
const infectology = JSON.parse(fs.readFileSync('infectology.json', 'utf8'));

const immunology = infectology
  .filter((m) => m.id === 'imunologia-infecciosa')
  .map((m, i) => ({ ...m, number: String(i + 1).padStart(2, '0'), blockKey: 'immunology', block: 'Imunologia' }));

const microbiology = infectology
  .filter((m) => ['bacterias', 'fungos'].includes(m.id))
  .map((m, i) => ({ ...m, number: String(i + 1).padStart(2, '0'), blockKey: 'microbiology', block: 'Microbiologia' }));

const subjects = [
  { subjectId: 'pathology', modules: pathology },
  { subjectId: 'infectology', modules: infectology },
  { subjectId: 'immunology', modules: immunology },
  { subjectId: 'microbiology', modules: microbiology },
];

const modulesRows = [];
const topicsRows = [];
for (const { subjectId, modules } of subjects) {
  modules.forEach((m, mi) => {
    const modId = `${subjectId}:${m.id}`;
    modulesRows.push({
      id: modId,
      subject_id: subjectId,
      block_key: m.blockKey ?? null,
      block: m.block ?? null,
      number: m.number ?? null,
      title: m.title,
      description: m.description ?? null,
      map: m.map ?? null,
      confusions: m.confusions ?? [],
      test_count: m.testCount ?? null,
      ordering: mi,
    });
    (m.topics ?? []).forEach((t, ti) => {
      topicsRows.push({
        id: `${modId}:${t.id}`,
        module_id: modId,
        title: t.title,
        subtitle: t.subtitle ?? null,
        question_count: t.questions ?? null,
        flashcard_count: t.flashcards ?? null,
        level: t.level ?? null,
        status: t.status ?? null,
        ordering: ti,
      });
    });
  });
}

console.log(`Modules: ${modulesRows.length}, Topics: ${topicsRows.length}`);

// Upsert modules first (FK dep)
{
  const { error } = await supabase.from('curriculum_modules').upsert(modulesRows, { onConflict: 'id' });
  if (error) {
    console.error('Modules upsert error:', error);
    process.exit(1);
  }
  console.log(`Upserted ${modulesRows.length} modules`);
}

// Topics in chunks of 200 to avoid huge payloads
const CHUNK = 200;
for (let i = 0; i < topicsRows.length; i += CHUNK) {
  const slice = topicsRows.slice(i, i + CHUNK);
  const { error } = await supabase.from('curriculum_topics').upsert(slice, { onConflict: 'id' });
  if (error) {
    console.error(`Topics upsert error (chunk ${i / CHUNK}):`, error);
    process.exit(1);
  }
  console.log(`Upserted ${slice.length} topics (offset ${i})`);
}

// Sanity check
const { count: modCount } = await supabase
  .from('curriculum_modules')
  .select('*', { count: 'exact', head: true });
const { count: topCount } = await supabase
  .from('curriculum_topics')
  .select('*', { count: 'exact', head: true });
console.log(`DB now has ${modCount} modules and ${topCount} topics.`);
