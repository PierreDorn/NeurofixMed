// Seed das notas autorais V70 no Supabase.
// Roda: node --env-file=../../.env.local apply-notes.mjs

import fs from 'node:fs';

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_BASE || !KEY) throw new Error('Missing env');

const { createClient } = await import('@supabase/supabase-js');
const supabase = createClient(URL_BASE, KEY, { auth: { persistSession: false } });

const contents = JSON.parse(fs.readFileSync('notes-content.json', 'utf8'));
const flashcards = JSON.parse(fs.readFileSync('notes-flashcards.json', 'utf8'));
const questions = JSON.parse(fs.readFileSync('notes-questions.json', 'utf8'));

const TAB_LABELS = {
  start: 'Comece aqui',
  explain: 'Explicação do zero',
  learning: 'Entender × memorizar',
  clinical: 'Raciocínio clínico',
  confusions: 'O que confunde',
  pathogenesis: 'Patogênese',
  morphology: 'Morfologia',
  clinic: 'Clínica e prova',
  traps: 'Comparação e pegadinhas',
  questions: 'Questões',
  flashcards: 'Flashcards',
  eve: 'Véspera',
  mastery: 'Domínio e fontes',
  exam: 'Essencial para prova',
  falls: 'Como cai',
  question: 'Questão comentada',
  flash: 'Flashcards',
};

const NOTES = [
  {
    slug: 'etiologia-fatores-de-risco',
    subject_id: 'pathology',
    module_id: 'pathology:como-pensar-em-patologia',
    topic_id: 'pathology:como-pensar-em-patologia:etiologia-e-fatores-de-risco',
    title: 'Etiologia e fatores de risco',
    subtitle:
      'Aprenda a identificar por que uma doença surge, diferenciar causa de fator de risco e transformar dados do caso clínico em um raciocínio etiológico preciso.',
    breadcrumb: 'Patologia Médica · Aula 01 · Como pensar em Patologia',
    duration: '35–45 minutos',
    level: 'Faculdade → Clínica → Residência',
    meta: { pill: 'Nota NeuroFix Ouro · Padrão editorial oficial', pillTone: 'gold' },
    payload: contents.etiology,
    flashcards: flashcards.etiology,
    questions: questions.etiology,
  },
  {
    slug: 'patogenese',
    subject_id: 'pathology',
    module_id: 'pathology:como-pensar-em-patologia',
    topic_id: 'pathology:como-pensar-em-patologia:patogenese',
    title: 'Patogênese',
    subtitle:
      'Aprenda a reconstruir o caminho entre a causa e a manifestação clínica atravessando as etapas moleculares, celulares, teciduais e funcionais.',
    breadcrumb: 'Patologia Médica · Aula 02 · Como pensar em Patologia',
    duration: '45–55 minutos',
    level: 'Faculdade → Clínica → Residência',
    meta: { pill: 'Nota NeuroFix Ouro · Padrão editorial oficial', pillTone: 'gold' },
    payload: contents.pathogenesis,
    flashcards: flashcards.pathogenesis,
    questions: questions.pathogenesis,
  },
  {
    slug: 'necrose-apoptose',
    subject_id: 'pathology',
    module_id: 'pathology:morte-celular',
    topic_id: 'pathology:morte-celular:necrose-apoptose',
    title: 'Necrose × apoptose',
    subtitle:
      'Entenda como a célula morre, reconheça os padrões morfológicos, conecte o mecanismo ao caso clínico e evite as pegadinhas que mais derrubam em prova.',
    breadcrumb: 'Patologia Médica · Aula 05 · Morte celular',
    duration: '18 minutos',
    level: 'Faculdade → Clínica → Residência',
    meta: { pill: 'Nota NeuroFix Ouro · Patologia Geral', pillTone: 'gold' },
    payload: contents.pathology,
    flashcards: flashcards.pathology,
    questions: questions.pathology,
  },
  {
    slug: 'ascaris-lumbricoides',
    subject_id: 'infectology',
    module_id: null,
    topic_id: null,
    title: 'Ascaris lumbricoides',
    subtitle: 'A nota completa para entender, reconhecer as pegadinhas e resolver questões.',
    breadcrumb: 'Infectologia e Parasitologia · Helmintos · Nematódeos',
    duration: '25 minutos',
    level: 'Faculdade → Clínica → Residência',
    meta: { pill: 'Nota NeuroFix', pillTone: 'blue' },
    payload: contents.ascaris,
    flashcards: flashcards.ascaris,
    questions: questions.ascaris,
  },
];

for (const n of NOTES) {
  const { error: e1 } = await supabase.from('authored_notes').upsert(
    {
      slug: n.slug,
      subject_id: n.subject_id,
      module_id: n.module_id,
      topic_id: n.topic_id,
      title: n.title,
      subtitle: n.subtitle,
      breadcrumb: n.breadcrumb,
      duration: n.duration,
      level: n.level,
      meta: n.meta,
    },
    { onConflict: 'slug' },
  );
  if (e1) throw e1;

  // Sobrescreve tabs (não upsert por (slug,key) para garantir remoção do que
  // tiver mudado). Aqui usamos delete + insert.
  await supabase.from('authored_note_tabs').delete().eq('note_slug', n.slug);
  const tabRows = Object.entries(n.payload).map(([key, html], i) => ({
    note_slug: n.slug,
    tab_key: key,
    tab_label: TAB_LABELS[key] ?? key,
    content_html: String(html),
    ordering: i,
  }));
  const { error: e2 } = await supabase.from('authored_note_tabs').insert(tabRows);
  if (e2) throw e2;

  await supabase.from('note_flashcards').delete().eq('note_slug', n.slug);
  const flashRows = n.flashcards.map((f, i) => ({
    note_slug: n.slug,
    ordering: i,
    front: String(f.q ?? f.front ?? ''),
    back: String(f.a ?? f.back ?? ''),
    track: f.track ?? null,
  }));
  if (flashRows.length) {
    const { error: e3 } = await supabase.from('note_flashcards').insert(flashRows);
    if (e3) throw e3;
  }

  await supabase.from('note_questions').delete().eq('note_slug', n.slug);
  const qRows = n.questions.map((q, i) => ({
    note_slug: n.slug,
    ordering: i,
    stem: String(q.stem ?? q.text ?? ''),
    options: q.options ?? {},
    answer: String(q.answer ?? q.ans ?? ''),
    explanation: q.explanation ?? q.comment ?? null,
    bank: q.bank ?? null,
    meta: q.meta ?? {},
  }));
  if (qRows.length) {
    // Insere em chunks
    const CHUNK = 200;
    for (let i = 0; i < qRows.length; i += CHUNK) {
      const { error: e4 } = await supabase.from('note_questions').insert(qRows.slice(i, i + CHUNK));
      if (e4) throw e4;
    }
  }

  console.log(
    `✓ ${n.slug}: ${tabRows.length} tabs, ${flashRows.length} flashcards, ${qRows.length} questions`,
  );
}

const [{ count: notes }, { count: tabs }, { count: fcs }, { count: qs }] = await Promise.all([
  supabase.from('authored_notes').select('*', { count: 'exact', head: true }),
  supabase.from('authored_note_tabs').select('*', { count: 'exact', head: true }),
  supabase.from('note_flashcards').select('*', { count: 'exact', head: true }),
  supabase.from('note_questions').select('*', { count: 'exact', head: true }),
]);
console.log(`DB now: notes=${notes} tabs=${tabs} flashcards=${fcs} questions=${qs}`);
