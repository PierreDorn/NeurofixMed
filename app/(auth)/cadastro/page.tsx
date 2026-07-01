'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

const css = `
.nf-cad-page{min-height:100vh;width:100vw;background:#000;display:flex;align-items:flex-start;justify-content:center;padding:32px 20px;font-family:'Montserrat',sans-serif;position:relative;overflow-x:hidden}
.nf-cad-page::before{content:'';position:fixed;inset:0;background:
  radial-gradient(ellipse 80% 55% at 20% 15%,rgba(26,111,212,.18) 0%,transparent 60%),
  radial-gradient(ellipse 55% 45% at 82% 85%,rgba(201,168,76,.10) 0%,transparent 55%),
  radial-gradient(ellipse 50% 40% at 50% 50%,rgba(20,50,120,.08) 0%,transparent 65%);
  pointer-events:none;z-index:0}
.nf-cad-shell{position:relative;z-index:1;width:100%;max-width:440px;margin:auto 0;background:#07090F;border:1px solid rgba(201,168,76,.15);border-radius:10px;padding:34px 32px 30px;box-shadow:0 30px 80px rgba(0,0,0,.65);animation:nfCadUp .55s ease both}
@keyframes nfCadUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.nf-cad-shell::before{content:'';position:absolute;top:0;left:24px;right:24px;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,.55),transparent)}
.nf-cad-logo{display:flex;justify-content:center;margin-bottom:14px}
.nf-cad-logo img{height:68px;width:auto;display:block;object-fit:contain}
.nf-cad-head{text-align:center;margin-bottom:22px}
.nf-cad-title{font-size:20px;font-weight:800;color:#F0EDE6;letter-spacing:-.3px;margin:0 0 6px}
.nf-cad-title span{color:#C9A84C}
.nf-cad-sub{font-size:11.5px;font-weight:300;color:rgba(240,237,230,.5);margin:0;line-height:1.55}

.nf-cad-google{width:100%;padding:12px;background:#fff;border:1px solid #fff;border-radius:7px;color:#1F2937;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s;margin-bottom:18px}
.nf-cad-google:hover{background:#F3F4F6;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.35)}
.nf-cad-google:disabled{opacity:.7;cursor:wait;transform:none}

.nf-cad-or{display:flex;align-items:center;gap:10px;margin:6px 0 18px}
.nf-cad-or-ln{flex:1;height:1px;background:rgba(201,168,76,.14)}
.nf-cad-or-tx{font-size:10px;font-weight:600;letter-spacing:2px;color:rgba(240,237,230,.38);text-transform:uppercase}

.nf-cad-field{margin-bottom:14px}
.nf-cad-label{display:block;font-size:11px;font-weight:600;color:rgba(240,237,230,.72);margin-bottom:6px;letter-spacing:.3px}
.nf-cad-input-wrap{position:relative}
.nf-cad-input{width:100%;padding:11px 13px;background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.14);border-radius:7px;color:#F0EDE6;font-family:'Montserrat',sans-serif;font-size:13px;transition:all .18s;outline:none}
.nf-cad-input:hover{border-color:rgba(201,168,76,.28)}
.nf-cad-input:focus{border-color:rgba(201,168,76,.55);background:rgba(255,255,255,.05);box-shadow:0 0 0 3px rgba(201,168,76,.08)}
.nf-cad-input::placeholder{color:rgba(240,237,230,.28);font-weight:300}
.nf-cad-hint{font-size:10.5px;color:rgba(240,237,230,.32);margin-top:5px;line-height:1.45}
.nf-cad-eye{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:transparent;border:none;color:rgba(240,237,230,.45);cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;border-radius:4px;transition:color .15s}
.nf-cad-eye:hover{color:#C9A84C}

.nf-cad-phone-wrap{display:flex;gap:8px;align-items:stretch}
.nf-cad-phone-flag{display:flex;align-items:center;gap:6px;padding:0 11px;background:rgba(255,255,255,.03);border:1px solid rgba(201,168,76,.14);border-radius:7px;font-size:12px;color:#F0EDE6;font-weight:500;flex-shrink:0}
.nf-cad-phone-flag span{font-size:16px;line-height:1}
.nf-cad-input-phone{flex:1}

.nf-cad-terms{display:flex;align-items:flex-start;gap:9px;margin:16px 0 20px;padding:2px 0;font-size:11px;color:rgba(240,237,230,.55);line-height:1.55;cursor:pointer;user-select:none}
.nf-cad-check{margin-top:2px;width:15px;height:15px;accent-color:#C9A84C;cursor:pointer;flex-shrink:0}
.nf-cad-terms a{color:#C9A84C;text-decoration:none}
.nf-cad-terms a:hover{text-decoration:underline}

.nf-cad-cta{width:100%;padding:13px;background:linear-gradient(135deg,#8B6914 0%,#E8D08A 40%,#C9A84C 75%,#8B6914 100%);background-size:250% 250%;border:none;border-radius:7px;color:#000;font-family:'Montserrat',sans-serif;font-size:11.5px;font-weight:800;letter-spacing:3.5px;text-transform:uppercase;cursor:pointer;box-shadow:0 4px 24px rgba(201,168,76,.28);animation:nfCadGold 3s ease-in-out infinite;transition:transform .2s,box-shadow .2s}
@keyframes nfCadGold{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.nf-cad-cta:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,168,76,.42)}
.nf-cad-cta:disabled{opacity:.6;cursor:not-allowed;animation:none}

.nf-cad-err{margin:6px 0 14px;padding:10px 12px;border-radius:6px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.35);color:#F87171;font-size:11.5px;line-height:1.5}
.nf-cad-ok{margin:6px 0 14px;padding:10px 12px;border-radius:6px;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.35);color:#4ADE80;font-size:11.5px;line-height:1.5}

.nf-cad-foot{margin-top:20px;text-align:center;font-size:11.5px;color:rgba(240,237,230,.4)}
.nf-cad-foot a{color:#C9A84C;text-decoration:none;font-weight:600}
.nf-cad-foot a:hover{text-decoration:underline}
.nf-cad-back{display:block;text-align:center;margin-top:10px;font-size:11px;color:rgba(240,237,230,.25);text-decoration:none;transition:color .2s}
.nf-cad-back:hover{color:rgba(240,237,230,.5)}

@media(max-width:520px){
  .nf-cad-shell{padding:28px 22px 24px;border-radius:8px}
  .nf-cad-title{font-size:18px}
}
`;

