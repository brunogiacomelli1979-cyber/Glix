# Segurança - Glix

O Glix lida com registros pessoais de glicemia, então segurança e privacidade são importantes mesmo o projeto sendo um MVP.

Este documento descreve o modelo de segurança atual e melhorias futuras.

## Escopo

Glix é um diário pessoal de acompanhamento. Ele não fornece diagnóstico médico, tratamento ou recomendações clínicas.

Os usuários são donos dos próprios dados. O app foi desenhado para ajudar usuários a organizar registros pessoais, não para substituir orientação médica profissional.

## Autenticação

A autenticação é tratada pelo Supabase Auth.

Fluxo atual:

- cadastro com e-mail/senha;
- confirmação de e-mail dependendo das configurações do projeto Supabase;
- login via Supabase Auth;
- rota protegida de dashboard;
- logout por meio de Server Action.

Páginas privadas devem estar disponíveis apenas para usuários autenticados.

## Supabase Auth

Supabase Auth gerencia:

- identidade do usuário;
- cookies de sessão;
- estado de autenticação;
- tratamento de senha.

A aplicação não implementa armazenamento customizado de senhas.

## Row Level Security

Supabase Row Level Security está habilitado para as tabelas principais.

As policies de RLS garantem que usuários só possam acessar os próprios registros.

Para `glucose_records`, as policies cobrem:

- selecionar os próprios registros;
- inserir registros para o próprio id de usuário;
- atualizar os próprios registros;
- excluir os próprios registros.

Para `profiles`, as policies cobrem:

- ler o próprio perfil;
- atualizar o próprio perfil.

RLS é a camada final de enforcement. Verificações de UI e filtros de consulta melhoram UX e clareza, mas as policies do banco de dados são a fronteira crítica de segurança.

## Hardening da Função do Supabase

O Glix usa uma função de trigger chamada `public.handle_new_user()` para criar uma linha em `public.profiles` sempre que o Supabase Auth cria um novo usuário em `auth.users`.

O Supabase Security Advisor reportou avisos para essa função:

- `function_search_path_mutable`
- `anon_security_definer_function_executable`
- `authenticated_security_definer_function_executable`

Esses avisos foram tratados manualmente no Supabase SQL Editor e refletidos em `SUPABASE_SETUP.md`.

Hardening atual:

- a função permanece `SECURITY DEFINER`, porque precisa inserir uma linha de perfil como parte do fluxo interno da trigger de autenticação;
- a função define explicitamente `search_path = public, auth`;
- a permissão direta de execute é revogada de `PUBLIC`;
- a permissão direta de execute é revogada de `anon`;
- a permissão direta de execute é revogada de `authenticated`;
- a trigger `on_auth_user_created` é recriada após remover qualquer versão anterior.

### Por Que um `search_path` Fixo Importa

Funções do PostgreSQL podem resolver nomes de objetos não qualificados usando o `search_path` ativo. Se uma função `SECURITY DEFINER` tiver um search path mutável ou inseguro, a resolução de objetos pode se tornar ambígua.

Ao definir:

```sql
SET search_path = public, auth
```

a função executa com uma ordem previsível de resolução de schemas. Isso reduz o risco de objetos inesperados serem resolvidos durante a execução da função.

### Por Que Revogar `EXECUTE` Importa

A função deve ser invocada pela trigger interna vinculada a `auth.users`, não diretamente por roles de cliente.

Revogar a execução direta de `PUBLIC`, `anon` e `authenticated` reduz a superfície chamável:

```sql
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
```

A trigger ainda pode executar a função como parte do fluxo controlado de criação de usuário.

### Papel da Trigger

A trigger `on_auth_user_created` é responsável por chamar `public.handle_new_user()` depois que uma nova linha é inserida em `auth.users`.

Isso mantém a criação de perfil automática, evitando acesso direto client-side à função.

## Chaves de API e Variáveis de Ambiente

O frontend usa a chave anon/publishable do Supabase.

Espera-se que essa chave seja pública em uma arquitetura client-side com Supabase, mas ela deve ser usada em conjunto com RLS.

Regras:

- não exponha uma chave `service_role` do Supabase no código frontend;
- não faça commit de `.env.local`;
- não cole segredos reais na documentação;
- use variáveis de ambiente da Vercel em produção.

Variáveis de ambiente obrigatórias:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Server Actions

Mutações de registros de glicemia são tratadas com Next.js Server Actions.

Proteções atuais:

- ler usuário autenticado antes da mutação;
- redirecionar usuários não autenticados para login;
- validar entrada antes da escrita;
- filtrar operações de update/delete por `user_id`;
- revalidar o dashboard após mutações.

## Validação de Entrada

A validação é centralizada em `src/lib/glucose.ts`.

Regras atuais de validação:

- valor de glicemia deve estar entre 20 e 600 mg/dL;
- contexto deve ser um dos contextos de medição conhecidos;
- observações são limitadas a 300 caracteres;
- datas inválidas são rejeitadas;
- envios obrigatórios vazios são rejeitados.

A validação melhora a qualidade dos dados e a experiência do usuário, mas não substitui a segurança em nível de banco de dados.

## Privacidade

O Glix armazena registros pessoais de glicemia conectados a contas de usuário.

Princípios atuais de privacidade:

- cada usuário deve acessar apenas os próprios dados;
- registros não são expostos publicamente;
- nenhuma chave `service_role` é usada no frontend;
- nenhum diagnóstico ou recomendação de tratamento é gerado.

## Considerações de LGPD

Para um produto em produção relacionado à saúde no Brasil, requisitos de LGPD devem ser revisados com cuidado.

Considerações futuras:

- política de privacidade;
- termos de uso;
- fluxo de exclusão de conta;
- exportação de dados;
- política de retenção de dados;
- linguagem de consentimento explícito;
- auditoria de operadores/fornecedores terceiros;
- processo de resposta a incidentes.

## Limitações Atuais

O MVP ainda não inclui:

- página completa de política de privacidade;
- testes automatizados de segurança;
- exclusão de conta;
- exportação de dados do usuário;
- logs de auditoria;
- estratégia de rate limiting;
- monitoramento de produção;
- threat model formal.

Supabase Auth também reporta `Leaked Password Protection Disabled`. O recurso "Prevent use of leaked passwords / HaveIBeenPwned.org" está disponível em planos Supabase Pro. O Glix atualmente é um projeto MVP/teste no plano Free, então isso permanece como limitação documentada, não como problema ativo de configuração.

## Próximos Passos Recomendados

- Adicionar páginas de política de privacidade e termos.
- Adicionar fluxo de exclusão de conta.
- Adicionar exportação CSV/PDF com consentimento claro do usuário.
- Gerar tipos de banco de dados do Supabase.
- Adicionar testes para regras de validação.
- Adicionar monitoramento e rastreamento de erros.
- Revisar policies do Supabase antes de escalar para usuários reais.
- Habilitar proteção contra senhas vazadas ao migrar para um plano Supabase Pro.

## Aviso de Saúde

Glix não é um dispositivo médico. Ele não diagnostica, trata, previne ou cura condições médicas. Usuários devem consultar profissionais de saúde qualificados antes de tomar decisões de saúde.
