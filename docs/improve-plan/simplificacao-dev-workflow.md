# Plano de Ação: Simplificação do Workflow de Desenvolvimento

**Data:** 2025-11-29
**Status:** Proposta para aprovação
**Objetivo:** Simplificar o fluxo de desenvolvimento do plugin IziFlow, reduzindo complexidade e scripts desnecessários

---

## 1. Problemas Identificados

### 1.1 Build em Duas Etapas
**Problema:** Build atual requer dois comandos separados
```bash
npm run build      # UI (React)
npm run buildcode  # Plugin code (Figma sandbox)
```

**Impacto:**
- Workflow fragmentado
- Maior chance de erro (esquecer de rodar um dos builds)
- Experiência de desenvolvimento inconsistente

### 1.2 Dev/Watch em Duas Etapas
**Problema:** Desenvolvimento requer dois terminais ou dois comandos
```bash
npm run dev        # Watch UI
npm run devcode    # Watch plugin code (NÃO USADO segundo usuário)
```

**Impacto:**
- Necessidade de múltiplos terminais
- Complexidade desnecessária para desenvolvimento

### 1.3 Scripts Não Utilizados
**Problema:** Scripts que não são usados no workflow atual:
- `devcode` - Nunca usado
- `zip` - Não utilizado
- `test` - Apenas placeholder sem implementação real

**Impacto:**
- Confusão sobre quais scripts usar
- Manutenção de código morto

### 1.4 Configuração ESLint no package.json
**Problema:** ESLint configurado dentro do `package.json` (linhas 68-89)

**Impacto:**
- package.json inchado
- Dificulta manutenção da configuração
- Não segue convenções da comunidade

### 1.5 Múltiplos Arquivos de Documentação AI
**Problema:** Três arquivos separados para IAs diferentes:
- `CLAUDE.md`
- `GEMINI.md`
- `AGENTS.md`

**Impacto:**
- Manutenção duplicada
- Inconsistências entre documentações
- Confusão sobre qual arquivo atualizar

---

## 2. Soluções Propostas

### 2.1 Unificar Scripts de Build

**Ação:** Criar um único script `build` que executa ambos os builds em paralelo

**Implementação:**
```json
{
  "scripts": {
    "build": "npm-run-all --parallel build:ui build:code",
    "build:ui": "vite build",
    "build:code": "vite build --config vite.config.code.ts"
  }
}
```

**Dependência necessária:**
```bash
npm install --save-dev npm-run-all
```

**Benefícios:**
- Um único comando para build completo
- Builds em paralelo (mais rápido)
- Mantém comandos individuais disponíveis se necessário

**Alternativa (sem dependência extra):**
```json
{
  "scripts": {
    "build": "vite build && vite build --config vite.config.code.ts"
  }
}
```

### 2.2 Simplificar Script de Dev

**Ação:** Como `devcode` não é usado, remover e manter apenas `dev` para UI

**Implementação:**
```json
{
  "scripts": {
    "dev": "vite build --watch",
    "dev:code": "vite build --config vite.config.code.ts --watch"
  }
}
```

**Nota:** Se necessário watch para ambos, criar:
```json
{
  "scripts": {
    "dev": "npm-run-all --parallel dev:ui dev:code",
    "dev:ui": "vite build --watch",
    "dev:code": "vite build --config vite.config.code.ts --watch"
  }
}
```

### 2.3 Limpar Scripts Não Utilizados

**Ação:** Remover scripts não utilizados

**Scripts a remover:**
- `zip` - Não utilizado
- `test` - Placeholder vazio (manter apenas `test:validate` e `test:build`)

**Package.json resultante:**
```json
{
  "scripts": {
    "dev": "vite build --watch",
    "build": "npm-run-all --parallel build:ui build:code",
    "build:ui": "vite build",
    "build:code": "vite build --config vite.config.code.ts",
    "preview": "vite preview",
    "hmr": "vite",
    "test:validate": "npx tsc -p tests/tsconfig.test.json",
    "test:build": "npm run build"
  }
}
```

### 2.4 Mover Configuração ESLint

**Ação:** Criar arquivo `.eslintrc.json` e remover do `package.json`

**Arquivo `.eslintrc.json`:**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@figma/figma-plugins/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "root": true,
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ]
  }
}
```

### 2.5 Consolidar Documentação AI

**Ação:** Criar um único arquivo `AI.md` que substitui os três atuais

**Estrutura sugerida:**
```markdown
# AI.md

Instruções para assistentes de IA (Claude, Gemini, ChatGPT, etc.)

## Instruções Gerais
[Conteúdo comum a todas as IAs]

## Instruções Específicas por IA
### Claude Code
[Instruções específicas do CLAUDE.md]

### Gemini
[Instruções específicas do GEMINI.md]

