## Sobre
IziFlow é um plugin para Figma e FigJam que automatiza a criação de fluxos de usuário a partir de uma **descrição textual simples usando a sintaxe IziFlow Markdown**.

## Documentação Principal
- **[Sintaxe IziFlow Markdown](docs/markdown-syntax.md)** <--- **COMECE AQUI!**
- [Workflow de Uso](docs/workflow.md)
- [Arquitetura](docs/architecture.md)
- [Estrutura dos Nós Gerados](docs/components.md) (Detalhes técnicos dos elementos criados)
- [Assistente IA (GPT)](docs/ai-instructions.md) (Instruções para usar o GPT para ajudar a definir fluxos)

# Guia Rápido para Desenvolvedores

Esta seção é para quem deseja contribuir com o desenvolvimento do IziFlow.

## Instalação (Desenvolvimento)

1.  Clone o repositório do IziFlow.
2.  Navegue até a pasta do projeto no seu terminal.
3.  Instale as dependências:
    ```bash
    npm install # ou pnpm install / yarn install
    ```

## Pré-requisitos (Desenvolvimento)

- Node.js (versão recomendada no `package.json` ou superior, ex: 18+)
- Gerenciador de pacotes: NPM, PNPM ou Yarn
- Figma Desktop App instalado (necessário para rodar e testar plugins localmente)
- Conta Figma (gratuita ou paga) com permissões de desenvolvedor habilitadas (se aplicável).

## Desenvolvimento Local

Para rodar o plugin localmente durante o desenvolvimento, você precisa de dois processos rodando em terminais separados:

1.  **Compilar a UI (React/Vite) em modo watch:**
    ```bash
    npm run dev
    ```
    Isso compila a interface do usuário e a recarrega automaticamente (HMR) quando você faz alterações nos arquivos dentro da pasta `src/`.

2.  **Compilar o Código do Plugin (Figma API/TypeScript) em modo watch:**
    ```bash
    npm run devcode
    ```
    Isso compila o código que interage com a API do Figma (dentro de `src-code/`) sempre que você salva uma alteração. **Nota:** Alterações aqui exigem que você recarregue o plugin manualmente dentro do Figma.

O modo de desenvolvimento oferece:
- Hot Module Replacement (HMR) para a UI.
- Recompilação automática do código do plugin ao salvar.
- Source maps para facilitar o debugging no console do Figma/Navegador.
- Logs do console (`console.log`) preservados.

## Build de Produção

Para criar a versão final otimizada do plugin para distribuição:

1.  **Compilar a UI:**
    ```bash
    npm run build
    ```
2.  **Compilar o Código do Plugin:**
    ```bash
    npm run buildcode
    ```
3.  **Empacotar para Distribuição:**
    ```bash
    npm run zip
    ```
    Este comando geralmente combina os artefatos compilados (UI e código do plugin) com o `manifest.json` em um arquivo `.zip` dentro da pasta `/zip`, pronto para ser publicado na Comunidade Figma ou distribuído.

## Scripts Disponíveis

| Comando         | Descrição                                                    |
| :-------------- | :----------------------------------------------------------- |
| `npm run dev`     | Compila a UI em modo watch (desenvolvimento)               |
| `npm run devcode` | Compila o código do plugin em modo watch (desenvolvimento) |
| `npm run build`   | Gera build de produção da UI                                 |
| `npm run buildcode`| Gera build de produção do código do plugin                   |
| `npm run zip`     | Cria o arquivo ZIP final para distribuição na pasta `/zip` |

## Adicionando ao Figma (Modo de Desenvolvimento)

1.  Certifique-se de que os processos `dev` e `devcode` estejam rodando.
2.  Abra o Figma Desktop App.
3.  Vá para o menu principal: Plugins > Development > Import plugin from manifest…
4.  Navegue até a pasta do seu projeto IziFlow e selecione o arquivo `manifest.json` (geralmente localizado na pasta `dist/` ou `.tmp/` após a compilação inicial, verifique sua config de build).
5.  O plugin "IziFlow V2" (ou o nome no seu manifest) aparecerá na lista de plugins em desenvolvimento e poderá ser executado no Figma/FigJam.

### Desenvolvimento no Figma

- **Recarregar Plugin:** Use `Ctrl/Cmd + Alt + P` para rapidamente fechar e reabrir o plugin após fazer alterações no código de `src-code/` (que foi recompilado pelo `npm run devcode`).
- **Abrir Console:** Use `Ctrl/Cmd + Alt + I` (ou vá em Plugins > Development > Open Console) para ver `console.log`s do seu código do plugin (`src-code/`). Para ver logs da UI (`src/`), você geralmente precisa inspecionar a própria janela/iframe do plugin no navegador ou DevTools do Figma.

## Estrutura do Projeto
Use code with caution.
shared/ # Tipos, Schemas, Utils compartilhados entre UI e Plugin
src/ # Código fonte da UI (React, CSS, Assets)
src-code/ # Código do Plugin (Interação com API Figma, Lógica Core)
docs/ # Documentação do projeto
.tmp/ # Pasta temporária para builds de desenvolvimento/intermediários
dist/ # Pasta para build final (antes do zip) - pode variar
zip/ # Pasta onde o .zip final é gerado (configurável)
## Próximos Passos

- Aprenda a **[Sintaxe IziFlow Markdown](docs/markdown-syntax.md)**.
- Entenda o [Workflow de Uso](docs/workflow.md).
- Explore a [Arquitetura](docs/architecture.md) detalhada do projeto.