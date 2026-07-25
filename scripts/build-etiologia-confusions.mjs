// Gera HTML da aba "O que confunde" da nota etiologia-fatores-de-risco.
// Colunas independentes: item aberto na coluna 1 não expande a coluna 2.

const pairs = [
  ['Etiologia × patogênese', 'Etiologia é a origem. Patogênese é a sequência de mecanismos que produz a doença.'],
  ['Causa × fator de risco', 'Fator de risco aumenta probabilidade; não deve ser tratado automaticamente como condição suficiente.'],
  ['Doença de base × gatilho', 'Aterosclerose é a doença de base; ruptura da placa e trombose podem precipitar o infarto.'],
  ['Genético × hereditário', 'Alteração genética pode ser somática e não transmissível. Hereditário envolve linhagem germinativa.'],
  ['Congênito × genético', 'Congênito significa presente ao nascimento e pode decorrer de teratógenos, infecções ou de alterações genéticas.'],
  ['Idiopático × "sem causa"', 'Idiopático significa que a causa permanece desconhecida, não que a doença surgiu sem causa.'],
  ['Iatrogênico × erro médico', 'Iatrogênico é efeito decorrente da assistência; não implica necessariamente negligência ou erro.'],
  ['Associação × causalidade', 'Duas variáveis podem ocorrer juntas sem que uma seja a causa da outra. Confundimento e viés precisam ser considerados.'],
];

const glossary = [
  { term: 'Etiologia', meaning: 'É a origem da doença: a causa ou o conjunto de fatores responsáveis pelo seu início.', example: 'No infarto, a aterosclerose e os fatores que favorecem sua formação pertencem ao raciocínio etiológico.' },
  { term: 'Patogênese', meaning: 'É a sequência de mecanismos que transforma a causa inicial em alterações celulares, teciduais e clínicas.', example: 'Ruptura de placa, formação de trombo, isquemia e necrose compõem a patogênese do infarto.' },
  { term: 'Fator de risco', meaning: 'É uma característica ou exposição que aumenta a probabilidade de um desfecho, mas não torna esse desfecho obrigatório.', example: 'Tabagismo aumenta o risco cardiovascular, porém não significa que todo fumante terá infarto.' },
  { term: 'Susceptibilidade', meaning: 'É a vulnerabilidade do indivíduo a desenvolver uma doença diante de determinada exposição.', example: 'Idade, variantes genéticas e comorbidades podem tornar dois pacientes expostos ao mesmo agente biologicamente diferentes.' },
  { term: 'Predisposição', meaning: 'É uma condição prévia que facilita o desenvolvimento de uma doença, sem ser necessariamente suficiente para causá-la.', example: 'Uma mutação herdada pode predispor ao câncer, mas outros eventos celulares ainda podem ser necessários.' },
  { term: 'Doença de base', meaning: 'É o processo patológico que já estava se desenvolvendo antes do evento agudo.', example: 'Na síndrome coronariana, a aterosclerose é a doença de base; o infarto é uma de suas possíveis consequências agudas.' },
  { term: 'Gatilho', meaning: 'É o evento que precipita uma mudança aguda em um processo que já existia.', example: 'A ruptura de uma placa aterosclerótica pode funcionar como gatilho para a formação do trombo.' },
  { term: 'Causa necessária', meaning: 'É um componente que precisa estar presente para que determinada doença ocorra naquele modelo causal, mas pode não produzir a doença sozinho.', example: 'A infecção persistente por HPV de alto risco é necessária para a maioria dos carcinomas do colo uterino, porém não é suficiente isoladamente.' },
  { term: 'Causa suficiente', meaning: 'É um conjunto de condições capaz de produzir o desfecho quando está completo.', example: 'Nas doenças multifatoriais, a suficiência costuma resultar da combinação de vários componentes, e não de um único fator.' },
  { term: 'Idiopático', meaning: 'Significa que a causa inicial não foi identificada com o conhecimento ou a investigação disponível.', example: 'Idiopático não quer dizer que a doença não tenha mecanismo ou que tenha surgido sem causa.' },
  { term: 'Iatrogênico', meaning: 'É o efeito ou condição decorrente de uma intervenção diagnóstica ou terapêutica.', example: 'Uma reação adversa previsível a um medicamento pode ser iatrogênica sem representar necessariamente erro profissional.' },
  { term: 'Congênito', meaning: 'É aquilo que está presente ao nascimento, independentemente de ser genético.', example: 'Uma alteração congênita pode decorrer de mutação, infecção intrauterina, fármaco ou outro fator ambiental fetal.' },
  { term: 'Genético', meaning: 'É aquilo que envolve alteração do material genético.', example: 'Uma mutação somática em um tumor é genética, mas não é automaticamente hereditária.' },
  { term: 'Hereditário', meaning: 'É aquilo que pode ser transmitido entre gerações pela linhagem germinativa.', example: 'Uma variante germinativa presente em óvulos ou espermatozoides pode ser herdada pelos descendentes.' },
  { term: 'Associação', meaning: 'É a ocorrência conjunta de duas variáveis com frequência maior ou menor que a esperada, sem provar que uma cause a outra.', example: 'Um hábito pode estar associado a uma doença por influência de outro fator não medido.' },
  { term: 'Causalidade', meaning: 'É a relação em que uma exposição participa efetivamente da produção do desfecho.', example: 'Para sustentar causalidade, a exposição deve preceder o desfecho e o conjunto de evidências deve ser biologicamente coerente.' },
  { term: 'Confundimento', meaning: 'É a distorção de uma associação por uma terceira variável relacionada tanto à exposição quanto ao desfecho.', example: 'Uma associação entre café e câncer pode ser confundida pelo tabagismo quando fumantes consomem mais café.' },
  { term: 'Latência', meaning: 'É o intervalo entre a exposição causal e o aparecimento clínico da doença.', example: 'Neoplasias ocupacionais podem surgir muitos anos depois da exposição inicial.' },
];

