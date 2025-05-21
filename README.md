# iziFlow v2

> Figma/FigJam plugin for automating user flows through a simple Markdown-based syntax.

> [iziFlow GPT Copilot](https://chatgpt.com/g/g-680800ab82a88191afc106220253ff30-iziflow-assistant)  
> Visit [iziTools](https://luski.studio/izitools) for more information.

iziFlow transforms structured textual descriptions of user flows into visual diagrams directly in Figma and FigJam, streamlining the design and documentation process.

## ✨ Highlights

* **Simplified Input:** Define your flows using an intuitive Markdown-inspired syntax, far more readable than JSON.
* **Automatic Generation:** Automatically convert your text into visual nodes (Start, End, Step, Decision, Entrypoint) and connectors with an organized layout.
* **Visual Consistency:** Applies standardized styles for different node types and connections.
* **Designer-Focused:** Designed to simplify flow creation, even for those with minimal coding experience.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/luskizera/iziflowv2.git
```

# Install dependencies
```bash
npm install # or pnpm install / yarn install
```

📦 Build

To create the final version for use:
# Compiles the UI and plugin code for production
```bash
npm run build
npm run buildcode
```

# In FigJam
* Plugins > Development > Import plugin from manifest...
* Select dist/manifest.json