# Glix

Glix é um micro-SaaS/PWA mobile-first para acompanhamento pessoal de glicemia. Ele ajuda usuários a registrar medições rapidamente, revisar um resumo simples e acessar um histórico detalhado e editável quando necessário.

Produção: [https://glix-one.vercel.app/](https://glix-one.vercel.app/)  
Repositório: [https://github.com/brunogiacomelli1979-cyber/Glix](https://github.com/brunogiacomelli1979-cyber/Glix)

> Glix é um diário pessoal de acompanhamento. Ele não fornece diagnóstico médico, orientação de tratamento ou recomendações clínicas.

## Status

Status atual: MVP pronto para portfólio e publicado em produção.

O projeto já inclui autenticação, fluxo rápido de registro, telas protegidas de resumo e histórico, CRUD para registros de glicemia, classificação visual, filtros temporais, insights automáticos, gráfico básico de evolução, validação centralizada, componentes reutilizáveis, interface mobile-first refinada e suporte a PWA instalável.

## Visão Geral do Produto

Muitas pessoas ainda acompanham medições de glicemia usando anotações em papel, planilhas ou aplicativos fragmentados. O Glix explora uma experiência mais calma, clara e organizada para o registro pessoal de glicemia.

O produto se concentra em:

- registro rápido de medições de glicemia;
- acesso seguro com contas de usuário;
- resumo curto para revisão diária;
- histórico organizado e editável por período e contexto;
- tendências visuais simples, sem interpretação clínica;
- interface mobile-first adequada ao uso diário.

O Glix intencionalmente não é posicionado como ferramenta clínica. Ele é um diário digital para organização pessoal e para apoiar conversas melhores com profissionais de saúde.

## Abordagem de Desenvolvimento Assistida por IA

O Glix foi construído com um fluxo de desenvolvimento assistido por IA, combinando ferramentas low-code/low-friction com código real de aplicação e práticas modernas de engenharia.

Ferramentas usadas no processo:

- ChatGPT para mentoria, decisões de arquitetura, documentação e raciocínio de produto;
- Codex/Antigravity para geração de código, refatoração e apoio à implementação;
- Canva para identidade visual e assets oficiais;
- Supabase como backend-as-a-service;
- Vercel para deploy;
- GitHub para controle de versão.

Este não é um projeto "100% no-code". A aplicação inclui código real escrito em Next.js, TypeScript, Server Actions, componentes reutilizáveis, validação centralizada, integração com Supabase e deploy em produção.

## Stack

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- componentes no estilo shadcn/ui
- Supabase Auth
- Supabase Database
- Row Level Security
- Vercel
- GitHub
- Canva
- fluxo assistido por ChatGPT/Codex

## Principais Funcionalidades

- Página pública inicial com branding oficial do Glix
- Hero da página inicial em estilo de produto, construído com HTML/CSS, evitando mockups externos genéricos
- Autenticação por e-mail/senha com Supabase Auth
- Controle de mostrar/ocultar senha nas páginas de login e cadastro
- Experiência protegida após login dividida em três áreas claras:
  - `Registrar`: registro diário rápido de glicemia
  - `Resumo`: dashboard curto com indicadores principais
  - `Historico`: histórico detalhado com filtros, edição e exclusão
- Registro rápido de glicemia após login
- Criação, edição e exclusão de registros de glicemia
- Campos: valor da glicemia, data/hora, contexto da medição e observações
- Filtros temporais: hoje, 7 dias, 30 dias e 90 dias
- Filtro por contexto
- Classificação da glicemia:
  - baixa: abaixo de 70 mg/dL
  - normal: 70 a 140 mg/dL
  - atenção: 141 a 180 mg/dL
  - alta: acima de 180 mg/dL
- Badges visuais por registro e card de resumo
- Insights automáticos:
  - média do período
  - contagem de registros altos
  - tendência
  - estabilidade
- Gráfico de evolução
- Atalho flutuante `+` do resumo/histórico para a tela de registro rápido
- Validação centralizada
- UI responsiva mobile-first
- Contraste e legibilidade aprimorados em cards do dashboard, filtros, gráfico, histórico e formulários
- PWA instalável com manifest, ícones públicos e metadados de instalação mobile

## Fluxo do Usuário Logado

O app privado é organizado em torno da tarefa mais comum no uso real: registrar uma medição de glicemia rapidamente.

```text
Login -> Registrar -> Resumo -> Historico
```

Rotas principais:

- `/registrar`: rota principal após login, focada em salvar uma nova medição em segundos.
- `/dashboard`: visão compacta de resumo com última medição, média de 7 dias, mínimo/máximo, tendência, insight e mini gráfico.
- `/historico`: visão detalhada com histórico filtrado completo, observações, edição e exclusão.

Essa separação mantém a experiência diária simples, preservando análise e gestão de registros para os momentos em que o usuário quer revisar detalhes.

## Screenshots e Assets

Os assets visuais oficiais ficam em:

```text
public/branding/
```

Assets disponíveis:

- `glix-logo-main.png`
- `glix-app-icon.png`
- `glix-splash-screen.png`
- `glix-landing-hero.png`
- `glix-dashboard-preview.png`

Ícones de PWA também estão disponíveis em `public/` para suporte à instalação em navegadores e dispositivos móveis.

## Resumo da Arquitetura

O app usa o Next.js App Router com acesso a dados server-side via Supabase. O dashboard é protegido pelo gerenciamento de sessão do Supabase e lê apenas os registros de glicemia do usuário autenticado.

Fluxo em alto nível:

```text
Usuário -> Next.js App Router -> Server Actions / Server Components -> Supabase Auth + Database -> UI logada
```

Decisões arquiteturais principais:

- Server Actions lidam com mutações.
- Server Components buscam dados protegidos para `Registrar`, `Resumo` e `Historico`.
- Supabase Auth gerencia a identidade do usuário.
- Supabase Row Level Security isola os dados por usuário.
- A UI logada é dividida em componentes reutilizáveis.
- Regras e validação de glicemia são centralizadas em `src/lib/glucose.ts`.
- Tipos compartilhados ficam em `src/types/glucose.ts`.

## Segurança e Privacidade

O Glix usa Supabase Auth e Row Level Security para manter os registros de cada usuário isolados.

Práticas atuais de segurança:

- rotas autenticadas para acesso ao dashboard privado;
- consultas específicas por usuário;
- policies de RLS no Supabase;
- nenhuma chave `service_role` no frontend;
- apenas chave anon/publishable pública;
- validação centralizada de entrada;
- `.env.local` excluído do controle de versão.
- hardening da função de trigger do Supabase documentado para `public.handle_new_user()`.

Veja [SECURITY.md](./SECURITY.md) para mais detalhes.

## Testando como PWA

Para testar a experiência instalável:

1. Abra o app em produção em um navegador mobile:

```text
https://glix-one.vercel.app/
```

2. Use a opção de instalação do navegador:

- Android/Chrome: menu -> Add to Home screen ou Install app.
- iOS/Safari: Share -> Add to Home Screen.

3. Abra o Glix pela tela inicial e verifique:

- o app abre em visualização mobile standalone;
- o ícone aparece corretamente;
- a landing page e o dashboard permanecem legíveis;
- login, filtros, gráfico, histórico e formulários mantêm o mesmo comportamento da versão no navegador.

O Glix não implementa cache offline para dados privados de glicemia nesta etapa. Isso é intencional para evitar armazenar dados sensíveis relacionados à saúde localmente sem uma estratégia de privacidade mais clara.

## Rodando Localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

Não faça commit de valores reais de ambiente.

3. Configure o Supabase usando:

```text
SUPABASE_SETUP.md
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Abra:

```text
http://localhost:3000
```

## Scripts Úteis

```bash
npm run dev
npm run lint
npm run build
```

## Estrutura do Projeto

```text
src/app/
  page.tsx                 Página pública inicial
  login/page.tsx           Página de login
  register/page.tsx        Página de cadastro
  dashboard/page.tsx       Página protegida de resumo
  dashboard/actions.ts     Server Actions para registros de glicemia
  historico/page.tsx       Histórico detalhado protegido
  registrar/page.tsx       Página protegida de registro rápido
  auth/actions.ts          Ações de autenticação

src/components/app/        Navegação e atalhos do app logado
src/components/dashboard/  Componentes do dashboard
src/components/measurements/ Componentes do formulário rápido de medição
src/components/ui/         Componentes base de UI
src/lib/glucose.ts         Regras, métricas e validação de glicemia
src/types/glucose.ts       Tipos compartilhados de glicemia
src/utils/supabase/        Clientes Supabase e helpers de sessão
public/branding/           Assets visuais oficiais
```

## Roadmap

Curto prazo:

- testar a experiência com usuários reais;
- adicionar página de perfil/conta;
- adicionar fluxo de recuperação de senha;
- adicionar página/fluxo dedicado de consentimento LGPD;
- criar checklist de QA para testes mobile/PWA;
- adicionar monitoramento de produção e rastreamento de erros;
- conectar um domínio customizado.

Médio prazo:

- exportar relatórios em CSV;
- exportar relatórios em PDF como futura funcionalidade premium;
- configurações de perfil;
- fluxo de exclusão de conta;
- analytics e monitoramento de produção.
- avaliação do Supabase Pro se o produto avançar além de MVP/testes.

Ideias futuras premium:

- relatórios avançados;
- exportação em PDF;
- histórico e exportações mais amplos;
- lembretes;
- integrações com ferramentas de automação;
- fluxos opcionais de compartilhamento com cuidador ou profissional.

## Aviso de Saúde

Glix não é um dispositivo médico e não fornece diagnóstico, tratamento ou orientação clínica. Usuários devem consultar profissionais de saúde qualificados para decisões médicas.
