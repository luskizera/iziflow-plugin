estou tendo estes erros  

```  
[Bifurcated Layout] Mapa de lanes: 
{inicio: 0, fazer_login: 0, logar: 1, credenciais_validas: 0, erro_login: 1, …}
credenciais_validas
: 
0
erro_login
: 
1
escolher_pos
: 
-1
esqueceu_senha
: 
1
fazer_login
: 
0
formulario_indicacao
: 
-1
inicio
: 
0
logar
: 
1
metodo_pagamento
: 
-1
redefinir_senha
: 
1
redirecionamento_lp
: 
-1
token_email
: 
1
validacao_email
: 
-1
``` 
---

```
vendor-core-8d98bf0f…336918.min.js.br:54 [Smart Layout] Bifurcado Completo falhou: 
Error {message: "Falha ao criar nó 'Logar': cannot read property 'x' of undefined", stack: '    at Ra (PLUGIN_5_SOURCE:2:130178)\n'}
message
: 
"Falha ao criar nó 'Logar': cannot read property 'x' of undefined"
stack
: 
"    at Ra (PLUGIN_5_SOURCE:2:130178)\n"
``` 

com o seguinte input:

```  
metadata:
  name: Login e Fluxo de Indicação
  layout:
    algorithm: auto
    unit: 300
    first_node_position: center
    spacing:
      horizontal: 1u
      vertical: 0.8u

nodes:

  inicio:
    type: ENTRYPOINT
    name: Início

  # =========================
  # LOGIN
  # =========================

  fazer_login:
    type: STEP
    name: Fazer Login

  logar:
    type: STEP
    name: Logar
    content: |
      Inputs:
      - RA
      - Senha

  credenciais_validas:
    type: DECISION
    name: Credenciais válidas?

  erro_login:
    type: STEP
    name: Mensagem de Erro
    description: RA ou senha incorretos

  esqueceu_senha:
    type: STEP
    name: Esqueci Senha

  token_email:
    type: STEP
    name: Token de validação por email

  redefinir_senha:
    type: STEP
    name: Redefinir Senha

  # =========================
  # FORMULÁRIO DE INDICAÇÃO
  # =========================

  formulario_indicacao:
    type: STEP
    name: Formulário de Indicação
    content: |
      Inputs:
      - Nome
      - Email
      - Telefone
      - Token / Código de indicação
      - CPF

  escolher_pos:
    type: STEP
    name: Escolher Pós-Graduação

  validacao_email:
    type: STEP
    name: Validação de E-mail

  redirecionamento_lp:
    type: STEP
    name: Redirecionamento para LP do Curso

  metodo_pagamento:
    type: END
    name: Método de Pagamento

connections:

  # Entrada principal
  - from: inicio
    to: fazer_login

  - from: inicio
    to: formulario_indicacao
    label: Indicar

  # Login
  - from: fazer_login
    to: logar

  - from: logar
    to: credenciais_validas

  - from: credenciais_validas
    to: erro_login
    label: Não

  - from: credenciais_validas
    to: formulario_indicacao
    label: Sim

  # Recuperação de senha
  - from: erro_login
    to: esqueceu_senha
    label: Esqueci senha

  - from: esqueceu_senha
    to: token_email

  - from: token_email
    to: redefinir_senha

  - from: redefinir_senha
    to: logar
    label: Tentar novamente

  # Indicação
  - from: formulario_indicacao
    to: escolher_pos

  - from: escolher_pos
    to: validacao_email

  - from: validacao_email
    to: redirecionamento_lp

  - from: redirecionamento_lp
    to: metodo_pagamento
```

como resolver? e quais as causas do problema?