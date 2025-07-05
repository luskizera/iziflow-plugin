# Documentação: Alert Dialogs no Plugin IziFlow

## 1. Introdução

Este documento detalha o uso dos Alert Dialogs no plugin IziFlow, explicando quais eventos acionam esses diálogos, as dependências de código utilizadas e um plano de ação para remover essa funcionalidade do plugin.

## 2. Eventos que Acionam os Alert Dialogs

No plugin IziFlow, os Alert Dialogs são utilizados em dois cenários específicos relacionados ao gerenciamento do histórico de fluxos:

### 2.1. Confirmação para Remover um Item do Histórico

**Evento Acionador:** Quando o usuário clica no botão "Remove" no menu dropdown de um item do histórico.

**Sequência de Ações:**
1. O usuário navega para a aba "History"
2. Clica no ícone de três pontos (MoreHorizontalIcon) de um item do histórico
3. Seleciona a opção "Remove" no dropdown menu
4. A função `handleRemoveItemClick` é chamada, que:
   - Armazena o item a ser removido no estado `itemToRemove`
   - Define `isRemoveConfirmOpen` como `true`, exibindo o diálogo de confirmação

```typescript
const handleRemoveItemClick = (markdownItem: string) => {
    setItemToRemove(markdownItem);
    setIsRemoveConfirmOpen(true);
};
```

### 2.2. Confirmação para Limpar Todo o Histórico

**Evento Acionador:** Quando o usuário clica no botão "Clean History" na parte inferior da aba de histórico.

**Sequência de Ações:**
1. O usuário navega para a aba "History"
2. Clica no botão "Clean History" no rodapé da aba
3. A função `handleClearHistoryClick` é chamada, que:
   - Verifica se há itens no histórico
   - Se houver, define `isClearConfirmOpen` como `true`, exibindo o diálogo de confirmação

```typescript
const handleClearHistoryClick = () => {
    if (history.length > 0) {
         setIsClearConfirmOpen(true);
    }
};
```

## 3. Código Importado Utilizado pelos Alert Dialogs

Os Alert Dialogs no plugin IziFlow utilizam os seguintes componentes e bibliotecas importados:

### 3.1. Componentes do Radix UI

O componente base `alert-dialog.tsx` importa e estende os componentes do Radix UI:

```typescript
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
```

Estes componentes fornecem a funcionalidade base dos diálogos, incluindo acessibilidade, gerenciamento de estado e comportamentos padrão.

### 3.2. Componentes Personalizados

No arquivo `app.tsx`, os seguintes componentes são importados do arquivo local `@/components/ui/alert-dialog`:

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
```

### 3.3. Utilitários e Estilos

Os Alert Dialogs também dependem de:

- `buttonVariants` de `@/components/ui/button` para estilização dos botões
- `cn` de `@/lib/utils` para composição de classes CSS

## 4. Plano de Ação para Remover a Funcionalidade

Para remover os Alert Dialogs do plugin IziFlow, siga este plano de ação:

### 4.1. Substituir ou Remover as Funcionalidades de Confirmação

#### Opção 1: Remover Completamente as Confirmações

1. **Modificar a função `handleRemoveItemClick`**:
   ```typescript
   const handleRemoveItemClick = (markdownItem: string) => {
       // Remover diretamente sem confirmação
       setHistory(prev => prev.filter(item => item !== markdownItem));
       dispatchTS('remove-history-entry', { markdown: markdownItem });
   };
   ```

2. **Modificar a função `handleClearHistoryClick`**:
   ```typescript
   const handleClearHistoryClick = () => {
       if (history.length > 0) {
           // Limpar diretamente sem confirmação
           setHistory([]);
           dispatchTS('clear-history-request');
       }
   };
   ```

#### Opção 2: Substituir por Confirmações Mais Simples

1. **Usar confirmações nativas do navegador**:
   ```typescript
   const handleRemoveItemClick = (markdownItem: string) => {
       if (window.confirm(`Deseja remover "${extractFlowName(markdownItem)}" do histórico?`)) {
           setHistory(prev => prev.filter(item => item !== markdownItem));
           dispatchTS('remove-history-entry', { markdown: markdownItem });
       }
   };
   
   const handleClearHistoryClick = () => {
       if (history.length > 0 && window.confirm("Deseja limpar todo o histórico? Esta ação não pode ser desfeita.")) {
           setHistory([]);
           dispatchTS('clear-history-request');
       }
   };
   ```

### 4.2. Remover os Estados Relacionados aos Alert Dialogs

Remover as seguintes linhas de código:

```typescript
const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
const [itemToRemove, setItemToRemove] = useState<string | null>(null);
```

### 4.3. Remover as Funções de Confirmação

Remover as seguintes funções que não serão mais necessárias:

```typescript
const handleConfirmRemoveItem = () => {
    // ...
};

const handleConfirmClearHistory = () => {
    // ...
};
```

### 4.4. Remover os Componentes de Alert Dialog do JSX

Remover os seguintes blocos de código do JSX:

```tsx
{/* Clear History Confirmation */}
<AlertDialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
  {/* ... */}
</AlertDialog>

{/* Remove Single Item Confirmation */}
<AlertDialog open={isRemoveConfirmOpen} onOpenChange={setIsRemoveConfirmOpen}>
  {/* ... */}
</AlertDialog>
```

### 4.5. Remover as Importações Não Utilizadas

Remover a importação dos componentes de Alert Dialog:

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
```

### 4.6. Testar as Alterações

1. Verificar se as funcionalidades de remoção de item e limpeza do histórico continuam funcionando corretamente
2. Garantir que não há erros de console ou comportamentos inesperados
3. Verificar se a experiência do usuário permanece intuitiva mesmo sem os diálogos de confirmação

### 4.7. Opcional: Remover o Componente Alert Dialog do Projeto

Se os Alert Dialogs não forem utilizados em outras partes do projeto, o arquivo `src/components/ui/alert-dialog.tsx` pode ser removido completamente, reduzindo o tamanho do bundle.

## 5. Considerações Adicionais

### 5.1. Impacto na Experiência do Usuário

A remoção dos Alert Dialogs pode impactar a experiência do usuário, pois ações destrutivas (como remover itens ou limpar o histórico) não terão mais uma etapa de confirmação elaborada. Considere:

- Adicionar mensagens de feedback após as ações (como toasts ou notificações)
- Implementar funcionalidade de desfazer (undo) para mitigar erros acidentais
- Adicionar dicas visuais para indicar que as ações são irreversíveis

### 5.2. Dependências do Projeto

Verifique se `@radix-ui/react-alert-dialog` é utilizado em outras partes do projeto antes de remover completamente a dependência do `package.json`.

## 6. Conclusão

Os Alert Dialogs no plugin IziFlow são utilizados exclusivamente para confirmações de ações destrutivas relacionadas ao histórico de fluxos. A remoção dessa funcionalidade é viável seguindo o plano de ação detalhado, mas deve ser feita com cuidado para manter uma boa experiência do usuário.