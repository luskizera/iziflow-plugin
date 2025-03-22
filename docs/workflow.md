# Workflow do IziFlow

## Processo de Geração

### 1. Preparação
- Defina o escopo do fluxo
- Identifique pontos de início e fim
- Liste todas as etapas necessárias

### 2. Estruturação JSON
```json
{
  "flowName": "Nome do Fluxo",
  "nodes": [
    {
      "id": "start",
      "type": "START",
      "text": "Início do Fluxo"
    }
  ],
  "connections": [
    {
      "from": "start",
      "to": "step1"
    }
  ]
}
```

### 3. Geração do Fluxo
1. Abra o plugin no Figma
2. Cole o JSON ou use o assistente
3. Valide a estrutura
4. Gere o fluxo visual

### 4. Personalização
- Ajuste posições se necessário
- Customize textos
- Adicione detalhes visuais

## Tipos de Nós Suportados

| Tipo | Descrição | Uso |
|------|-----------|-----|
| START | Ponto inicial | Início do fluxo |
| STEP | Etapa normal | Ações principais |
| DECISION | Decisão | Bifurcações |
| END | Ponto final | Conclusão |

## Boas Práticas

### Estruturação
- Use nomes descritivos
- Mantenha fluxos focados
- Limite a 20 nós por fluxo

### Visual
- Agrupe por contexto
- Use categorias adequadas
- Mantenha espaçamento consistente

### Manutenção
- Documente alterações
- Versione os JSONs
- Backup regular

## Exemplos Práticos

### Fluxo de Onboarding
```json
{
  "flowName": "User Onboarding",
  "nodes": [
    {
      "id": "welcome",
      "type": "START",
      "text": "Boas-vindas"
    },
    {
      "id": "register",
      "type": "STEP",
      "text": "Cadastro"
    }
  ]
}
```