function onlyDigits(v: string) {
  return v.replace(/\D+/g, '');
}

function formatPhoneBR(digits: string) {
  const d = digits.slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleGoogle() {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback?next=/onboarding`,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Não foi possível iniciar o cadastro com Google.';
      setErrorMsg(msg);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const nomeTrim = nome.trim();
    if (nomeTrim.length < 3) {
      setErrorMsg('Digite seu nome completo (mínimo 3 caracteres).');
      return;
    }
    if (!/\s/.test(nomeTrim)) {
      setErrorMsg('Digite nome e sobrenome.');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg('Digite um email válido.');
      return;
    }
    if (senha.length < 8) {
      setErrorMsg('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    const telDigits = onlyDigits(telefone);
    if (telDigits.length < 10 || telDigits.length > 11) {
      setErrorMsg('Digite um telefone válido com DDD (10 ou 11 dígitos).');
      return;
    }
    if (!aceitaTermos) {
      setErrorMsg('Você precisa aceitar os Termos de Uso e a Política de Privacidade.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const phoneE164 = `+55${telDigits}`;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: senha,
        options: {
          data: {
            full_name: nomeTrim,
            phone: phoneE164,
          },
          emailRedirectTo: `${location.origin}/auth/callback?next=/onboarding`,
        },
      });

      if (error) {
        if (/already registered|already exists|user.*exists/i.test(error.message)) {
          setErrorMsg('Este email já está cadastrado. Faça login em vez de criar conta.');
        } else if (/password/i.test(error.message)) {
          setErrorMsg('Senha inválida. Use pelo menos 8 caracteres com letras e números.');
        } else {
          setErrorMsg(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push('/onboarding');
        return;
      }

      setSuccessMsg(
        'Cadastro realizado! Verifique seu email para confirmar sua conta e liberar o acesso.'
      );
      setLoading(false);
    } catch (err: unknown) {
      setErrorMsg((err as { message?: string })?.message ?? 'Erro ao criar conta. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div className="nf-cad-page">
        <div className="nf-cad-shell">
          <div className="nf-cad-logo">
            <img src="/neurofix-logo-transparente.png" alt="NeuroFix Med" />
          </div>

          <div className="nf-cad-head">
            <h1 className="nf-cad-title">Crie sua <span>conta.</span></h1>
            <p className="nf-cad-sub">Dê o próximo passo na sua jornada médica.</p>
          </div>

          <button
            type="button"
            className="nf-cad-google"
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            aria-label="Entrar com Google"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? 'Abrindo Google…' : 'Entrar com Google'}
          </button>

          <div className="nf-cad-or">
            <div className="nf-cad-or-ln" />
            <span className="nf-cad-or-tx">ou cadastre-se</span>
            <div className="nf-cad-or-ln" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="nf-cad-field">
              <label htmlFor="cad-nome" className="nf-cad-label">Nome completo</label>
              <div className="nf-cad-input-wrap">
                <input
                  id="cad-nome"
                  className="nf-cad-input"
                  type="text"
                  autoComplete="name"
                  placeholder="Ex.: Ana Silva"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="nf-cad-hint">Usaremos para personalizar sua experiência no NeuroFix Med.</p>
            </div>

            <div className="nf-cad-field">
              <label htmlFor="cad-email" className="nf-cad-label">Email</label>
              <div className="nf-cad-input-wrap">
                <input
                  id="cad-email"
                  className="nf-cad-input"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="nf-cad-field">
              <label htmlFor="cad-senha" className="nf-cad-label">Senha</label>
              <div className="nf-cad-input-wrap">
                <input
                  id="cad-senha"
                  className="nf-cad-input"
                  type={showSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  disabled={loading}
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  className="nf-cad-eye"
                  onClick={() => setShowSenha(v => !v)}
                  aria-label={showSenha ? 'Esconder senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  {showSenha ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.35 20.35 0 0 1 5.06-6.06M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.5 20.5 0 0 1-3.17 4.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="nf-cad-hint">Use no mínimo 8 caracteres com letras e números.</p>
            </div>

            <div className="nf-cad-field">
              <label htmlFor="cad-tel" className="nf-cad-label">Telefone</label>
              <div className="nf-cad-phone-wrap">
                <div className="nf-cad-phone-flag" aria-hidden="true">
                  <span>🇧🇷</span> +55
                </div>
                <input
                  id="cad-tel"
                  className="nf-cad-input nf-cad-input-phone"
                  type="tel"
                  autoComplete="tel-national"
                  placeholder="(11) 91234-5678"
                  value={telefone}
                  onChange={e => setTelefone(formatPhoneBR(onlyDigits(e.target.value)))}
                  inputMode="numeric"
                  disabled={loading}
                />
              </div>
              <p className="nf-cad-hint">Usado para segurança da conta e recuperação de acesso.</p>
            </div>

            <label className="nf-cad-terms">
              <input
                type="checkbox"
                className="nf-cad-check"
                checked={aceitaTermos}
                onChange={e => setAceitaTermos(e.target.checked)}
                disabled={loading}
              />
              <span>
                Li e aceito os{' '}
                <Link href="/termos-de-uso" target="_blank">Termos de Uso</Link>{' '}
                e a{' '}
                <Link href="/politica-de-privacidade" target="_blank">Política de Privacidade</Link>.
              </span>
            </label>

            {errorMsg && <div className="nf-cad-err">⚠️ {errorMsg}</div>}
            {successMsg && <div className="nf-cad-ok">✅ {successMsg}</div>}

            <button
              type="submit"
              className="nf-cad-cta"
              disabled={loading || googleLoading}
            >
              {loading ? 'CRIANDO CONTA…' : 'CRIAR CONTA →'}
            </button>
          </form>

          <div className="nf-cad-foot">
            Já tem conta? <Link href="/login">Entrar</Link>
          </div>
          <Link href="/" className="nf-cad-back">← Voltar ao início</Link>
        </div>
      </div>
    </>
  );
}
