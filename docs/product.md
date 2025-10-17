# IziFlow – the automation plugin for user flows

IziFlow is a next-gen Figma and FigJam plugin that **redefines how user flows are created** through smart automation. Designed for designers and product teams, it turns **simple Markdown text** into structured, visually consistent flow diagrams in seconds.

## Overview

### Main goal
To automate and standardize the creation of user flows in Figma/FigJam — cutting time, removing repetitive work, and ensuring visual consistency through an **intuitive text-based input**.

### Target audience
- UI/UX designers  
- Product teams  
- Discovery specialists  
- Product managers  
- UX researchers  
- Anyone who needs to quickly map and visualize user flows  

### Problems it solves
- Eliminates repetitive manual work when building diagrams.  
- Ensures consistent visual patterns across all flows.  
- Speeds up ideation and flow documentation.  
- **Lowers the technical barrier** compared to JSON or code-based flow creation.  

## Key features

### ✍️ Simple Markdown input
- Define nodes (`NODE`), descriptions (`DESC`), metadata (`META`), and connections (`CONN`) using clean, human-readable syntax.  
- **Syntax validation:** Get instant feedback on structure errors.  
- See the **[IziFlow Markdown Syntax](docs/markdown-syntax.md)** for full details.  

### 🔄 Smart automation
- **Auto layout generation:** Automatically arranges nodes on the canvas.  
- **Logical connections:** Creates connectors between defined nodes.  
- **Optimized spatial organization:** Keeps your flow clean and easy to follow.  

### 🎨 Dynamic visualization
- **Node types:** Renders `START`, `END`, `STEP`, `DECISION`, `ENTRYPOINT` with distinct visual styles.  
- **Detailed content:** Displays names, descriptions, and metadata where needed.  
- **Connection styles:** Differentiates primary and secondary connections (`[SECONDARY]`).  

### 🤖 AI assistant (optional)
- Use the IziFlow Copilot (GPT-powered) to automatically generate Markdown structure through guided prompts — just copy the result into the plugin.  

## Technical requirements

### Figma / FigJam
- Figma account (free or paid).  
- Editing permissions in the target file.  
- Works on Figma Desktop App or compatible browsers.  

### System
- Stable internet connection (especially for AI features).  
- Sufficient system performance to run Figma/FigJam smoothly.  

## Current limitations
- Visual customization is limited to default node styles.  
- No support for generating multiple flows from a single Markdown input (each run creates a new one).  
- Importing hand-drawn flows directly from Figma/FigJam is not supported.  
- Exporting visual flows to other formats (besides Figma) not yet available.  

## Roadmap (examples)
- Graphical interface for manual creation (alternative to Markdown).  
- Customizable visual themes for generated nodes.  
- Library of pre-made Markdown flow templates.  
- Integrations with tools like Notion or Jira.  
- Smarter auto-layout algorithm.  
