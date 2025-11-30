# Plano de Ação: Simplificação do Fluxo de Desenvolvimento

Este documento propõe uma série de mudanças para simplificar o fluxo de trabalho de desenvolvimento do plugin, com foco na otimização dos scripts NPM e na remoção de complexidade desnecessária.

## Análise do Cenário Atual

Atualmente, o `package.json` contém múltiplos scripts para tarefas de build e desenvolvimento, refletindo a arquitetura do plugin que é dividida em duas partes principais:

1.  **UI (`src`):** A interface do usuário, construída com React e gerenciada pelo `vite.config.ts`.
2.  **Código Principal (`src-code`):** A lógica do plugin que interage com a API do Figma, gerenciada pelo `vite.config.code.ts`.

Essa divisão resulta em scripts duplicados como `build`/`buildcode` e `dev`/`devcode`, além de scripts que não estão em uso (`test`, `zip`).

## Plano de Ação

Propomos as seguintes alterações no `package.json` para unificar e limpar os scripts.

### 1. Unificar os Scripts de Build

Combinar os dois comandos de build em um único script `build`. Isso garantirá que um único comando gere a versão completa e pronta para produção do plugin.

**Ação:**

-   Alterar o script `build`.
-   Remover o script `buildcode`.

**Sugestão de implementação:**

```jsonc
"scripts": {
  // ...
  "build": "vite build && vite build --config vite.config.code.ts",
  // "buildcode": "...", // remover esta linha
  // ...
}
```

### 2. Unificar os Scripts de Desenvolvimento (`watch mode`)

Para simplificar o ambiente de desenvolvimento, os dois processos de `watch` (`dev` e `devcode`) devem ser iniciados com um único comando. Isso pode ser feito utilizando um utilitário como `npm-run-all`.

**Ação:**

-   Adicionar `npm-run-all` como uma dependência de desenvolvimento: `npm install --save-dev npm-run-all`.
-   Alterar o script `dev` para executar os dois processos em paralelo.
-   Remover o script `devcode`.

**Sugestão de implementação:**

```jsonc
"scripts": {
  // "dev": "vite build --watch", // substituir esta linha
  "dev": "npm-run-all --parallel \"dev:*\"",
  "dev:ui": "vite build --watch",
  "dev:code": "vite build --config vite.config.code.ts --watch",
  // "devcode": "...", // remover esta linha
  // ...
}
```

*Obs: Renomeei os scripts originais para `dev:ui` e `dev:code` para clareza, e o novo `dev` os orquestra.*

### 3. Remover Scripts Não Utilizados

Conforme solicitado, os scripts `test`, `test:validate`, `test:build` e `zip` não são utilizados e podem ser removidos para limpar o `package.json`.

**Ação:**

-   Remover os scripts `test`, `test:validate`, `test:build` e `zip`.

## Resumo das Vantagens

-   **Comando Único de Build:** `npm run build` para construir o projeto inteiro.
-   **Comando Único de Desenvolvimento:** `npm run dev` para iniciar o ambiente de desenvolvimento completo.
-   **`package.json` mais Limpo:** Redução de 6 scripts, tornando-o mais fácil de ler e manter.
-   **Fluxo de Trabalho Simplificado:** Menos comandos para os desenvolvedores lembrarem.

Este plano, quando aprovado, pode ser implementado rapidamente para melhorar a experiência de desenvolvimento do projeto.