### Agents
[Instruções específicas do AGENTS.md]
```

**Alternativa:** Manter apenas `CLAUDE.md` como padrão e remover os outros

---

## 3. Simplificações Adicionais Sugeridas

### 3.1 Simplificar `test:build`

**Atual:**
```json
"test:build": "echo 'Validando builds após implementação da Fase 8...' && npm run build && npm run buildcode"
```

**Proposto:**
```json
"test:build": "npm run build"
```

**Justificativa:** Com build unificado, não precisa mais chamar dois comandos

### 3.2 Adicionar Script de Limpeza

**Ação:** Criar script para limpar builds

**Implementação:**
```json
{
  "scripts": {
    "clean": "rm -rf dist .tmp node_modules/.vite",
    "clean:all": "npm run clean && rm -rf node_modules"
  }
}
```

### 3.3 Adicionar Script de Setup

**Ação:** Script para setup inicial do projeto

**Implementação:**
```json
{
  "scripts": {
    "setup": "npm install && npm run build",
    "postinstall": "echo 'Instalação concluída. Execute npm run build para gerar os arquivos do plugin.'"
  }
}
```

---

## 4. Package.json Final Proposto

```json
{
  "scripts": {
    "dev": "vite build --watch",
    "build": "npm-run-all --parallel build:ui build:code",
    "build:ui": "vite build",
    "build:code": "vite build --config vite.config.code.ts",
    "preview": "vite preview",
    "hmr": "vite",
    "test:validate": "npx tsc -p tests/tsconfig.test.json",
    "test:build": "npm run build",
    "clean": "rm -rf dist .tmp node_modules/.vite",
    "setup": "npm install && npm run build"
  }
}
```

**Redução:** De 8 scripts para 9 scripts (mas mais organizados e úteis)

---

## 5. Plano de Implementação

### Fase 1: Preparação (5 min)
- [ ] Instalar `npm-run-all`: `npm install --save-dev npm-run-all`
- [ ] Criar backup do `package.json` atual

### Fase 2: Atualização de Scripts (10 min)
- [ ] Atualizar scripts no `package.json` conforme proposto
- [ ] Testar `npm run build` (deve buildar UI e code)
- [ ] Testar `npm run dev` (deve fazer watch da UI)
- [ ] Testar `npm run test:build`

### Fase 3: Configuração ESLint (5 min)
- [ ] Criar `.eslintrc.json` com configuração atual
- [ ] Remover `eslintConfig` do `package.json`
- [ ] Testar linting (se houver script de lint configurado)

### Fase 4: Documentação (10 min)
- [ ] Decidir abordagem de consolidação (AI.md único ou manter apenas CLAUDE.md)
- [ ] Consolidar conteúdo
- [ ] Remover arquivos antigos

### Fase 5: Limpeza (5 min)
- [ ] Testar todos os scripts novos
- [ ] Atualizar README.md com novos comandos
- [ ] Commit das mudanças

**Tempo total estimado:** ~35 minutos

---

## 6. Riscos e Mitigações

### Risco 1: Scripts quebrados em CI/CD
**Mitigação:** Não há CI/CD configurado no projeto atual

### Risco 2: Dependência de `npm-run-all`
**Mitigação:**
- Biblioteca amplamente usada e mantida
- Alternativa: usar `&&` e comandos sequenciais (sem paralelização)

### Risco 3: Perda de funcionalidade do `devcode`
**Mitigação:**
- Usuário confirmou que não usa
- Manter `dev:code` como fallback por um tempo

---

## 7. Benefícios Esperados

### Desenvolvedor
- ✅ Comando único de build: `npm run build`
- ✅ Menos confusão sobre quais scripts usar
- ✅ Builds mais rápidos (paralelos)
- ✅ Menos terminais abertos durante desenvolvimento

### Manutenção
- ✅ Menos código para manter
- ✅ Configurações mais organizadas
- ✅ Documentação consolidada
- ✅ Melhor alinhamento com convenções da comunidade

### Onboarding
- ✅ Mais fácil para novos desenvolvedores entenderem o projeto
- ✅ README mais simples
- ✅ Menos "por que tem dois builds?"

---

## 8. Métricas de Sucesso

- [ ] Redução de comandos necessários de 2 para 1 (build)
- [ ] Remoção de pelo menos 2 scripts não utilizados
- [ ] Consolidação de 3 arquivos AI em 1
- [ ] Tempo de setup inicial reduzido
- [ ] Zero quebras em funcionalidades existentes

---

## 9. Próximos Passos

1. **Revisar e aprovar este plano**
2. **Decidir sobre:**
   - Usar `npm-run-all` ou comandos sequenciais simples?
   - Consolidar documentação AI em um arquivo ou remover os extras?
3. **Executar implementação em branch separada**
4. **Testar thoroughly**
5. **Merge para main**

---

## Apêndice: Comparação Antes/Depois

### Comandos de Build
```bash
# ANTES
npm run build
npm run buildcode

# DEPOIS
npm run build
```

### Comandos de Dev
```bash
# ANTES (não usado pelo usuário)
npm run dev
npm run devcode

# DEPOIS
npm run dev
# ou, se necessário watch em ambos:
npm run dev  # (roda ambos em paralelo)
```

### Scripts Totais
```
ANTES: 8 scripts (test, dev, devcode, build, buildcode, preview, hmr, zip, test:validate, test:build)
DEPOIS: 9 scripts (dev, build, build:ui, build:code, preview, hmr, test:validate, test:build, clean, setup)

Diferença: -2 scripts não usados, +3 scripts úteis = +1 total, mas muito mais organizado
```
