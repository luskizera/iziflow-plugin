# Plano de Ação para Remoção de Dependências Não Utilizadas

Após uma análise detalhada do código e das dependências do projeto, identifiquei vários componentes e suas respectivas dependências que não estão sendo utilizados. Vou apresentar um plano de ação estruturado para remover essas dependências de forma segura.

## 1. Componentes Não Utilizados

### Componentes que não são importados em nenhum lugar:
- accordion.tsx
- aspect-ratio.tsx
- avatar.tsx
- breadcrumb.tsx
- calendar.tsx
- card.tsx
- carousel.tsx
- chart.tsx
- checkbox.tsx
- collapsible.tsx
- color-selector-panel.tsx
- context-menu.tsx
- drawer.tsx
- form.tsx
- hover-card.tsx
- input-otp.tsx
- menubar.tsx
- navigation-menu.tsx
- pagination.tsx
- popover.tsx
- progress.tsx
- radio-group.tsx
- resizable.tsx
- slider.tsx
- sonner.tsx
- switch.tsx

### Componentes que são importados por outros componentes não utilizados:
- color-picker.tsx (importa input.tsx e select.tsx)
- command.tsx (importa dialog.tsx)
- sidebar.tsx (importa input.tsx, separator.tsx, sheet.tsx e skeleton.tsx)
- tabgroup.tsx (importa badge.tsx e scroll-area.tsx)
- toggle-group.tsx (importa toggle.tsx)

## 2. Dependências do package.json a serem removidas

As seguintes dependências do Radix UI podem ser removidas:

```json
"@radix-ui/react-accordion": "^1.2.3",
"@radix-ui/react-aspect-ratio": "^1.1.2",
"@radix-ui/react-avatar": "^1.1.3",
"@radix-ui/react-checkbox": "^1.1.4",
"@radix-ui/react-collapsible": "^1.1.3",
"@radix-ui/react-context-menu": "^2.2.6",
"@radix-ui/react-dialog": "^1.1.6",
"@radix-ui/react-hover-card": "^1.1.6",
"@radix-ui/react-menubar": "^1.1.6",
"@radix-ui/react-navigation-menu": "^1.2.5",
"@radix-ui/react-popover": "^1.1.6",
"@radix-ui/react-progress": "^1.1.2",
"@radix-ui/react-radio-group": "^1.2.3",
"@radix-ui/react-select": "^2.2.2",
"@radix-ui/react-separator": "^1.1.2",
"@radix-ui/react-slider": "^1.3.2",
"@radix-ui/react-switch": "^1.1.3",
"@radix-ui/react-toggle": "^1.1.2",
"@radix-ui/react-toggle-group": "^1.1.2",
```

Outras dependências relacionadas que podem ser removidas:

```json
"cmdk": "^1.0.0",
"date-fns": "^4.1.0",
"embla-carousel-react": "^8.5.2",
"input-otp": "^1.4.2",
"react-colorful": "^5.6.1",
"react-day-picker": "^8.10.1",
"react-hook-form": "^7.54.2",
"@hookform/resolvers": "^4.1.3",
"react-resizable-panels": "^2.1.7",
"recharts": "^2.15.1",
"sonner": "^2.0.1",
"vaul": "^1.1.2",
```

## 3. Etapas para Remoção Segura

1. **Backup do Projeto**:
   - Crie um backup do projeto antes de iniciar as remoções.
   - Utilize controle de versão (git) para facilitar a reversão caso necessário.

2. **Remoção dos Arquivos de Componentes**:
   - Remova os arquivos de componentes não utilizados da pasta `src/components/ui/`.
   - Comece pelos componentes que não são importados por nenhum outro componente.
   - Em seguida, remova os componentes que são importados apenas por outros componentes não utilizados.

3. **Atualização do package.json**:
   - Remova as dependências identificadas do arquivo package.json.
   - Execute `npm install` ou `yarn` para atualizar o arquivo de lock.

4. **Testes**:
   - Após cada etapa de remoção, teste a aplicação para garantir que não houve quebras.
   - Verifique se todas as funcionalidades continuam operando normalmente.

## 4. Ordem de Remoção Recomendada

Para minimizar o risco de quebrar a aplicação, sugiro a seguinte ordem de remoção:

1. Primeiro, remova os componentes que não são importados por nenhum outro componente:
   - accordion.tsx, aspect-ratio.tsx, avatar.tsx, etc.

2. Em seguida, remova os componentes que são importados apenas por outros componentes não utilizados:
   - color-picker.tsx, command.tsx, sidebar.tsx, tabgroup.tsx, toggle-group.tsx

3. Por fim, atualize o package.json removendo as dependências correspondentes.

## 5. Monitoramento e Validação

- Após a remoção, monitore o desempenho da aplicação.
- Verifique se houve redução no tamanho do bundle.
- Certifique-se de que todas as funcionalidades continuam operando normalmente.

## 6. Documentação

- Documente as alterações realizadas para referência futura.
- Mantenha um registro das dependências removidas caso seja necessário reintroduzi-las no futuro.

Este plano de ação permitirá a remoção segura das dependências não utilizadas, resultando em um projeto mais limpo, com menor tamanho de bundle e melhor desempenho.