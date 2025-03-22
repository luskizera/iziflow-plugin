# Componentes do IziFlow

## Componentes de Interface

### FlowEditor
O componente principal para edição de fluxos.

```tsx
import { FlowEditor } from '@/components/flow-editor';

<FlowEditor 
  initialJson={jsonString}
  onChange={handleChange}
/>
```

**Props:**
| Prop | Tipo | Descrição |
|------|------|-----------|
| initialJson | `string` | JSON inicial do fluxo |
| onChange | `(json: string) => void` | Callback de mudanças |
| theme? | `Theme` | Tema customizado |

### JsonViewer
Visualizador de JSON com syntax highlighting.

```tsx
<JsonViewer 
  value={jsonString}
  readonly={false}
/>
```

### FlowControls
Barra de controles para manipulação do fluxo.

```tsx
<FlowControls
  onGenerate={() => {}}
  onReset={() => {}}
  disabled={false}
/>
```

## Componentes de Nós

### StartNode
Nó inicial do fluxo.

```tsx
<StartNode
  data={{ label: 'Início' }}
  position={{ x: 0, y: 0 }}
/>
```

### StepNode
Nó de passo padrão.

```tsx
<StepNode
  data={{
    label: 'Passo 1',
    description: 'Descrição...'
  }}
/>
```

### DecisionNode
Nó de decisão com múltiplas saídas.

```tsx
<DecisionNode
  data={{
    question: 'Usuário logado?',
    options: ['Sim', 'Não']
  }}
/>
```

## Componentes de Formulário

### JsonInput
Campo para entrada de JSON com validação.

```tsx
<JsonInput
  value={json}
  onChange={setJson}
  error={error}
/>
```

### FlowOptions
Configurações do fluxo.

```tsx
<FlowOptions
  direction="horizontal"
  spacing={50}
  onChange={handleOptionsChange}
/>
```

## Hooks Personalizados

### useFlowValidation
Hook para validação de JSON do fluxo.

```tsx
const { isValid, errors } = useFlowValidation(jsonString);
```

### useFlowLayout
Hook para cálculo automático de layout.

```tsx
const { positions, recalculate } = useFlowLayout(nodes);
```

## Exemplos de Uso

### Fluxo Básico
```tsx
import { FlowEditor, FlowControls } from '@/components';

export function BasicFlow() {
  const [json, setJson] = useState('');
  
  return (
    <div>
      <FlowControls />
      <FlowEditor 
        initialJson={json}
        onChange={setJson}
      />
    </div>
  );
}
```

### Fluxo com Preview
```tsx
import { FlowEditor, JsonViewer } from '@/components';

export function FlowWithPreview() {
  const [json, setJson] = useState('');
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <FlowEditor 
        initialJson={json}
        onChange={setJson}
      />
      <JsonViewer value={json} readonly />
    </div>
  );
}
```

## Boas Práticas

1. **Performance**
   - Use `memo` para componentes pesados
   - Evite re-renders desnecessários
   - Implemente virtualização para muitos nós

2. **Acessibilidade**
   - Todos componentes suportam navegação por teclado
   - Labels e ARIAs implementados
   - Alto contraste disponível

3. **Customização**
   - Use o sistema de temas
   - Sobrescreva estilos via classes
   - Extenda componentes base

## Contribuindo

Para adicionar novos componentes:

1. Crie em `src/components/[nome]`
2. Adicione tipos TypeScript
3. Documente props e exemplos
4. Adicione testes unitários