# 📜 Sintaxe IziFlow Markdown

Este documento descreve a sintaxe Markdown simplificada utilizada pelo plugin IziFlow para definir a estrutura de fluxos de usuário. Ao escrever seu fluxo neste formato, o plugin pode interpretá-lo e gerar automaticamente o diagrama visual correspondente no Figma ou FigJam.

## 📝 Estrutura Básica

Um arquivo IziFlow Markdown é composto por:

1.  Um título opcional para o fluxo.
2.  Definições de Nós (`NODE`).
3.  Definições de Conexões (`CONN`).
4.  Comentários (linhas que começam com `#`).
5.  Linhas em branco (ignoradas).

**Observações:**

*   As definições de `META` e `DESC` devem estar **indentadas** sob o `NODE` ao qual se referem.
*   A ordem geral é definir todos os `NODE`s primeiro, seguidos por todas as `CONN`s, mas o parser é flexível e pode lidar com `CONN`s intercaladas, embora a organização visual no Markdown ajude na legibilidade humana.

## 🧱 Definição de Nós (`NODE`)

Cada linha que define um nó começa com a palavra-chave `NODE`, seguida por:

1.  Um `[id_do_no]` único (sem espaços, caracteres especiais, etc. - use `snake_case` ou `kebab-case`).
2.  O `[TIPO_DO_NO]` (em maiúsculas): `START`, `END`, `STEP`, `DECISION`, `ENTRYPOINT`.
3.  O `"[Nome do Nó]"`. Este é o texto principal que aparecerá no nó. Deve estar entre aspas duplas (`"`).

**Sintaxe:**
```markdown
NODE [id_do_no] [TIPO_DO_NO] "[Nome do Nó]"
NODE start_process START "Início do Fluxo"
NODE user_input STEP "Preencher Formulário"
NODE check_status DECISION "Status Válido?"
NODE process_complete END "Fim do Processo"
```

## 📦 Metadados (META)

Você pode adicionar metadados a um nó para fornecer contexto adicional (categoria, responsável, etc.). Cada metadado deve estar em uma nova linha, indentada sob o NODE, começando com META, seguida por:

1. A [chave] do metadado.
2. Dois pontos (:).
3. O [valor] do metadado.

Sintaxe:
```markdown
META [chave]: [valor]
```

Exemplo:

```markdown
NODE user_login ENTRYPOINT "Tela de Login"
    META category: Authentication
    META createdBy: Alice
    META version: 1.2
```

## 📄 Descrição Detalhada (DESC)

Para nós dos tipos STEP, DECISION, e ENTRYPOINT, você pode adicionar blocos de descrição detalhando ações, inputs, regras, etc. Cada item de descrição deve estar em uma nova linha, indentada sob o NODE, começando com DESC, seguida por:

1. O [Rótulo] da descrição (ex: Action, Inputs, Validation, Feedback).
2. Dois pontos (:).
3. O [Conteúdo] da descrição.

O [Conteúdo] pode conter texto simples ou múltiplas linhas separadas por \n. O parser irá preservar a quebra de linha.

Sintaxe:
```markdown
DESC [Rótulo]: [Conteúdo]
```
Exemplo:

```markdown
NODE shipping_address STEP "Enter Shipping Address"
    META category: Checkout Form
    DESC Title: Shipping Details
    DESC Inputs: Full Name\nStreet Address\nCity\nPostcode\nCountry
    DESC Validation: All fields required, postcode format validation.
    DESC Option: Save address for future use? (Checkbox)
```

No exemplo acima, o conteúdo após "Inputs:" será interpretado como uma única string contendo "\n", que o plugin renderizará com quebras de linha.

## 🔗 Definição de Conexões (CONN)

Cada linha que define uma conexão começa com a palavra-chave CONN, seguida por:
1. O [id_do_no_origem].
2. Uma seta ->.
3. O [id_do_no_destino].
4. Opcionalmente, uma "[Etiqueta da Condição]". Este texto aparecerá no conector. Deve estar entre aspas duplas (").
5. Opcionalmente, a flag [SECONDARY] para marcar a conexão como secundária (altera o estilo visual).

Sintaxe:
```markdown
CONN [id_do_no_origem] -> [id_do_no_destino] "[Etiqueta da Condição]" [SECONDARY]
```
Exemplo:

```markdown
CONN review_cart -> shipping_address "Proceed to Shipping"
CONN payment_options -> cc_details "Selects Credit Card"
CONN payment_options -> paypal_redirect "Selects PayPal" [SECONDARY]
CONN cc_details -> order_confirmation
```
Note que a etiqueta da condição e a flag [SECONDARY] são opcionais.

## # Comentários
Exemplo:
```markdown
# Este é um comentário sobre o fluxo
NODE start START "Iniciar"
# Esta é a primeira etapa visível
NODE welcome_screen ENTRYPOINT "Tela de Boas-Vindas"
CONN start -> welcome_screen # Conecta início com a tela inicial
```
