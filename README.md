# Glix

Glix é um app simples para controle pessoal de glicose. O objetivo do MVP é permitir
que uma pessoa crie uma conta, registre medições e acompanhe seu histórico de forma
limpa, segura e responsiva.

> O Glix não realiza diagnóstico médico. Ele funciona como ferramenta de registro e
> acompanhamento pessoal.

## Funcionalidades do MVP

- Cadastro e login com Supabase Auth
- Área protegida para usuários autenticados
- Cadastro de medições de glicose
- Listagem das medições do usuário logado
- Edição e exclusão de registros
- Campos básicos: valor, data/hora, contexto e observações
- Filtro por contexto
- Interface responsiva com base mobile-first
- Manifest básico para uso como PWA

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database com Row Level Security
- shadcn/base-ui para componentes básicos

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env.local` com as variáveis públicas do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-ou-publishable
```

3. Configure o banco no Supabase executando o SQL de `SUPABASE_SETUP.md`.

4. Rode o servidor de desenvolvimento:

```bash
npm run dev
```

5. Abra:

```text
http://localhost:3000
```

## Segurança

- O app usa Supabase Auth para autenticação.
- As ações do servidor verificam o usuário logado antes de criar, editar ou excluir dados.
- As queries de edição/exclusão filtram por `user_id`.
- O banco deve manter Row Level Security ativado para garantir isolamento entre usuários.
- O arquivo `.env.local` não deve ser versionado.

## Estrutura principal

```text
src/app/page.tsx                 Página inicial
src/app/login/page.tsx           Login
src/app/register/page.tsx        Cadastro
src/app/dashboard/page.tsx       Dashboard protegido
src/app/dashboard/actions.ts     Server Actions de medições
src/app/auth/actions.ts          Server Actions de autenticação
src/utils/supabase/              Clientes Supabase
SUPABASE_SETUP.md                Script SQL do banco
```

## Scripts úteis

```bash
npm run dev
npm run lint
npm run build
```

## Próximos passos

- Melhorar o ícone e assets do PWA
- Criar gráfico simples de evolução
- Adicionar exportação CSV ou PDF
- Melhorar mensagens de erro vindas do Supabase
- Revisar UX em celulares reais
- Preparar deploy na Vercel
