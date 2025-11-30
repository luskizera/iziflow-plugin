# Plano de ação — Simplificação do fluxo de desenvolvimento do plugin

## Contexto resumido
- Hoje precisamos executar o build do UI (`npm run build`) e do código do plugin (`npm run buildcode`) separadamente; para releases é preciso lembrar também do `zip`.
- O fluxo de desenvolvimento requer dois watchers (`dev` e `devcode`) para manter `.tmp/` atualizado, embora apenas o primeiro seja usado com frequência.
- Existem scripts de teste/zip placeholders que criam ruído e não agregam valor no dia a dia.
- As configurações de build do UI e do código possuem trechos duplicados (minify, treeshake, nomenclatura de diretórios), aumentando o custo para qualquer ajuste.

## Objetivos desta rodada
1. Reduzir o número de comandos necessários para preparar o plugin para review ou release.
2. Padronizar a experiência de desenvolvimento com um único script observando UI + código.
3. Tirar scripts e validações que não estão sendo usados do caminho, mantendo claro o que é obrigatório vs. opcional.
4. Diminuir a duplicação de configuração entre os builds para facilitar ajustes futuros.

## Iniciativas propostas

### 1. `build:all` orquestrado (substitui `build`, `buildcode` e alimenta `test:build` e `zip`)
- **O que dói**: lembrar de rodar dois builds em sequência e configurar variáveis (`MODE=zip`) manualmente.
- **Proposta**: criar um script `scripts/build-all.ts` (pode usar `vite.build` via API) que chama os dois configs e aplica pós-passos (copiar manifest, produzir `dist/`, zip quando necessário). `npm run build` passa a disparar esse script; `npm run zip` apenas define `MODE=zip` e delega para ele.
- **Passos**:
  1. Adicionar dependência leve (`tsx` ou `ts-node`) para executar o script ou compilar via `tsc`.
  2. Implementar `build-all` chamando `vite.build` duas vezes (uma para `vite.config.ts`, outra para `vite.config.code.ts`) e consolidando a saída.
  3. Atualizar `package.json` (`build`, `buildcode`, `zip`, `test:build`) para usar o novo orquestrador e remover o script antigo `buildcode`.
  4. Documentar no `docs/getting-started.md` e no README como acionar build e release a partir de agora.
- **Benefícios esperados**: um único comando garante `index.html`, `code.js`, `manifest.json` e zip opcional. Menos risco de esquecer etapas.

### 2. `dev` único com observação paralela
- **O que dói**: para atualizar `code.ts` precisamos lembrar de iniciar `devcode`, mas ele raramente é usado e cria ruído em `package.json`.
- **Proposta**: criar subtarefas `dev:ui` e `dev:code` (reaproveitando os comandos atuais) e usar `concurrently`/`npm-run-all` para rodá-las em paralelo via `npm run dev`. Dessa forma mantemos os dois watchers vivos com um comando, e podemos eliminar `devcode` da interface pública.
- **Passos**:
  1. Adicionar dependência `npm-run-all` (ou `concurrently`) para orquestrar watchers.
  2. Atualizar scripts: `dev:ui = vite build --watch`, `dev:code = vite build --config vite.config.code.ts --watch`, `dev = run-p dev:ui dev:code`.
  3. Garantir que `vite-figma-plugin` continua populando `.tmp/` corretamente (testar editando UI e `code.ts`).
  4. Atualizar a documentação substituindo referências a `devcode`.
- **Benefícios esperados**: um único comando cobre UI + code, diminuindo esquecimento e ruído.

