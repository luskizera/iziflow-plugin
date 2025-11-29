# 📜 IziFlow YAML syntax

The IziFlow plugin now consumes a single structured input: **YAML**. A valid flow always contains `metadata`, `nodes`, and `connections`. The parser enforces this schema and converts it into the internal layout engine (default unit = **300px**, default horizontal spacing = **1u** when not provided).

Use this document to craft flows manually or to understand what the IziFlow Copilot is generating for you.

---

## ⚙️ Metadata

```yaml
metadata:
  name: Checkout Flow            # Used in the UI history
  layout:
    algorithm: auto              # only supported algorithm
    unit: 300                    # 1u = 300px when omitted
    first_node_position: center  # required
    spacing:
      horizontal: 1u             # default fallback if omitted
      vertical: 0.75u            # default fallback if omitted
```

**Required fields**
- `metadata.name`: string that labels history entries (trimmed automatically)
- `layout.algorithm`: currently must be `auto`
- `layout.unit`: numeric base unit in pixels (defaults to 300 when not supplied in UI fallback)
- `layout.first_node_position`: must be `center`

**Optional fields**
- `spacing.horizontal`: accepts raw numbers, `<value>u`, or `<value>px` (defaults to `1u`)
- `spacing.vertical`: defaults to `0.75u`

> 📝 Tip: keep `unit` = 300 for consistent spacing across flows unless a coarser/finer grid is needed.

---

## 🧱 Nodes

Nodes are defined under the `nodes` map. The key is the node ID.

```yaml
nodes:
  welcome_screen:
    type: ENTRYPOINT            # ENTRYPOINT | STEP | DECISION | END
    name: Welcome
    description: Hero copy
    content: |
      Action: Introduce the experience
      CTA: Start now
    position:
      anchor: entrypoint        # optional relative positioning
      offset:
        x: 1.2u
        y: 0
      exit: right               # connector magnets (top|right|bottom|left)
```

Supported fields:
- `type` (required): `ENTRYPOINT`, `STEP`, `DECISION`, or `END`
- `name` (required)
- `description` (optional short text)
- `content` (optional multiline body using `|` for formatting)
- `position` (optional): anchor another node and provide offsets in `u`, `px`, or raw numbers. Entry/exit magnets plug into connector logic.

START nodes are implicit; don’t declare them in YAML.

---

## 🔗 Connections

Connections describe directed edges.

```yaml
connections:
  - from: welcome_screen
    to: choose_auth
    label: Continue
    style:
      line_type: ELBOWED
      exit: right
      entry: left
  - from: choose_auth
    to: login_form
    label: Login
```

Supported fields:
- `from` / `to` (required)
- `label` (optional, mirrored to the connector label + `conditionLabel` field)
- `style.line_type`: `STRAIGHT` or `ELBOWED`
- `style.exit` / `style.entry`: magnets to fine-tune elbows

The parser validates references to ensure every node exists.

---

## 🧲 Layout Defaults & Hints

- If `spacing.horizontal` is omitted, the parser resolves it to `1u` (matching the declared unit).
- The fallback layout resolver (used when metadata is missing) now assumes `unit = 300`, ensuring consistent auto-layout even when YAML is partially filled.
- Manual anchors + offsets allow precise placement; when no hints are supplied the bifurcated layout keeps nodes centered relative to their predecessors.

---

## 📚 Examples

Reference flows converted to YAML live in `docs/flows-examples/`:
- `flow-example-checkout.yaml`
- `flow-example-file-upload.yaml`
- `flow-example-password-reset.yaml`
- `sample-flow.yaml` (full demo with anchors, offsets, and magnets)

---

## 🧠 Copilot Integration

The IziFlow Copilot GPT now emits YAML with the structure above. Make sure the assistant sets `metadata.name` for every flow to keep the plugin’s history list readable. When users paste YAML into the UI the parser enforces everything described here—no Markdown is accepted.

Need a migration reference from the legacy Markdown format? See the “Migration from Markdown” appendix in `docs/improve-plan/iziflow-yaml-syntax.md` for a step-by-step mapping.
