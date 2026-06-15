# Changelog - Glix

Este changelog resume os principais marcos do projeto. As datas são aproximadas e agrupadas por fase de desenvolvimento, não por tags formais de release.

## MVP Atual

### Documentação e Definição de Produto

- Criada a visão inicial de produto.
- Definido o escopo do MVP.
- Documentada a estrutura do banco de dados.
- Adicionadas notas de segurança e roadmap.
- Documentação reformulada para apresentação em portfólio.

### Setup do Projeto

- Criado o projeto Next.js.
- Configurado TypeScript.
- Adicionado Tailwind CSS.
- Adicionados componentes base de UI.
- Organizada a estrutura inicial do projeto.

### Integração com Supabase

- Adicionados helpers de cliente Supabase.
- Configurado Supabase Auth.
- Adicionado gerenciamento de sessão para rotas protegidas.
- Criado script de setup do banco de dados.
- Adicionadas as tabelas `profiles` e `glucose_records`.
- Habilitado Row Level Security.
- Adicionadas policies para acesso a dados pertencentes ao usuário.
- Documentado o hardening do Supabase Security Advisor para `public.handle_new_user()`.
- Adicionado `search_path` fixo da função e revogadas permissões diretas de execução no script de setup.

### Autenticação

- Implementado cadastro.
- Implementado login.
- Implementado logout.
- Adicionado roteamento protegido do dashboard.
- Adicionada orientação de confirmação de e-mail para usuários.
- Adicionados controles de mostrar/ocultar senha nas páginas de login e cadastro.

### CRUD de Registros de Glicemia

- Adicionada criação de registros de glicemia.
- Adicionada listagem de registros para usuários autenticados.
- Adicionada edição de registros.
- Adicionada exclusão de registros.
- Preservadas verificações de propriedade do usuário nas mutações.

### Dashboard

- Adicionados cards de resumo.
- Adicionados filtros temporais.
- Adicionado filtro por contexto.
- Adicionados badges de classificação de glicemia.
- Adicionados insights automáticos.
- Adicionado gráfico de evolução da glicemia.
- Melhorado o layout mobile-first do dashboard.

### Navegação do App Logado

- Adicionada `/registrar` como rota principal após login para registro rápido de glicemia.
- Simplificada `/dashboard` em uma visão curta de resumo focada nos indicadores principais e em um gráfico compacto.
- Adicionada `/historico` como área de histórico detalhado para filtros, observações, edição e exclusão.
- Atualizada a navegação logada para: Registrar, Resumo, Historico e Sair.
- Adicionado atalho flutuante `+` do resumo/histórico de volta para o registro rápido.
- Adicionada `/conta` com informações básicas de perfil e edição de nome.
- Adicionadas páginas públicas iniciais de termos de uso e política de privacidade.

### Identidade Visual

- Criados assets visuais oficiais no Canva.
- Adicionado logo do Glix.
- Adicionado ícone do app.
- Adicionada imagem hero da landing.
- Adicionado asset de preview do dashboard.
- Aplicada direção visual health tech nas páginas.
- Substituída a imagem hero da landing por um mockup em HTML/CSS com estilo de produto.
- Melhorada a legibilidade da landing page e reduzida a sensação de marketing genérico.

### Preparação PWA

- Adicionada rota de manifest.
- Adicionada referência ao ícone do app.
- Adicionadas cores de tema e background.
- Adicionados screenshots iniciais ao manifest.
- Preparados metadados de instalação mobile.
- Melhorada a instalabilidade do PWA.
- Criados ícones públicos de PWA para navegador e instalação mobile.
- Adicionados metadados de ícone para uso mobile instalável.

### Deploy

- MVP publicado na Vercel.
- Projeto conectado ao repositório GitHub.
- Validado o fluxo de build orientado à produção.

### Refatoração de Arquitetura

- Extraídos componentes reutilizáveis de dashboard:
  - DashboardHeader
  - FilterBar
  - SummaryCards
  - InsightCards
  - GlucoseChart
  - MeasurementForm
  - HistoryList
  - StatusBadge
  - SubmitButton
- Adicionados tipos compartilhados de glicemia.
- Centralizadas regras, métricas e validação de glicemia.
- Melhorada a segurança de tipos em TypeScript.
- Adicionados estados de envio loading/disabled.

### Validação

- Adicionada validação centralizada para:
  - intervalo do valor de glicemia;
  - contexto;
  - tamanho das observações;
  - datas;
  - envios vazios.

### Refinamento de UI/UX

- Melhorada a legibilidade do dashboard para uso mobile e como PWA instalado.
- Aumentado o conforto das áreas de toque em filtros, ações e controles de formulário.
- Melhorado o contraste de textos secundários em cards, gráfico, histórico e mensagens auxiliares.
- Refinada a experiência mobile-first do dashboard, preservando o fluxo CRUD existente.
- Refinado o fluxo central do produto em torno de registro diário rápido e revisão mais profunda opcional.

## Próximos Marcos Planejados

- Adicionar testes automatizados para helpers de validação.
- Adicionar fluxo de recuperação de senha.
- Adicionar página/fluxo dedicado de consentimento LGPD.
- Adicionar checklist de QA para testes mobile/PWA.
- Adicionar exportação CSV/PDF.
- Adicionar fluxo de exclusão de conta.
- Melhorar testes de acessibilidade.
- Adicionar monitoramento de produção.
