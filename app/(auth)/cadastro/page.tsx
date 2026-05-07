import Image from 'next/image';
import Link from 'next/link';
import { GoogleLoginButton } from '@/components/AuthButton';

export default function CadastroPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#0f0f0f',
        border: '1px solid rgba(201,164,85,0.2)',
        borderRadius: '24px',
        padding: '40px 36px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <Image src="/logo.png" alt="NeuroFix Med" width={160} height={48}
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#f1f5f9', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Criar sua conta
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
            Comece gratuitamente e tenha acesso ao seu plano de estudos personalizado.
          </p>
        </div>

        {/* Botão Google */}
        <GoogleLoginButton />

        {/* Separador */}
        <div style={{ textAlign: 'center', margin: '24px 0 0' }}>
          <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>
            Já tem conta?{' '}
            <Link href="/login" style={{ color: '#C9A455', fontWeight: '700', textDecoration: 'none' }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>

      {/* Voltar */}
      <Link href="/" style={{
        marginTop: '20px', fontSize: '13px', color: '#4b5563',
        textDecoration: 'none', fontWeight: '600',
      }}>
        ← Voltar ao início
      </Link>
    </div>
  );
}