### 3. Limpeza e renomeação de scripts opcionais
- **O que dói**: `npm run test`, `test:validate`, `test:build`, `zip` aparecem no autocomplete/README, mas não são usados; é fácil rodar algo por engano.
- **Proposta**: remover scripts placeholder ou movê-los para um bloco "extra" documentado; introduzir `npm run lint`/`typecheck` real se houver necessidade futura.
- **Passos**:
  1. Excluir `test`, `test:validate` e `test:build` do `package.json` ou convertê-los em scripts documentados em `docs/testing.md` (fora da lista de comandos principais).
  2. Atualizar README/`docs/getting-started.md` com a lista enxuta (`dev`, `build`, `hmr`, `preview`, `zip?`).
  3. (Opcional) criar `npm run validate` que roda `tsc --noEmit` apenas quando quisermos um sanity check manual.
- **Benefícios esperados**: scripts disponíveis refletem exatamente o que é suportado/necessário.

### 4. Centralizar configurações compartilhadas
- **O que dói**: `vite.config.ts` e `vite.config.code.ts` repetem opções de minificação, `treeshake`, `outDir` e comentários sobre `console.log`, aumentando a chance de divergência.
- **Proposta**: extrair um helper (ex.: `config/build-options.ts`) com as opções comuns e importá-lo em ambos os configs ou direto no novo `build-all`.
- **Passos**:
  1. Criar módulo compartilhado exportando `TERSER_OPTIONS`, `COMMON_ROLLUP_OPTIONS`, `OUTPUT_DIRS`.
  2. Aplicar nos dois configs e ajustar apenas o que for realmente específico (ex.: `entryFileNames`).
  3. Documentar o helper para facilitar ajustes futuros (ex.: manter `drop_console: false`).
- **Benefícios esperados**: uma única fonte da verdade para otimizações e paths, reduzindo regressões.

### 5. Automatizar tarefas de limpeza e preparação
- **O que dói**: quando há lixo em `.tmp/` ou `dist/`, é preciso limpar manualmente antes de um build limpo.
- **Proposta**: adicionar `npm run clean` que remove `.tmp/` e `dist/`, e fazer com que `build:all` chame `clean` automaticamente antes do build quando não for watch.
- **Passos**:
  1. Adicionar dependência `rimraf` (ou usar `rm -rf` via script cross-platform).
  2. Criar `clean` + `prebuild` e referenciar no orquestrador.
  3. Documentar o comando para casos de debug.
- **Benefícios esperados**: builds reproduzíveis e menos ruído manual.

## Roadmap sugerido
| Semana | Entrega | Observações |
| --- | --- | --- |
| S1 | Implementar `build:all`, `clean` e atualizar scripts relacionados | Prioridade por afetar build/test/release.
| S2 | Ajustar fluxo de desenvolvimento (`dev`, remoção de `devcode`, docs) | Testar dentro do Figma para garantir que o watcher único basta.
| S3 | Limpar/renomear scripts opcionais, introduzir validações reais se necessário | Atualizar documentação pública.
| S4 | Refatorar configs compartilhadas + revisitar zip/manual | Pode ser feito em paralelo com melhorias de docs.

## Critérios de aceite gerais
- `npm run dev` e `npm run build` são os únicos comandos necessários no dia a dia.
- README/`docs/getting-started.md` refletem exatamente o fluxo novo e não citam scripts removidos.
- `dist/` sempre sai consistente a partir de um único build (com ou sem zip) e `.tmp/` permanece fonte para testes dentro do Figma.
- Scripts “extras” (zip/validate) ficam documentados como opcionais ou escondidos atrás de flags explícitas.

## Riscos e mitigação
- **Quebra em pipelines existentes**: validar no primeiro build após a mudança e, se houver automações externas, prover script de compatibilidade temporário (`build:legacy`).
- **Perda de performance no watch**: monitorar CPU ao rodar watchers em paralelo e, se necessário, habilitar `--skipWrite` do `vite-figma-plugin` para arquivos inalterados.
- **Adoção parcial**: incluir trecho no README destacando "fluxo antigo" vs. "fluxo simplificado" até todos migrarem.

## Próximos passos imediatos
1. Validar este plano com o time e priorizar as iniciativas (especialmente a consolidação do build).
2. Assim que aprovado, abrir um issue ou PR tracking para cada iniciativa para dar visibilidade e histórico.
