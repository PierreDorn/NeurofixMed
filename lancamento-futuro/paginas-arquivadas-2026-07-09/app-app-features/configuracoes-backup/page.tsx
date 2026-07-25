import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import BackupExportImport from '@/components/ia/BackupExportImport';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BackupPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 80px' }}>
      <BackupExportImport />
    </div>
  );
}
