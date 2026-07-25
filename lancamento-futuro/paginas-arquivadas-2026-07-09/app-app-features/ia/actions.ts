'use server';

import { createHash } from 'node:crypto';
import { createServerClient, createAdminClient } from '@/lib/supabase-server';
import {
  ErroNeuroIA,
  NEURO_IA_CONFIG,
  getClienteNeuroIA,
  traduzirErroOpenAI,
} from '@/lib/neuro-ia';
import {
  CONTEUDO_GERADO_JSON_SCHEMA,
  ConteudoGeradoSchema,
  SYSTEM_PROMPT_PRECEPTOR,
  TIPOS_VALIDOS,
  type ConteudoGerado,
  type TipoConteudo,
} from '@/lib/prompts/preceptor-medicina';

const TAMANHO_MAX_CONTEUDO = 30_000;
const TAMANHO_MIN_CONTEUDO = 20;
const TAMANHO_MAX_INSTRUCOES = 500;

type EntradaGeracao = {
  conteudoBase: string;
  tipos: TipoConteudo[];
  instrucoesExtra?: string;
};

export type ResultadoGeracao =
  | {
      ok: true;
      conteudo: ConteudoGerado;
      geracoesHoje: number;
      limiteDiario: number;
    }
  | {
      ok: false;
      erro: string;
      codigo: string;
      geracoesHoje?: number;
      limiteDiario?: number;
    };

function calcularCacheKey(entrada: EntradaGeracao): string {
  const payload = JSON.stringify({
    modelo: NEURO_IA_CONFIG.modelo,
    promptVersao: NEURO_IA_CONFIG.promptVersao,
    tipos: [...entrada.tipos].sort(),
    instrucoesExtra: entrada.instrucoesExtra?.trim() ?? '',
    conteudoBase: entrada.conteudoBase.trim(),
  });
  return createHash('sha256').update(payload).digest('hex');
}

function validarEntrada(entrada: EntradaGeracao): string | null {
  if (!entrada.conteudoBase || typeof entrada.conteudoBase !== 'string') {
    return 'Cole algum conteúdo de estudo antes de gerar.';
  }
  const texto = entrada.conteudoBase.trim();
  if (texto.length < TAMANHO_MIN_CONTEUDO) {
    return 'O conteúdo está curto demais. Cole pelo menos 20 caracteres de estudo.';
  }
  if (texto.length > TAMANHO_MAX_CONTEUDO) {
    return 'O conteúdo está muito longo. Divida em pedaços menores (máx ~30.000 caracteres).';
  }
  if (!Array.isArray(entrada.tipos) || entrada.tipos.length === 0) {
    return 'Escolha pelo menos um tipo de conteúdo para gerar.';
  }
  const invalidos = entrada.tipos.filter((t) => !TIPOS_VALIDOS.includes(t));
  if (invalidos.length > 0) {
    return 'Tipo de conteúdo inválido.';
  }
  if (entrada.instrucoesExtra && entrada.instrucoesExtra.length > TAMANHO_MAX_INSTRUCOES) {
    return `Instruções extras muito longas. Máximo ${TAMANHO_MAX_INSTRUCOES} caracteres.`;
  }
  return null;
}

export async function getUsoDoDia(): Promise<
  { geracoesHoje: number; limiteDiario: number } | null
> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const hoje = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from('controle_geracoes_diarias')
    .select('contador')
    .eq('user_id', user.id)
    .eq('data', hoje)
    .maybeSingle();

  return {
    geracoesHoje: (data?.contador as number | undefined) ?? 0,
    limiteDiario: NEURO_IA_CONFIG.limiteDiarioPadrao,
  };
}

