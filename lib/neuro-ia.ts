import 'server-only';
import OpenAI from 'openai';

const MODELO_PADRAO = 'gpt-5-mini' as const;
const PROMPT_VERSAO = 'v1' as const;
const LIMITE_DIARIO_PADRAO = 200;

const TIMEOUT_MS = 60_000;

let _cliente: OpenAI | null = null;

function getCliente(): OpenAI {
  if (!_cliente) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new ErroNeuroIA('credencial_ausente');
    }
    _cliente = new OpenAI({ apiKey, timeout: TIMEOUT_MS, maxRetries: 1 });
  }
  return _cliente;
}

type CodigoErro =
  | 'credencial_ausente'
  | 'limite_diario_excedido'
  | 'conteudo_invalido'
  | 'tempo_esgotado'
  | 'servico_indisponivel'
  | 'resposta_invalida'
  | 'desconhecido';

const MENSAGENS_ERRO: Record<CodigoErro, string> = {
  credencial_ausente: 'A Neuro IA está indisponível no momento. Tente novamente em alguns minutos.',
  limite_diario_excedido: 'Você atingiu o limite de gerações de hoje. Volta amanhã!',
  conteudo_invalido: 'Não consegui entender esse conteúdo. Tente colar um texto de estudo.',
  tempo_esgotado: 'A Neuro IA demorou demais pra responder. Tente novamente.',
  servico_indisponivel: 'A Neuro IA está sobrecarregada agora. Tente em alguns minutos.',
  resposta_invalida: 'A Neuro IA gerou uma resposta inesperada. Tente novamente.',
  desconhecido: 'Algo deu errado. Tente novamente.',
};

export class ErroNeuroIA extends Error {
  codigo: CodigoErro;
  mensagemAluno: string;
  detalhesInternos?: string;

  constructor(codigo: CodigoErro, detalhesInternos?: string) {
    super(MENSAGENS_ERRO[codigo]);
    this.name = 'ErroNeuroIA';
    this.codigo = codigo;
    this.mensagemAluno = MENSAGENS_ERRO[codigo];
    this.detalhesInternos = detalhesInternos;
  }
}

function traduzirErroOpenAI(erro: unknown): ErroNeuroIA {
  if (erro instanceof ErroNeuroIA) return erro;
  if (erro instanceof OpenAI.APIError) {
    if (erro.status === 401 || erro.status === 403) return new ErroNeuroIA('credencial_ausente');
    if (erro.status === 408 || erro.status === 504) return new ErroNeuroIA('tempo_esgotado');
    if (erro.status === 429) return new ErroNeuroIA('servico_indisponivel');
    if (erro.status && erro.status >= 500) return new ErroNeuroIA('servico_indisponivel');
    if (erro.status && erro.status >= 400) return new ErroNeuroIA('conteudo_invalido');
  }
  return new ErroNeuroIA('desconhecido');
}

export const NEURO_IA_CONFIG = {
  modelo: MODELO_PADRAO,
  promptVersao: PROMPT_VERSAO,
  limiteDiarioPadrao: LIMITE_DIARIO_PADRAO,
} as const;

export { getCliente as getClienteNeuroIA, traduzirErroOpenAI };
