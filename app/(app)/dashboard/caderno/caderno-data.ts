// Extracted from mock neurofix_med_codigo_completo.txt (lines 867-3037).
// Estrutura: Matéria → Tema → Subtema → conteúdo (aula/resumo/pegadinhas/questoes/flashcards/modelo).

export type Questao = {
  q: string;
  alts: string[];
  correct: number;
  comments?: string[];
  exp?: string;
  traps?: Array<{ erro?: string; verdade?: string; revisao?: string }> | string;
  clinicalReasoning?: string;
  tip?: string;
  oral?: string;
};
export type SubtemaContent = {
  intro?: string;
  aula: string;
  resumo?: string;
  pegadinhas?: string;
  questoes?: Questao[];
  casosClinicos?: Questao[];
  flashcards?: [string, string][];
  modelo?: string;
  plano?: string;
};
export type Materia = { progress: number; lessons: Record<string, { topics: Record<string, SubtemaContent> }> };

export const cadernoData: Record<string, Materia> =
{
      "Patologia Médica": {
        progress: 42,
        lessons: {
          "Helmintos": {
            topics: {
              "Ascaris lumbricoides": {
                intro: "Tema clássico de parasitologia médica. O objetivo aqui é entender o ciclo, a forma infectante, a transmissão, o diagnóstico e os sinais que aparecem em questão.",
                aula: `
                  
<h3 class="lesson-title">Aula explicada do zero</h3>

                  <h4 class="lesson-subtitle"><span class="gold">1.</span> O que é Ascaris lumbricoides?</h4>

                  <p><b><span class="gold">Ascaris lumbricoides</span></b> é o nome de um verme parasita. “Ascaris” é o gênero, e “lumbricoides” lembra a semelhança do verme adulto com uma lombriga. Por isso, no dia a dia, muita gente chama a ascaridíase de “infecção por lombriga”.</p>

                  <div class="lesson-key"><b>Para guardar:</b> <span class="gold">Ascaris lumbricoides</span> é um <b>helminto nematódeo intestinal</b>. Ele é um verme cilíndrico, vive como adulto no intestino delgado e é muito cobrado por <span class="blue">forma infectante, ciclo pulmonar e ovos nas fezes</span>.</div>

                  <p>Então, a primeira característica que você precisa guardar é: <b>Ascaris lumbricoides é um helminto nematódeo intestinal</b>. Helmintos são vermes parasitas. Nematódeos são vermes cilíndricos, alongados, diferentes dos platelmintos, que são achatados. Então, se a prova falar em verme cilíndrico, longo, intestinal, associado a saneamento precário e ovos nas fezes, sua cabeça já precisa acender: pode ser <b>Ascaris lumbricoides</b>.</p>

                  <h4 class="lesson-subtitle"><span class="gold">2.</span> O que a prova quer que você reconheça?</h4>

                  <p>Agora vamos traduzir isso para a lógica da prova. Ascaris lumbricoides é um parasita que vive, na fase adulta, no <b>intestino delgado</b>. Isso significa que o verme adulto fica no intestino, cresce ali, produz ovos e esses ovos podem sair nas fezes. Por isso, o diagnóstico clássico que mais aparece em prova é o <b>exame parasitológico de fezes mostrando ovos</b>.</p>

                  <p>Mas aqui vem uma pegadinha muito importante: o fato de o verme adulto viver no intestino não significa que todo o ciclo acontece só no intestino. O Ascaris tem uma fase de migração larvária pelo pulmão. Então, quando a prova fala em parasita intestinal com tosse, sibilância, infiltrado pulmonar transitório ou eosinofilia, você não deve descartar Ascaris. Pelo contrário: isso pode ser exatamente a pista do ciclo.</p>

                  <h4 class="lesson-subtitle"><span class="gold">3.</span> Ciclo de vida: o caminho do parasita</h4>

                  <p>Agora vamos começar o ciclo do jeito que você precisa entender para nunca mais esquecer.</p>

                  <p>A infecção acontece quando a pessoa ingere <b>ovos embrionados</b> de Ascaris lumbricoides. <span class="gold"><b>ovo embrionado</b></span> quer dizer ovo que já amadureceu no ambiente e se tornou capaz de infectar. Esses ovos podem estar em água contaminada, alimentos mal higienizados, solo contaminado ou mãos sujas. Por isso, a transmissão é chamada de <b>fecal-oral</b>. Fecal porque os ovos saem nas fezes. Oral porque entram novamente no corpo pela boca.</p>

                  <div class="lesson-key"><b>Frase de prova:</b> <span class="gold">Ascaris entra pela boca como ovo embrionado</span>.</div>

                  <p>Então, para prova, grave assim: <b><span class="gold">Ascaris entra pela boca como ovo embrionado</span></b>. Essa frase é uma das mais importantes de todo o assunto.</p>

                  <div class="lesson-alert"><b>Atenção à pegadinha:</b> <span class="blue">Ascaris não penetra pela pele.</span> Se a questão falar em larva filariforme penetrando pela pele, pense mais em Ancylostoma ou Strongyloides.</div>

                  <p>Agora vem uma diferença que o professor ama cobrar. Ascaris não penetra pela pele. Quem faz você pensar em pele são outros helmintos, como Ancylostoma e Strongyloides, que podem envolver larva filariforme penetrando ativamente pela pele. Ascaris não. Se a questão falar em Ascaris, a palavra-chave é ingestão. Ingestão de <span class="gold"><b>ovos embrionados</b></span>.</p>

                  <p>Depois que a pessoa ingere o <span class="gold"><b>ovo embrionado</b></span>, o ovo chega ao intestino. Ali, a larva sai do ovo. Essa larva atravessa a parede intestinal, entra na circulação e começa uma migração pelo corpo. Ela passa pelo fígado, pelo coração e chega aos pulmões. No pulmão, pode atravessar os alvéolos, subir pela árvore respiratória, chegar até a faringe, ser deglutida e voltar para o intestino delgado.</p>

                  <p>Agora pensa comigo: por que uma pessoa com verme intestinal pode tossir? Porque a larva passou pelo pulmão. Não é porque o verme adulto mora no pulmão. O adulto mora no intestino. O pulmão é uma etapa de passagem da larva.</p>

                  <p>Essa passagem pulmonar pode causar sintomas respiratórios transitórios, como tosse seca, chiado, desconforto respiratório, infiltrado pulmonar passageiro e eosinofilia. Eosinofilia significa aumento de eosinófilos, que são células de defesa muito associadas a alergias e também a helmintos, principalmente quando há migração por tecidos. Em prova, eosinofilia com parasitose e sintomas pulmonares deve fazer você lembrar de helmintos com migração larvária.</p>

                  <h4 class="lesson-subtitle"><span class="gold">4.</span> Fase pulmonar e síndrome de Löeffler</h4>

                  <p>Agora vamos falar de uma expressão que pode aparecer: <b><span class="blue">síndrome de Löeffler</span></b>. Essa síndrome é um quadro pulmonar transitório associado à migração de larvas de helmintos, podendo cursar com tosse, infiltrado pulmonar e eosinofilia. Então, se a questão falar em eosinofilia, tosse e infiltrado pulmonar passageiro em uma pessoa exposta a saneamento precário ou alimentos contaminados, Ascaris pode estar no raciocínio.</p>

                  <p>Depois da passagem pelos pulmões, a larva sobe pela árvore respiratória, é engolida e retorna ao intestino delgado. No intestino, ela amadurece e vira verme adulto. O verme adulto pode viver no intestino e produzir ovos. Esses ovos são eliminados nas fezes. No ambiente, em condições adequadas, esses ovos embrionam e se tornam infectantes para outra pessoa. Assim, o ciclo continua.</p>

                  <div class="lesson-key"><b>Sequência impossível de esquecer:</b> <span class="gold">ovo embrionado é ingerido</span>, <span class="blue">larva passa pelo pulmão</span>, <span class="gold">adulto vive no intestino</span> e <span class="blue">ovos saem nas fezes</span>.</div>

                  <p>Então, organiza assim na cabeça: <b>ovo embrionado é ingerido, larva passa pelo pulmão, verme adulto vive no intestino, ovos saem nas fezes</b>.</p>

                  <h4 class="lesson-subtitle"><span class="gold">5.</span> Manifestações clínicas</h4>

                  <p>Agora vamos falar da clínica, porque é isso que transforma o conteúdo em questão de prova.</p>

                  <p>Muitas pessoas com Ascaris podem ser assintomáticas. Assintomática significa sem sintomas. Outras podem ter sintomas leves, como dor abdominal, náuseas, perda de apetite, desconforto intestinal, alteração do hábito intestinal e baixo ganho de peso em crianças. A intensidade dos sintomas depende muito da carga parasitária. Carga parasitária significa quantidade de vermes no organismo.</p>

                  <p>Quando a carga parasitária é baixa, o paciente pode quase não sentir nada. Quando a carga parasitária é alta, principalmente em crianças, os vermes adultos podem se acumular no intestino e causar uma complicação importante: <b>obstrução intestinal</b>. <span class="gold"><b>obstrução intestinal</b></span> significa bloqueio da passagem do conteúdo intestinal. Em prova, isso pode aparecer como criança com dor abdominal intensa, distensão, vômitos, parada de eliminação de fezes ou gases e história de eliminação de vermes longos.</p>

                  <p>Agora perceba como a banca pode montar uma questão bonita: criança, área sem saneamento, dor abdominal, vômitos, distensão, eliminação de vermes longos e cilíndricos. A resposta mais provável pode ser Ascaris lumbricoides com <span class="gold"><b>obstrução intestinal</b></span> por grande carga de vermes adultos.</p>

                  <p>Além da <span class="gold"><b>obstrução intestinal</b></span>, o verme adulto pode, em alguns casos, migrar para locais inadequados, como vias biliares ou pancreáticas. Isso pode causar dor em hipocôndrio direito, colangite, pancreatite ou quadro biliar. Isso já é uma cobrança mais avançada, mais cara de residência médica. A ideia é: o adulto vive no intestino, mas pode migrar de forma ectópica. Ectópica significa fora do lugar esperado.</p>

                  <h4 class="lesson-subtitle"><span class="gold">6.</span> Como diferenciar de outros parasitas</h4>

                  <p>Agora vamos separar Ascaris de outros parasitas, porque a prova ama comparação.</p>

                  <p>Ascaris entra por ingestão de <b>ovo embrionado</b>. Ancylostoma e Strongyloides fazem você pensar em <b>larva filariforme penetrando pela pele</b>. Schistosoma mansoni faz você pensar em <b>cercária penetrando pela pele em água doce contaminada</b>. Taenia faz você pensar em <b>carne crua ou malpassada com cisticerco</b>, quando o assunto é teníase. Enterobius faz você pensar em <b>prurido anal noturno</b> e teste da fita gomada.</p>

                  <p>Então, se a questão falar “larva filariforme”, não marque Ascaris. Se falar “cercária”, não marque Ascaris. Se falar “cisticerco na carne”, não marque Ascaris. Se falar “prurido anal noturno”, pense primeiro em Enterobius. Para Ascaris, a frase é: <b>ovo embrionado ingerido, pulmão, intestino, ovos nas fezes</b>.</p>

                  <h4 class="lesson-subtitle"><span class="gold">7.</span> Diagnóstico</h4>

                  <p>Agora vamos falar do diagnóstico.</p>

                  <p>O diagnóstico clássico da ascaridíase é feito pelo <b>exame parasitológico de fezes</b>, com identificação de ovos. Em algumas situações, pode haver eliminação de vermes adultos nas fezes ou pela boca, mas para prova, o mais importante é lembrar dos ovos nas fezes. E aqui tem outra pegadinha: a forma infectante não é a mesma coisa que a forma diagnóstica.</p>

                  <p>A forma infectante é o <b>ovo embrionado</b>, aquele que entra pela boca e causa infecção. A forma diagnóstica mais cobrada é o <b>ovo encontrado nas fezes</b>. Então, quando a prova perguntar “como infecta?”, responda <span class="gold"><b>ovo embrionado</b></span> ingerido. Quando perguntar “como diagnostica?”, pense em ovos no <span class="blue"><b>exame parasitológico de fezes</b></span>.</p>

                  <h4 class="lesson-subtitle"><span class="gold">8.</span> Prevenção</h4>

                  <p>Agora vamos falar da prevenção, porque ela é consequência direta do ciclo.</p>

                  <p>Se o parasita sai pelas fezes e entra pela boca, a prevenção precisa quebrar esse caminho. Por isso, as medidas mais importantes são saneamento básico, destino adequado das fezes, água tratada, lavagem das mãos e higienização correta dos alimentos. Não adianta decorar prevenção como lista solta. A lógica é simples: se ovos contaminam ambiente, água, solo e alimentos, a prevenção é impedir que esses ovos cheguem à boca.</p>

                  <h4 class="lesson-subtitle"><span class="gold">9.</span> Como pode cair na prova da faculdade</h4>

                  <p>Agora vamos trazer isso para a prova da faculdade.</p>

                  <p>Pode cair assim: “Qual é a forma infectante do Ascaris lumbricoides?” Resposta: <span class="gold"><b>ovo embrionado</b></span>.</p>

                  <p>Pode cair assim: “Como ocorre a transmissão?” Resposta: ingestão de <span class="gold"><b>ovos embrionados</b></span> presentes em água, alimentos, mãos ou solo contaminado.</p>

                  <p>Pode cair assim: “Qual é o ciclo?” Resposta: ingestão do <span class="gold"><b>ovo embrionado</b></span>, liberação da larva no intestino, <span class="blue"><b>migração pulmonar</b></span>, deglutição, retorno ao intestino e maturação em verme adulto.</p>

                  <p>Pode cair assim: “Qual é o diagnóstico clássico?” Resposta: <span class="blue"><b>exame parasitológico de fezes</b></span> com ovos.</p>

                  <p>Pode cair assim: “Criança com dor abdominal, vômitos, distensão e eliminação de vermes longos.” Resposta: pensar em ascaridíase intensa com <span class="gold"><b>obstrução intestinal</b></span>.</p>

                  <p>Pode cair assim: “Tosse, infiltrado pulmonar transitório e eosinofilia antes de sintomas intestinais.” Resposta: migração larvária pulmonar, podendo lembrar síndrome de Löeffler.</p>

                  <h4 class="lesson-subtitle"><span class="gold">10.</span> Como pode cair na residência médica</h4>

                  <p>Agora vamos trazer isso para prova de residência médica.</p>

                  <p>Na residência, o caso pode vir menos direto. A banca pode colocar uma criança de área vulnerável, com baixo ganho ponderal, sintomas respiratórios prévios, eosinofilia, dor abdominal e depois uma complicação obstrutiva. Também pode colocar uma complicação biliar ou pancreática por migração de verme adulto. Pode ainda fazer diferencial com ancilostomíase, estrongiloidíase, esquistossomose, teníase e enterobíase.</p>

                  <p>Então, para residência, não basta decorar “Ascaris é lombriga”. Você precisa reconhecer o padrão clínico: exposição fecal-oral, <span class="gold"><b>ovo embrionado</b></span>, fase pulmonar, eosinofilia, fase intestinal, ovos nas fezes e complicações por alta carga.</p>

                  <h4 class="lesson-subtitle"><span class="gold">11.</span> Revisão oral final</h4>

                  <p>Agora vamos fechar com a revisão oral mais importante.</p>

                  <p>Ascaris lumbricoides é um helminto nematódeo intestinal. Ele é transmitido pela ingestão de <span class="gold"><b>ovos embrionados</b></span> presentes em água, alimentos, mãos ou solo contaminados por fezes. Depois que o ovo é ingerido, a larva sai no intestino, migra pela circulação, passa pelos pulmões, sobe pela árvore respiratória, é deglutida e volta ao intestino delgado, onde vira verme adulto. O adulto produz ovos, que saem nas fezes. O diagnóstico clássico é o parasitológico de fezes com ovos. A clínica pode ser ausente, leve ou intensa. Pode haver tosse, eosinofilia e infiltrado pulmonar na fase larvária. No intestino, pode causar dor abdominal e, em cargas altas, <span class="gold"><b>obstrução intestinal</b></span>. Em alguns casos, o adulto pode migrar para vias biliares ou pancreáticas. A prevenção é saneamento, água tratada, lavagem das mãos e higienização de alimentos.</p>

                  <div class="lesson-final"><b>Frase final para gravar:</b> <span class="gold">Ascaris lumbricoides</span> é o <b>nematódeo intestinal</b> transmitido por <span class="gold">ovo embrionado ingerido</span>; a <span class="blue">larva passa pelo pulmão</span>, o <b>adulto vive no intestino</b> e o diagnóstico clássico é por <span class="blue">ovos nas fezes</span>.</div>
                
                `,
                
                resumo: `
                  <div class="revision-hero">
                    <div class="revision-label">Revisão rápida</div>
                    <h3>O que realmente precisa ficar na memória</h3>
                    <p>Esta revisão foi reorganizada para funcionar como uma lembrança visual do conteúdo. A ideia é que, ao bater o olho, o acadêmico reconheça imediatamente <span class="gold">quem é o parasita</span>, <span class="gold">como ele infecta</span>, <span class="blue">qual é o caminho do ciclo</span>, <span class="gold">como aparece na prova</span> e <span class="blue">quais são as pegadinhas mais clássicas</span>.</p>
                  </div>

                  <div class="sticky-memory"><b>Memória central:</b> <span class="gold">Ascaris lumbricoides</span> entra como <span class="gold">ovo embrionado pela boca</span>, faz <span class="blue">migração pulmonar</span>, volta ao <span class="gold">intestino delgado</span> e aparece no exame como <span class="blue">ovos nas fezes</span>.</div>

                  <div class="revision-sequence">
                    <div class="revision-sequence-card">
                      <div class="thumb">Etapa 1 • Infecção</div>
                      <div class="content">
                        <h5>Ovo embrionado</h5>
                        <p>A infecção começa quando a pessoa ingere <span class="gold">ovos embrionados</span> em água, alimentos, mãos ou solo contaminados por fezes.</p>
                      </div>
                    </div>

                    <div class="revision-sequence-card">
                      <div class="thumb">Etapa 2 • Migração</div>
                      <div class="content">
                        <h5>Passagem pelo pulmão</h5>
                        <p>A larva sai no intestino, entra na circulação e faz <span class="blue">migração pulmonar</span>. Isso explica tosse, chiado e eosinofilia.</p>
                      </div>
                    </div>

                    <div class="revision-sequence-card">
                      <div class="thumb">Etapa 3 • Retorno</div>
                      <div class="content">
                        <h5>Deglutição da larva</h5>
                        <p>Depois de subir pela árvore respiratória, a larva é deglutida e retorna ao intestino delgado para amadurecer.</p>
                      </div>
                    </div>

                    <div class="revision-sequence-card">
                      <div class="thumb">Etapa 4 • Diagnóstico</div>
                      <div class="content">
                        <h5>Ovos nas fezes</h5>
                        <p>O verme adulto vive no intestino delgado, produz ovos e o diagnóstico clássico é o <span class="blue">exame parasitológico de fezes</span>.</p>
                      </div>
                    </div>
                  </div>

                  <div class="revision-blackboard">
                    <h4>Frase que precisa virar automática</h4>
                    <p class="memory-sentence"><span class="gold">Ascaris lumbricoides</span> é um <span class="gold">nematódeo intestinal</span> transmitido por <span class="gold">ovo embrionado ingerido</span>; a larva faz <span class="blue">migração pulmonar</span>, o adulto vive no <span class="gold">intestino delgado</span> e o diagnóstico clássico é feito por <span class="blue">ovos nas fezes</span>.</p>
                  </div>

                  <div class="revision-grid">
                    <div class="revision-card">
                      <h4><span class="num">1</span>Identificação</h4>
                      <p>É um <b>helminto nematódeo</b>, ou seja, um verme cilíndrico intestinal. O adulto vive no <span class="gold">intestino delgado</span>.</p>
                    </div>

                    <div class="revision-card">
                      <h4><span class="num">2</span>Forma infectante</h4>
                      <p>A forma infectante é o <span class="gold">ovo embrionado</span>. Este é um dos pontos que mais caem em prova.</p>
                    </div>

                    <div class="revision-card">
                      <h4><span class="num">3</span>Transmissão</h4>
                      <p>A transmissão é <b>fecal-oral</b>: fezes contaminam o ambiente, os ovos chegam à boca por água, alimento, solo ou mãos contaminadas.</p>
                    </div>

                    <div class="revision-card">
                      <h4><span class="num">4</span>Pista clínica importante</h4>
                      <p>Se o caso trouxer <b>tosse, eosinofilia, infiltrado pulmonar transitório</b> e depois sintomas intestinais, pense na fase larvária do Ascaris.</p>
                    </div>

                    <div class="revision-card">
                      <h4><span class="num">5</span>Diagnóstico</h4>
                      <p>O diagnóstico clássico é o <span class="blue">exame parasitológico de fezes</span>. Forma infectante e forma diagnóstica não são a mesma coisa.</p>
                    </div>

                    <div class="revision-card">
                      <h4><span class="num">6</span>Complicação clássica</h4>
                      <p>Em alta carga, principalmente em crianças, pode causar <span class="gold">obstrução intestinal</span> por massa de vermes adultos.</p>
                    </div>

                    <div class="revision-card">
                      <h4><span class="num">7</span>Complicação mais avançada</h4>
                      <p>O verme adulto pode migrar para vias biliares ou pancreáticas, gerando quadros que aparecem mais em provas avançadas e residência.</p>
                    </div>

                    <div class="revision-card">
                      <h4><span class="num">8</span>O que a banca gosta</h4>
                      <p><b>Saneamento precário</b> + <b>ingestão de ovos</b> + <b>tosse/eosinofilia</b> + <b>ovos nas fezes</b> praticamente desenham o diagnóstico.</p>
                    </div>
                  </div>

                  <h4 class="lesson-subtitle"><span class="gold">Mapa anti-pegadinha</span></h4>

                  <div class="mini-compare">
                    <div><b>Ascaris</b>Ovo embrionado pela boca. Pulmão no ciclo. Adulto no intestino. Ovos nas fezes.</div>
                    <div><b>Ancylostoma</b>Larva pela pele. Muito associado a anemia por perda de sangue.</div>
                    <div><b>Strongyloides</b>Larva pela pele. Pode fazer autoinfecção.</div>
                    <div><b>Schistosoma</b>Cercária em água doce penetra a pele.</div>
                    <div><b>Taenia</b>Cisticerco na carne ou ovos, dependendo da doença cobrada.</div>
                  </div>

                  <div class="revision-blackboard">
                    <h4>Para não errar na hora da prova</h4>
                    <p><span class="gold">Ascaris</span> não é <b>larva filariforme pela pele</b>, não é <b>cercária</b>, não é <b>cisticerco</b> e não é <b>prurido anal noturno</b>. A memória correta é: <b>ovo embrionado ingerido</b>, <span class="blue">pulmão</span>, <b>intestino</b>, <span class="blue">ovos nas fezes</span>.</p>
                  </div>
                `,
                pegadinhas: `
                  <h3>Pontos que confundem</h3>
                  <div class="base-phrase"><b>Para fixar:</b> Ascaris lumbricoides é um nematódeo intestinal transmitido pela ingestão de ovos embrionados presentes em água, alimentos ou mãos contaminadas. Depois de ingerido, o ovo libera larvas no intestino, essas larvas fazem migração pulmonar, sobem pela árvore respiratória, são deglutidas e retornam ao intestino delgado, onde se tornam vermes adultos. A prova costuma cobrar forma infectante, transmissão fecal-oral, ciclo pulmonar e diagnóstico por ovos nas fezes.</div>
                  <div class="confusion-list">
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaris lumbricoides é infectante na forma de larva filariforme.”</p>
                      <p><b>O erro é:</b> trocar Ascaris por helmintos que penetram pela pele, como Ancylostoma e Strongyloides.</p>
                      <p><b>A versão verdadeira é:</b> a forma infectante do Ascaris lumbricoides é o ovo embrionado. A pessoa se infecta ao ingerir ovos presentes em água, alimentos ou mãos contaminadas.</p>
                      <p><b>Revisão oral:</b> Ascaris entra como ovo embrionado. Se a questão falar em larva filariforme, pense mais em Ancylostoma ou Strongyloides, não em Ascaris.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaris lumbricoides penetra ativamente pela pele.”</p>
                      <p><b>O erro é:</b> confundir a transmissão do Ascaris com parasitas de penetração cutânea.</p>
                      <p><b>A versão verdadeira é:</b> Ascaris é adquirido por ingestão de ovos embrionados. Ele não penetra pela pele.</p>
                      <p><b>Revisão oral:</b> Ascaris é parasita de transmissão fecal-oral. Se aparecer pele como porta de entrada, a questão está tentando levar você para outro helminto.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Como o verme adulto vive no intestino, Ascaris não passa pelo pulmão.”</p>
                      <p><b>O erro é:</b> esquecer a migração larvária pulmonar.</p>
                      <p><b>A versão verdadeira é:</b> o ciclo do Ascaris inclui passagem pelo pulmão antes do retorno ao intestino delgado, onde o verme adulto se estabelece.</p>
                      <p><b>Revisão oral:</b> O verme adulto fica no intestino, mas a larva faz migração pulmonar. Por isso, sintomas respiratórios podem aparecer no ciclo do Ascaris.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “A forma infectante e a forma diagnóstica do Ascaris são a mesma coisa.”</p>
                      <p><b>O erro é:</b> misturar o que infecta com o que aparece no exame.</p>
                      <p><b>A versão verdadeira é:</b> a forma infectante é o ovo embrionado ingerido. O diagnóstico costuma ser feito pela identificação de ovos nas fezes.</p>
                      <p><b>Revisão oral:</b> Uma coisa é o que entra no corpo. Outra é o que o laboratório encontra. No Ascaris, entra ovo embrionado e o exame de fezes pesquisa ovos.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Se a questão fala em ingestão, a resposta pode ser larva filariforme.”</p>
                      <p><b>O erro é:</b> não relacionar via de entrada com forma infectante.</p>
                      <p><b>A versão verdadeira é:</b> quando o enunciado fala em ingestão no Ascaris, a forma infectante esperada é o ovo embrionado.</p>
                      <p><b>Revisão oral:</b> Leia a via de transmissão antes de olhar a alternativa. Ingestão combina com ovo embrionado; pele combina mais com larva filariforme.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Cercária é a forma infectante do Ascaris lumbricoides.”</p>
                      <p><b>O erro é:</b> trocar Ascaris por Schistosoma mansoni.</p>
                      <p><b>A versão verdadeira é:</b> cercária é forma infectante do Schistosoma mansoni. No Ascaris, a forma infectante é o ovo embrionado.</p>
                      <p><b>Revisão oral:</b> Cercária é palavra de esquistossomose. Ascaris é ovo embrionado ingerido.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Cisticerco é a forma infectante do Ascaris lumbricoides.”</p>
                      <p><b>O erro é:</b> misturar Ascaris com Taenia.</p>
                      <p><b>A versão verdadeira é:</b> cisticerco é forma larvária relacionada à Taenia, principalmente em contexto de carne crua ou malpassada.</p>
                      <p><b>Revisão oral:</b> Cisticerco lembra Taenia. Ascaris não vem de carne com cisticerco; Ascaris vem de ingestão de ovos embrionados.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Todo helminto com ciclo pulmonar é Strongyloides.”</p>
                      <p><b>O erro é:</b> achar que a passagem pulmonar pertence a apenas um parasita.</p>
                      <p><b>A versão verdadeira é:</b> Ascaris também tem ciclo com passagem pulmonar.</p>
                      <p><b>Revisão oral:</b> Ciclo pulmonar não fecha diagnóstico sozinho. Para diferenciar, olhe a forma de entrada: Ascaris entra por ovo ingerido.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaris é transmitido principalmente por picada de inseto.”</p>
                      <p><b>O erro é:</b> puxar o raciocínio para doença vetorial sem base no enunciado.</p>
                      <p><b>A versão verdadeira é:</b> Ascaris é transmitido por via fecal-oral, pela ingestão de ovos embrionados.</p>
                      <p><b>Revisão oral:</b> Picada de inseto não é transmissão de Ascaris. Em Ascaris, pense em saneamento, água, alimento e mãos contaminadas.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “O verme adulto do Ascaris vive nos pulmões.”</p>
                      <p><b>O erro é:</b> confundir local de migração com local definitivo do verme adulto.</p>
                      <p><b>A versão verdadeira é:</b> o verme adulto vive no intestino delgado. O pulmão é etapa de migração larvária.</p>
                      <p><b>Revisão oral:</b> Pulmão é passagem; intestino é moradia do adulto. Essa distinção evita erro em questão de ciclo.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Tosse exclui Ascaris, porque Ascaris é intestinal.”</p>
                      <p><b>O erro é:</b> separar rigidamente sintomas respiratórios de parasitoses intestinais.</p>
                      <p><b>A versão verdadeira é:</b> a fase larvária pode passar pelos pulmões e gerar sintomas respiratórios.</p>
                      <p><b>Revisão oral:</b> Se a questão mistura tosse e depois sintomas intestinais, não descarte Ascaris. Isso pode ser justamente a pista da migração pulmonar.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Síndrome de Löeffler não tem relação com helmintos.”</p>
                      <p><b>O erro é:</b> não lembrar que migração larvária pode causar quadro pulmonar com eosinofilia.</p>
                      <p><b>A versão verdadeira é:</b> helmintos com migração pulmonar, incluindo Ascaris, podem estar associados à síndrome de Löeffler.</p>
                      <p><b>Revisão oral:</b> Löeffler lembra pulmão, eosinofilia e migração larvária. Em parasitologia, isso pode aparecer junto de Ascaris.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “O diagnóstico clássico de Ascaris é hemocultura.”</p>
                      <p><b>O erro é:</b> usar exame de bactéria para parasitose intestinal.</p>
                      <p><b>A versão verdadeira é:</b> o diagnóstico clássico é exame parasitológico de fezes com identificação de ovos.</p>
                      <p><b>Revisão oral:</b> Ascaris é parasitose intestinal. Na prova, o caminho mais clássico é pensar em ovos nas fezes.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Uma única amostra negativa de fezes sempre exclui parasitose.”</p>
                      <p><b>O erro é:</b> achar que o parasitológico de fezes é perfeito em qualquer amostra isolada.</p>
                      <p><b>A versão verdadeira é:</b> amostras seriadas podem aumentar a chance de detecção em parasitoses intestinais.</p>
                      <p><b>Revisão oral:</b> Se o tema é parasitológico de fezes, lembre que a eliminação pode variar. Por isso, mais de uma amostra pode ser solicitada.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Prurido anal noturno é a pista mais clássica de Ascaris.”</p>
                      <p><b>O erro é:</b> confundir Ascaris com Enterobius vermicularis.</p>
                      <p><b>A versão verdadeira é:</b> prurido anal noturno é clássico de Enterobius. Ascaris é mais associado a ingestão de ovos, ciclo pulmonar e manifestação intestinal.</p>
                      <p><b>Revisão oral:</b> Prurido anal noturno chama Enterobius. Ascaris chama ovo ingerido, pulmão e intestino.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaris causa anemia por sugar sangue da mucosa intestinal.”</p>
                      <p><b>O erro é:</b> confundir Ascaris com ancilostomídeos.</p>
                      <p><b>A versão verdadeira é:</b> anemia por espoliação sanguínea é mais característica de Ancylostoma e Necator.</p>
                      <p><b>Revisão oral:</b> Se a questão enfatiza anemia ferropriva por perda sanguínea intestinal, pense em ancilostomídeos. Ascaris pesa mais por ciclo pulmonar e carga intestinal.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaris faz autoinfecção como Strongyloides.”</p>
                      <p><b>O erro é:</b> transferir uma característica marcante de Strongyloides para Ascaris.</p>
                      <p><b>A versão verdadeira é:</b> autoinfecção é característica importante de Strongyloides stercoralis, não de Ascaris.</p>
                      <p><b>Revisão oral:</b> Autoinfecção é palavra que deve acender Strongyloides. Ascaris não é o clássico da autoinfecção.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaris precisa de hospedeiro intermediário obrigatório.”</p>
                      <p><b>O erro é:</b> achar que todo parasita precisa de outro animal no ciclo.</p>
                      <p><b>A versão verdadeira é:</b> Ascaris tem ciclo direto, sem hospedeiro intermediário obrigatório.</p>
                      <p><b>Revisão oral:</b> Quando a questão fala em boi ou porco no ciclo, pense em Taenia. Ascaris faz ciclo direto no ser humano e no ambiente.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaris é transmitido por carne crua ou malpassada.”</p>
                      <p><b>O erro é:</b> misturar Ascaris com Taenia.</p>
                      <p><b>A versão verdadeira é:</b> Ascaris é transmitido por ingestão de ovos embrionados, não por carne.</p>
                      <p><b>Revisão oral:</b> Carne crua ou malpassada é pista de Taenia. Água, alimento e mãos contaminadas por ovos são pistas de Ascaris.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaris é adquirido por cercárias em água doce.”</p>
                      <p><b>O erro é:</b> confundir água contaminada por ovos com água contendo cercárias.</p>
                      <p><b>A versão verdadeira é:</b> cercárias em água doce indicam Schistosoma mansoni. Ascaris envolve ingestão de ovos, geralmente por contaminação fecal-oral.</p>
                      <p><b>Revisão oral:</b> Água pode aparecer nos dois temas, mas a palavra cercária muda tudo. Cercária é Schistosoma; ovo ingerido é Ascaris.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “O ovo eliminado nas fezes já é imediatamente infectante.”</p>
                      <p><b>O erro é:</b> ignorar a maturação do ovo no ambiente.</p>
                      <p><b>A versão verdadeira é:</b> o ovo precisa embrionar no ambiente para se tornar infectante.</p>
                      <p><b>Revisão oral:</b> Ovo eliminado não é automaticamente infectante. Ele precisa de condições ambientais para embrionar.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Higiene das mãos não interfere na transmissão do Ascaris.”</p>
                      <p><b>O erro é:</b> não conectar transmissão fecal-oral com prevenção.</p>
                      <p><b>A versão verdadeira é:</b> higiene das mãos, saneamento e lavagem de alimentos reduzem a transmissão de ovos.</p>
                      <p><b>Revisão oral:</b> Se a transmissão é fecal-oral, prevenção envolve saneamento e higiene. Isso vale muito para Ascaris.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaridíase sempre causa sintomas graves.”</p>
                      <p><b>O erro é:</b> achar que toda infecção por Ascaris é intensa.</p>
                      <p><b>A versão verdadeira é:</b> muitas infecções podem ser assintomáticas ou leves; a gravidade depende da carga parasitária e de complicações.</p>
                      <p><b>Revisão oral:</b> Nem todo paciente terá quadro exuberante. Carga parasitária alta aumenta chance de sintomas e complicações.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaris nunca causa obstrução intestinal.”</p>
                      <p><b>O erro é:</b> subestimar complicações por alta carga de vermes.</p>
                      <p><b>A versão verdadeira é:</b> infestações intensas podem causar obstrução intestinal, especialmente em crianças.</p>
                      <p><b>Revisão oral:</b> Quando há muitos vermes adultos no intestino, pode ocorrer obstrução. Essa é uma complicação clássica em prova.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Eosinofilia é exclusiva de alergias.”</p>
                      <p><b>O erro é:</b> esquecer que helmintos também podem elevar eosinófilos.</p>
                      <p><b>A versão verdadeira é:</b> helmintíases, especialmente com migração tecidual, podem cursar com eosinofilia.</p>
                      <p><b>Revisão oral:</b> Eosinofilia não é só alergia. Em parasitologia, pense em helmintos, principalmente quando há migração tecidual.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “O diagnóstico principal é sempre ver o verme adulto nas fezes.”</p>
                      <p><b>O erro é:</b> confundir eliminação ocasional do verme com diagnóstico laboratorial clássico.</p>
                      <p><b>A versão verdadeira é:</b> o diagnóstico clássico é a identificação de ovos no exame parasitológico de fezes.</p>
                      <p><b>Revisão oral:</b> O verme adulto pode até ser eliminado, mas a prova costuma cobrar ovos nas fezes como diagnóstico.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Antibiótico é o tratamento específico da ascaridíase.”</p>
                      <p><b>O erro é:</b> tratar helminto como bactéria.</p>
                      <p><b>A versão verdadeira é:</b> ascaridíase é tratada com anti-helmínticos, conforme orientação clínica.</p>
                      <p><b>Revisão oral:</b> Antibiótico é para bactéria. Ascaris é helminto, então o raciocínio terapêutico é antiparasitário.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Ascaris é independente de saneamento básico.”</p>
                      <p><b>O erro é:</b> não relacionar o ciclo ao ambiente contaminado por fezes.</p>
                      <p><b>A versão verdadeira é:</b> más condições de saneamento favorecem a contaminação ambiental por ovos.</p>
                      <p><b>Revisão oral:</b> Saneamento é central em parasitoses fecal-orais. Onde há contaminação do ambiente por fezes, o risco aumenta.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Lavar alimentos é diagnóstico de Ascaris.”</p>
                      <p><b>O erro é:</b> confundir medida preventiva com exame diagnóstico.</p>
                      <p><b>A versão verdadeira é:</b> lavar alimentos ajuda na prevenção; o diagnóstico é feito por exame parasitológico de fezes.</p>
                      <p><b>Revisão oral:</b> Prevenção evita a infecção. Diagnóstico confirma a infecção. A prova pode misturar essas funções.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Pegadinha:</b> “Basta decorar o nome Ascaris para acertar a questão.”</p>
                      <p><b>O erro é:</b> estudar o agente isolado, sem ligar transmissão, ciclo e diagnóstico.</p>
                      <p><b>A versão verdadeira é:</b> o acerto vem de conectar agente, forma infectante, via de transmissão, ciclo pulmonar e exame de fezes.</p>
                      <p><b>Revisão oral:</b> Para gabaritar, monte a sequência: ovo ingerido, larva migra, pulmão, deglutição, intestino, ovos nas fezes.</p>
                    </div>
                  </div>
                `,
                questoes: [
                  {
                    q: "1. Qual é a forma infectante de Ascaris lumbricoides?",
                    alts: ["Ovo embrionado", "Larva filariforme", "Cercária", "Cisticerco", "Trofozoíto"],
                    correct: 0,
                    comments: [
                      "Correta. A forma infectante é o ovo embrionado, ingerido por água, alimentos ou mãos contaminadas.",
                      "Errada. Larva filariforme lembra Ancylostoma ou Strongyloides.",
                      "Errada. Cercária lembra Schistosoma mansoni.",
                      "Errada. Cisticerco lembra Taenia.",
                      "Errada. Trofozoíto é termo associado a protozoários, não ao Ascaris."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "2. A transmissão clássica da ascaridíase ocorre por:",
                    alts: ["Picada de mosquito", "Penetração de larvas pela pele", "Ingestão de ovos embrionados", "Ingestão de carne bovina crua", "Contato sexual"],
                    correct: 2,
                    comments: [
                      "Errada. Ascaris não é doença vetorial.",
                      "Errada. Penetração pela pele sugere outros helmintos.",
                      "Correta. Ascaris é transmitido por via fecal-oral, pela ingestão de ovos embrionados.",
                      "Errada. Carne bovina crua lembra Taenia saginata.",
                      "Errada. Contato sexual não é a transmissão clássica."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "3. O local em que o verme adulto de Ascaris lumbricoides vive é:",
                    alts: ["Pulmão", "Fígado", "Intestino delgado", "Baço", "Sistema nervoso central"],
                    correct: 2,
                    comments: [
                      "Errada. O pulmão é fase de migração larvária.",
                      "Errada. Fígado não é o local do verme adulto.",
                      "Correta. O verme adulto vive no intestino delgado.",
                      "Errada. Baço não é local clássico do Ascaris.",
                      "Errada. Sistema nervoso central não é local do Ascaris adulto."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "4. A passagem pulmonar no ciclo do Ascaris ocorre principalmente na fase de:",
                    alts: ["Ovo não embrionado", "Larva", "Verme adulto", "Cisticerco", "Proglote"],
                    correct: 1,
                    comments: [
                      "Errada. Ovo não embrionado não faz migração pulmonar.",
                      "Correta. A larva migra pelos pulmões antes de ser deglutida e retornar ao intestino.",
                      "Errada. O adulto vive no intestino.",
                      "Errada. Cisticerco pertence à Taenia.",
                      "Errada. Proglote é estrutura de cestódeos como Taenia."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "5. O diagnóstico laboratorial clássico da ascaridíase é feito por:",
                    alts: ["Hemocultura", "Gota espessa", "Exame parasitológico de fezes", "Teste da fita gomada", "Sorologia para toxina"],
                    correct: 2,
                    comments: [
                      "Errada. Hemocultura é para investigação bacteriana no sangue.",
                      "Errada. Gota espessa é clássica para malária.",
                      "Correta. O exame parasitológico de fezes pode identificar ovos de Ascaris.",
                      "Errada. Fita gomada é clássica para Enterobius.",
                      "Errada. Não é o método clássico da ascaridíase."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "6. A forma diagnóstica mais cobrada em Ascaris é:",
                    alts: ["Ovo nas fezes", "Cercária na água", "Larva no sangue periférico", "Cisticerco na carne", "Proglote gravídica"],
                    correct: 0,
                    comments: [
                      "Correta. Ovos nas fezes são a forma diagnóstica clássica.",
                      "Errada. Cercária é Schistosoma.",
                      "Errada. Larva no sangue periférico não é a forma diagnóstica clássica.",
                      "Errada. Cisticerco na carne é Taenia.",
                      "Errada. Proglote gravídica é Taenia."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "7. Ascaris lumbricoides pertence ao grupo dos:",
                    alts: ["Protozoários flagelados", "Nematódeos", "Cestódeos", "Trematódeos", "Bactérias Gram-positivas"],
                    correct: 1,
                    comments: [
                      "Errada. Não é protozoário.",
                      "Correta. Ascaris é um nematódeo, ou seja, um helminto cilíndrico.",
                      "Errada. Cestódeos incluem Taenia.",
                      "Errada. Trematódeos incluem Schistosoma.",
                      "Errada. Não é bactéria."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "8. Em relação ao ciclo do Ascaris, é correto afirmar:",
                    alts: ["É transmitido por cercárias em água doce", "Tem ciclo direto e não exige hospedeiro intermediário obrigatório", "Depende obrigatoriamente de porco como hospedeiro intermediário", "É transmitido por carne bovina crua", "Tem como forma infectante o cisticerco"],
                    correct: 1,
                    comments: [
                      "Errada. Cercária em água doce sugere Schistosoma.",
                      "Correta. Ascaris tem ciclo direto, com ovos no ambiente e infecção por ingestão.",
                      "Errada. Porco está ligado à Taenia solium.",
                      "Errada. Carne bovina crua sugere Taenia saginata.",
                      "Errada. Cisticerco é Taenia."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "9. A principal medida preventiva contra Ascaris é:",
                    alts: ["Vacinação anual", "Uso de repelente", "Saneamento básico e higiene das mãos/alimentos", "Evitar contato com gatos", "Cozinhar carne suína"],
                    correct: 2,
                    comments: [
                      "Errada. Não há vacinação anual para ascaridíase.",
                      "Errada. Repelente não previne Ascaris.",
                      "Correta. Como a transmissão é fecal-oral, prevenção envolve saneamento, higiene e lavagem de alimentos.",
                      "Errada. Gatos não são o ponto central.",
                      "Errada. Carne suína lembra Taenia."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "10. O ovo de Ascaris torna-se infectante após:",
                    alts: ["Ser eliminado já infectante nas fezes", "Embrionar no ambiente", "Virar cercária na água", "Transformar-se em cisticerco na carne", "Entrar no mosquito"],
                    correct: 1,
                    comments: [
                      "Errada. Ovo eliminado não é imediatamente infectante.",
                      "Correta. O ovo precisa embrionar no ambiente para se tornar infectante.",
                      "Errada. Cercária é Schistosoma.",
                      "Errada. Cisticerco é Taenia.",
                      "Errada. Mosquito não participa do ciclo."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "11. A síndrome de Löeffler na ascaridíase está ligada a:",
                    alts: ["Obstrução de vias biliares por proglotes", "Migração larvária pulmonar com eosinofilia", "Cisticercose cerebral", "Penetração de cercárias pela pele", "Fermentação bacteriana intestinal"],
                    correct: 1,
                    comments: [
                      "Errada. Proglotes são de Taenia.",
                      "Correta. Migração larvária pode causar quadro pulmonar transitório com eosinofilia.",
                      "Errada. Cisticercose cerebral é Taenia solium.",
                      "Errada. Cercárias são de Schistosoma.",
                      "Errada. Não é o mecanismo clássico."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "12. Um achado hematológico que pode acompanhar migração larvária de helmintos é:",
                    alts: ["Neutropenia obrigatória", "Eosinofilia", "Trombocitose essencial", "Anemia falciforme", "Linfopenia profunda isolada"],
                    correct: 1,
                    comments: [
                      "Errada. Não é achado obrigatório.",
                      "Correta. Eosinofilia pode ocorrer em helmintíases, especialmente com migração tecidual.",
                      "Errada. Não é o achado clássico.",
                      "Errada. É doença genética.",
                      "Errada. Não é o achado típico."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "13. Qual alternativa diferencia Ascaris de Ancylostoma?",
                    alts: ["Ascaris entra por ingestão de ovos; Ancylostoma pode penetrar pela pele", "Ascaris é sempre transmitido por carne bovina", "Ancylostoma é protozoário", "Ascaris é transmitido por cercária", "Ancylostoma não causa anemia"],
                    correct: 0,
                    comments: [
                      "Correta. Ascaris é via oral por ovos; Ancylostoma penetra pela pele e pode causar anemia.",
                      "Errada. Carne bovina sugere Taenia saginata.",
                      "Errada. Ancylostoma é helminto, não protozoário.",
                      "Errada. Cercária é Schistosoma.",
                      "Errada. Ancylostoma pode causar anemia."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "14. Qual alternativa diferencia Ascaris de Schistosoma?",
                    alts: ["Ascaris é transmitido por ovos ingeridos; Schistosoma por cercárias na água", "Ambos são transmitidos por carne suína", "Schistosoma é transmitido por ovos ingeridos", "Ascaris penetra pela pele em água doce", "Ambos têm cisticerco"],
                    correct: 0,
                    comments: [
                      "Correta. Ascaris é ingestão de ovos; Schistosoma é cercária penetrando pela pele em água contaminada.",
                      "Errada. Carne suína sugere Taenia.",
                      "Errada. Schistosoma infecta por cercárias.",
                      "Errada. Ascaris não penetra pela pele.",
                      "Errada. Cisticerco é Taenia."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "15. Qual alternativa diferencia Ascaris de Taenia?",
                    alts: ["Ascaris é bactéria; Taenia é vírus", "Ascaris envolve ovos embrionados no ambiente; Taenia envolve carne com cisticerco ou ovos conforme a doença", "Ambos são transmitidos apenas por mosquito", "Ascaris é sempre coagulase positivo", "Taenia é transmitida por cercária"],
                    correct: 1,
                    comments: [
                      "Errada. Ambos são helmintos.",
                      "Correta. Ascaris é fecal-oral por ovos embrionados; Taenia depende do contexto de carne/cisticerco ou ovos.",
                      "Errada. Mosquito não é o ciclo desses helmintos.",
                      "Errada. Coagulase é termo bacteriano.",
                      "Errada. Cercária é Schistosoma."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "16. A obstrução intestinal por Ascaris ocorre principalmente por:",
                    alts: ["Produção de toxina botulínica", "Alta carga de vermes adultos no intestino", "Destruição autoimune da mucosa", "Formação de cisticercos no cérebro", "Picada de vetor"],
                    correct: 1,
                    comments: [
                      "Errada. Toxina botulínica é Clostridium botulinum.",
                      "Correta. Grande quantidade de vermes adultos pode obstruir o intestino, especialmente em crianças.",
                      "Errada. Não é o mecanismo clássico.",
                      "Errada. Cisticercose é Taenia solium.",
                      "Errada. Não há vetor."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "17. A anemia por espoliação sanguínea intestinal é mais típica de:",
                    alts: ["Ascaris lumbricoides", "Ancylostoma/Necator", "Enterobius vermicularis", "Schistosoma na forma de cercária", "Taenia saginata no pulmão"],
                    correct: 1,
                    comments: [
                      "Errada. Ascaris não é o clássico da anemia por sugar sangue.",
                      "Correta. Ancylostoma e Necator são associados à perda sanguínea intestinal e anemia ferropriva.",
                      "Errada. Enterobius é prurido anal.",
                      "Errada. Schistosoma tem outro quadro.",
                      "Errada. Taenia saginata não vive no pulmão."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "18. Autoinfecção é uma característica importante de:",
                    alts: ["Strongyloides stercoralis", "Ascaris lumbricoides", "Taenia saginata", "Schistosoma mansoni", "Enterobius sempre invasivo"],
                    correct: 0,
                    comments: [
                      "Correta. Strongyloides pode fazer autoinfecção, diferente do Ascaris.",
                      "Errada. Ascaris não tem autoinfecção clássica.",
                      "Errada. Taenia não é a resposta.",
                      "Errada. Schistosoma não é autoinfecção clássica.",
                      "Errada. Enterobius não é descrito assim."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "19. Prurido anal noturno lembra mais:",
                    alts: ["Ascaris lumbricoides", "Enterobius vermicularis", "Schistosoma mansoni", "Taenia saginata", "Necator americanus"],
                    correct: 1,
                    comments: [
                      "Errada. Ascaris é mais ciclo pulmonar/intestino.",
                      "Correta. Enterobius é classicamente associado a prurido anal noturno.",
                      "Errada. Schistosoma é cercária/água.",
                      "Errada. Taenia é carne/proglotes.",
                      "Errada. Necator é pele/anemia."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "20. Teste da fita gomada é mais associado a:",
                    alts: ["Enterobius vermicularis", "Ascaris lumbricoides", "Schistosoma mansoni", "Taenia solium", "Plasmodium vivax"],
                    correct: 0,
                    comments: [
                      "Correta. O teste da fita gomada é usado para Enterobius.",
                      "Errada. Ascaris é fezes com ovos.",
                      "Errada. Schistosoma tem outro diagnóstico.",
                      "Errada. Taenia não é fita gomada.",
                      "Errada. Plasmodium é gota espessa/esfregaço."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "21. Gota espessa é exame clássico para:",
                    alts: ["Ascaridíase", "Malária", "Enterobíase", "Teníase", "Ancilostomíase"],
                    correct: 1,
                    comments: [
                      "Errada. Ascaris é parasitológico de fezes.",
                      "Correta. Gota espessa é clássica para diagnóstico de malária.",
                      "Errada. Enterobius usa fita gomada.",
                      "Errada. Teníase tem proglotes/ovos conforme contexto.",
                      "Errada. Ancilostomíase é fezes."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "22. No ciclo do Ascaris, após passar pelos pulmões, as larvas:",
                    alts: ["São eliminadas pela urina", "São deglutidas e retornam ao intestino", "Viraram cercárias na água", "Formam cisticercos no músculo", "Entram em mosquitos"],
                    correct: 1,
                    comments: [
                      "Errada. Não é via urinária.",
                      "Correta. Após subir pela árvore respiratória, as larvas são deglutidas e retornam ao intestino.",
                      "Errada. Cercária é Schistosoma.",
                      "Errada. Cisticerco é Taenia.",
                      "Errada. Mosquito não participa."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "23. A alternativa que melhor resume Ascaris é:",
                    alts: ["Ovo ingerido, pulmão, intestino, ovos nas fezes", "Cercária na água, pele, fígado, ovos na urina", "Carne bovina, cisticerco, intestino, proglotes", "Mosquito, sangue, fígado, hemácias", "Fita gomada, prurido anal, sem ciclo pulmonar"],
                    correct: 0,
                    comments: [
                      "Correta. Essa sequência resume o essencial do ciclo do Ascaris.",
                      "Errada. Mistura Schistosoma.",
                      "Errada. Sugere Taenia.",
                      "Errada. Sugere malária.",
                      "Errada. Sugere Enterobius."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "24. Ascaridíase pode ser assintomática?",
                    alts: ["Não, sempre causa obstrução", "Sim, muitas infecções podem ser leves ou assintomáticas", "Não, sempre causa neurocisticercose", "Sim, mas apenas quando há mosquito vetor", "Não existe forma intestinal"],
                    correct: 1,
                    comments: [
                      "Errada. Obstrução ocorre em alta carga, não sempre.",
                      "Correta. Muitas infecções são leves ou assintomáticas; gravidade depende da carga parasitária.",
                      "Errada. Neurocisticercose é Taenia solium.",
                      "Errada. Não há mosquito vetor.",
                      "Errada. Forma intestinal é clássica."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "25. A gravidade da ascaridíase depende principalmente de:",
                    alts: ["Cor do ovo", "Carga parasitária e complicações", "Tipo sanguíneo do paciente", "Coagulase do parasita", "Presença de cápsula bacteriana"],
                    correct: 1,
                    comments: [
                      "Errada. Cor do ovo não é o principal.",
                      "Correta. Quanto maior a carga parasitária, maior risco de sintomas e complicações.",
                      "Errada. Não é o ponto central.",
                      "Errada. Coagulase é bacteriana.",
                      "Errada. Cápsula bacteriana não se aplica."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "26. A relação entre saneamento básico e Ascaris existe porque:",
                    alts: ["O parasita é transmitido por aerossóis hospitalares", "Ovos podem contaminar ambiente, água e alimentos por fezes", "O verme vive em mosquitos urbanos", "A transmissão ocorre por contato sexual", "O ciclo depende de carne refrigerada"],
                    correct: 1,
                    comments: [
                      "Errada. Não é aerossol hospitalar.",
                      "Correta. Ovos eliminados nas fezes podem contaminar o ambiente e manter transmissão fecal-oral.",
                      "Errada. Não há mosquito.",
                      "Errada. Não é contato sexual.",
                      "Errada. Não depende de carne."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "27. A lavagem de alimentos previne Ascaris porque:",
                    alts: ["Remove ou reduz contaminação por ovos no alimento", "Mata cisticercos da carne bovina", "Impede picada de mosquito", "Destrói cercárias no sangue", "Substitui exame de fezes"],
                    correct: 0,
                    comments: [
                      "Correta. Higienização reduz ingestão de ovos embrionados presentes em alimentos contaminados.",
                      "Errada. Cisticerco é Taenia.",
                      "Errada. Mosquito não transmite Ascaris.",
                      "Errada. Cercária é Schistosoma.",
                      "Errada. Prevenção não é diagnóstico."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "28. A prova pode usar sintomas pulmonares em Ascaris para testar se o aluno sabe que:",
                    alts: ["O verme adulto vive no pulmão", "O ciclo tem migração larvária pulmonar", "Ascaris é transmitido por ar", "Ascaris é bactéria respiratória", "O diagnóstico é raio-x sempre"],
                    correct: 1,
                    comments: [
                      "Errada. Adulto vive no intestino.",
                      "Correta. Sintomas pulmonares refletem a passagem larvária, não moradia do adulto.",
                      "Errada. Transmissão é fecal-oral.",
                      "Errada. Não é bactéria.",
                      "Errada. Raio-x não é diagnóstico clássico."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "29. A alternativa incorreta sobre Ascaris é:",
                    alts: ["É transmitido por ingestão de ovos embrionados", "Pode ter fase pulmonar", "Adulto vive no intestino delgado", "Tem cercária como forma infectante", "Pode ser diagnosticado por ovos nas fezes"],
                    correct: 3,
                    comments: [
                      "Errada. Está correta sobre Ascaris.",
                      "Errada. Está correta.",
                      "Errada. Está correta.",
                      "Correta. Cercária é forma infectante de Schistosoma, não de Ascaris.",
                      "Errada. Está correta."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  },
                  {
                    q: "30. Para acertar questão de Ascaris, a melhor sequência mental é:",
                    alts: ["Coagulase, catalase, toxina, pus, abscesso", "Ovo ingerido, larva no pulmão, adulto no intestino, ovos nas fezes", "Cercária, caramujo, pele, hipertensão portal, ovos", "Carne suína, cisticerco, verme adulto, proglote", "Mosquito, fígado, hemácia, febre periódica"],
                    correct: 1,
                    comments: [
                      "Errada. Isso é bacteriologia.",
                      "Correta. Essa é a sequência mental mais útil para Ascaris.",
                      "Errada. Isso sugere Schistosoma.",
                      "Errada. Isso sugere Taenia.",
                      "Errada. Isso sugere malária."
                    ],
                    traps: [
                      {erro:"Confundir forma infectante com forma diagnóstica.", verdade:"Forma infectante é o ovo embrionado; forma diagnóstica costuma ser o ovo nas fezes.", revisao:"Na prova, separe o que entra no corpo do que aparece no exame."},
                      {erro:"Trocar transmissão oral por penetração pela pele.", verdade:"Ascaris é transmitido pela ingestão de ovos embrionados.", revisao:"Penetração pela pele lembra Ancylostoma, Strongyloides ou Schistosoma, dependendo do enunciado."},
                      {erro:"Ignorar a migração pulmonar.", verdade:"As larvas de Ascaris passam pelos pulmões antes de retornar ao intestino.", revisao:"Tosse e eosinofilia podem ser pistas do ciclo."},
                      {erro:"Confundir Ascaris com Taenia.", verdade:"Taenia aparece ligada a carne ou ovos de Taenia solium; Ascaris aparece ligado a ovos embrionados no ambiente.", revisao:"Olhe a via de transmissão."},
                      {erro:"Achar que todo parasita intestinal tem o mesmo ciclo.", verdade:"Cada helminto tem forma infectante, transmissão e diagnóstico próprios.", revisao:"O professor costuma cobrar justamente as diferenças."}
                    ],
                    clinicalReasoning: "Resolva começando pela pista principal do enunciado. Em Ascaris, procure forma infectante, via de transmissão, ciclo pulmonar, local do adulto e diagnóstico. Depois elimine alternativas que pertencem a outros parasitas.",
                    tip: "Antes de marcar, pergunte: isso é ovo ingerido, pele, água com cercária, carne com cisticerco ou mosquito? A via de entrada costuma entregar a resposta.",
                    oral: "O raciocínio de Ascaris fica mais fácil quando você repete a sequência: ovo embrionado é ingerido, a larva passa pelo pulmão, o adulto vive no intestino e o diagnóstico clássico aparece pelos ovos nas fezes."
                  }
                ],
                casosClinicos: [
                  
                  {
                    q: "Menino de 8 anos, morador de uma comunidade sem rede de esgoto, é atendido por dor abdominal recorrente, inapetência e distensão leve. A mãe relata que, duas semanas antes, ele teve tosse seca, chiado discreto e cansaço, sem febre alta. Hemograma mostra eosinofilia. O exame parasitológico de fezes identifica ovos de helminto compatíveis com nematódeo intestinal. Qual alternativa integra melhor o agente, a forma infectante e o ciclo?",
                    alts: ["Ascaris lumbricoides; ingestão de ovos embrionados; migração larvária pulmonar; adultos no intestino delgado", "Ancylostoma duodenale; ingestão de larvas rabditoides; adultos no cólon; anemia por toxina", "Schistosoma mansoni; ingestão de cercárias; adultos no intestino delgado; ovos na urina", "Taenia solium; ingestão de cisticercos; adultos no pulmão; ovos no escarro", "Enterobius vermicularis; penetração cutânea; migração pulmonar obrigatória; ovos nas fezes"],
                    correct: 0,
                    comments: [
                      "Correta. O conjunto saneamento precário, provável ingestão fecal-oral, tosse prévia, eosinofilia e ovos nas fezes fecha Ascaris.",
                      "Errada. Ancylostoma é mais lembrado por larva filariforme penetrando a pele e anemia por espoliação sanguínea.",
                      "Errada. Schistosoma envolve cercária penetrando a pele em água doce, não ingestão de cercárias.",
                      "Errada. Taenia solium causa teníase por cisticerco na carne e cisticercose por ovos, mas o adulto não vive no pulmão.",
                      "Errada. Enterobius é clássico por prurido anal noturno e teste da fita gomada, não por penetração cutânea."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Junte as pistas: criança, saneamento precário, fase respiratória transitória, eosinofilia e ovos nas fezes. Esse padrão une transmissão fecal-oral, migração pulmonar larvária e fase intestinal.",
                    tip: "Em caso de Ascaris, procure a sequência: ovo ingerido, pulmão, intestino, ovos nas fezes.",
                    oral: "A criança ingeriu ovos embrionados no ambiente contaminado. As larvas passaram pelos pulmões e depois retornaram ao intestino, onde os adultos produziram ovos detectáveis nas fezes."
                  },
                  {
                    q: "Criança de 6 anos chega ao pronto atendimento com cólica abdominal intensa, vômitos biliosos e distensão abdominal. A família relata que ela já eliminou vermes longos, cilíndricos e esbranquiçados nas fezes. Vive em área com esgoto a céu aberto. A hipótese é complicação por Ascaris lumbricoides. Qual mecanismo explica melhor o quadro atual?",
                    alts: ["Obstrução intestinal por grande carga de vermes adultos no lúmen do intestino delgado", "Anemia ferropriva por larvas de Ascaris sugando sangue no duodeno", "Hipertensão portal por ovos de Ascaris retidos no sistema porta", "Neurocisticercose por larvas de Ascaris no sistema nervoso central", "Colite invasiva por trofozoítos de Ascaris penetrando a mucosa"],
                    correct: 0,
                    comments: [
                      "Correta. Ascaris em alta carga pode formar massa de vermes adultos e causar obstrução intestinal, especialmente em crianças.",
                      "Errada. Anemia por sucção de sangue é mais típica de ancilostomídeos.",
                      "Errada. Hipertensão portal por ovos é raciocínio de esquistossomose mansônica.",
                      "Errada. Neurocisticercose é causada por Taenia solium, não por Ascaris.",
                      "Errada. Trofozoíto é termo de protozoários, não de Ascaris."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "O quadro é de complicação mecânica. Vermes longos cilíndricos, criança, saneamento precário e obstrução apontam para carga elevada de Ascaris no intestino.",
                    tip: "Quando aparecer obstrução intestinal em criança com vermes longos, pense em Ascaris.",
                    oral: "Na ascaridíase intensa, o problema pode deixar de ser apenas dor abdominal e virar obstrução por emaranhado de vermes adultos."
                  },
                  {
                    q: "Homem de 23 anos apresenta tosse seca, dispneia leve, infiltrado pulmonar migratório e eosinofilia. Após alguns dias, passa a relatar cólicas abdominais. Nega banho em rios ou lagoas, mas refere consumo frequente de saladas cruas mal higienizadas. Qual forma infectante melhor explica o quadro?",
                    alts: ["Ovo embrionado", "Larva filariforme", "Cercária", "Cisticerco", "Proglote gravídica"],
                    correct: 0,
                    comments: [
                      "Correta. Ovo embrionado é a forma infectante do Ascaris, compatível com saladas contaminadas e fase pulmonar.",
                      "Errada. Larva filariforme sugere Ancylostoma ou Strongyloides, geralmente com penetração cutânea.",
                      "Errada. Cercária sugere Schistosoma e exposição à água doce contaminada.",
                      "Errada. Cisticerco sugere Taenia e ingestão de carne crua ou malpassada.",
                      "Errada. Proglote é estrutura de Taenia, não a forma infectante de Ascaris."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "A exposição alimentar mal higienizada aponta para ingestão. A fase pulmonar com eosinofilia sugere migração larvária. Juntas, as pistas favorecem Ascaris por ovo embrionado.",
                    tip: "Em parasitologia, forma infectante depende da porta de entrada.",
                    oral: "O paciente provavelmente ingeriu ovos embrionados presentes em alimento contaminado. A tosse e o infiltrado transitório correspondem à fase larvária pulmonar."
                  },
                  {
                    q: "Menina de 9 anos, assintomática na maior parte do tempo, realiza exame parasitológico de fezes em triagem escolar. O laudo descreve ovos de Ascaris lumbricoides. A família pergunta como a infecção pode ter ocorrido, já que ela não come carne crua. Qual explicação é mais adequada?",
                    alts: ["Ingestão de ovos embrionados presentes em água, alimentos, solo ou mãos contaminadas", "Ingestão de cisticercos presentes em carne suína malpassada", "Penetração de cercárias pela pele durante banho em água doce", "Picada de mosquito com inoculação de larvas no sangue", "Ingestão de proglotes presentes em carne bovina crua"],
                    correct: 0,
                    comments: [
                      "Correta. A infecção por Ascaris ocorre por ingestão de ovos embrionados em contexto fecal-oral.",
                      "Errada. Cisticerco em carne suína é relacionado à Taenia solium.",
                      "Errada. Cercárias pela pele indicam Schistosoma.",
                      "Errada. Mosquito não participa do ciclo de Ascaris.",
                      "Errada. Proglotes são estruturas de Taenia e não são ingeridas dessa forma."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "O caso mostra uma dúvida comum: não é preciso carne crua para Ascaris. A transmissão é fecal-oral por ovos embrionados.",
                    tip: "Quando o caso nega carne crua, não force Taenia. Pense em ovos no ambiente.",
                    oral: "Ascaris é adquirido pela boca, mas não por carne. A fonte pode ser água, alimento ou mãos contaminadas por ovos embrionados."
                  },
                  {
                    q: "Menino de 10 anos apresenta prurido anal noturno intenso. Na mesma casa, sua irmã de 7 anos tem dor abdominal, história de tosse seca há 10 dias, eosinofilia e parasitológico de fezes com ovos de Ascaris. Qual alternativa compara corretamente os quadros?",
                    alts: ["O menino sugere Enterobius vermicularis; a irmã sugere Ascaris lumbricoides", "O menino sugere Ascaris lumbricoides; a irmã sugere Enterobius vermicularis", "Ambos sugerem Schistosoma mansoni por penetração de cercárias", "Ambos sugerem Taenia solium por ingestão de cisticercos", "Ambos sugerem Ancylostoma duodenale por anemia intensa"],
                    correct: 0,
                    comments: [
                      "Correta. Prurido anal noturno é clássico de Enterobius; tosse prévia, eosinofilia e ovos nas fezes favorecem Ascaris.",
                      "Errada. A alternativa inverte os quadros.",
                      "Errada. Schistosoma exigiria exposição à água com cercárias e outro padrão clínico.",
                      "Errada. Taenia solium não explica prurido anal noturno nem ciclo pulmonar de Ascaris.",
                      "Errada. Ancylostoma é mais ligado a penetração cutânea e anemia por espoliação."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Compare pistas específicas: prurido anal noturno aponta Enterobius; fase pulmonar e ovos nas fezes apontam Ascaris.",
                    tip: "Não trate todos os helmintos intestinais como iguais.",
                    oral: "Dois parasitas podem circular no mesmo ambiente, mas cada um deixa pistas próprias. Enterobius é perianal; Ascaris é fecal-oral com fase pulmonar."
                  },
                  {
                    q: "Adolescente de 13 anos apresenta dor abdominal e náuseas. O parasitológico de fezes mostra ovos de Ascaris. Ao revisar a história, relata que consumia verduras de horta irrigada com água contaminada. Qual medida preventiva tem maior relação com o ciclo desse parasita?",
                    alts: ["Saneamento básico, lavagem das mãos e higienização adequada dos alimentos", "Uso de repelente para evitar vetor hematófago", "Evitar exclusivamente carne bovina malpassada", "Evitar apenas banho em lagoas com caramujos", "Rastreamento de contatos por fita gomada como principal ação"],
                    correct: 0,
                    comments: [
                      "Correta. A prevenção de Ascaris bloqueia a transmissão fecal-oral por ovos embrionados.",
                      "Errada. Não há vetor hematófago no ciclo de Ascaris.",
                      "Errada. Carne bovina malpassada sugere Taenia saginata.",
                      "Errada. Lagoas com caramujos sugerem Schistosoma.",
                      "Errada. Fita gomada é mais usada para Enterobius."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "A prevenção precisa atuar sobre a via de transmissão. Como Ascaris depende de contaminação fecal do ambiente, saneamento e higiene são centrais.",
                    tip: "Prevenção correta é aquela que corta o ciclo correto.",
                    oral: "Se o ovo chega à boca por água, alimento ou mãos contaminadas, a prevenção é saneamento, higiene e lavagem adequada dos alimentos."
                  },
                  {
                    q: "Paciente de 28 anos tem anemia ferropriva importante, fraqueza e história de andar descalço em solo úmido. Outro paciente da mesma região apresenta dor abdominal, tosse prévia, eosinofilia e ovos de Ascaris nas fezes. Qual característica diferencia melhor o primeiro quadro do segundo?",
                    alts: ["Penetração cutânea por larvas e anemia por espoliação sanguínea", "Ingestão de ovos embrionados e migração pulmonar", "Ovos de Ascaris no parasitológico de fezes", "Obstrução intestinal por vermes adultos", "Transmissão fecal-oral por hortaliças contaminadas"],
                    correct: 0,
                    comments: [
                      "Correta. Penetração pela pele e anemia ferropriva importante favorecem ancilostomídeos, não Ascaris.",
                      "Errada. Essa descrição favorece Ascaris.",
                      "Errada. Ovos de Ascaris favorecem o segundo quadro.",
                      "Errada. Obstrução por vermes adultos é complicação de Ascaris.",
                      "Errada. Transmissão fecal-oral por hortaliças favorece Ascaris."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "A pergunta quer diferenciar dois helmintos. O primeiro tem pele e anemia; o segundo tem ingestão, pulmão e ovos de Ascaris.",
                    tip: "Se a questão destacar anemia por perda sanguínea e pé descalço, pense em Ancylostoma ou Necator.",
                    oral: "Ascaris pode causar dor abdominal e obstrução; ancilostomídeos se destacam por penetração cutânea e anemia."
                  },
                  {
                    q: "Criança de 5 anos, com hábito de levar as mãos sujas à boca, apresenta dor abdominal leve. A mãe relata que a criança brinca em solo contaminado próximo a esgoto. O exame de fezes confirma Ascaris lumbricoides. Qual etapa ambiental é necessária para que os ovos eliminados se tornem infectantes?",
                    alts: ["Embrionamento do ovo no ambiente", "Transformação do ovo em cercária dentro de caramujo", "Encistamento do ovo na musculatura bovina", "Multiplicação do ovo em mosquito", "Formação de proglote no solo"],
                    correct: 0,
                    comments: [
                      "Correta. O ovo de Ascaris precisa embrionar no ambiente para se tornar infectante.",
                      "Errada. Cercária e caramujo são de Schistosoma.",
                      "Errada. Musculatura bovina e cisticerco são de Taenia saginata.",
                      "Errada. Mosquito não participa do ciclo de Ascaris.",
                      "Errada. Proglote é estrutura de Taenia, não etapa de Ascaris."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "A pista é que o ovo sai nas fezes, mas precisa amadurecer fora do corpo. Esse amadurecimento é o embrionamento.",
                    tip: "Não confunda ovo eliminado com ovo infectante.",
                    oral: "O ciclo depende do ambiente: o ovo eliminado nas fezes precisa embrionar para conseguir infectar outra pessoa."
                  },
                  {
                    q: "Paciente de 30 anos retorna de viagem a zona rural com dor abdominal, tosse transitória e eosinofilia. O médico suspeita de ascaridíase. Qual achado confirmaria de forma mais clássica a hipótese na fase intestinal estabelecida?",
                    alts: ["Ovos de Ascaris no exame parasitológico de fezes", "Plasmodium em gota espessa", "Ovos perianais no teste da fita gomada", "Cisticercos em biópsia muscular", "Cercárias em amostra de sangue periférico"],
                    correct: 0,
                    comments: [
                      "Correta. O diagnóstico clássico de Ascaris é identificação de ovos nas fezes.",
                      "Errada. Gota espessa é exame para malária.",
                      "Errada. Fita gomada é mais associada a Enterobius.",
                      "Errada. Cisticercos são relacionados à Taenia.",
                      "Errada. Cercárias não são achado de Ascaris no sangue."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "O adulto de Ascaris vive no intestino e produz ovos eliminados nas fezes. Por isso o exame clássico acompanha a biologia do parasita.",
                    tip: "Associe o local do adulto ao exame.",
                    oral: "Se o adulto está no intestino, faz sentido procurar ovos nas fezes. Esse é o caminho clássico do diagnóstico."
                  },
                  {
                    q: "Criança de 7 anos apresenta tosse seca, infiltrado pulmonar transitório e eosinofilia. Dias depois, surge dor abdominal. A família nega contato com rios, mas relata consumo de água não filtrada e verduras mal lavadas. Qual alternativa contém a melhor interpretação do quadro?",
                    alts: ["Ascaridíase com fase pulmonar larvária seguida de fase intestinal", "Esquistossomose aguda por ingestão de cercárias em água contaminada", "Teníase por ingestão de ovos embrionados de Taenia saginata em verduras", "Enterobíase com migração obrigatória pelo pulmão", "Malária intestinal por ovos eliminados nas fezes"],
                    correct: 0,
                    comments: [
                      "Correta. O padrão respiratório transitório, eosinofilia e exposição fecal-oral indicam Ascaris.",
                      "Errada. Schistosoma infecta por cercária penetrando a pele em água, não por ingestão.",
                      "Errada. Taenia saginata se relaciona a carne bovina; ovos de Taenia solium causam cisticercose, não esse ciclo pulmonar.",
                      "Errada. Enterobius não tem migração pulmonar obrigatória.",
                      "Errada. Malária não é intestinal nem diagnosticada por ovos nas fezes."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "A negativa de rios enfraquece Schistosoma. Água não filtrada e verduras mal lavadas fortalecem ingestão de ovos embrionados.",
                    tip: "Quando o caso traz uma exposição negada, use isso para eliminar alternativas.",
                    oral: "O caso combina pulmão e intestino em sequência. Em Ascaris, isso é esperado pela migração larvária."
                  },
                  {
                    q: "Mulher de 34 anos relata eliminação de verme longo nas fezes após episódio de dor abdominal. Tem histórico de consumo de alimentos crus mal lavados. O parasitológico confirma Ascaris. Qual alternativa está correta sobre a localização das fases do parasita?",
                    alts: ["A larva pode passar pelos pulmões, mas o verme adulto vive no intestino delgado", "O verme adulto vive nos pulmões e os ovos são eliminados pelo escarro", "A larva permanece no estômago e o adulto vive no sangue", "O cisticerco vive no intestino e o adulto vive no cérebro", "A cercária vive nas fezes e o adulto vive no caramujo"],
                    correct: 0,
                    comments: [
                      "Correta. Essa alternativa diferencia corretamente fase larvária pulmonar e fase adulta intestinal.",
                      "Errada. O adulto não vive nos pulmões.",
                      "Errada. Não é o ciclo de Ascaris.",
                      "Errada. Cisticerco e cérebro remetem à Taenia solium.",
                      "Errada. Cercária e caramujo remetem a Schistosoma."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Não confunda passagem pulmonar com moradia definitiva. O local final do adulto é o intestino delgado.",
                    tip: "Pulmão é passagem; intestino é fase adulta.",
                    oral: "Essa distinção é essencial: a larva migra, o adulto se estabelece no intestino."
                  },
                  {
                    q: "Menino de 4 anos com ascaridíase intensa evolui com vômitos, distensão abdominal e parada de eliminação de fezes. O exame de imagem sugere obstrução por massa intraluminal. Qual alternativa apresenta uma explicação coerente?",
                    alts: ["Emaranhado de vermes adultos de Ascaris formando obstrução mecânica", "Ovos de Ascaris formando granulomas no sistema porta", "Cercárias de Ascaris bloqueando vasos mesentéricos", "Cisticercos de Ascaris comprimindo o intestino externamente", "Trofozoítos de Ascaris invadindo a mucosa colônica"],
                    correct: 0,
                    comments: [
                      "Correta. Alta carga de vermes adultos pode formar massa intraluminal e obstruir o intestino.",
                      "Errada. Granulomas periovulares no sistema porta são de Schistosoma.",
                      "Errada. Ascaris não tem cercária.",
                      "Errada. Ascaris não forma cisticerco.",
                      "Errada. Ascaris não tem trofozoíto."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "O quadro obstrutivo decorre de mecanismo mecânico, não de toxina ou granuloma.",
                    tip: "Em alta carga, pense em bolo de vermes.",
                    oral: "Na criança pequena, muitos Ascaris adultos no intestino podem se comportar como uma obstrução física."
                  },
                  {
                    q: "Paciente com eosinofilia e dor abdominal recebe hipótese de Ascaris. Entre as alternativas abaixo, qual seria uma pegadinha por misturar característica verdadeira de outro parasita?",
                    alts: ["Cercárias penetram a pele em água doce e causam o quadro intestinal de Ascaris", "Ovos embrionados podem ser ingeridos em alimentos contaminados", "Larvas podem passar pelos pulmões antes do retorno ao intestino", "O exame parasitológico de fezes pode mostrar ovos", "Alta carga parasitária pode causar obstrução intestinal"],
                    correct: 0,
                    comments: [
                      "Correta. Cercárias em água doce pertencem ao ciclo do Schistosoma, não ao Ascaris.",
                      "Errada. Verdadeiro para Ascaris.",
                      "Errada. Verdadeiro para Ascaris.",
                      "Errada. Verdadeiro para Ascaris.",
                      "Errada. Verdadeiro para Ascaris em infecção intensa."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "A alternativa errada é sedutora porque é parasitologia verdadeira, mas de outro parasita.",
                    tip: "Cercária é palavra proibida para Ascaris.",
                    oral: "Em prova, não basta a alternativa ser biologicamente bonita. Ela precisa pertencer ao agente do caso."
                  },
                  {
                    q: "Criança de 9 anos com baixa condição sanitária apresenta dor abdominal. No mesmo mês, teve tosse com infiltrado pulmonar transitório e eosinofilia. O exame de fezes mostra ovos de Ascaris. Qual complicação deve ser monitorada em infecções intensas?",
                    alts: ["Obstrução intestinal", "Neurocisticercose", "Hipertensão portal esquistossomótica", "Febre terçã malárica", "Endocardite por coco Gram-positivo"],
                    correct: 0,
                    comments: [
                      "Correta. Infecções intensas por Ascaris podem causar obstrução intestinal.",
                      "Errada. Neurocisticercose é Taenia solium.",
                      "Errada. Hipertensão portal é complicação de Schistosoma mansoni.",
                      "Errada. Febre terçã é associada à malária.",
                      "Errada. Endocardite por coco Gram-positivo é bacteriologia, não Ascaris."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "O caso já fechou Ascaris. A complicação clássica em alta carga é obstrução intestinal.",
                    tip: "Depois de reconhecer o agente, pense nas complicações próprias dele.",
                    oral: "Ascaris adulto vive no intestino. Em grande número, pode obstruir a luz intestinal."
                  },
                  {
                    q: "Paciente apresenta quadro intestinal leve e parasitológico positivo para Ascaris. O colega estranha a ausência de sintomas importantes. Qual alternativa explica melhor essa situação?",
                    alts: ["A ascaridíase pode ser assintomática ou leve, dependendo da carga parasitária", "Ascaris sempre causa obstrução intestinal grave", "O achado de ovos nas fezes sempre indica neurocisticercose", "Ausência de sintomas exclui helmintíase", "Ascaris só causa doença se houver penetração cutânea"],
                    correct: 0,
                    comments: [
                      "Correta. Muitas infecções por Ascaris podem ser leves ou assintomáticas.",
                      "Errada. Obstrução ocorre em casos intensos, não em todos.",
                      "Errada. Neurocisticercose é causada por Taenia solium.",
                      "Errada. Helmintíase pode ser assintomática.",
                      "Errada. Ascaris não penetra pela pele."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Nem toda infecção tem quadro exuberante. A carga parasitária influencia sintomas e complicações.",
                    tip: "Não confunda presença do parasita com gravidade obrigatória.",
                    oral: "O exame pode detectar Ascaris mesmo quando o quadro clínico é discreto."
                  },
                  {
                    q: "Lactente maior, morador de área sem saneamento, apresenta dor abdominal, tosse prévia, eosinofilia e ovos de Ascaris no exame de fezes. Qual alternativa melhor diferencia o diagnóstico de malária?",
                    alts: ["Ascaris é helminto intestinal com ovos nas fezes; malária é hemoparasitose diagnosticada por exame de sangue", "Ascaris e malária são transmitidos por ingestão de ovos embrionados", "Malária causa ovos nas fezes, e Ascaris parasita hemácias", "Ascaris é transmitido por Anopheles, e malária por alimento contaminado", "Ambas são diagnosticadas preferencialmente por fita gomada"],
                    correct: 0,
                    comments: [
                      "Correta. A diferença entre parasitose intestinal e hemoparasitose está correta.",
                      "Errada. Malária não é transmitida por ovos.",
                      "Errada. Está invertido e errado.",
                      "Errada. Está invertido.",
                      "Errada. Fita gomada é Enterobius."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Use o material do exame como pista: fezes para Ascaris, sangue para malária.",
                    tip: "Quando alternativas misturam exames, elimine pelo método diagnóstico.",
                    oral: "Ascaris pertence ao raciocínio de intestino e fezes; malária pertence ao raciocínio de sangue e vetor."
                  },
                  {
                    q: "Criança com dor abdominal e eosinofilia mora em área sem saneamento. O parasitológico inicial vem negativo, mas a suspeita de parasitose intestinal permanece. Qual conduta diagnóstica é mais coerente com a lógica do exame parasitológico?",
                    alts: ["Solicitar amostras seriadas de fezes para aumentar a chance de detecção de ovos", "Trocar imediatamente para gota espessa como exame específico de Ascaris", "Usar fita gomada como exame principal para Ascaris", "Pesquisar coagulase positiva em cultura de fezes", "Diagnosticar apenas por radiografia de tórax"],
                    correct: 0,
                    comments: [
                      "Correta. A eliminação de ovos pode variar, e amostras seriadas aumentam a sensibilidade.",
                      "Errada. Gota espessa é para malária.",
                      "Errada. Fita gomada é mais associada a Enterobius.",
                      "Errada. Coagulase é termo bacteriano.",
                      "Errada. Radiografia pode mostrar achados pulmonares, mas não é diagnóstico específico de Ascaris."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Se o exame depende de encontrar ovos nas fezes, repetir amostras pode ajudar.",
                    tip: "Exame negativo isolado não anula uma suspeita bem construída.",
                    oral: "O parasitológico é uma busca por formas eliminadas. Como essa eliminação pode variar, amostras seriadas fazem sentido."
                  },
                  {
                    q: "Menino de 12 anos, com dor abdominal e eliminação de verme cilíndrico, apresenta também história de geofagia. O exame confirma Ascaris. Qual detalhe do hábito relatado ajuda a explicar a infecção?",
                    alts: ["Ingestão de solo contaminado por ovos embrionados", "Ingestão de cisticercos presentes em terra úmida", "Penetração de cercárias pela mucosa oral", "Inoculação de larvas por mosquito do solo", "Absorção cutânea de ovos pela planta dos pés"],
                    correct: 0,
                    comments: [
                      "Correta. Solo contaminado por fezes pode conter ovos embrionados de Ascaris.",
                      "Errada. Cisticercos não são adquiridos pelo solo.",
                      "Errada. Cercárias não penetram mucosa oral nesse ciclo.",
                      "Errada. Mosquito não participa.",
                      "Errada. Ovos de Ascaris não entram pela planta dos pés."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Geofagia é uma pista de ingestão de material ambiental contaminado.",
                    tip: "Solo contaminado conversa com ovos de Ascaris.",
                    oral: "O hábito de comer terra aumenta o risco de ingerir ovos embrionados presentes em ambiente contaminado por fezes."
                  },
                  {
                    q: "Paciente de 40 anos com dor em hipocôndrio direito, náuseas e história recente de eliminação de Ascaris nas fezes evolui com suspeita de complicação biliar. Qual mecanismo é possível nesse contexto?",
                    alts: ["Migração ectópica de verme adulto para vias biliares", "Formação de cisticercos de Ascaris na vesícula", "Deposição de ovos com espinho lateral no fígado", "Invasão de hemácias por larvas adultas", "Produção de toxina coagulase positiva pelo verme"],
                    correct: 0,
                    comments: [
                      "Correta. Ascaris adulto pode migrar para vias biliares ou pancreáticas, causando complicações.",
                      "Errada. Ascaris não forma cisticercos.",
                      "Errada. Ovos com espinho lateral são de Schistosoma mansoni.",
                      "Errada. Invasão de hemácias é malária.",
                      "Errada. Coagulase positiva é bacteriologia."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Embora a obstrução intestinal seja mais clássica, a migração do adulto pode causar complicações biliares.",
                    tip: "Em questão mais avançada, lembre de migração ectópica do verme adulto.",
                    oral: "Ascaris adulto é intestinal, mas pode migrar para ductos, gerando quadros biliares ou pancreáticos."
                  },
                  {
                    q: "Criança apresenta dor abdominal e ovos de Ascaris nas fezes. A alternativa do exame diz: 'forma infectante: ovo encontrado nas fezes imediatamente após eliminação'. Qual é o erro dessa afirmação?",
                    alts: ["O ovo precisa embrionar no ambiente para se tornar infectante", "Ascaris não elimina ovos nas fezes", "A forma infectante é sempre cisticerco", "A forma infectante é sempre cercária", "O diagnóstico correto é apenas por hemocultura"],
                    correct: 0,
                    comments: [
                      "Correta. O ovo eliminado precisa amadurecer no ambiente antes de se tornar infectante.",
                      "Errada. Ascaris pode eliminar ovos nas fezes.",
                      "Errada. Cisticerco é Taenia.",
                      "Errada. Cercária é Schistosoma.",
                      "Errada. Hemocultura não é diagnóstico de Ascaris."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "A afirmação é sutil: ela acerta o ovo, mas erra o momento de infectividade.",
                    tip: "Palavras como 'imediatamente' podem transformar uma alternativa em errada.",
                    oral: "O ovo recém-eliminado não é a forma infectante clássica. Ele precisa embrionar no ambiente."
                  },
                  {
                    q: "Mulher de 29 anos apresenta tosse, eosinofilia e dor abdominal após período em zona rural. Nega consumo de carne crua, mas relata comer verduras cruas de produção local. Qual alternativa mais provavelmente estaria errada se o caso fosse Ascaris?",
                    alts: ["O quadro foi causado por ingestão de cisticercos em carne suína", "A transmissão pode ter ocorrido por ovos embrionados em alimentos contaminados", "A tosse pode ser explicada por migração larvária pulmonar", "O exame de fezes pode identificar ovos", "A prevenção envolve higienização de alimentos e saneamento"],
                    correct: 0,
                    comments: [
                      "Correta. Cisticercos em carne suína indicam Taenia solium, não Ascaris.",
                      "Errada. Compatível com Ascaris.",
                      "Errada. Compatível com Ascaris.",
                      "Errada. Compatível com Ascaris.",
                      "Errada. Compatível com Ascaris."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "A negação de carne crua e a presença de verduras contaminadas afastam Taenia e favorecem Ascaris.",
                    tip: "Quando uma alternativa traz carne e cisticerco, confira se o caso realmente fala de Taenia.",
                    oral: "Ascaris entra por ovo embrionado em ambiente contaminado. Carne com cisticerco é outro ciclo."
                  },
                  {
                    q: "Criança de 3 anos com saneamento precário apresenta dor abdominal e eliminação de vermes. A mãe relata que os sintomas começaram depois de um período de tosse e febre baixa. Qual alternativa explica melhor a presença de manifestações respiratórias no ciclo do agente provável?",
                    alts: ["Migração de larvas pelos pulmões antes da maturação intestinal", "Adultos de Ascaris vivendo permanentemente nos brônquios", "Ovos de Ascaris eclodindo nos alvéolos e sendo eliminados no escarro", "Cisticercos de Ascaris obstruindo bronquíolos", "Cercárias de Ascaris penetrando a pele e migrando ao coração"],
                    correct: 0,
                    comments: [
                      "Correta. A fase pulmonar larvária explica tosse e sintomas respiratórios transitórios.",
                      "Errada. O adulto vive no intestino, não nos brônquios.",
                      "Errada. Ovos não eclodem nos alvéolos nesse ciclo.",
                      "Errada. Ascaris não forma cisticercos.",
                      "Errada. Ascaris não tem cercárias."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Não interprete sintoma respiratório como adulto pulmonar. É a larva que passa pelo pulmão.",
                    tip: "Pulmão no Ascaris é uma fase de passagem.",
                    oral: "A larva usa o pulmão no ciclo. Depois ela é deglutida e retorna ao intestino para maturar."
                  },
                  {
                    q: "Paciente com suspeita de parasitose intestinal traz cinco alternativas de diagnóstico diferencial. Qual conjunto de dados favorece Ascaris lumbricoides acima dos demais?",
                    alts: ["Saneamento precário, ingestão provável de ovos, tosse transitória, eosinofilia e ovos nas fezes", "Banho em água doce, cercárias, caramujo e hipertensão portal", "Carne bovina malpassada, proglotes e cestódeo segmentado", "Prurido anal noturno, irritabilidade e fita gomada positiva", "Febre periódica, calafrios e parasitas intraeritrocitários"],
                    correct: 0,
                    comments: [
                      "Correta. Esse conjunto fecha Ascaris.",
                      "Errada. Esse conjunto sugere Schistosoma.",
                      "Errada. Esse conjunto sugere Taenia saginata.",
                      "Errada. Esse conjunto sugere Enterobius.",
                      "Errada. Esse conjunto sugere malária."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Cada alternativa é um diagnóstico em pacote. Escolha o pacote que pertence ao Ascaris.",
                    tip: "Leia a alternativa inteira, não apenas uma palavra.",
                    oral: "Ascaris tem uma assinatura: ovo ingerido, pulmão, intestino e ovos nas fezes."
                  },
                  {
                    q: "Criança com ascaridíase apresenta eosinofilia. Qual explicação imunoparasitológica é mais adequada para esse achado no contexto do ciclo?",
                    alts: ["Resposta associada à migração tecidual de larvas de helmintos", "Produção de toxina bacteriana por cocos Gram-positivos", "Ruptura cíclica de hemácias por Plasmodium", "Formação de imunocomplexos por vírus respiratório", "Coagulase positiva produzida pelo verme adulto"],
                    correct: 0,
                    comments: [
                      "Correta. Helmintos com migração tecidual podem cursar com eosinofilia.",
                      "Errada. Cocos Gram-positivos são bactérias, não Ascaris.",
                      "Errada. Ruptura de hemácias é raciocínio de malária.",
                      "Errada. Não é a melhor explicação para o ciclo do Ascaris.",
                      "Errada. Coagulase é enzima bacteriana."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Conecte eosinofilia a helmintos e migração larvária.",
                    tip: "Não misture mecanismos de microbiologia bacteriana com helmintologia.",
                    oral: "No Ascaris, a eosinofilia ganha sentido durante a passagem larvária por tecidos, especialmente pulmões."
                  },
                  {
                    q: "Menino de 11 anos é avaliado por dor abdominal e baixo ganho ponderal. Exame de fezes confirma Ascaris. Qual alternativa descreve corretamente a classificação morfológica do agente e ajuda a diferenciá-lo de Taenia?",
                    alts: ["Ascaris é nematódeo cilíndrico; Taenia é cestódeo achatado e segmentado", "Ascaris é cestódeo segmentado; Taenia é nematódeo cilíndrico", "Ascaris é protozoário flagelado; Taenia é bactéria", "Ascaris é trematódeo; Taenia é fungo dimórfico", "Ascaris é bactéria Gram-positiva; Taenia é vírus"],
                    correct: 0,
                    comments: [
                      "Correta. Ascaris é nematódeo; Taenia é cestódeo.",
                      "Errada. Está invertido.",
                      "Errada. Ambos não são assim classificados.",
                      "Errada. Classificação incorreta.",
                      "Errada. Classificação completamente incorreta."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Classificação ajuda a eliminar alternativas absurdas e a diferenciar helmintos.",
                    tip: "Guarde: Ascaris cilíndrico; Taenia achatada e segmentada.",
                    oral: "O caso é Ascaris, mas a prova pode cobrar a base morfológica para separar nematódeos de cestódeos."
                  },
                  {
                    q: "Paciente com dor abdominal e eosinofilia relata banho recente em lagoa com caramujos e também consumo de verduras mal lavadas. O exame de fezes posteriormente identifica ovos de Ascaris. Qual alternativa explica por que o resultado favorece Ascaris apesar da história de lagoa?",
                    alts: ["O achado de ovos de Ascaris nas fezes, associado à ingestão possível de ovos embrionados, fecha ascaridíase", "Todo contato com lagoa fecha Ascaris por cercárias", "Caramujos são hospedeiros intermediários obrigatórios de Ascaris", "Verduras mal lavadas transmitem cisticercos de Taenia", "Ovos de Ascaris indicam esquistossomose porque todos os ovos têm espinho lateral"],
                    correct: 0,
                    comments: [
                      "Correta. O exame identificou ovos de Ascaris e a ingestão por verduras contaminadas é compatível.",
                      "Errada. Cercárias em lagoa sugerem Schistosoma, não Ascaris.",
                      "Errada. Caramujos são relevantes para Schistosoma, não Ascaris.",
                      "Errada. Verduras mal lavadas podem transmitir ovos de Ascaris, não cisticercos de Taenia.",
                      "Errada. Ovos de Ascaris não são ovos de Schistosoma."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Histórias podem ter exposições misturadas. O exame e o ciclo precisam ser compatíveis.",
                    tip: "Não deixe uma exposição chamativa apagar a pista diagnóstica.",
                    oral: "O caso tem lagoa para confundir, mas o exame e a via alimentar sustentam Ascaris."
                  },
                  {
                    q: "Criança com diagnóstico de ascaridíase tem tosse na fase inicial e, semanas depois, dor abdominal. Qual alternativa representa a ordem mais coerente dos eventos após a ingestão da forma infectante?",
                    alts: ["Eclosão no intestino, migração larvária pulmonar, deglutição, maturação no intestino delgado", "Penetração pela pele, maturação no cólon, eliminação de cercárias nas fezes", "Ingestão de cisticerco, fase adulta no pulmão, ovos no escarro", "Picada de mosquito, invasão de hemácias, eliminação de ovos nas fezes", "Ovos perianais, teste da fita, adulto nos brônquios"],
                    correct: 0,
                    comments: [
                      "Correta. Essa ordem resume o ciclo do Ascaris após ingestão do ovo embrionado.",
                      "Errada. Mistura penetração cutânea e cercária, não Ascaris.",
                      "Errada. Cisticerco é Taenia e adulto pulmonar está errado.",
                      "Errada. É raciocínio de malária, não Ascaris.",
                      "Errada. Mistura Enterobius com erro de localização."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "A questão exige ordem, não apenas conceitos soltos. O ciclo tem sequência lógica.",
                    tip: "Transforme o ciclo em história com começo, meio e fim.",
                    oral: "O ovo entra, a larva eclode, migra, passa pelo pulmão, é deglutida e retorna ao intestino."
                  },
                  {
                    q: "Paciente com dor abdominal, eosinofilia e parasitológico positivo para Ascaris recebe uma alternativa que diz: 'o tratamento deve ser antibacteriano porque se trata de coco Gram-positivo intestinal'. Qual é o principal erro conceitual?",
                    alts: ["Ascaris é helminto nematódeo, não bactéria Gram-positiva", "Ascaris é vírus de transmissão respiratória", "Ascaris é protozoário intracelular obrigatório", "Ascaris é fungo dimórfico", "Ascaris é bactéria anaeróbia produtora de toxina alimentar"],
                    correct: 0,
                    comments: [
                      "Correta. Ascaris é um helminto nematódeo.",
                      "Errada. Não é vírus.",
                      "Errada. Não é protozoário intracelular.",
                      "Errada. Não é fungo.",
                      "Errada. Não é bactéria anaeróbia."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Antes de pensar em tratamento ou mecanismo, classifique o agente corretamente.",
                    tip: "Quando a alternativa usa termos bacterianos em helminto, desconfie.",
                    oral: "Ascaris é verme. Coagulase, Gram e cocos pertencem ao raciocínio de bacteriologia, não ao de helmintos."
                  },
                  {
                    q: "Em uma criança com dor abdominal e alta carga de Ascaris, a equipe suspeita de obstrução. Qual dado adicional reforçaria mais essa complicação?",
                    alts: ["Vômitos, distensão abdominal e parada de eliminação de fezes ou gases", "Prurido anal noturno isolado", "Febre periódica com calafrios a cada 48 horas", "Crises convulsivas por lesão cística cerebral", "Lesão cutânea no local de picada de flebotomíneo"],
                    correct: 0,
                    comments: [
                      "Correta. Vômitos, distensão e parada de eliminação sugerem obstrução intestinal.",
                      "Errada. Prurido anal sugere Enterobius.",
                      "Errada. Febre periódica sugere malária.",
                      "Errada. Lesão cística cerebral sugere neurocisticercose.",
                      "Errada. Flebotomíneo sugere leishmaniose."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "Complicação intestinal obstrutiva tem sinais de obstrução, não apenas dor leve.",
                    tip: "Alta carga de Ascaris pode transformar parasitose em abdome agudo obstrutivo.",
                    oral: "Quando o intestino obstrui, aparecem vômitos, distensão e parada de eliminação. Em Ascaris intenso, isso pode ocorrer por massa de vermes."
                  },
                  {
                    q: "Paciente apresenta dor abdominal e exame de fezes com ovos de Ascaris. Ao ser questionado, relata que usa água de poço e não higieniza verduras. Qual alternativa descreve corretamente a relação entre epidemiologia e ciclo?",
                    alts: ["A contaminação fecal do ambiente permite que ovos embrionados cheguem à água e aos alimentos", "A água de poço transmite Ascaris por cercárias que penetram a pele", "Verduras transmitem Ascaris por cisticercos aderidos às folhas", "A água transmite Ascaris por mosquitos aquáticos", "A falta de higiene transforma proglotes em ovos de Schistosoma"],
                    correct: 0,
                    comments: [
                      "Correta. A transmissão fecal-oral por ovos embrionados explica a relação com água e alimentos contaminados.",
                      "Errada. Cercária é Schistosoma.",
                      "Errada. Cisticerco é Taenia, não Ascaris.",
                      "Errada. Mosquitos não participam do ciclo.",
                      "Errada. Proglotes são de Taenia e não viram ovos de Schistosoma."
                    ],
                    traps: [
                      {erro:"Escolher a alternativa por uma palavra isolada.", verdade:"A alternativa correta precisa explicar exposição, forma infectante, ciclo, clínica e exame.", revisao:"Em caso clínico, uma palavra pode ser verdadeira, mas pertencer a outro parasita."},
                      {erro:"Trocar a forma infectante.", verdade:"Ascaris lumbricoides infecta pela ingestão de ovo embrionado.", revisao:"Larva filariforme lembra Ancylostoma ou Strongyloides; cercária lembra Schistosoma; cisticerco lembra Taenia."},
                      {erro:"Ignorar a fase pulmonar.", verdade:"A larva de Ascaris pode migrar pelos pulmões antes de retornar ao intestino.", revisao:"Tosse, sibilância, infiltrado transitório e eosinofilia podem ser pistas de migração larvária."},
                      {erro:"Confundir diagnóstico com transmissão.", verdade:"Transmissão é por ingestão de ovo embrionado; diagnóstico clássico é por ovos nas fezes.", revisao:"Separe o que entra no corpo do que o exame encontra."},
                      {erro:"Marcar uma alternativa parcialmente correta.", verdade:"Alternativa parcialmente correta continua errada se não fecha o caso todo.", revisao:"A opção certa precisa combinar com todas as pistas do enunciado."}
                    ],
                    clinicalReasoning: "O contexto epidemiológico só faz sentido quando conectado ao ciclo do parasita.",
                    tip: "Saneamento precário é pista porque permite contaminação por ovos.",
                    oral: "Ascaris circula quando ovos eliminados nas fezes contaminam água, solo ou alimentos e depois são ingeridos."
                  }
                
                ],
                flashcards: [
                  ["1. Qual é o agente etiológico da ascaridíase?", "Ascaris lumbricoides, um helminto nematódeo intestinal."],
                  ["2. Ascaris lumbricoides é platelminto ou nematódeo?", "Nematódeo. É um verme cilíndrico, diferente dos platelmintos, que são achatados."],
                  ["3. Qual é a frase de ouro para fixar Ascaris?", "Ascaris entra como ovo embrionado, passa pelo pulmão e vira adulto no intestino delgado."],
                  ["4. Qual é a forma infectante do Ascaris lumbricoides?", "Ovo embrionado. Essa é uma das informações mais cobradas em prova."],
                  ["5. Qual é a forma diagnóstica mais clássica na ascaridíase?", "Ovos nas fezes, identificados no exame parasitológico de fezes."],
                  ["6. Qual é a diferença entre forma infectante e forma diagnóstica?", "Infectante é o ovo embrionado ingerido. Diagnóstica é o ovo encontrado nas fezes."],
                  ["7. Como ocorre a transmissão do Ascaris?", "Por via fecal-oral, pela ingestão de ovos embrionados em água, alimentos, solo ou mãos contaminadas."],
                  ["8. Ascaris lumbricoides penetra pela pele?", "Não. Essa é pegadinha clássica. Ascaris é adquirido por ingestão de ovos embrionados."],
                  ["9. Se a questão fala em larva filariforme penetrando pela pele, devo pensar em Ascaris?", "Não. Pense mais em Ancylostoma ou Strongyloides."],
                  ["10. Se a questão fala em cercária penetrando pela pele em água doce, devo pensar em quê?", "Schistosoma mansoni, não Ascaris."],
                  ["11. Se a questão fala em cisticerco na carne crua ou malpassada, devo pensar em quê?", "Taenia, não Ascaris."],
                  ["12. Ascaris precisa de hospedeiro intermediário?", "Não. O ciclo é direto e não exige hospedeiro intermediário obrigatório."],
                  ["13. Onde o verme adulto de Ascaris vive?", "No intestino delgado."],
                  ["14. O pulmão é o local definitivo do Ascaris?", "Não. O pulmão é uma fase de migração larvária. O adulto vive no intestino delgado."],
                  ["15. Qual é a sequência do ciclo do Ascaris?", "Ingestão de ovo embrionado, larva no intestino, migração pela circulação, pulmões, subida pela árvore respiratória, deglutição e retorno ao intestino."],
                  ["16. Por que Ascaris pode causar tosse ou sintomas respiratórios?", "Porque as larvas passam pelos pulmões durante o ciclo."],
                  ["17. O que é síndrome de Löeffler no contexto de Ascaris?", "Quadro pulmonar transitório relacionado à migração larvária, com tosse, infiltrados pulmonares e eosinofilia."],
                  ["18. Ascaris pode causar eosinofilia?", "Sim, especialmente na fase de migração tecidual larvária."],
                  ["19. Quais manifestações intestinais podem aparecer?", "Dor abdominal, náuseas, alteração do apetite, eliminação de vermes e, em cargas altas, obstrução intestinal."],
                  ["20. Qual complicação intestinal clássica pode cair em prova?", "Obstrução intestinal por grande carga de vermes, especialmente em crianças."],
                  ["21. Ascaris causa anemia por sugar sangue?", "Não é o mais clássico. Anemia por perda sanguínea intestinal lembra mais Ancylostoma e Necator."],
                  ["22. Ascaris faz autoinfecção como Strongyloides?", "Não. Autoinfecção é característica importante de Strongyloides stercoralis."],
                  ["23. O ovo eliminado nas fezes já é imediatamente infectante?", "Não. Ele precisa embrionar no ambiente para se tornar infectante."],
                  ["24. Que ambiente favorece a transmissão de Ascaris?", "Locais com saneamento precário, contaminação fecal do solo, água ou alimentos."],
                  ["25. Quais medidas previnem ascaridíase?", "Saneamento básico, higiene das mãos, lavagem adequada de alimentos e destino correto das fezes."],
                  ["26. Qual exame a prova geralmente espera para diagnóstico?", "Exame parasitológico de fezes com identificação de ovos."],
                  ["27. Uma única amostra negativa de fezes sempre exclui parasitose?", "Não necessariamente. Amostras seriadas podem aumentar a sensibilidade do exame."],
                  ["28. Qual é a pegadinha mais comum sobre a forma infectante?", "Trocar ovo embrionado por larva filariforme, cercária ou cisticerco."],
                  ["29. Qual é a pegadinha mais comum sobre transmissão?", "Dizer que Ascaris penetra pela pele. A transmissão correta é ingestão de ovos embrionados."],
                  ["30. Qual é a pegadinha mais comum sobre ciclo?", "Achar que, por ser verme intestinal, Ascaris não passa pelos pulmões."],
                  ["31. Qual é a pegadinha mais comum sobre diagnóstico?", "Confundir o que infecta com o que aparece no exame. Infecta como ovo embrionado; diagnostica-se por ovos nas fezes."],
                  ["32. Como diferenciar Ascaris de Ancylostoma em prova?", "Ascaris entra por ingestão de ovos. Ancylostoma entra pela pele e está associado a anemia por perda sanguínea."],
                  ["33. Como diferenciar Ascaris de Strongyloides em prova?", "Ascaris é ingestão de ovos e não faz autoinfecção clássica. Strongyloides envolve larva filariforme e pode fazer autoinfecção."],
                  ["34. Como diferenciar Ascaris de Schistosoma em prova?", "Ascaris é ingestão de ovos. Schistosoma é cercária penetrando pela pele em água contaminada."],
                  ["35. Como diferenciar Ascaris de Taenia em prova?", "Ascaris envolve ovos embrionados em contaminação fecal-oral. Taenia envolve carne com cisticerco ou ingestão de ovos, dependendo do quadro."],
                  ["36. Se o caso fala em criança, saneamento precário, dor abdominal e possível obstrução, o que pensar?", "Ascaridíase deve entrar no raciocínio, principalmente se houver pista de ingestão de ovos ou vermes intestinais."],
                  ["37. Se o caso fala em tosse, eosinofilia e depois sintomas gastrointestinais, qual raciocínio fazer?", "Pensar em migração larvária de helmintos, incluindo Ascaris lumbricoides."],
                  ["38. O que a prova da faculdade mais cobra em Ascaris?", "Forma infectante, transmissão fecal-oral, ciclo pulmonar, diagnóstico por ovos nas fezes e complicações intestinais."],
                  ["39. O que a residência médica pode cobrar sobre Ascaris?", "Raciocínio clínico integrando exposição fecal-oral, sintomas pulmonares, eosinofilia, sintomas intestinais, obstrução e diferenciação com outros helmintos."],
                  ["40. Como responder uma questão de Ascaris sem decorar tudo?", "Procure quatro pistas: ingestão de ovos, passagem pulmonar, adulto no intestino e ovos nas fezes. Se essas pistas aparecerem, o raciocínio fecha para Ascaris."]
                ]
              },
              "Taenia solium": {
                intro: "Tema importante porque envolve teníase e cisticercose. A confusão entre ingerir carne contaminada e ingerir ovos é uma das maiores pegadinhas.",
                aula: `<h3>Aula explicada</h3><p>Taenia solium é o verme relacionado ao porco. Quando o ser humano ingere carne suína crua ou malpassada contendo cisticercos, desenvolve teníase intestinal. Quando ingere ovos de Taenia solium, pode desenvolver cisticercose, inclusive neurocisticercose.</p><div class="callout"><b>Raciocínio de prova:</b> carne com cisticerco causa teníase; ovos podem causar cisticercose.</div>`,
                resumo: `<h3>Revisão rápida</h3><p><b>Teníase:</b> ingestão de cisticerco na carne suína.</p><p><b>Cisticercose:</b> ingestão de ovos de Taenia solium.</p><p><b>Hospedeiro definitivo:</b> ser humano na teníase.</p><p><b>Pegadinha central:</b> trocar carne contaminada por ovos.</p>`,
                pegadinhas: `
                  <h3>Pontos que confundem</h3>
                  <div class="base-phrase"><b>Para fixar:</b> Para fixar: Taenia solium é o cestódeo associado ao porco. Quando o ser humano ingere carne suína crua ou malpassada com cisticercos, desenvolve teníase intestinal. Quando ingere ovos de Taenia solium, pode desenvolver cisticercose, inclusive neurocisticercose. A prova costuma cobrar a diferença entre teníase e cisticercose, a forma ingerida, o hospedeiro relacionado e a associação com carne suína.</div>
                  <div class="confusion-list">
                    <div class="confusion-item">
                      <p><b>Erro:</b> achar que teníase e cisticercose acontecem pela mesma forma de ingestão.</p>
                      <p><b>Versão verdadeira:</b> teníase ocorre por ingestão de cisticerco na carne; cisticercose ocorre por ingestão de ovos.</p>
                      <p><b>Mini revisão:</b> a forma ingerida muda a doença. Carne com cisticerco dá teníase; ovo pode dar cisticercose.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Erro:</b> confundir Taenia solium com Taenia saginata.</p>
                      <p><b>Versão verdadeira:</b> Taenia solium é associada ao porco; Taenia saginata é associada ao boi.</p>
                      <p><b>Mini revisão:</b> porco lembra solium; boi lembra saginata.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Erro:</b> marcar cisticercose quando o enunciado fala em carne suína com cisticercos.</p>
                      <p><b>Versão verdadeira:</b> carne suína com cisticercos causa teníase intestinal.</p>
                      <p><b>Mini revisão:</b> a palavra cisticerco no alimento não significa cisticercose; significa forma larvária ingerida na carne.</p>
                    </div>
                  </div>
                `,
                questoes: [
                  {q:"A ingestão de carne suína crua contendo cisticercos leva mais provavelmente a qual condição?", alts:["Teníase", "Cisticercose", "Esquistossomose", "Ascaridíase"], correct:0, comments:["Correta. Carne suína crua ou malpassada contendo cisticercos causa teníase intestinal por Taenia solium.","Errada. Cisticercose ocorre quando a pessoa ingere ovos de Taenia solium, não quando ingere cisticercos na carne.","Errada. Esquistossomose está relacionada ao Schistosoma mansoni e à penetração de cercárias pela pele em água contaminada.","Errada. Ascaridíase é causada por Ascaris lumbricoides e ocorre pela ingestão de ovos embrionados, não por carne suína com cisticercos."], traps:[
                      {erro:"Trocar teníase por cisticercose.", verdade:"Carne com cisticerco causa teníase; ovos de Taenia solium podem causar cisticercose.", revisao:"A doença muda conforme a forma ingerida."},
                      {erro:"Achar que toda Taenia causa a mesma doença do mesmo jeito.", verdade:"A forma de transmissão define o quadro.", revisao:"Não basta reconhecer Taenia; é preciso ver se o enunciado fala em carne ou ovos."},
                      {erro:"Confundir carne com cisticerco e ingestão de ovos.", verdade:"Carne com cisticerco é teníase; ovo é risco de cisticercose.", revisao:"Essa é uma das trocas mais clássicas em prova."},
                      {erro:"Misturar Taenia solium com Taenia saginata.", verdade:"Taenia solium se relaciona ao porco; Taenia saginata ao boi.", revisao:"Porco, boi, carne e ovos são pistas importantes no enunciado."},
                      {erro:"Marcar outra parasitose só porque também é helminto.", verdade:"Esquistossomose, ascaridíase e teníase têm transmissões diferentes.", revisao:"Compare sempre o agente, a forma infectante e a via de transmissão."}
                    ],
                    clinicalReasoning:"Primeiro, observe a forma ingerida: carne suína crua contendo cisticercos. Essa pista não descreve ingestão de ovos; descreve ingestão da larva presente na carne. Portanto, o quadro esperado é teníase intestinal. Se o enunciado falasse em ingestão de ovos de Taenia solium, aí o raciocínio mudaria para cisticercose.",
                    tip:"Olhe primeiro o que foi ingerido. Carne suína com cisticerco aponta para teníase. Ovos de Taenia solium apontam para cisticercose.",
                    oral:"Quando a questão fala em carne suína crua ou malpassada contendo cisticercos, ela está descrevendo teníase. O verme adulto vai se desenvolver no intestino. Já a cisticercose aparece quando a pessoa ingere ovos de Taenia solium. Essa é a troca que a prova ama fazer. Então não responda pelo nome bonito da doença; responda pela forma ingerida."}
                ],
                flashcards: [
                  ["Carne suína com cisticerco causa o quê?", "Teníase."],
                  ["Ingestão de ovos de Taenia solium causa o quê?", "Cisticercose."],
                  ["Qual Taenia é ligada ao porco?", "Taenia solium."],
                  ["Qual a pegadinha principal?", "Trocar teníase por cisticercose."]
                ]
              }
            }
          },
          "Hipersensibilidades": {
            topics: {
              "Tipo I": {
                aula: `
                  <h3 class="lesson-title">Aula explicada do zero</h3>

                  <h4 class="lesson-subtitle"><span class="gold">1.</span> O que é hipersensibilidade tipo I?</h4>

                  <p><b><span class="gold">Hipersensibilidade tipo I</span></b> é uma reação exagerada do sistema imune contra algo que, em muitas pessoas, seria inofensivo. Esse algo é chamado de <b>alérgeno</b>. Alérgeno é qualquer substância capaz de provocar alergia, como pólen, ácaros, alimentos, medicamentos, venenos de insetos ou pelos de animais.</p>

                  <div class="lesson-key"><b>Para guardar:</b> hipersensibilidade tipo I é a reação alérgica <span class="blue">imediata</span>, mediada por <span class="gold">imunoglobulina E</span>, <span class="gold">mastócitos</span> e liberação de mediadores como <span class="blue">histamina</span>.</div>

                  <p>Quando a prova fala em alergia imediata, anafilaxia, urticária, rinite alérgica, asma alérgica ou reação rápida após contato com alimento, medicamento ou picada de inseto, a sua cabeça precisa acender: pode ser <b>hipersensibilidade tipo I</b>.</p>

                  <h4 class="lesson-subtitle"><span class="gold">2.</span> Traduzindo os nomes difíceis</h4>

                  <p><b>Imunoglobulina E</b>, também chamada de IgE, é um tipo de anticorpo muito relacionado a alergias e parasitoses. Anticorpo é uma proteína de defesa produzida pelo sistema imune. No caso da hipersensibilidade tipo I, a IgE fica presa na superfície dos mastócitos.</p>

                  <p><b>Mastócitos</b> são células de defesa cheias de grânulos. Esses grânulos guardam substâncias inflamatórias, como a <b>histamina</b>. Quando o mastócito é ativado, ele libera essas substâncias rapidamente. Esse processo é chamado de <b>degranulação</b>.</p>

                  <p><b>Histamina</b> é um mediador inflamatório. Ela ajuda a explicar vários sintomas alérgicos: coceira, vermelhidão, inchaço, secreção nasal, broncoconstrição e queda de pressão nos casos graves.</p>

                  <div class="lesson-alert"><b>Atenção à pegadinha:</b> se a questão falar em <span class="gold">IgE + mastócito + histamina + reação rápida</span>, ela está praticamente desenhando hipersensibilidade tipo I.</div>

                  <h4 class="lesson-subtitle"><span class="gold">3.</span> Como a reação acontece?</h4>

                  <p>A reação tipo I costuma ter duas etapas principais. A primeira é a <b>sensibilização</b>. Sensibilização significa o primeiro contato do organismo com o alérgeno. Nesse primeiro contato, o sistema imune entende aquele alérgeno como algo perigoso e passa a produzir IgE contra ele.</p>

                  <p>Essa IgE se fixa na superfície dos mastócitos. O paciente pode ainda não ter uma reação grave nesse primeiro contato, mas o corpo fica preparado para reagir de forma intensa se encontrar o mesmo alérgeno novamente.</p>

                  <p>No segundo contato, o alérgeno se liga à IgE que já está presa no mastócito. Isso ativa o mastócito e causa degranulação. A célula libera histamina e outros mediadores inflamatórios. É por isso que a reação pode ser muito rápida.</p>

                  <div class="lesson-key"><b>Sequência impossível de esquecer:</b> <span class="gold">primeiro contato sensibiliza</span>, <span class="blue">IgE gruda no mastócito</span>, <span class="gold">segundo contato ativa</span>, <span class="blue">mastócito libera histamina</span>.</div>

                  <h4 class="lesson-subtitle"><span class="gold">4.</span> O que acontece no corpo?</h4>

                  <p>A histamina e os outros mediadores causam vasodilatação, aumento da permeabilidade vascular, coceira, edema, secreção de muco e contração da musculatura lisa dos brônquios. Traduzindo: os vasos dilatam, o líquido sai mais facilmente para os tecidos, a pele pode coçar e inchar, o nariz pode escorrer e os brônquios podem fechar.</p>

                  <p>Quando isso acontece na pele, pode aparecer urticária, coceira e angioedema. Quando acontece no nariz, pode aparecer rinite alérgica. Quando acontece nos brônquios, pode aparecer asma alérgica. Quando acontece de forma sistêmica, com queda de pressão e dificuldade respiratória, o quadro pode ser anafilaxia.</p>

                  <h4 class="lesson-subtitle"><span class="gold">5.</span> Anafilaxia: a forma grave que cai muito</h4>

                  <p><b>Anafilaxia</b> é uma reação alérgica sistêmica, rápida e potencialmente fatal. Sistêmica significa que envolve o corpo todo, não apenas uma região. Ela pode acontecer após alimentos, medicamentos, contraste, látex ou picada de insetos.</p>

                  <p>Em prova, anafilaxia pode aparecer com urticária, edema de lábios ou língua, chiado, falta de ar, hipotensão, tontura, síncope, vômitos ou dor abdominal logo após exposição a um alérgeno.</p>

                  <div class="lesson-alert"><b>Frase de prova:</b> reação rápida após exposição + <span class="blue">urticária</span> + <span class="blue">broncoespasmo</span> + <span class="gold">hipotensão</span> deve fazer pensar em <b>anafilaxia por hipersensibilidade tipo I</b>.</div>

                  <h4 class="lesson-subtitle"><span class="gold">6.</span> Como diferenciar dos outros tipos?</h4>

                  <p>A prova ama confundir os quatro tipos de hipersensibilidade. A tipo I é imediata e mediada por IgE. A tipo II envolve anticorpos contra células ou estruturas fixas. A tipo III envolve imunocomplexos circulantes que se depositam em tecidos. A tipo IV é tardia e mediada por células T.</p>

                  <p>Então, se aparecer IgE, mastócito, histamina, alergia e anafilaxia, pense em tipo I. Se aparecer anticorpo contra célula, pense em tipo II. Se aparecer imunocomplexo, pense em tipo III. Se aparecer célula T, granuloma, teste tuberculínico ou dermatite de contato tardia, pense em tipo IV.</p>

                  <h4 class="lesson-subtitle"><span class="gold">7.</span> Como pode cair na prova da faculdade</h4>

                  <p>Pode cair assim: “Paciente apresenta urticária, broncoespasmo e hipotensão minutos após picada de abelha. Qual mecanismo?” Resposta: hipersensibilidade tipo I mediada por IgE e mastócitos.</p>

                  <p>Pode cair assim: “Qual imunoglobulina está mais relacionada às reações alérgicas imediatas?” Resposta: imunoglobulina E.</p>

                  <p>Pode cair assim: “Qual célula libera histamina na hipersensibilidade tipo I?” Resposta: mastócito.</p>

                  <p>Pode cair assim: “Qual tipo de hipersensibilidade é a anafilaxia?” Resposta: tipo I.</p>

                  <h4 class="lesson-subtitle"><span class="gold">8.</span> Como pode cair na residência médica</h4>

                  <p>Na residência, o caso pode vir como uma situação clínica real. Por exemplo: paciente recebe antibiótico e minutos depois apresenta placas urticariformes, edema de glote, sibilância, hipotensão e rebaixamento. A prova pode perguntar o mecanismo imunológico, a célula envolvida ou o mediador responsável.</p>

                  <p>Também pode aparecer como criança com asma alérgica, rinite e dermatite atópica, cobrando o perfil de resposta imune, IgE e mastócitos. O segredo é reconhecer o padrão: reação rápida, alérgeno, IgE, mastócito e histamina.</p>

                  <h4 class="lesson-subtitle"><span class="gold">9.</span> Revisão oral final</h4>

                  <p>Hipersensibilidade tipo I é a reação alérgica imediata. Ela acontece em pessoas sensibilizadas, que produziram imunoglobulina E contra determinado alérgeno. Essa imunoglobulina E fica presa nos mastócitos. Quando o alérgeno aparece novamente, ele se liga à imunoglobulina E na superfície do mastócito, ativa a célula e causa liberação de histamina e outros mediadores. Por isso, surgem coceira, urticária, edema, rinite, broncoespasmo e, nos casos graves, anafilaxia com queda de pressão e risco de morte.</p>

                  <div class="lesson-final"><b>Frase final para gravar:</b> <span class="gold">Hipersensibilidade tipo I</span> é a reação <span class="blue">imediata</span> mediada por <span class="gold">IgE</span>, <span class="gold">mastócitos</span> e <span class="blue">histamina</span>, clássica de alergia, urticária, asma alérgica e anafilaxia.</div>
                `,
                resumo: `
                  <div class="revision-hero">
                    <div class="revision-label">Revisão rápida</div>
                    <h3>Hipersensibilidade tipo I sem confundir</h3>
                    <p>O objetivo é bater o olho e lembrar: <span class="gold">alergia imediata</span>, <span class="gold">IgE</span>, <span class="blue">mastócito</span>, <span class="blue">histamina</span> e <span class="gold">anafilaxia</span>.</p>
                  </div>

                  <div class="sticky-memory"><b>Memória central:</b> tipo I é <span class="gold">imediata</span>. O alérgeno encontra a <span class="gold">IgE</span> presa no <span class="blue">mastócito</span>, o mastócito degranula e libera <span class="blue">histamina</span>.</div>

                  <div class="revision-sequence">
                    <div class="revision-sequence-card">
                      <div class="thumb">Etapa 1 • Sensibilização</div>
                      <div class="content">
                        <h5>Primeiro contato</h5>
                        <p>O organismo encontra o alérgeno e produz <span class="gold">IgE</span> contra ele.</p>
                      </div>
                    </div>

                    <div class="revision-sequence-card">
                      <div class="thumb">Etapa 2 • Preparação</div>
                      <div class="content">
                        <h5>IgE no mastócito</h5>
                        <p>A IgE fica fixada na superfície dos <span class="blue">mastócitos</span>. O corpo fica sensibilizado.</p>
                      </div>
                    </div>

                    <div class="revision-sequence-card">
                      <div class="thumb">Etapa 3 • Reexposição</div>
                      <div class="content">
                        <h5>Alérgeno retorna</h5>
                        <p>No novo contato, o alérgeno se liga à IgE e ativa o mastócito.</p>
                      </div>
                    </div>

                    <div class="revision-sequence-card">
                      <div class="thumb">Etapa 4 • Sintomas</div>
                      <div class="content">
                        <h5>Histamina</h5>
                        <p>O mastócito libera histamina: coceira, urticária, edema, muco, broncoespasmo e hipotensão.</p>
                      </div>
                    </div>
                  </div>

                  <div class="revision-blackboard">
                    <h4>Frase-mãe da prova</h4>
                    <p class="memory-sentence"><span class="gold">Hipersensibilidade tipo I</span> é <span class="blue">imediata</span>, mediada por <span class="gold">IgE</span>, ativação de <span class="gold">mastócitos</span> e liberação de <span class="blue">histamina</span>.</p>
                  </div>

                  <div class="revision-grid">
                    <div class="revision-card">
                      <h4><span class="num">1</span>Palavras que entregam</h4>
                      <p><b>IgE</b>, mastócito, histamina, alergia, urticária, broncoespasmo, anafilaxia, reação rápida.</p>
                    </div>

                    <div class="revision-card">
                      <h4><span class="num">2</span>Exemplos clássicos</h4>
                      <p>Rinite alérgica, asma alérgica, urticária, alergia alimentar, reação a picada de inseto e anafilaxia.</p>
                    </div>

                    <div class="revision-card">
                      <h4><span class="num">3</span>Anafilaxia</h4>
                      <p>Reação sistêmica rápida com urticária, edema, broncoespasmo e hipotensão após exposição a alérgeno.</p>
                    </div>

                    <div class="revision-card">
                      <h4><span class="num">4</span>Não confundir</h4>
                      <p>Tipo I não é imunocomplexo e não é célula T tardia. Se tem IgE e mastócito, é tipo I.</p>
                    </div>
                  </div>

                  <h4 class="lesson-subtitle"><span class="gold">Mapa anti-pegadinha</span></h4>

                  <div class="mini-compare">
                    <div><b>Tipo I</b>IgE, mastócito, histamina, alergia imediata.</div>
                    <div><b>Tipo II</b>Anticorpo contra célula ou estrutura fixa.</div>
                    <div><b>Tipo III</b>Imunocomplexos circulantes depositados em tecidos.</div>
                    <div><b>Tipo IV</b>Célula T, reação tardia, dermatite de contato.</div>
                    <div><b>Anafilaxia</b>Tipo I grave e sistêmica.</div>
                  </div>

                  <div class="revision-blackboard">
                    <h4>Para não errar na prova</h4>
                    <p>Se o caso for <span class="blue">rápido</span>, com <span class="gold">alérgeno</span>, <span class="gold">IgE</span>, <span class="blue">mastócito</span>, <b>histamina</b>, urticária ou anafilaxia, marque <b>hipersensibilidade tipo I</b>.</p>
                  </div>
                `,
                pegadinhas: `
                  <h3>Pontos que confundem</h3>
                  <div class="base-phrase"><b>Para fixar:</b> Hipersensibilidade tipo I é a reação alérgica imediata mediada por imunoglobulina E, mastócitos e histamina. Ela aparece em alergias, urticária, rinite alérgica, asma alérgica e anafilaxia. A prova costuma tentar confundir com imunocomplexos da tipo III ou célula T da tipo IV.</div>
                  <div class="confusion-list">
                    <div class="confusion-item"><p><b>Pegadinha:</b> “Hipersensibilidade tipo I é mediada por imunocomplexos.”</p><p><b>O erro é:</b> trocar tipo I por tipo III.</p><p><b>A versão verdadeira é:</b> tipo I é mediada por IgE e mastócitos; imunocomplexos são tipo III.</p><p><b>Revisão oral:</b> se apareceu imunocomplexo, pense em tipo III. Se apareceu IgE, mastócito e histamina, pense em tipo I.</p></div>
                    <div class="confusion-item"><p><b>Pegadinha:</b> “Anafilaxia é hipersensibilidade tipo IV.”</p><p><b>O erro é:</b> confundir reação imediata com reação tardia.</p><p><b>A versão verdadeira é:</b> anafilaxia é exemplo clássico e grave de hipersensibilidade tipo I.</p><p><b>Revisão oral:</b> anafilaxia é rápida, sistêmica e alérgica. Isso aponta para tipo I.</p></div>
                    <div class="confusion-item"><p><b>Pegadinha:</b> “Mastócitos são a principal marca da hipersensibilidade tipo III.”</p><p><b>O erro é:</b> deslocar mastócito para o tipo errado.</p><p><b>A versão verdadeira é:</b> mastócitos são protagonistas da tipo I.</p><p><b>Revisão oral:</b> mastócito degranula, libera histamina e gera sintomas alérgicos imediatos.</p></div>
                    <div class="confusion-item"><p><b>Pegadinha:</b> “Dermatite de contato clássica é tipo I porque dá alergia.”</p><p><b>O erro é:</b> achar que toda alergia é tipo I.</p><p><b>A versão verdadeira é:</b> dermatite de contato clássica é tipo IV, mediada por células T e tardia.</p><p><b>Revisão oral:</b> rápido com IgE é tipo I; tardio com célula T é tipo IV.</p></div>
                    <div class="confusion-item"><p><b>Pegadinha:</b> “Histamina é liberada principalmente por linfócitos T na tipo I.”</p><p><b>O erro é:</b> trocar a célula efetora.</p><p><b>A versão verdadeira é:</b> histamina é liberada principalmente por mastócitos ativados.</p><p><b>Revisão oral:</b> tipo I é mastócito degranulando, não linfócito T como protagonista.</p></div>
                  </div>
                `,
                questoes: [
                  {
                    q: "Qual alternativa descreve corretamente a hipersensibilidade tipo I?",
                    alts: ["Reação imediata mediada por IgE e mastócitos", "Reação tardia mediada por células T", "Reação por imunocomplexos circulantes", "Reação por anticorpos contra células", "Reação exclusivamente infecciosa por neutrófilos"],
                    correct: 0,
                    comments: [
                      "Correta. A tipo I é imediata e envolve IgE, mastócitos e histamina.",
                      "Errada. Reação tardia por células T é tipo IV.",
                      "Errada. Imunocomplexos são tipo III.",
                      "Errada. Anticorpos contra células ou estruturas fixas indicam tipo II.",
                      "Errada. Não é uma reação exclusivamente infecciosa."
                    ],
                    traps: [
                      {erro:"Marcar tipo IV porque alergia parece inflamação tardia.", verdade:"Tipo I é imediata e mediada por IgE.", revisao:"Rápida + IgE + mastócito = tipo I."},
                      {erro:"Confundir imunocomplexos com IgE.", verdade:"Imunocomplexos são tipo III.", revisao:"Tipo III deposita imunocomplexos; tipo I degranula mastócitos."},
                      {erro:"Achar que anafilaxia é tipo II.", verdade:"Anafilaxia é tipo I.", revisao:"Anafilaxia é alergia sistêmica imediata."},
                      {erro:"Ignorar a palavra imediata.", verdade:"Imediata é pista forte de tipo I.", revisao:"Tempo da reação ajuda a diferenciar."},
                      {erro:"Esquecer mastócitos.", verdade:"Mastócitos são centrais na tipo I.", revisao:"Mastócito libera histamina."}
                    ],
                    clinicalReasoning: "Procure as palavras do mecanismo: imediata, IgE, mastócitos e histamina. Esse conjunto fecha hipersensibilidade tipo I.",
                    tip: "Se aparecer IgE e mastócito, marque tipo I sem medo.",
                    oral: "Hipersensibilidade tipo I é a alergia imediata. O alérgeno ativa IgE ligada ao mastócito, o mastócito libera histamina e os sintomas aparecem rápido."
                  }
                ],
                casosClinicos: [
                  {
                    q: "Paciente de 22 anos apresenta urticária difusa, chiado no peito, edema labial e hipotensão minutos após picada de abelha. Qual mecanismo imunológico explica melhor o quadro?",
                    alts: ["IgE ligada a mastócitos com liberação de histamina", "Imunocomplexos depositados em vasos", "Células T ativadas em reação tardia", "Anticorpos IgG contra hemácias", "Ativação exclusiva de macrófagos granulomatosos"],
                    correct: 0,
                    comments: [
                      "Correta. O quadro é anafilaxia, reação tipo I mediada por IgE, mastócitos e histamina.",
                      "Errada. Imunocomplexos indicam tipo III.",
                      "Errada. Células T e reação tardia indicam tipo IV.",
                      "Errada. Anticorpos contra hemácias indicam tipo II.",
                      "Errada. Granuloma e macrófagos não explicam anafilaxia imediata."
                    ],
                    traps: [
                      {erro:"Marcar tipo III por envolver vasos e hipotensão.", verdade:"A rapidez, urticária e broncoespasmo indicam tipo I.", revisao:"Anafilaxia é tipo I."},
                      {erro:"Marcar tipo IV por ser resposta imune.", verdade:"Tipo IV é tardia, não minutos após exposição.", revisao:"Minutos = tipo I."},
                      {erro:"Ignorar edema labial e chiado.", verdade:"Esses sinais indicam reação alérgica sistêmica.", revisao:"Pele + pulmão + pressão baixa = anafilaxia."},
                      {erro:"Trocar IgE por IgG.", verdade:"Tipo I é IgE.", revisao:"IgG contra célula lembra tipo II."},
                      {erro:"Pensar apenas em veneno da abelha.", verdade:"O mecanismo é resposta alérgica mediada por IgE.", revisao:"A exposição é gatilho; a imunologia é tipo I."}
                    ],
                    clinicalReasoning: "O caso é rápido, sistêmico e ocorre após alérgeno. Urticária, edema, broncoespasmo e hipotensão formam anafilaxia. O mecanismo é IgE em mastócitos com liberação de histamina.",
                    tip: "Pele + respiração + pressão baixa minutos após alérgeno = anafilaxia tipo I.",
                    oral: "A picada funcionou como alérgeno. Em paciente sensibilizado, a IgE nos mastócitos foi ativada, houve degranulação e liberação de histamina, causando urticária, broncoespasmo e hipotensão."
                  }
                ],
                flashcards: [
                  ["Qual é o mecanismo da hipersensibilidade tipo I?", "Reação imediata mediada por IgE, mastócitos e histamina."],
                  ["Qual imunoglobulina marca a tipo I?", "Imunoglobulina E."],
                  ["Qual célula degranula na tipo I?", "Mastócito."],
                  ["Qual mediador explica muitos sintomas alérgicos?", "Histamina."],
                  ["Anafilaxia é qual tipo de hipersensibilidade?", "Tipo I."],
                  ["Tipo I é rápida ou tardia?", "Rápida/imediata."],
                  ["Imunocomplexos pertencem a qual tipo?", "Tipo III."],
                  ["Célula T tardia pertence a qual tipo?", "Tipo IV."],
                  ["Anticorpo contra célula pertence a qual tipo?", "Tipo II."],
                  ["Frase curta para fixar tipo I?", "IgE no mastócito libera histamina rápido."]
                ],
                plano: `
                  <h3>Plano de estudo</h3>
                  <p><b>Dia 1:</b> Entenda o mecanismo: sensibilização, IgE, mastócito e histamina.</p>
                  <p><b>Dia 2:</b> Decore exemplos: urticária, rinite alérgica, asma alérgica e anafilaxia.</p>
                  <p><b>Dia 3:</b> Compare tipo I, II, III e IV para não cair nas pegadinhas da prova.</p>
                  <p><b>Dia 4:</b> Faça questões de mecanismo e casos clínicos de anafilaxia.</p>
                  <p><b>Dia 5:</b> Revise pela frase final: tipo I é IgE, mastócito, histamina e reação imediata.</p>
                `
              }
            }
          }
        }
      },
      "Fisiologia": {
        progress: 18,
        lessons: {
          "Sistema Renina Angiotensina Aldosterona": {
            topics: {
              "Visão geral": {
                intro: "Entenda o sistema que regula pressão arterial, volume e retenção de sódio.",
                aula: `<h3>Aula explicada</h3><p>O sistema renina angiotensina aldosterona é ativado quando o corpo percebe queda de perfusão renal, queda de pressão ou redução de sódio. A renina inicia uma cascata que leva à formação de angiotensina II, uma substância vasoconstritora que também estimula aldosterona.</p><p>A aldosterona aumenta reabsorção de sódio e água, elevando volume circulante e pressão arterial.</p>`,
                resumo: `<h3>Revisão rápida</h3><p>Renina inicia a cascata. Angiotensina II faz vasoconstrição. Aldosterona retém sódio e água.</p>`,
                pegadinhas: `
                  <h3>Pontos que confundem</h3>
                  <div class="base-phrase"><b>Para fixar:</b> Para fixar: o sistema renina angiotensina aldosterona é ativado quando o corpo precisa recuperar pressão, perfusão renal ou volume circulante. A renina inicia a cascata, a angiotensina II faz vasoconstrição e estimula a liberação de aldosterona, e a aldosterona aumenta a reabsorção de sódio e água. A prova costuma cobrar quem contrai vaso, quem retém sódio e água e como isso aumenta volume e pressão.</div>
                  <div class="confusion-list">
                    <div class="confusion-item">
                      <p><b>Erro:</b> achar que angiotensina II e aldosterona fazem a mesma coisa.</p>
                      <p><b>Versão verdadeira:</b> angiotensina II faz vasoconstrição; aldosterona aumenta retenção de sódio e água.</p>
                      <p><b>Mini revisão:</b> as duas participam do mesmo sistema, mas têm funções diferentes.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Erro:</b> dizer que aldosterona aumenta perda de sódio.</p>
                      <p><b>Versão verdadeira:</b> aldosterona aumenta reabsorção de sódio.</p>
                      <p><b>Mini revisão:</b> guarde: aldosterona segura sal, e a água acompanha o sal.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Erro:</b> pensar que o sistema reduz pressão arterial.</p>
                      <p><b>Versão verdadeira:</b> o sistema tende a aumentar volume circulante e pressão arterial.</p>
                      <p><b>Mini revisão:</b> ele é ativado em situações em que o corpo interpreta baixa perfusão, baixo volume ou baixa pressão.</p>
                    </div>
                  </div>
                `,
                questoes: [{q:"Qual é o principal efeito da aldosterona?", alts:["Aumentar excreção de sódio","Aumentar reabsorção de sódio e água","Reduzir volume circulante","Bloquear renina"], correct:1, comments:["Errada. A aldosterona não aumenta a excreção de sódio; ela favorece a retenção de sódio.","Correta. A aldosterona aumenta a reabsorção de sódio e água, elevando volume circulante e contribuindo para aumento da pressão arterial.","Errada. Se há maior retenção de sódio e água, a tendência é aumentar, não reduzir, o volume circulante.","Errada. A aldosterona é resultado da ativação do sistema, não um bloqueador direto da renina."], traps:[
                      {erro:"Dizer que a aldosterona aumenta a perda de sódio.", verdade:"A aldosterona aumenta a reabsorção de sódio.", revisao:"Ela faz o corpo reter sal, não perder sal."},
                      {erro:"Dizer que a aldosterona reduz o volume circulante.", verdade:"Ao reter sódio e água, ela tende a aumentar o volume circulante.", revisao:"Mais retenção de água significa mais volume."},
                      {erro:"Confundir aldosterona com angiotensina II.", verdade:"Angiotensina II faz vasoconstrição; aldosterona retém sódio e água.", revisao:"As duas participam do mesmo sistema, mas não fazem a mesma coisa."},
                      {erro:"Esquecer que água acompanha o sódio.", verdade:"A reabsorção de sódio favorece a retenção de água.", revisao:"Essa frase resolve muitas questões: água segue o sal."},
                      {erro:"Marcar uma alternativa que inverte o sistema.", verdade:"O sistema tende a recuperar volume e pressão.", revisao:"Se a alternativa reduz volume e pressão, confira se ela não está no sentido oposto."}
                    ],
                    clinicalReasoning:"A pergunta pede o efeito principal da aldosterona. Então pense na função dela no sistema renina angiotensina aldosterona: recuperar volume e ajudar a manter pressão. Para isso, ela aumenta a reabsorção de sódio; a água acompanha o sódio. Logo, a alternativa correta deve falar em retenção de sódio e água, não em perda de sódio ou redução de volume.",
                    tip:"Use a frase mental: aldosterona segura sal; água segue o sal. Se a alternativa disser o contrário, provavelmente está invertida.",
                    oral:"A aldosterona atua favorecendo a reabsorção de sódio. Quando o sódio fica, a água acompanha. Com mais água retida, o volume circulante tende a aumentar e isso ajuda a elevar a pressão arterial. Então, se a questão disser que aldosterona faz perder sódio ou diminuir volume, desconfie imediatamente: ela está invertendo o mecanismo."}],
                flashcards: [["O que a renina faz?","Inicia a cascata do sistema."],["O que a angiotensina II faz?","Vasoconstrição e estímulo de aldosterona."],["O que a aldosterona faz?","Retém sódio e água."]]
              }
            }
          }
        }
      },
      "Farmacologia": {
        progress: 8,
        lessons: {
          "Anti-inflamatórios": {
            topics: {
              "AINEs": {
                intro: "Tema base de farmacologia: ação, efeitos adversos e contraindicações.",
                aula: `<h3>Aula explicada</h3><p>Os anti-inflamatórios não esteroidais inibem enzimas ciclo-oxigenases, reduzindo prostaglandinas. Isso ajuda na dor e inflamação, mas também pode aumentar risco gastrointestinal e renal.</p>`,
                resumo: `<h3>Revisão rápida</h3><p>AINEs reduzem prostaglandinas. Ajudam em dor e inflamação. Cuidado com estômago, rim e risco cardiovascular.</p>`,
                pegadinhas: `
                  <h3>Pontos que confundem</h3>
                  <div class="base-phrase"><b>Para fixar:</b> Para fixar: os anti-inflamatórios não esteroidais reduzem a produção de prostaglandinas ao inibir ciclo-oxigenases, o que ajuda a reduzir dor e inflamação. Porém, como prostaglandinas também protegem a mucosa gástrica e participam da perfusão renal, esses medicamentos podem causar gastrite, úlcera, sangramento gastrointestinal e piora da função renal em pacientes suscetíveis. A prova costuma cobrar mecanismo, benefício e principais riscos.</div>
                  <div class="confusion-list">
                    <div class="confusion-item">
                      <p><b>Erro:</b> pensar só no efeito analgésico e esquecer os riscos.</p>
                      <p><b>Versão verdadeira:</b> o mesmo mecanismo que ajuda na dor pode reduzir proteção gástrica e afetar o rim.</p>
                      <p><b>Mini revisão:</b> em AINEs, sempre lembre de estômago e rim.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Erro:</b> achar que prostaglandina só participa da inflamação.</p>
                      <p><b>Versão verdadeira:</b> prostaglandinas também têm funções protetoras no organismo.</p>
                      <p><b>Mini revisão:</b> bloquear prostaglandina reduz sintomas, mas pode retirar proteções fisiológicas.</p>
                    </div>
                    <div class="confusion-item">
                      <p><b>Erro:</b> ignorar risco gastrointestinal.</p>
                      <p><b>Versão verdadeira:</b> AINEs podem causar gastrite, úlcera e sangramento gastrointestinal.</p>
                      <p><b>Mini revisão:</b> se a questão pergunta efeito adverso clássico, pense primeiro em trato gastrointestinal.</p>
                    </div>
                  </div>
                `,
                questoes: [{q:"Qual efeito adverso é clássico dos AINEs?", alts:["Hipoglicemia grave","Gastrite e sangramento gastrointestinal","Surdez congênita","Anemia falciforme"], correct:1, comments:["Errada. Hipoglicemia grave não é o efeito adverso clássico dos anti-inflamatórios não esteroidais.","Correta. AINEs reduzem prostaglandinas protetoras da mucosa gástrica, aumentando risco de gastrite, úlcera e sangramento gastrointestinal.","Errada. Surdez congênita não é o efeito adverso clássico esperado nessa classe.","Errada. Anemia falciforme é uma doença genética, não um efeito adverso de AINEs."], traps:[
                      {erro:"Marcar um efeito adverso sem relação clássica com AINE.", verdade:"AINEs se associam principalmente a risco gastrointestinal, renal e, em alguns casos, cardiovascular.", revisao:"Sempre conecte a classe ao seu mecanismo."},
                      {erro:"Esquecer que prostaglandinas protegem a mucosa gástrica.", verdade:"Menos prostaglandina pode significar menos proteção gástrica.", revisao:"Isso explica gastrite, úlcera e sangramento."},
                      {erro:"Pensar só no efeito analgésico.", verdade:"O mesmo mecanismo que reduz dor pode gerar efeitos adversos.", revisao:"Farmacologia cobra benefício e risco juntos."},
                      {erro:"Ignorar o risco renal.", verdade:"AINEs podem prejudicar função renal em pacientes suscetíveis.", revisao:"Estômago e rim são alertas clássicos."},
                      {erro:"Confundir efeito adverso com doença genética.", verdade:"Anemia falciforme é doença genética, não efeito adverso de AINE.", revisao:"Elimine alternativas que não têm relação farmacológica direta."}
                    ],
                    clinicalReasoning:"Comece pelo mecanismo: AINEs reduzem prostaglandinas. Depois pergunte o que as prostaglandinas fazem além de participar da dor e inflamação. Elas também protegem a mucosa gástrica e ajudam na perfusão renal. Portanto, um efeito adverso clássico será gastrointestinal, como gastrite, úlcera ou sangramento.",
                    tip:"Conecte mecanismo e consequência: AINE reduz prostaglandina. Isso ajuda na dor, mas também reduz proteção gástrica e pode afetar o rim.",
                    oral:"Os AINEs diminuem a produção de prostaglandinas. Isso é bom para dor e inflamação, mas as prostaglandinas também têm funções protetoras, principalmente no estômago e nos rins. Por isso, um efeito adverso clássico é gastrite, úlcera ou sangramento gastrointestinal. Quando a prova pergunta efeito adverso de AINE, pense primeiro em estômago e rim."}],
                flashcards: [["O que AINEs inibem?","Ciclo-oxigenases."],["Qual risco gastrointestinal?","Gastrite e sangramento."],["Qual órgão exige cuidado?","Rim."]]
              }
            }
          }
        }
      },
      "Anatomia": {progress: 5, lessons:{}},
      "Semiologia": {progress: 12, lessons:{}},
      "Medicina da Família": {progress: 30, lessons:{}}
    };

