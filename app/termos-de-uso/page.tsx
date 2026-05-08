import Link from 'next/link';

export default function TermosDeUsoPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b14',
      color: '#c8d4e0',
      fontFamily: "'Inter', sans-serif",
      padding: '48px 24px',
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <Link href="/" style={{ color: '#C9A455', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
            ← Voltar ao início
          </Link>
          <h1 style={{
            fontSize: '32px', fontWeight: '900', color: '#f0ede6',
            marginTop: '24px', marginBottom: '8px', letterSpacing: '-0.02em',
          }}>
            Termos de Uso
          </h1>
          <p style={{ fontSize: '13px', color: '#3a5a7a' }}>
            Última atualização: maio de 2026
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              1. Aceitação dos Termos
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Ao acessar ou usar o <strong style={{ color: '#f0ede6' }}>NeuroFix Med</strong>, você concorda com estes Termos de Uso e com nossa Política de Privacidade. Se não concordar com qualquer parte destes termos, não utilize a plataforma.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              2. Sobre a plataforma
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              O NeuroFix Med é uma plataforma educacional de apoio ao estudo para estudantes de medicina. Utilizamos técnicas de repetição espaçada e inteligência artificial para personalizar o conteúdo e ajudar na fixação do conhecimento. O conteúdo disponível tem fins exclusivamente educacionais e não substitui orientação médica profissional.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              3. Elegibilidade
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              A plataforma é destinada a estudantes de medicina e profissionais da saúde com 18 anos ou mais. Ao criar uma conta, você declara ter a idade mínima exigida ou ter obtido consentimento dos responsáveis legais.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              4. Conta e acesso
            </h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', lineHeight: '1.7' }}>
              <li>O acesso é feito via Google OAuth — você é responsável por manter sua conta Google segura</li>
              <li>Cada pessoa pode ter apenas uma conta no NeuroFix Med</li>
              <li>É proibido compartilhar ou transferir sua conta para terceiros</li>
              <li>Você é responsável por todas as atividades realizadas com sua conta</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              5. Uso aceitável
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px', marginBottom: '12px' }}>
              Você concorda em não:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', lineHeight: '1.7' }}>
              <li>Usar a plataforma para fins ilegais ou não autorizados</li>
              <li>Tentar acessar dados de outros usuários</li>
              <li>Realizar engenharia reversa ou copiar o código da plataforma</li>
              <li>Reproduzir ou distribuir conteúdo protegido sem autorização</li>
              <li>Usar bots ou sistemas automatizados para interagir com a plataforma</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              6. Conteúdo educacional
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Todo o conteúdo disponível no NeuroFix Med tem fins educacionais e de apoio ao estudo. Não somos um provedor de serviços médicos e o conteúdo não deve ser interpretado como diagnóstico, tratamento ou orientação clínica. Para decisões médicas, consulte sempre um profissional habilitado.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              7. Plano gratuito e futuras cobranças
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Atualmente o NeuroFix Med oferece acesso gratuito. Podemos introduzir planos pagos no futuro, com aviso prévio aos usuários. O acesso gratuito existente será respeitado conforme a política vigente no momento da mudança.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              8. Propriedade intelectual
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Todo o conteúdo, design, código e marca do NeuroFix Med são protegidos por direitos autorais. É proibida a reprodução, distribuição ou criação de obras derivadas sem autorização expressa. O conteúdo gerado pelos próprios usuários permanece de propriedade deles, com licença de uso concedida à plataforma para fins de funcionamento do serviço.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              9. Limitação de responsabilidade
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              O NeuroFix Med é fornecido "como está". Não garantimos que a plataforma estará disponível ininterruptamente ou livre de erros. Não nos responsabilizamos por perdas decorrentes do uso ou impossibilidade de uso da plataforma, nem pelo desempenho acadêmico ou profissional dos usuários.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              10. Encerramento de conta
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Você pode solicitar o encerramento da sua conta a qualquer momento pelo e-mail <a href="mailto:neurofixmed@gmail.com" style={{ color: '#C9A455' }}>neurofixmed@gmail.com</a>. Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos, com ou sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              11. Alterações nos Termos
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Podemos modificar estes Termos a qualquer momento. Alterações significativas serão comunicadas com antecedência. O uso contínuo da plataforma após as alterações implica aceitação dos novos Termos.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              12. Lei aplicável
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Estes Termos são regidos pelas leis da República Federativa do Brasil, incluindo o Código de Defesa do Consumidor (Lei nº 8.078/1990) e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Qualquer disputa será resolvida no foro da comarca de domicílio do usuário.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              13. Contato
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Dúvidas sobre estes Termos? Entre em contato:<br />
              E-mail: <a href="mailto:neurofixmed@gmail.com" style={{ color: '#C9A455' }}>neurofixmed@gmail.com</a>
            </p>
          </section>

        </div>

        {/* Footer */}
        <div style={{
          marginTop: '64px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(201,164,85,0.1)',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
        }}>
          <Link href="/politica-de-privacidade" style={{ color: '#C9A455', fontSize: '13px', textDecoration: 'none' }}>
            Política de Privacidade
          </Link>
          <Link href="/login" style={{ color: '#5a7a9a', fontSize: '13px', textDecoration: 'none' }}>
            Entrar na plataforma
          </Link>
          <Link href="/" style={{ color: '#5a7a9a', fontSize: '13px', textDecoration: 'none' }}>
            Início
          </Link>
        </div>

      </div>
    </div>
  );
}
