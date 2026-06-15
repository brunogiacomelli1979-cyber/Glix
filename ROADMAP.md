# Roadmap - Glix

Este roadmap descreve o estado atual do Glix e possíveis próximos passos. Ele é intencionalmente prático e focado em evoluir o MVP sem overengineering.

## MVP Concluído

O MVP atual inclui:

- landing page pública;
- hero da landing construído com HTML/CSS para representar a interface do produto;
- identidade visual oficial;
- branding do Glix integrado em todo o app;
- UI responsiva mobile-first;
- legibilidade e contraste refinados no dashboard;
- fluxo rápido de registro de glicemia;
- `Registrar` como experiência principal após login;
- dashboard compacto de resumo;
- visão separada de histórico detalhado;
- navegação logada clara com Registrar, Resumo, Historico e Sair;
- página básica de conta com edição de nome;
- página inicial de termos de uso;
- página inicial de política de privacidade;
- autenticação Supabase;
- dashboard protegido;
- integração com banco de dados Supabase;
- policies de Row Level Security;
- criação, edição e exclusão de registros de glicemia;
- campos de medição:
  - valor da glicemia;
  - data/hora;
  - contexto;
  - observações;
- filtros temporais:
  - hoje;
  - 7 dias;
  - 30 dias;
  - 90 dias;
- filtro por contexto;
- área de histórico completo com filtro, edição e exclusão;
- badges de classificação de glicemia;
- insights automáticos;
- gráfico de evolução;
- validação centralizada;
- componentes reutilizáveis de dashboard;
- PWA básico instalável;
- manifest de PWA aprimorado;
- ícones públicos de PWA;
- deploy na Vercel;
- controle de versão no GitHub;
- documentação profissional do projeto.

## Melhorias de Curto Prazo

Prioridades para a próxima iteração:

- testar a experiência com usuários reais;
- adicionar fluxo de recuperação de senha;
- adicionar página/fluxo dedicado de consentimento LGPD;
- criar checklist de QA para testes mobile/PWA;
- conectar um domínio customizado;
- adicionar analytics básico;
- adicionar monitoramento de produção e rastreamento de erros;
- melhorar mensagens de feedback dos formulários;
- testar a experiência em dispositivos móveis reais;
- adicionar testes automatizados básicos para helpers de validação.

## Melhorias de Médio Prazo

Melhorias de produto e técnicas:

- exportação CSV;
- exportação PDF como futura funcionalidade premium;
- configurações de perfil;
- fluxo de exclusão de conta;
- interações aprimoradas no gráfico;
- paginação ou carregamento infinito para histórico;
- tipos TypeScript gerados do Supabase;
- auditoria de acessibilidade;
- monitoramento de deploy e rastreamento de erros.
- avaliação do Supabase Pro se o produto avançar além de MVP/testes;
- proteção contra senhas vazadas quando disponível por meio de um plano pago do Supabase.

## Futuras Funcionalidades Premium

Possível direção freemium/premium:

- relatórios avançados;
- exportações completas de histórico;
- exportação de relatório em PDF;
- lembretes;
- filtros salvos;
- tags customizadas;
- análise de tendências mais rica;
- compartilhamento opcional com cuidadores ou profissionais;
- templates de relatório.

Funcionalidades premium devem evitar diagnóstico médico ou recomendações de tratamento.

## Escalabilidade

Possíveis trabalhos de escalabilidade:

- índices de banco de dados para `user_id` e `recorded_at`;
- paginação mais robusta de consultas;
- geração de relatórios com cache;
- background jobs para relatórios futuros;
- estratégia de rate limiting;
- observabilidade;
- área modular de relatórios;
- checks automatizados de CI.

## Segurança

Roadmap de segurança:

- revisar policies de RLS antes de receber usuários reais;
- adicionar política de privacidade e linguagem de consentimento;
- adicionar exclusão de conta;
- adicionar exportação de dados;
- adicionar auditoria de variáveis de ambiente;
- adicionar testes para validação e regras de acesso;
- documentar noções básicas de resposta a incidentes.

## Integrações Futuras

Possíveis integrações futuras:

- Vercel Analytics ou monitoramento;
- n8n para automação de relatórios;
- notificações por e-mail;
- lembretes de calendário;
- geração segura de PDF;
- integrações opcionais com fontes externas de dados de saúde, se legal e tecnicamente apropriado.

Qualquer integração envolvendo dados relacionados à saúde deve ser revisada cuidadosamente quanto a privacidade, consentimento e segurança.
