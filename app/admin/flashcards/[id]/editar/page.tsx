import { createServerClient } from '@/lib/supabase-server';
import AdminFlashcardForm from '@/components/admin/AdminFlashcardForm';
import { notFound } from 'next/navigation';

export default async function EditarFlashcardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();

  const [{ data: card }, { data: materiais }] = await Promise.all([
    supabase.from('flashcards')
      .select('id, tipo, pergunta, resposta, texto_lacuna, opcoes, resposta_correta, status, ciclo, materia, topic_id, subtopic_id, sub_subtopic_id')
      .eq('id', id).single(),
    supabase.from('materiais').select('id, nome, ciclo').eq('ativo', true).order('ordem'),
  ]);

  if (!card) notFound();

  return (
    <AdminFlashcardForm
      materiais={materiais ?? []}
      initial={{
        id: card.id,
        tipo: card.tipo as 'frente_verso' | 'lacuna' | 'multipla_escolha',
        pergunta: card.pergunta ?? '',
        resposta: card.resposta ?? '',
        texto_lacuna: card.texto_lacuna ?? '',
        opcoes: Array.isArray(card.opcoes) ? card.opcoes : ['', '', '', ''],
        resposta_correta: card.resposta_correta ?? '',
        status: card.status ?? 'draft',
        ciclo: card.ciclo ?? '',
        materia: card.materia ?? '',
        topic_id: card.topic_id ?? '',
        subtopic_id: card.subtopic_id ?? '',
        sub_subtopic_id: card.sub_subtopic_id ?? '',
      }}
    />
  );
}
