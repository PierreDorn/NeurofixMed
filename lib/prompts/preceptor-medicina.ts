import 'server-only';
import { z } from 'zod';

export type TipoConteudo = 'resumo' | 'flashcards' | 'questoes';

export const TIPOS_VALIDOS: readonly TipoConteudo[] = ['resumo', 'flashcards', 'questoes'] as const;

export const SYSTEM_PROMPT_PRECEPTOR = `Você é o Preceptor da Neuro IA — um tutor digital especialista em medicina, voltado para estudantes brasileiros de graduação em medicina.

Sua missão:
- Transformar o conteúdo fornecido pelo aluno em material de estudo de altíssima qualidade.
- Manter rigor clínico e técnico. Não invente fatos, condutas ou diretrizes.
- Usar terminologia médica correta em português do Brasil.
- Ser direto, didático e organizado. Estudante de medicina não tem tempo a perder.

Estilo:
- Português do Brasil, formal porém acessível.
- Sem emojis, sem floreios.
- Quando houver controvérsia clínica, mencione brevemente.

Você vai receber um JSON com:
- "conteudo_base": o texto que o aluno colou (notas, transcrição, capítulo, etc.).
- "tipos_pedidos": array com o que gerar — pode conter "resumo", "flashcards" e/ou "questoes".
- "instrucoes_extra": (opcional) preferências do aluno (foco em X, evitar Y, etc.).

Regras de resposta:
- Gere APENAS os tipos pedidos. Para os tipos NÃO pedidos, retorne null no campo correspondente.
- Resumo: estruturado em markdown, com pontos-chave acionáveis.
- Flashcards: pergunta-resposta atômica, focada em UM conceito por card. Frente curta, verso explicativo mas conciso. Marque dificuldade.
- Questões: estilo prova de medicina, 5 alternativas (A-E), uma correta, justificativa que explica por que a correta é certa E por que cada errada está errada.

Quando o conteúdo for insuficiente ou irrelevante (ex: aluno colou texto sem sentido médico):
- Para resumo: gere um aviso curto no campo titulo: "Conteúdo insuficiente" e explique no resumo_markdown.
- Para flashcards/questões: retorne array vazio [] e adicione 1 flashcard/questão única explicando que o conteúdo não é adequado.

Quantidade padrão (a menos que instrucoes_extra peça diferente):
- Flashcards: 10 a 15.
- Questões: 5 a 8.`;

const DificuldadeSchema = z.enum(['facil', 'medio', 'dificil']);

const ResumoSchema = z.object({
  titulo: z.string().describe('Título curto, identificando o tema principal do conteúdo.'),
  resumo_markdown: z.string().describe('Resumo principal em markdown, com seções e subseções clínicas relevantes.'),
  pontos_chave: z.array(z.string()).describe('Lista de 3 a 8 pontos-chave acionáveis para revisão rápida.'),
});

const FlashcardSchema = z.object({
  frente: z.string().describe('Pergunta curta e objetiva (1-2 frases).'),
  verso: z.string().describe('Resposta clara e completa, ainda concisa.'),
  dica: z.string().nullable().describe('Dica opcional para ajudar a lembrar. null se não houver.'),
  dificuldade: DificuldadeSchema,
});

const AlternativaSchema = z.object({
  letra: z.enum(['a', 'b', 'c', 'd', 'e']),
  texto: z.string(),
});

const QuestaoSchema = z.object({
  enunciado: z.string().describe('Enunciado da questão em estilo de prova médica.'),
  alternativas: z.array(AlternativaSchema).describe('Sempre 5 alternativas (a, b, c, d, e).'),
  resposta_correta: z.enum(['a', 'b', 'c', 'd', 'e']),
  justificativa: z.string().describe('Explica por que a correta está certa E por que cada errada está errada.'),
  dificuldade: DificuldadeSchema,
});

export const ConteudoGeradoSchema = z.object({
  resumo: ResumoSchema.nullable(),
  flashcards: z.array(FlashcardSchema).nullable(),
  questoes: z.array(QuestaoSchema).nullable(),
});

export type ConteudoGerado = z.infer<typeof ConteudoGeradoSchema>;
export type Resumo = z.infer<typeof ResumoSchema>;
export type Flashcard = z.infer<typeof FlashcardSchema>;
export type Questao = z.infer<typeof QuestaoSchema>;

export const CONTEUDO_GERADO_JSON_SCHEMA = {
  name: 'ConteudoGerado',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['resumo', 'flashcards', 'questoes'],
    properties: {
      resumo: {
        anyOf: [
          { type: 'null' },
          {
            type: 'object',
            additionalProperties: false,
            required: ['titulo', 'resumo_markdown', 'pontos_chave'],
            properties: {
              titulo: { type: 'string' },
              resumo_markdown: { type: 'string' },
              pontos_chave: { type: 'array', items: { type: 'string' } },
            },
          },
        ],
      },
      flashcards: {
        anyOf: [
          { type: 'null' },
          {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['frente', 'verso', 'dica', 'dificuldade'],
              properties: {
                frente: { type: 'string' },
                verso: { type: 'string' },
                dica: { anyOf: [{ type: 'string' }, { type: 'null' }] },
                dificuldade: { type: 'string', enum: ['facil', 'medio', 'dificil'] },
              },
            },
          },
        ],
      },
      questoes: {
        anyOf: [
          { type: 'null' },
          {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['enunciado', 'alternativas', 'resposta_correta', 'justificativa', 'dificuldade'],
              properties: {
                enunciado: { type: 'string' },
                alternativas: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['letra', 'texto'],
                    properties: {
                      letra: { type: 'string', enum: ['a', 'b', 'c', 'd', 'e'] },
                      texto: { type: 'string' },
                    },
                  },
                },
                resposta_correta: { type: 'string', enum: ['a', 'b', 'c', 'd', 'e'] },
                justificativa: { type: 'string' },
                dificuldade: { type: 'string', enum: ['facil', 'medio', 'dificil'] },
              },
            },
          },
        ],
      },
    },
  },
} as const;
