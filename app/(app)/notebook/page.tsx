import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import NotebookView from './NotebookView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export type Capture = {
  id: string;
  text: string;
  resolved: boolean;
  created_at: string;
};

export type ErrorItem = {
  id: string;
  topic: string;
  why: string | null;
  rule: string | null;
  resolved: boolean;
  created_at: string;
};

export type ExamItem = {
  id: string;
  label: string;
  text: string | null;
  created_at: string;
};

export default async function NotebookPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [captures, errors, exam] = await Promise.all([
    supabase.from('caderno_captures').select('id, text, resolved, created_at').order('created_at', { ascending: false }),
    supabase.from('caderno_errors').select('id, topic, why, rule, resolved, created_at').order('created_at', { ascending: false }),
    supabase.from('caderno_exam').select('id, label, text, created_at').order('created_at', { ascending: false }),
  ]);

  return (
    <NotebookView
      captures={(captures.data as Capture[]) ?? []}
      errors={(errors.data as ErrorItem[]) ?? []}
      exam={(exam.data as ExamItem[]) ?? []}
    />
  );
}
