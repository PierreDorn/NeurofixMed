# Arquivamento — 2026-07-09

Features tiradas do ar em 09/07/2026. Código preservado aqui para reativação futura sem retrabalho.

## O que foi arquivado

| Pasta original                    | Nova localização                  | Motivo                                     |
|-----------------------------------|-----------------------------------|--------------------------------------------|
| `app/onboarding/`                 | `app-onboarding/`                 | Fluxo de configuração inicial descontinuado |
| `app/admin/`                      | `app-admin/`                      | Painel administrativo pausado               |
| `components/admin/`               | `components-admin/`               | Componentes do admin                        |
| `app/(app)/`                      | `app-app/`                        | Dashboard, biblioteca, questões, etc. — todo o app logado pausado |
| `components/Sidebar.tsx`          | `components-Sidebar.tsx`          | Sidebar (só usada dentro de `(app)`)        |
| `components/notifications/`       | `components-notifications/`       | Sistema de notificações pausado             |
| `app/notifications-actions.ts`    | `app-notifications-actions.ts`    | Server actions das notificações             |
| `app/api/cron/`                   | `app-api-cron/`                   | Crons de notificações e revisões            |

## Estado do site após arquivamento

- **Ativo**: landing (`/` → `/landing.html`), páginas de auth (`/login`, `/cadastro`, `/auth/callback`), páginas legais (`/termos-de-uso`, `/politica-de-privacidade`).
- **404 gracioso**: qualquer rota arquivada cai no `app/not-found.tsx` — fundo escuro + bolinha dourada no canto inferior esquerdo (sem texto de erro).

## Referências que foram redirecionadas para `/dashboard`

Os pontos abaixo apontavam para `/onboarding` e foram todos remanejados na mesma sessão:

- `app/auth/callback/route.ts` — todo usuário autenticado agora vai direto ao dashboard
- `app/(auth)/cadastro/page.tsx` — 3 pontos (Google OAuth, email confirm, sessão pós-signup)
- `app/(auth)/login/page.tsx` — Google OAuth
- `public/landing.html` — CTA do overlay `?comprado=1`
- `app/(app)/layout.tsx` — removido `onboarding_done` do select em `student_profiles`

## Banco de dados — nada foi migrado

As migrations do Supabase seguem intactas em `supabase/migrations/`. As tabelas continuam existindo e podem ser reativadas a qualquer momento sem alteração de schema.

Migrations diretamente ligadas às features arquivadas:

| Migration                                                     | Feature                    |
|---------------------------------------------------------------|----------------------------|
| `20260624120000_perfis_estudantes_conteudos_gerados.sql`      | Onboarding (student_profiles) |
| `20260624130000_neuro_ia_cache_e_rate_limit.sql`              | Neuro IA (usada no admin)     |
| `20260603120000_agenda_revisao_sistema.sql`                   | Agenda/revisão (admin gerenciava) |
| `20260603130000_srs_adaptativo.sql`                           | SRS (admin gerenciava)       |
| `20260604120000_fix_revisoes_horario_titulo.sql`              | Idem                         |

## Como reativar

1. Mover as pastas de volta para os locais originais (`git mv`).
2. Reverter os redirects do `/dashboard` para `/onboarding` nos arquivos listados acima.
3. Restaurar o `select('perfil_cognitivo, semestre, onboarding_done')` em `app/(app)/layout.tsx`.
4. Testar fluxo completo signup → onboarding → dashboard.

Nada foi apagado — só desconectado das rotas ativas.
