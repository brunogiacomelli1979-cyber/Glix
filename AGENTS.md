# AGENTS.md - Glix

Orientações para futuras sessões do Codex trabalhando no Glix.

## Resumo do Projeto

Glix é um PWA/micro-SaaS mobile-first para registro pessoal de glicemia. É um diário digital para organizar medições de glicemia, tendências e histórico. Ele não deve ser apresentado nem evoluído como ferramenta de diagnóstico, tratamento ou recomendação médica.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- componentes no estilo shadcn/ui
- Supabase Auth
- Supabase Database com Row Level Security
- deploy na Vercel
- manifest de PWA e ícones públicos

Antes de alterar código específico de framework, lembre que este projeto usa uma versão moderna do Next.js. Verifique os padrões atuais do projeto e os arquivos locais antes de assumir comportamento de APIs antigas.

## Áreas Atuais do Produto

- `/registrar`: fluxo principal após login para registro rápido de glicemia.
- `/dashboard`: visão curta de resumo com indicadores principais e gráfico.
- `/historico`: histórico detalhado com filtros, edição e exclusão.
- Páginas públicas: landing, login e cadastro.

Preserve o tom do produto: calmo, claro, health tech, sem alarmismo e focado em organização.

## Comandos de Validação

Use comandos Windows:

```bash
npm.cmd run lint
npm.cmd run build
```

Rode ambos após alterações de código quando viável. Alterações apenas de documentação também podem rodá-los quando solicitado.

## Regras de Segurança

- Nunca exponha nem solicite chaves `service_role`.
- Nunca faça commit de `.env.local` ou segredos reais.
- Nunca desative RLS.
- Nunca enfraqueça policies do Supabase sem confirmação explícita.
- Não altere autenticação, schema de banco, RLS, migrations SQL ou código sensível de segurança sem perguntar antes.
- Peça confirmação antes de qualquer mudança em banco de dados, autenticação ou segurança.
- Não use `localStorage`, IndexedDB, cache de service worker ou cache offline para dados sensíveis de glicemia, a menos que o usuário aprove explicitamente um desenho revisado de privacidade.
- Não adicione IA médica, diagnóstico, orientação de tratamento, recomendações clínicas ou mensagens alarmistas.
- Mantenha o Glix posicionado como diário pessoal, não como dispositivo médico.

## Princípios de Desenvolvimento

- Prefira mudanças pequenas e focadas.
- Preserve a arquitetura existente e as Server Actions, a menos que haja uma razão clara para mudar.
- Reutilize componentes e helpers existentes antes de criar novas abstrações.
- Mantenha a validação centralizada nos helpers de glicemia/domínio existentes.
- Preserve UX mobile-first e áreas de toque confortáveis.
- Evite dependências pesadas, salvo justificativa clara.
- Separe funcionalidades em mudanças incrementais e fáceis de revisar.

## Expectativas de Documentação

Ao alterar comportamento do produto, atualize a documentação relevante se solicitado ou se a mudança afetar:

- fluxo do usuário;
- rotas;
- postura de segurança;
- comportamento de PWA;
- roadmap;
- instruções de setup.

Mantenha a documentação profissional, honesta e adequada para avaliação em portfólio.

## Estilo de Commit

Use mensagens curtas no imperativo, por exemplo:

```text
Add quick glucose registration
Split dashboard and history views
Update documentation for new app navigation
```

Não crie commits a menos que o usuário peça.
