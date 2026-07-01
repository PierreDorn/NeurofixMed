'use client';

import Dexie, { type Table } from 'dexie';
import { z } from 'zod';

export type DificuldadeLocal = 'facil' | 'medio' | 'dificil';

export type ResumoLocal = {
  titulo: string;
  resumo_markdown: string;
  pontos_chave: string[];
};

export type FlashcardLocal = {
  frente: string;
  verso: string;
  dica: string | null;
  dificuldade: DificuldadeLocal;
};

export type AlternativaLocal = {
  letra: 'a' | 'b' | 'c' | 'd' | 'e';
  texto: string;
};

export type QuestaoLocal = {
  enunciado: string;
  alternativas: AlternativaLocal[];
  resposta_correta: 'a' | 'b' | 'c' | 'd' | 'e';
  justificativa: string;
  dificuldade: DificuldadeLocal;
};

export type Kit = {
  id?: number;
  titulo: string;
  conteudo_base: string;
  tipos: ('resumo' | 'flashcards' | 'questoes')[];
  resumo: ResumoLocal | null;
  criado_em: number;
  atualizado_em: number;
};

export type FlashcardSalvo = {
  id?: number;
  kit_id: number;
  frente: string;
  verso: string;
  dica: string | null;
  dificuldade: DificuldadeLocal;
  srs_proxima_revisao: number;
  srs_intervalo_dias: number;
  srs_ease_factor: number;
  srs_repeticoes: number;
  criado_em: number;
};

export type QuestaoSalva = {
  id?: number;
  kit_id: number;
  enunciado: string;
  alternativas: AlternativaLocal[];
  resposta_correta: 'a' | 'b' | 'c' | 'd' | 'e';
  justificativa: string;
  dificuldade: DificuldadeLocal;
  tentativas: number;
  acertos: number;
  ultima_tentativa: number | null;
  criado_em: number;
};

export type Configuracao = {
  chave: string;
  valor: unknown;
};

class NeuroFixLocalDB extends Dexie {
  kits!: Table<Kit, number>;
  flashcards!: Table<FlashcardSalvo, number>;
  questoes!: Table<QuestaoSalva, number>;
  configuracoes!: Table<Configuracao, string>;

  constructor() {
    super('NeuroFixLocal');
    this.version(1).stores({
      kits: '++id, titulo, criado_em, atualizado_em',
      flashcards: '++id, kit_id, srs_proxima_revisao, dificuldade, criado_em',
      questoes: '++id, kit_id, dificuldade, ultima_tentativa, criado_em',
      configuracoes: 'chave',
    });
  }
}

let _db: NeuroFixLocalDB | null = null;

export function getDB(): NeuroFixLocalDB {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB só está disponível no cliente.');
  }
  if (!_db) {
    _db = new NeuroFixLocalDB();
  }
  return _db;
}

export async function salvarKitGerado(opts: {
  titulo: string;
  conteudoBase: string;
  tipos: ('resumo' | 'flashcards' | 'questoes')[];
  resumo: ResumoLocal | null;
  flashcards: FlashcardLocal[] | null;
  questoes: QuestaoLocal[] | null;
}): Promise<number> {
  const db = getDB();
  const agora = Date.now();

  const kitId = await db.transaction('rw', db.kits, db.flashcards, db.questoes, async () => {
    const kid = await db.kits.add({
      titulo: opts.titulo,
      conteudo_base: opts.conteudoBase,
      tipos: opts.tipos,
      resumo: opts.resumo,
      criado_em: agora,
      atualizado_em: agora,
    });

    if (opts.flashcards && opts.flashcards.length > 0) {
      await db.flashcards.bulkAdd(
        opts.flashcards.map((f) => ({
          kit_id: kid,
          frente: f.frente,
          verso: f.verso,
          dica: f.dica,
          dificuldade: f.dificuldade,
          srs_proxima_revisao: agora,
          srs_intervalo_dias: 0,
          srs_ease_factor: 2.5,
          srs_repeticoes: 0,
          criado_em: agora,
        })),
      );
    }

    if (opts.questoes && opts.questoes.length > 0) {
      await db.questoes.bulkAdd(
        opts.questoes.map((q) => ({
          kit_id: kid,
          enunciado: q.enunciado,
          alternativas: q.alternativas,
          resposta_correta: q.resposta_correta,
          justificativa: q.justificativa,
          dificuldade: q.dificuldade,
          tentativas: 0,
          acertos: 0,
          ultima_tentativa: null,
          criado_em: agora,
        })),
      );
    }

    return kid;
  });

  return kitId;
}

export async function listarKits(): Promise<Kit[]> {
  const db = getDB();
  return db.kits.orderBy('criado_em').reverse().toArray();
}

export async function getKitCompleto(kitId: number) {
  const db = getDB();
  const [kit, flashcards, questoes] = await Promise.all([
    db.kits.get(kitId),
    db.flashcards.where('kit_id').equals(kitId).toArray(),
    db.questoes.where('kit_id').equals(kitId).toArray(),
  ]);
  if (!kit) return null;
  return { kit, flashcards, questoes };
}

