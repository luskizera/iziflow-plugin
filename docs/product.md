# IziFlow - Plugin de Automação de Fluxos

O IziFlow é um plugin inovador para Figma e FigJam que revoluciona a criação de fluxos de usuário através de automação inteligente. Projetado para agilizar o trabalho de designers e times de produto, ele transforma descrições de fluxo em **formato Markdown simplificado** em diagramas visuais estruturados e padronizados.

## Visão Geral

### Objetivo Principal
Automatizar e padronizar a criação de fluxos de usuário no Figma/FigJam, reduzindo tempo e garantindo consistência visual através de uma **entrada de texto intuitiva**.

### Público-Alvo
- UI/UX Designers
- Times de Produto
- Profissionais de Discovery
- Product Managers
- Pesquisadores UX
- Qualquer pessoa que precise mapear e visualizar fluxos de usuário rapidamente.

### Problemas Resolvidos
- Eliminação de trabalho manual repetitivo na criação de diagramas.
- Padronização visual dos fluxos gerados.
- Agilidade na ideação e documentação de fluxos.
- **Redução da barreira técnica** para criação de fluxos estruturados (comparado a JSON/código).

## Principais Features

### ✍️ Entrada via Markdown Simplificado
- Defina nós (`NODE`), descrições (`DESC`), metadados (`META`) e conexões (`CONN`) usando uma sintaxe clara e legível.
- **Validação de Sintaxe:** Feedback instantâneo sobre a estrutura do seu texto Markdown.
- Veja a **[Sintaxe IziFlow Markdown](docs/markdown-syntax.md)** para detalhes.

### 🔄 Automação Inteligente
- **Geração Automática de Layout:** Organiza os nós visualmente no canvas.
- **Conexões Lógicas:** Cria conectores entre os nós definidos.
- **Organização Espacial Otimizada:** Tenta manter o fluxo claro e organizado.

### 🎨 Visualização Dinâmica
- **Tipos de Nós Visuais:** Renderiza `START`, `END`, `STEP`, `DECISION`, `ENTRYPOINT` com estilos distintos.
- **Conteúdo Detalhado:** Exibe nomes, descrições e metadados nos nós apropriados.
- **Conectores Diferenciados:** Usa estilos diferentes para conexões primárias e secundárias (`[SECONDARY]`).

### 🤖 Assistente com IA (Opcional)
- Use o IziFlow Copilot (GPT) para gerar a estrutura Markdown do fluxo através de uma conversa guiada (o resultado pode ser colado no plugin).

## Requisitos Técnicos

### Figma / FigJam
- Conta Figma (plano gratuito ou pago).
- Permissões de edição no arquivo onde o plugin será executado.
- Figma Desktop App ou Navegador Web compatível.

### Sistema
- Conexão estável com a internet (especialmente para recursos de IA).
- Recursos de sistema adequados para rodar o Figma/FigJam.

## Limitações Atuais
- Personalização visual dos nós gerados é limitada aos estilos padrão.
- Sem suporte a múltiplos fluxos sendo gerados simultaneamente a partir de um único input Markdown (cada geração cria um novo fluxo).
- A importação de fluxos desenhados diretamente no Figma/FigJam (sem usar Markdown) não é suportada.
- Exportação do fluxo visual para outros formatos (além do próprio arquivo Figma) não implementada.

## Roadmap (Exemplos)
- Interface Gráfica para criação manual (alternativa ao Markdown).
- Sistema de temas personalizáveis para os nós gerados.
- Biblioteca de templates de fluxos em Markdown.
- Integração com outras ferramentas (ex: Notion, Jira).
- Melhorias no algoritmo de layout automático.