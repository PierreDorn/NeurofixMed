'use client';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
export function GoogleLoginButton(){
  async function login(){
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo:`${location.origin}/auth/callback` } });
  }
  return <button onClick={login} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700">Entrar com Google</button>;
}
export function LogoutButton(){
  async function logout(){ const supabase = createSupabaseBrowserClient(); await supabase.auth.signOut(); location.href='/login'; }
  return <button onClick={logout} className="rounded-xl border px-3 py-2 text-sm">Sair</button>;
}