export async function gerarConteudo(entrada: EntradaGeracao): Promise<ResultadoGeracao> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, erro: 'Faça login para usar a Neuro IA.', codigo: 'nao_autenticado' };
  }

  const erroValidacao = validarEntrada(entrada);
  if (erroValidacao) {
    return { ok: false, erro: erroValidacao, codigo: 'entrada_invalida' };
  }

  const admin = createAdminClient();
  const hoje = new Date().toISOString().slice(0, 10);

  const { data: usoAtual } = await admin
    .from('controle_geracoes_diarias')
    .select('contador')
    .eq('user_id', user.id)
    .eq('data', hoje)
    .maybeSingle();

  const contadorAtual = (usoAtual?.contador as number | undefined) ?? 0;
  if (contadorAtual >= NEURO_IA_CONFIG.limiteDiarioPadrao) {
    return {
      ok: false,
      erro: 'Você atingiu o limite de gerações de hoje. Volta amanhã!',
      codigo: 'limite_diario_excedido',
      geracoesHoje: contadorAtual,
      limiteDiario: NEURO_IA_CONFIG.limiteDiarioPadrao,
    };
  }

  const cacheKey = calcularCacheKey(entrada);

  const { data: cached } = await admin
    .from('conteudos_gerados')
    .select('flashcards, questoes, resumo_texto, hits')
    .eq('cache_key', cacheKey)
    .maybeSingle();

  let conteudoGerado: ConteudoGerado | null = null;
  let veioDoCache = false;

  if (cached) {
    let resumoParsed: ConteudoGerado['resumo'] = null;
    try {
      resumoParsed = cached.resumo_texto
        ? (JSON.parse(cached.resumo_texto as string) as ConteudoGerado['resumo'])
        : null;
    } catch {
      resumoParsed = null;
    }
    const candidato = {
      resumo: resumoParsed,
      flashcards: cached.flashcards as ConteudoGerado['flashcards'],
      questoes: cached.questoes as ConteudoGerado['questoes'],
    };
    const parsed = ConteudoGeradoSchema.safeParse(candidato);
    if (parsed.success) {
      conteudoGerado = parsed.data;
      veioDoCache = true;
      await admin
        .from('conteudos_gerados')
        .update({
          hits: ((cached.hits as number | undefined) ?? 0) + 1,
          ultima_leitura: new Date().toISOString(),
        })
        .eq('cache_key', cacheKey);
    }
  }

  let contadorPosIncremento = contadorAtual;

  if (!conteudoGerado) {
    const { data: novoContadorPre } = await admin.rpc('incrementar_geracao', {
      p_user_id: user.id,
    });
    contadorPosIncremento = (novoContadorPre as number | null) ?? contadorAtual + 1;

    if (contadorPosIncremento > NEURO_IA_CONFIG.limiteDiarioPadrao) {
      return {
        ok: false,
        erro: 'Você atingiu o limite de gerações de hoje. Volta amanhã!',
        codigo: 'limite_diario_excedido',
        geracoesHoje: contadorPosIncremento,
        limiteDiario: NEURO_IA_CONFIG.limiteDiarioPadrao,
      };
    }

    try {
      const cliente = getClienteNeuroIA();
      const resposta = await cliente.chat.completions.create({
        model: NEURO_IA_CONFIG.modelo,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_PRECEPTOR },
          {
            role: 'user',
            content: JSON.stringify({
              tipos_pedidos: entrada.tipos,
              instrucoes_extra: entrada.instrucoesExtra?.trim() || null,
              conteudo_base: entrada.conteudoBase.trim(),
            }),
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: CONTEUDO_GERADO_JSON_SCHEMA,
        },
      });

      const conteudoBruto = resposta.choices[0]?.message?.content;
      if (!conteudoBruto) {
        throw new ErroNeuroIA('resposta_invalida');
      }
      const parsed = ConteudoGeradoSchema.safeParse(JSON.parse(conteudoBruto));
      if (!parsed.success) {
        throw new ErroNeuroIA('resposta_invalida');
      }
      conteudoGerado = parsed.data;

      await admin.from('conteudos_gerados').upsert(
        {
          cache_key: cacheKey,
          modelo: NEURO_IA_CONFIG.modelo,
          prompt_versao: NEURO_IA_CONFIG.promptVersao,
          tipos: [...entrada.tipos].sort(),
          flashcards: conteudoGerado.flashcards,
          questoes: conteudoGerado.questoes,
          resumo_texto: conteudoGerado.resumo ? JSON.stringify(conteudoGerado.resumo) : null,
          hits: 0,
          ultima_leitura: new Date().toISOString(),
        },
        { onConflict: 'cache_key' }
      );
    } catch (erro) {
      const traduzido = traduzirErroOpenAI(erro);
      return {
        ok: false,
        erro: traduzido.mensagemAluno,
        codigo: traduzido.codigo,
        geracoesHoje: contadorPosIncremento,
        limiteDiario: NEURO_IA_CONFIG.limiteDiarioPadrao,
      };
    }
  }

  return {
    ok: true,
    conteudo: conteudoGerado,
    geracoesHoje: veioDoCache ? contadorAtual : contadorPosIncremento,
    limiteDiario: NEURO_IA_CONFIG.limiteDiarioPadrao,
  };
}
