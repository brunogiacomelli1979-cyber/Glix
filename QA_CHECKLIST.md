# Checklist de QA - Glix

Checklist manual para validar o Glix após mudanças relevantes de produto, UX, segurança ou código.

Glix é um diário pessoal de acompanhamento de glicemia. Ele não fornece diagnóstico médico, orientação de tratamento ou recomendações clínicas.

## 1. Ambiente Local

- [ ] Instalar dependências, se necessário, com `npm install`.
- [ ] Rodar `npm.cmd run lint`.
- [ ] Rodar `npm.cmd run build`.
- [ ] Rodar `npm.cmd run dev`.
- [ ] Abrir `http://127.0.0.1:3000`.
- [ ] Confirmar que o app carrega sem erros de console/runtime.

## 2. Autenticação

- [ ] Criar uma nova conta.
- [ ] Confirmar que o fluxo de e-mail funciona quando exigido pelas configurações do Supabase.
- [ ] Entrar com uma conta válida.
- [ ] Sair com sucesso.
- [ ] Confirmar persistência de sessão após atualizar o navegador.
- [ ] Confirmar que um usuário desconectado não consegue acessar `/registrar`, `/dashboard` ou `/historico`.
- [ ] Confirmar que um usuário logado consegue acessar `/registrar`, `/dashboard` e `/historico`.

## 3. Registro de Glicemia

- [ ] Criar uma medição válida de glicemia a partir de `/registrar`.
- [ ] Confirmar que o valor de glicemia é obrigatório.
- [ ] Confirmar que valores abaixo do mínimo são rejeitados.
- [ ] Confirmar que valores acima do máximo são rejeitados.
- [ ] Confirmar que o contexto é obrigatório.
- [ ] Confirmar que data/hora é preenchida automaticamente.
- [ ] Confirmar que data/hora pode ser alterada manualmente.
- [ ] Confirmar que observação é opcional.
- [ ] Confirmar que mensagens de sucesso e erro são compreensíveis.
- [ ] Confirmar que o novo registro aparece em `/historico`.

## 4. Dashboard de Resumo

- [ ] Confirmar que `/dashboard` carrega para um usuário logado.
- [ ] Confirmar que a medição mais recente aparece corretamente.
- [ ] Confirmar que a média de 7 dias é exibida.
- [ ] Confirmar que o menor valor é exibido.
- [ ] Confirmar que o maior valor é exibido.
- [ ] Confirmar que o texto de tendência aparece.
- [ ] Confirmar que o gráfico renderiza com dados recentes.
- [ ] Confirmar que o insight discreto aparece sem linguagem alarmista.
- [ ] Confirmar que o botão flutuante `+` abre `/registrar`.

## 5. Histórico

- [ ] Confirmar que `/historico` carrega para um usuário logado.
- [ ] Confirmar que a lista filtrada completa aparece.
- [ ] Confirmar que os filtros de período funcionam.
- [ ] Confirmar que os filtros de contexto funcionam.
- [ ] Editar um registro e confirmar que a alteração é salva.
- [ ] Excluir um registro e confirmar que ele é removido.
- [ ] Confirmar que observações aparecem quando presentes.
- [ ] Confirmar que ações de editar/excluir mantêm ou retornam o usuário para `/historico`.
- [ ] Confirmar que o botão flutuante `+` abre `/registrar`.

## 6. Segurança e Privacidade

- [ ] Confirmar que um usuário não consegue ver registros de outro usuário.
- [ ] Confirmar que RLS permanece habilitado no Supabase.
- [ ] Confirmar que `service_role` não está exposto no código frontend ou em arquivos públicos.
- [ ] Confirmar que `.env.local` não está em stage nem commitado.
- [ ] Confirmar que dados sensíveis de glicemia não são armazenados em `localStorage`.
- [ ] Confirmar que dados sensíveis de glicemia não são armazenados em cache offline.
- [ ] Confirmar que nenhuma funcionalidade apresenta diagnóstico médico ou orientação de tratamento.

## 7. PWA e Mobile

- [ ] Instalar o app em um dispositivo mobile ou navegador mobile.
- [ ] Confirmar que o ícone do app aparece corretamente.
- [ ] Confirmar que a tela de splash/loading corresponde à identidade do Glix.
- [ ] Confirmar que a navegação funciona no mobile.
- [ ] Confirmar que botões e áreas de toque são confortáveis.
- [ ] Confirmar que nenhum botão importante fica cortado.
- [ ] Confirmar que `/registrar`, `/dashboard` e `/historico` são utilizáveis em telas pequenas.

## 8. Produção e Vercel

- [ ] Confirmar que o deploy na Vercel conclui sem erros.
- [ ] Confirmar que variáveis de ambiente de produção estão configuradas.
- [ ] Confirmar que o login funciona em produção.
- [ ] Confirmar que o registro de glicemia funciona em produção.
- [ ] Confirmar que `/dashboard` carrega em produção.
- [ ] Confirmar que `/historico` carrega em produção.
- [ ] Confirmar que nenhum valor sensível aparece em logs, UI ou código-fonte público.

## 9. Aprovação Antes de Commit ou Push

- [ ] `npm.cmd run lint` passou.
- [ ] `npm.cmd run build` passou.
- [ ] O fluxo principal foi testado: login -> registrar -> dashboard -> historico.
- [ ] Nenhuma chave sensível ou valor de ambiente foi alterado.
- [ ] Mudanças em Supabase, RLS e autenticação foram revisadas ou evitadas.
- [ ] A documentação foi atualizada se a mudança afetou UX, rotas, segurança ou comportamento do produto.
- [ ] A mudança é pequena o suficiente para ser revisada com clareza.
