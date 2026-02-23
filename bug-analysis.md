# Análise do bug e soluções

## Resumo
O erro `cannot read property 'x' of undefined` acontece porque o layout bifurcado não calcula posição para todos os nós. Isso ocorre quando o grafo tem **ciclo**, e o algoritmo de ordenação topológica ignora nós que fazem parte desse ciclo. O nó `logar` entra no ciclo (`redefinir_senha -> logar -> credenciais_validas -> ... -> redefinir_senha`) e fica sem posição, quebrando a criação do frame.

## Causas
1. **Ciclo no grafo de conexões**
   - O fluxo contém o loop `redefinir_senha -> logar`. Isso cria um ciclo com `logar -> credenciais_validas -> ... -> redefinir_senha`.
   - Em `src-code/code.ts`, o layout bifurcado usa `Layout.topologicalSort(...)` para ordenar nós. Essa função só retorna nós com `inDegree == 0`. Em ciclos, ninguém chega a `0`, então parte do grafo fica de fora.
   - Resultado: `nodePositions.get(node.id)` retorna `undefined` para `logar`, e a linha `position.x` lança o erro.

2. **Detecção de bifurcação atravessando o loop**
   - `Layout.traceBranchPath(...)` segue o ramo até encontrar fim ou convergência. Com o loop, ele chega novamente em `logar` e para lá.
   - Isso coloca `logar` dentro do ramo da bifurcação, e o `calculateVerticalLanes(...)` chega a definir `logar` como lane `1` (mapa de lanes no log).
   - Essa mistura de “nó antes da decisão” dentro do ramo é um efeito colateral do ciclo.

3. **Ausência de fallback seguro dentro do layout bifurcado**
   - Quando falta posição para um nó, o layout bifurcado não trata isso (usa `!` e assume que existe).
   - Resultado: falha dura em vez de cair para linear ou reposicionar nós restantes.

## Soluções
### Soluções no input (rápidas, sem mexer no código)
1. **Quebrar o ciclo**
   - Trocar `redefinir_senha -> logar` por uma saída para um nó “Reiniciar Login” e reiniciar o fluxo a partir de um `ENTRYPOINT` separado.

2. **Usar posicionamento manual para o nó do loop**
   - Adicionar `position.anchor` + `position.offset` para `logar` (ou para todos os nós no ciclo). Assim ele entra no `manualPositions` e evita a ausência de posição.

### Soluções no código (correções estruturais)
1. **Detectar ciclos e fazer fallback automático**
   - Se `topologicalSort` retornar menos nós que o total, tratar como ciclo e cair para `generateFlowWithLinearLayout`.
   - Arquivo: `src-code/code.ts` (função `calculateBifurcatedPositions`).

2. **Completar posições faltantes**
   - Depois do `topologicalSort`, adicionar um passo que preencha nós não posicionados (ex.: posição após o último `currentX`).

3. **Evitar que loops entrem na análise de bifurcação**
   - Ajustar `traceBranchPath` para cortar se um nó já foi visto no caminho, evitando voltar ao início do fluxo.
   - Arquivo: `src-code/lib/layout.ts` (função `traceBranchPath`).

4. **Permitir conexões “secundárias” no YAML**
   - Hoje o YAML não suporta `secondary`, mas o código ignora conexões `secondary` na detecção de bifurcação.
   - Adicionar suporte a `secondary: true` no YAML poderia marcar loops (como `redefinir_senha -> logar`) para não entrarem na análise de bifurcação.
   - Arquivos: `shared/types/yaml-flow.types.ts` e `src-code/lib/yamlParser.ts`.

## Sugestão objetiva
A causa raiz é o ciclo. A solução mais rápida é **remover o loop do YAML** ou **posicionar manualmente os nós do loop**. Para correção definitiva, implemente detecção de ciclos + fallback para layout linear.
