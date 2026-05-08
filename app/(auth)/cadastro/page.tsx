import Image from 'next/image';
import Link from 'next/link';
import { GoogleLoginButton } from '@/components/AuthButton';

export default function CadastroPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Atmosfera de fundo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 20% 20%, rgba(15,40,110,0.55) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(10,30,90,0.45) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 50% 50%, rgba(20,50,120,0.2) 0%, transparent 60%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(10,18,35,0.85)',
        border: '1px solid rgba(201,164,85,0.2)',
        borderRadius: '16px',
        padding: '40px 36px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
      }}>
        {/* Linha dourada no topo */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #C9A455, transparent)',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <Image src="/logo.png" alt="NeuroFix Med" width={160} height={48}
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '22px', fontWeight: '800',
            color: '#f0ede6', marginBottom: '8px', letterSpacing: '-0.02em',
          }}>
            Criar sua conta
          </h1>
          <p style={{ fontSize: '13px', color: '#5a7a9a', lineHeight: '1.6', margin: 0 }}>
            Comece gratuitamente e tenha acesso ao seu plano de estudos personalizado.
          </p>
        </div>

        {/* Botão Google */}
        <GoogleLoginButton />

        {/* Política de privacidade */}
        <p style={{
          fontSize: '11px',
          color: '#3a4a5a',
          textAlign: 'center',
          marginTop: '20px',
          lineHeight: '1.6',
        }}>
          Ao continuar, você concorda com os nossos{' '}
          <Link href="/termos-de-uso" style={{ color: '#C9A455', textDecoration: 'none' }}>
            Termos de Uso
          </Link>{' '}
          e{' '}
          <Link href="/politica-de-privacidade" style={{ color: '#C9A455', textDecoration: 'none' }}>
            Política de Privacidade
          </Link>
          .
        </p>
      </div>

      {/* Link de login */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '20px', textAlign: 'center' }}>
        <Link href="/login" style={{
          fontSize: '13px', color: '#5a7a9a',
          textDecoration: 'none', fontWeight: '600',
        }}>
          Já tenho conta — <span style={{ color: '#C9A455' }}>Entrar</span>
        </Link>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginTop: '12px' }}>
        <Link href="/" style={{
          fontSize: '12px', color: '#2a3a4a',
          textDecoration: 'none',
        }}>
          ← Voltar ao início
        </Link>
      </div>
    </div>
  );
}