const col1 = glossary.filter((_, i) => i % 2 === 0);
const col2 = glossary.filter((_, i) => i % 2 === 1);

function renderPair([t, p]) {
  return `<div class="confusion-card"><b>${t}</b><p>${p}</p></div>`;
}

function renderEntry(g) {
  return `<details class="glossary-entry"><summary>${g.term}</summary><div class="glossary-body"><p><b>O que significa:</b> ${g.meaning}</p><p><b>Neste tema:</b> ${g.example}</p></div></details>`;
}

const pairsHtml = pairs.map(renderPair).join('');
const col1Html = col1.map(renderEntry).join('');
const col2Html = col2.map(renderEntry).join('');

const html = `
<span class="pill red">O que costuma confundir</span><h2>Trocas de conceito que derrubam em prova</h2>
<div class="confusion-grid">${pairsHtml}</div>
<div class="callout red" style="margin-top:20px"><b>Pegadinha de linguagem</b>Alternativas absolutas costumam ser frágeis: "todo exposto adoece", "o fator sempre determina", "a ausência exclui completamente". Em doenças multifatoriais, o raciocínio é probabilístico.</div>

<section class="confusion-glossary">
  <div class="confusion-glossary-head"><div><span class="pill gold">Glossário do tema</span><h2>Palavras que você precisa entender para não se perder</h2><p>Abra os termos que apareceram nesta parte da nota. A definição vem em linguagem médica compreensível e com um exemplo aplicado ao conteúdo.</p></div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start">
    <div style="display:flex;flex-direction:column;gap:10px">${col1Html}</div>
    <div style="display:flex;flex-direction:column;gap:10px">${col2Html}</div>
  </div>
  <div class="glossary-note" style="margin-top:18px"><b>Como usar:</b> sempre que uma alternativa empregar uma palavra que você não domina, volte ao glossário antes de decorar a resposta. Entender o termo melhora a interpretação do enunciado e a eliminação de alternativas.</div>
</section>
`.trim();

process.stdout.write(html);
