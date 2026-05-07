import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    icon: '🧠',
    titulo: 'Nunca mais esqueça um conteúdo',
    desc: 'A IA calcula o momento exato de revisar — antes que seu cérebro esqueça.',
  },
  {
    icon: '📋',
    titulo: 'Acorde sabendo exatamente o que estudar',
    desc: 'Seu plano do dia já está pronto. Sem montar cronograma, sem perder tempo.',
  },
  {
    icon: '❓',
    titulo: 'Treine o raciocínio clínico de verdade',
    desc: 'Questões estilo prova com gabarito comentado — você aprende até com o erro.',
  },
  {
    icon: '📚',
    titulo: 'Conteúdo direto ao ponto, por semestre',
    desc: 'Só o que cai na prova, organizado pelo seu período. Zero enrolação.',
  },
  {
    icon: '📈',
    titulo: 'Veja sua memória se consolidando',
    desc: 'Acompanhe o progresso real do seu aprendizado — dia após dia.',
  },
];

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', 'Atkinson Hyperlegible', sans-serif",
    }}>

      {/* ── Header ── */}
      <header style={{
        padding: '20px 48px',
        borderBottom: '1px solid rgba(201,164,85,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Image
          src="/logo.png"
          alt="NeuroFix Med"
          width={180}
          height={54}
          style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
          priority
        />
        <Link href="/login" style={{
          fontSize: '13px',
          color: 'rgba(201,164,85,0.8)',
          textDecoration: 'none',
          fontWeight: '600',
          letterSpacing: '0.01em',
        }}>
          Já tenho conta →
        </Link>
      </header>

      {/* ── Hero ── */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '64px 48px',
        alignItems: 'center',
        gap: '80px',
      }}>

        {/* ── Esquerda — copy ── */}
        <div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(201,164,85,0.08)',
            border: '1px solid rgba(201,164,85,0.22)',
            borderRadius: '2px',
            padding: '5px 14px',
            marginBottom: '32px',
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#C9A455',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.2em',
              fontFamily: 'monospace',
            }}>
              NF · Fixação inteligente para medicina
            </span>
          </div>

          {/* Headline principal */}
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            lineHeight: '1.08',
            letterSpacing: '-0.03em',
            color: '#f0ede6',
            marginBottom: '24px',
          }}>
            Você não precisa<br />
            estudar mais.<br />
            Precisa parar de{' '}
            <span style={{
              background: 'linear-gradient(135deg, #C9A455, #E8CA7A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              esquecer.
            </span>
          </h1>

          {/* Gancho emocional */}
          <p style={{
            fontSize: '18px',
            color: '#6B9EC4',
            lineHeight: '1.5',
            marginBottom: '12px',
            fontWeight: '500',
            letterSpacing: '-0.01em',
          }}>
            Criado para quem já se dedica —<br />
            e ainda assim esquece na hora da prova.
          </p>

          {/* Explicação */}
          <p style={{
            fontSize: '15px',
            color: '#5a5a5a',
            lineHeight: '1.7',
            marginBottom: '40px',
          }}>
            Para o estudante que já leu, resumiu, assistiu à aula — e na prova
            a mente deu em branco. O problema não é você. É o método.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '16px 0',
                borderBottom: i < features.length - 1 ? '1px solid #1e1e1e' : 'none',
              }}>
                {/* Ícone */}
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: '#1a1a1a',
                  border: '1px solid #1e1e1e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '15px',
                }}>
                  {f.icon}
                </div>
                <div>
                  <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: '600', color: '#f0ede6', lineHeight: '1.3' }}>
                    {f.titulo}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#5a5a5a', lineHeight: '1.55', fontWeight: '300' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Direita — card de acesso ── */}
        <div style={{
          background: '#111111',
          border: '1px solid rgba(201,164,85,0.2)',
          borderRadius: '4px',
          padding: '44px 40px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
          position: 'relative' as const,
          overflow: 'hidden',
        }}>
          {/* Linha dourada no topo do card */}
          <div style={{
            position: 'absolute' as const,
            top: 0, left: 0, right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #C9A455, transparent)',
          }} />

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '900',
              color: '#f0ede6',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
            }}>
              Comece hoje —<br />
              <span style={{ color: '#C9A455' }}>o conteúdo do seu semestre</span>{' '}
              te espera.
            </h2>
            <p style={{ fontSize: '13px', color: '#5a5a5a', lineHeight: '1.6', margin: 0, fontWeight: '300' }}>
              Gratuito para começar. Sem precisar de cartão.
            </p>
          </div>

          {/* Divisor */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(201,164,85,0.2))' }} />
            <span style={{ fontSize: '10px', color: '#C9A455', fontWeight: '700', letterSpacing: '0.2em', fontFamily: 'monospace' }}>ACESSO</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(201,164,85,0.2))' }} />
          </div>

          {/* Botão principal */}
          <Link href="/cadastro" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '17px',
            background: 'linear-gradient(135deg, #C9A455, #E8CA7A)',
            borderRadius: '2px',
            textDecoration: 'none',
            marginBottom: '12px',
            boxShadow: '0 8px 24px rgba(201,164,85,0.18)',
          }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#0a0a0a', letterSpacing: '0.02em' }}>
              Quero parar de esquecer →
            </span>
          </Link>

          {/* Botão secundário */}
          <Link href="/login" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '15px',
            background: 'transparent',
            border: '1px solid rgba(201,164,85,0.2)',
            borderRadius: '2px',
            textDecoration: 'none',
            marginBottom: '28px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#C9A455' }}>
              Já tenho conta — Entrar
            </span>
          </Link>

          {/* Segurança */}
          <div style={{
            background: 'rgba(201,164,85,0.04)',
            border: '1px solid rgba(201,164,85,0.1)',
            borderRadius: '2px',
            padding: '14px 16px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '12px', color: '#3a3a3a', lineHeight: '1.7', margin: 0, fontWeight: '300' }}>
              🔒 Login seguro com Google — sem senha para lembrar.<br />
              Seus dados ficam salvos automaticamente.
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        padding: '20px 48px',
        borderTop: '1px solid rgba(201,164,85,0.08)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '12px', color: '#2a2a2a', margin: 0 }}>
          © 2026 NeuroFix Med — Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
