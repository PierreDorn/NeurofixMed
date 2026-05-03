# MedStudy Neuro — MVP Next.js + Supabase

Aplicativo web para estudantes de medicina com login Google, perfil de aprendizagem, biblioteca por matéria/tópico/subtópico, questões com gabarito comentado, tarefas e lembretes por e-mail.

## Stack
- Next.js App Router
- Supabase Auth + Postgres + RLS
- Vercel para deploy e Cron Jobs
- Google Cloud para OAuth Client do login Google
- Cloudflare para DNS/domínio
- Resend para envio de e-mails de lembrete

## Rodar localmente
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Configurar Supabase
1. Crie um projeto no Supabase.
2. Rode o SQL de `supabase/schema.sql` no SQL Editor.
3. Em Authentication > Providers > Google, ative Google.
4. Adicione as URLs de redirect:
   - Local: `http://localhost:3000/auth/callback`
   - Produção: `https://SEU_DOMINIO/auth/callback`

## Configurar Google Cloud
1. Crie um OAuth Client ID do tipo Web.
2. Authorized redirect URI: a URL indicada pelo Supabase em Google Provider.
3. Copie Client ID e Client Secret para o painel do Supabase.

## Configurar Vercel
1. Importe o repositório do GitHub.
2. Adicione as variáveis do `.env.example`.
3. Deploy.
4. O arquivo `vercel.json` agenda o cron diário em `/api/cron/send-reminders`.

## Configurar Cloudflare
Use Cloudflare como DNS. No painel da Vercel, adicione o domínio ao projeto e copie os registros DNS exigidos para o painel da Cloudflare.

## Observação sobre e-mail
Este MVP usa Resend. Você pode trocar por SendGrid, Amazon SES ou Gmail API depois. Para produção, valide o domínio do remetente.

## Próximas melhorias
- Editor administrativo para cadastrar matérias e questões sem SQL.
- IA para gerar resumos, flashcards e questões.
- Plano premium e pagamentos.
- Modo foco, repetição espaçada e mapas mentais.
- Layout com configurações visuais específicas para TDAH, TEA e dislexia.
