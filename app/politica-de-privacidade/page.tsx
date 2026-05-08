import Link from 'next/link';

export default function PoliticaPrivacidadePage() {
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
            Política de Privacidade
          </h1>
          <p style={{ fontSize: '13px', color: '#3a5a7a' }}>
            Última atualização: maio de 2026
          </p>
        </div>

        {/* Conteúdo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              1. Quem somos
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              O <strong style={{ color: '#f0ede6' }}>NeuroFix Med</strong> é uma plataforma de estudo personalizado para estudantes de medicina, desenvolvida para auxiliar na fixação de conteúdo por meio de repetição espaçada e inteligência artificial. Somos responsáveis pelo tratamento dos seus dados pessoais conforme descrito nesta Política.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              2. Quais dados coletamos
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px', marginBottom: '12px' }}>
              Ao se cadastrar via Google, coletamos automaticamente:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', lineHeight: '1.7' }}>
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Foto de perfil (fornecida pelo Google)</li>
            </ul>
            <p style={{ lineHeight: '1.8', fontSize: '14px', marginTop: '12px' }}>
              Durante o onboarding, coletamos adicionalmente:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', lineHeight: '1.7' }}>
              <li>Semestre/fase do curso de medicina</li>
              <li>Objetivo principal de estudo (faculdade, ENAMED, residência etc.)</li>
              <li>Perfil cognitivo para adaptação da interface</li>
              <li>Nome da instituição de ensino (opcional)</li>
              <li>Data de nascimento (para verificação de idade — LGPD)</li>
            </ul>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              3. Como usamos seus dados
            </h2>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', lineHeight: '1.7' }}>
              <li>Personalizar seu plano de estudos e conteúdo exibido</li>
              <li>Adaptar a interface ao seu perfil cognitivo</li>
              <li>Enviar lembretes de estudo por e-mail (se ativado)</li>
              <li>Gerar estatísticas de progresso pessoal</li>
              <li>Melhorar os algoritmos de repetição espaçada</li>
            </ul>
            <p style={{ lineHeight: '1.8', fontSize: '14px', marginTop: '12px' }}>
              Nunca vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              4. Login com Google — Google OAuth
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Utilizamos o serviço de autenticação do Google (OAuth 2.0). Ao clicar em "Entrar com Google", você autoriza o NeuroFix Med a acessar apenas seu nome, e-mail e foto de perfil. Não temos acesso à sua senha do Google nem a nenhum outro dado da sua conta Google além do explicitamente autorizado. Você pode revogar esse acesso a qualquer momento em <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: '#C9A455' }}>myaccount.google.com/permissions</a>.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              5. Armazenamento e segurança
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Seus dados são armazenados de forma segura na plataforma Supabase (infraestrutura AWS), com criptografia em trânsito (TLS) e em repouso. Adotamos as melhores práticas de segurança para proteger suas informações contra acesso não autorizado, perda ou destruição.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              6. Seus direitos — LGPD
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px', marginBottom: '12px' }}>
              Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', lineHeight: '1.7' }}>
              <li>Confirmar a existência de tratamento dos seus dados</li>
              <li>Acessar seus dados pessoais armazenados</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
              <li>Solicitar a exclusão dos seus dados da plataforma</li>
              <li>Revogar o consentimento a qualquer momento</li>
              <li>Ser informado sobre o compartilhamento de dados</li>
            </ul>
            <p style={{ lineHeight: '1.8', fontSize: '14px', marginTop: '12px' }}>
              Para exercer qualquer um desses direitos, entre em contato pelo e-mail: <a href="mailto:neurofixmed@gmail.com" style={{ color: '#C9A455' }}>neurofixmed@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              7. Cookies
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Utilizamos cookies estritamente necessários para manter sua sessão ativa e garantir o funcionamento da plataforma. Não utilizamos cookies de rastreamento ou publicidade de terceiros.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              8. Menores de idade
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              O NeuroFix Med é destinado a estudantes de medicina, em sua maioria maiores de 18 anos. Não coletamos intencionalmente dados de menores de 18 anos. Caso identifiquemos um cadastro de menor sem consentimento dos responsáveis, os dados serão excluídos imediatamente.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              9. Alterações nesta política
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Podemos atualizar esta Política de Privacidade periodicamente. Quando houver alterações relevantes, você será notificado por e-mail ou por aviso na plataforma. O uso contínuo do NeuroFix Med após as alterações implica aceitação da nova versão.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#6B9EC4', fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
              10. Contato
            </h2>
            <p style={{ lineHeight: '1.8', fontSize: '14px' }}>
              Dúvidas sobre esta política? Fale conosco:<br />
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
          <Link href="/termos-de-uso" style={{ color: '#C9A455', fontSize: '13px', textDecoration: 'none' }}>
            Termos de Uso
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