export async function deletarKit(kitId: number): Promise<void> {
  const db = getDB();
  await db.transaction('rw', db.kits, db.flashcards, db.questoes, async () => {
    await db.flashcards.where('kit_id').equals(kitId).delete();
    await db.questoes.where('kit_id').equals(kitId).delete();
    await db.kits.delete(kitId);
  });
}

export async function exportarTudo(): Promise<string> {
  const db = getDB();
  const [kits, flashcards, questoes, configuracoes] = await Promise.all([
    db.kits.toArray(),
    db.flashcards.toArray(),
    db.questoes.toArray(),
    db.configuracoes.toArray(),
  ]);
  const payload = {
    versao: 1,
    exportado_em: new Date().toISOString(),
    aplicativo: 'NeuroFix Med',
    kits,
    flashcards,
    questoes,
    configuracoes,
  };
  return JSON.stringify(payload, null, 2);
}

const DificuldadeZod = z.enum(['facil', 'medio', 'dificil']);
const LetraAlternativaZod = z.enum(['a', 'b', 'c', 'd', 'e']);

const ResumoLocalZod = z.object({
  titulo: z.string(),
  resumo_markdown: z.string(),
  pontos_chave: z.array(z.string()),
});

const AlternativaLocalZod = z.object({
  letra: LetraAlternativaZod,
  texto: z.string(),
});

const KitZod = z.object({
  titulo: z.string(),
  conteudo_base: z.string(),
  tipos: z.array(z.enum(['resumo', 'flashcards', 'questoes'])),
  resumo: ResumoLocalZod.nullable(),
  criado_em: z.number(),
  atualizado_em: z.number(),
});

const FlashcardSalvoZod = z.object({
  kit_id: z.number(),
  frente: z.string(),
  verso: z.string(),
  dica: z.string().nullable(),
  dificuldade: DificuldadeZod,
  srs_proxima_revisao: z.number(),
  srs_intervalo_dias: z.number(),
  srs_ease_factor: z.number(),
  srs_repeticoes: z.number(),
  criado_em: z.number(),
});

const QuestaoSalvaZod = z.object({
  kit_id: z.number(),
  enunciado: z.string(),
  alternativas: z.array(AlternativaLocalZod),
  resposta_correta: LetraAlternativaZod,
  justificativa: z.string(),
  dificuldade: DificuldadeZod,
  tentativas: z.number(),
  acertos: z.number(),
  ultima_tentativa: z.number().nullable(),
  criado_em: z.number(),
});

const ConfiguracaoZod = z.object({
  chave: z.string(),
  valor: z.unknown(),
});

const BackupPayloadZod = z.object({
  versao: z.number(),
  exportado_em: z.string().optional(),
  aplicativo: z.literal('NeuroFix Med'),
  kits: z.array(KitZod.extend({ id: z.number().optional() })).optional(),
  flashcards: z.array(FlashcardSalvoZod.extend({ id: z.number().optional() })).optional(),
  questoes: z.array(QuestaoSalvaZod.extend({ id: z.number().optional() })).optional(),
  configuracoes: z.array(ConfiguracaoZod).optional(),
});

export async function importarTudo(jsonString: string): Promise<{
  kits: number;
  flashcards: number;
  questoes: number;
}> {
  const db = getDB();
  let bruto: unknown;
  try {
    bruto = JSON.parse(jsonString);
  } catch {
    throw new Error('Arquivo inválido. Envie um .json exportado da Neuro IA.');
  }
  const parsed = BackupPayloadZod.safeParse(bruto);
  if (!parsed.success) {
    throw new Error('Esse arquivo não é um backup válido do NeuroFix Med.');
  }
  const payload = parsed.data;

  return db.transaction(
    'rw',
    db.kits,
    db.flashcards,
    db.questoes,
    db.configuracoes,
    async () => {
      const kitsImportados = payload.kits
        ? await db.kits
            .bulkAdd(
              payload.kits.map(({ id: _id, ...resto }) => resto),
              { allKeys: true },
            )
            .then((arr) => arr.length)
        : 0;

      const flashImportados = payload.flashcards
        ? await db.flashcards
            .bulkAdd(
              payload.flashcards.map(({ id: _id, ...resto }) => resto),
              { allKeys: true },
            )
            .then((arr) => arr.length)
        : 0;

      const questoesImportadas = payload.questoes
        ? await db.questoes
            .bulkAdd(
              payload.questoes.map(({ id: _id, ...resto }) => resto),
              { allKeys: true },
            )
            .then((arr) => arr.length)
        : 0;

      if (payload.configuracoes) {
        await db.configuracoes.bulkPut(payload.configuracoes);
      }

      return {
        kits: kitsImportados,
        flashcards: flashImportados,
        questoes: questoesImportadas,
      };
    },
  );
}

export async function limparTudo(): Promise<void> {
  const db = getDB();
  await db.transaction(
    'rw',
    db.kits,
    db.flashcards,
    db.questoes,
    db.configuracoes,
    async () => {
      await db.kits.clear();
      await db.flashcards.clear();
      await db.questoes.clear();
      await db.configuracoes.clear();
    },
  );
}

