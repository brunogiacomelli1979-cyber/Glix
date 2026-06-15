# Arquitetura - Glix

Este documento descreve a arquitetura atual do Glix, um micro-SaaS/PWA mobile-first para acompanhamento pessoal de glicemia.

## Visão Geral

O Glix é construído com uma arquitetura full-stack moderna baseada em Next.js e Supabase.

Fluxo em alto nível:

```text
Browser / PWA
  -> Next.js App Router
  -> Server Components e Server Actions
  -> Supabase Auth e Supabase Database
  -> Row Level Security
```

A aplicação é intencionalmente pequena, mas organizada para que o MVP possa evoluir sem se tornar difícil de manter.

## Frontend

O frontend usa:

- Next.js App Router
- TypeScript
- Tailwind CSS
- primitivas no estilo shadcn/ui
- componentes reutilizáveis de dashboard
- layouts mobile-first

Rotas principais:

```text
/              Página pública inicial
/login         Página de login
/register      Página de cadastro
/dashboard     Dashboard autenticado protegido
```

A UI segue uma direção visual health tech:

- paleta calma em azul-marinho e aqua;
- cards brancos;
- sombras sutis;
- bordas suaves;
- espaçamento mobile-first;
- mensagens de feedback discretas.

## Backend

O Supabase é usado como backend-as-a-service.

Responsabilidades do backend:

- autenticação de usuários;
- gerenciamento de sessão;
- persistência dos registros de glicemia;
- Row Level Security;
- controle de acesso específico por usuário.

O app não usa um servidor de API customizado. Mutações são tratadas por Next.js Server Actions e helpers de cliente Supabase.

## Autenticação

A autenticação é tratada pelo Supabase Auth.

Fluxo atual de autenticação:

1. O usuário cria conta ou entra com e-mail/senha.
2. O Supabase gerencia a sessão.
3. O middleware/proxy do Next.js protege rotas privadas.
4. Usuários autenticados acessam `/dashboard`.
5. Usuários desconectados são redirecionados para `/login`.

O fluxo de autenticação deve permanecer pequeno e previsível para o MVP.

## Banco de Dados Supabase

Tabelas principais:

- `profiles`
- `glucose_records`

A tabela `glucose_records` armazena:

- `id`
- `user_id`
- `value_mgdl`
- `context`
- `notes`
- `recorded_at`
- `created_at`

A estrutura do banco de dados está documentada em `SUPABASE_SETUP.md`.

## Row Level Security

RLS é uma parte central da arquitetura.

As policies garantem que usuários só possam:

- ler o próprio perfil;
- atualizar o próprio perfil;
- ler os próprios registros de glicemia;
- inserir registros para o próprio id de usuário;
- atualizar os próprios registros;
- excluir os próprios registros.

O frontend também filtra mutações por `user_id`, mas o banco de dados permanece como a camada final de enforcement.

## Fluxo de Dados

Fluxo de dados do dashboard:

```text
Página do dashboard
  -> criar cliente server do Supabase
  -> ler usuário autenticado
  -> consultar glucose_records
  -> aplicar filtros de período/contexto
  -> calcular métricas e insights
  -> renderizar componentes reutilizáveis do dashboard
```

Fluxo de mutação:

```text
Envio de formulário
  -> Server Action
  -> validar dados do formulário
  -> ler usuário autenticado
  -> escrever no Supabase
  -> revalidar dashboard
  -> redirecionar com feedback para o usuário
```

## Organização do Código

Pastas importantes:

```text
src/app/
  Páginas do App Router e Server Actions

src/components/dashboard/
  Componentes reutilizáveis do dashboard:
  - DashboardHeader
  - FilterBar
  - SummaryCards
  - InsightCards
  - GlucoseChart
  - MeasurementForm
  - HistoryList
  - StatusBadge
  - SubmitButton

src/components/ui/
  Primitivas base de UI

src/lib/
  Regras de produto, validação e helpers de métricas

src/types/
  Tipos TypeScript compartilhados

src/utils/supabase/
  Helpers de cliente Supabase
```

## Camada de Validação

A validação é centralizada em `src/lib/glucose.ts`.

Regras atuais:

- o valor da glicemia deve estar entre 20 e 600 mg/dL;
- o contexto deve ser um dos valores permitidos;
- observações são limitadas a 300 caracteres;
- datas inválidas são rejeitadas;
- campos obrigatórios vazios são rejeitados.

Isso mantém o tratamento de formulários consistente entre fluxos de criação e atualização.

## Deploy

Deploy em produção:

[https://glix-one.vercel.app/](https://glix-one.vercel.app/)

Plataforma de deploy:

- Vercel

Controle de versão:

- GitHub

O app usa variáveis de ambiente públicas do Supabase. Chaves privadas `service_role` não devem ser expostas no frontend nem commitadas no repositório.

## Considerações de Escalabilidade

A arquitetura atual é adequada para um MVP e uma versão inicial de portfólio.

Melhorias futuras de escalabilidade podem incluir:

- índices de banco de dados para consultas maiores de histórico;
- paginação ou carregamento infinito para registros;
- tipos gerados do Supabase para o TypeScript;
- testes automatizados para Server Actions e validação;
- observabilidade e rastreamento de erros;
- fronteiras de API caso integrações externas se tornem necessárias;
- estratégia aprimorada de cache offline para PWA;
- módulo separado de relatórios.

## Melhorias Técnicas a Considerar

- Adicionar testes unitários para `src/lib/glucose.ts`.
- Gerar tipos TypeScript do Supabase a partir do schema do banco.
- Adicionar testes de integração para autenticação e fluxos de registros.
- Adicionar monitoramento de produção.
- Adicionar política de privacidade e fluxo de exclusão de conta.
- Melhorar testes de acessibilidade com teclado e leitores de tela.
