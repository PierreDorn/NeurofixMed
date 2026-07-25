// Extrai declarações JS/JSON do V70 e persiste como JSON.
// Estratégia dupla:
//   1) Se a declaração cabe em UMA linha (`const NAME=...;` ou `const NAME=...\n`),
//      pega até o fim da linha e valida com new Function.
//   2) Se não, faz parse balanceado de brackets ({ [ `) começando após `=`.

import fs from 'node:fs';

const html = fs.readFileSync(
  '/Users/pierredonascimentodoerner/Downloads/NeuroFix_Med_v70_LIMPO_FINAL.html',
  'utf8',
);

// Stubs para funções chamadas dentro dos payloads (retornam string vazia ou o
// placeholder textual da chamada). Preservam a estrutura sem executar lógica.
const STUB_NAMES = [
  'renderNeurofixClinicalReasoning',
  'renderClinicalReasoning',
  'renderPathologySnippet',
  'renderPathologySection',
  'renderPathogenesisSection',
  'renderEtiologySection',
  'renderCallout',
  'renderConfusionGlossary',
  'makeConfusionGlossaryHTML',
  'makeNeurofixFlashcardDeckHTML',
  'makeQuestionModeShell',
  'makeAlternativeTrap',
];

// Executa o candidate dentro de um sandbox onde qualquer identificador
// livre resolve para uma função stub (ou objeto stub). Isso captura tanto
// chamadas quanto acessos a variáveis externas (arrays clínicos, mapas, etc.).
import vm from 'node:vm';

function tryParse(candidate) {
  try {
    const stubFn = (...args) =>
      `<!-- stub(${JSON.stringify(args).slice(0, 200)}) -->`;
    const proxyHandler = {
      get(target, key) {
        if (key === Symbol.toPrimitive) return () => '';
        if (key in target) return target[key];
        // Stub genérico: pode ser chamado como função, iterado ou concatenado.
        const s = new Proxy(function () {}, {
          apply: () => stubFn(key),
          get: (_, k) => (k === 'length' ? 0 : ''),
        });
        return s;
      },
      has: () => true,
    };
    const sandbox = new Proxy({}, proxyHandler);
    return { ok: true, value: vm.runInNewContext(`(${candidate})`, sandbox) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function extractSingleLine(source, name) {
  const marker = `const ${name}=`;
  const start = source.indexOf(marker);
  if (start === -1) return null;
  const from = start + marker.length;
  const nl = source.indexOf('\n', from);
  const end = nl === -1 ? source.length : nl;
  let raw = source.slice(from, end).trim();
  if (raw.endsWith(';')) raw = raw.slice(0, -1);
  const res = tryParse(raw);
  return res.ok ? res.value : null;
}

function extractBalanced(source, name) {
  const marker = `const ${name}=`;
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`decl not found: ${name}`);
  let i = start + marker.length;
  // Skip leading whitespace
  while (i < source.length && /\s/.test(source[i])) i++;
  const openChar = source[i];
  const closeMap = { '{': '}', '[': ']', '(': ')' };
  if (!(openChar in closeMap)) throw new Error(`unexpected open for ${name}: ${openChar}`);
  const close = closeMap[openChar];

  let depth = 0;
  let inString = null; // '"', "'", "`"
  let inTemplateExpr = 0;
  let escape = false;
  let end = -1;
  for (let j = i; j < source.length; j++) {
    const ch = source[j];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (inString === '`') {
        if (ch === '$' && source[j + 1] === '{') {
          inTemplateExpr++;
          j++;
          continue;
        }
        if (ch === '}' && inTemplateExpr > 0) {
          inTemplateExpr--;
          continue;
        }
      }
      if (ch === inString && inTemplateExpr === 0) {
        inString = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
      continue;
    }
    if (ch === openChar) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) {
        end = j + 1;
        break;
      }
    }
  }
  if (end === -1) throw new Error(`unbalanced for ${name}`);
  const raw = source.slice(i, end);
  const res = tryParse(raw);
  if (!res.ok) throw new Error(`parse failed for ${name}: ${res.error}`);
  return res.value;
}

function extract(name) {
  const single = extractSingleLine(html, name);
  if (single !== null) return single;
  return extractBalanced(html, name);
}

const out = {
  contents: {
    etiology: extract('etiologyContents'),
    pathogenesis: extract('pathogenesisContents'),
    pathology: extract('pathologySections'),
    ascaris: extract('contents'),
  },
  flashcards: {
    etiology: extract('etiologyFlashcards'),
    pathogenesis: extract('pathogenesisFlashcards'),
    pathology: extract('pathologyFlashcards'),
    ascaris: extract('ascarisFlashcards'),
  },
  questions: {
    etiology: extract('etiologyQuestionBank'),
    pathogenesis: extract('pathogenesisQuestionBank'),
    pathology: extract('pathologyQuestionBank'),
    ascaris: extract('ascarisQuestionBank'),
  },
};

fs.writeFileSync('notes-content.json', JSON.stringify(out.contents, null, 2));
fs.writeFileSync('notes-flashcards.json', JSON.stringify(out.flashcards, null, 2));
fs.writeFileSync('notes-questions.json', JSON.stringify(out.questions, null, 2));

console.log('Notes contents:');
for (const [n, o] of Object.entries(out.contents)) {
  console.log(`  ${n}: tabs=[${Object.keys(o).join(', ')}]`);
}
console.log('Flashcards:');
for (const [n, l] of Object.entries(out.flashcards)) console.log(`  ${n}: ${l.length}`);
console.log('Questions:');
for (const [n, l] of Object.entries(out.questions)) console.log(`  ${n}: ${l.length}`);
