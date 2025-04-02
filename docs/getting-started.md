# IziFlow - Plugin Figma para Automação de Fluxos

## Sobre
IziFlow é um plugin para Figma que automatiza a criação de fluxos de usuário através de JSON.

## Documentação
- [Guia de Início Rápido](docs/getting-started.md)
- [Arquitetura](docs/architecture.md)
- [Componentes](docs/components.md)
- [GPT Model](https://chatgpt.com/g/g-67ddf4ec15ec8191af753f9ed387092f-iziflow-assistant)

# Guia de Início Rápido

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Pré-requisitos

- Node.js 16 ou superior
- NPM ou PNPM
- Figma Desktop instalado
- Conta de desenvolvedor Figma (gratuita)

## Desenvolvimento

Para iniciar o modo de desenvolvimento:

```bash
npm run dev     # Inicia build da UI com watch mode
npm run devcode # Inicia build do código do plugin com watch mode
```

O modo de desenvolvimento oferece:
- Hot reload da UI
- Compilação automática do código
- Source maps para debugging
- Console logs preservados

## Build

Para gerar o build de produção:

```bash 
npm run build      # Build da UI
npm run buildcode  # Build do código do plugin
npm run zip        # Gera arquivo ZIP para publicação
```

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia modo desenvolvimento da UI |
| `npm run devcode` | Inicia modo desenvolvimento do código |
| `npm run build` | Gera build de produção da UI |
| `npm run buildcode` | Gera build de produção do código |
| `npm run zip` | Cria ZIP para distribuição |

## Adicionando ao Figma

1. Abra o Figma Desktop
2. Navegue para Menu Plugins > Development > Import plugin from manifest
3. Selecione o arquivo `manifest.json` na pasta `dist`
4. O plugin aparecerá na lista de plugins de desenvolvimento

### Desenvolvimento no Figma

- Use `Ctrl/Cmd + Alt + P` para recarregar o plugin
- Abra o Console do DevTools para ver logs (`Ctrl/Cmd + Alt + I`)
- Os arquivos são recompilados automaticamente ao salvar

## Estrutura do Projeto

```
src/          # Código fonte da UI React
src-code/     # Código do plugin Figma
.tmp/         # Arquivos temporários de build
dist/         # Build de produção
```

## Próximos Passos

- Explore a [Arquitetura](architecture.md) do projeto
- Consulte os [Componentes](components.md) disponíveis

# Changelog

## [Unreleased]

## [0.1.0] - 2024-03-22
### Adicionado
- Estrutura inicial do projeto
- Documentação base
- Setup de desenvolvimento