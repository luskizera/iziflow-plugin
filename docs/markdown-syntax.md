# 📜 IziFlow Markdown syntax

This document describes the simplified Markdown syntax used by the IziFlow plugin to define user flow structures. When written in this format, the plugin can interpret and automatically generate the corresponding visual diagram in Figma or FigJam.

## 📝 Basic structure

An IziFlow Markdown file consists of:

1.  An optional title for the flow  
2.  Node definitions (`NODE`)  
3.  Connection definitions (`CONN`)  
4.  Comments (lines starting with `#`)  
5.  Blank lines (ignored)  

**Notes:**

* `META` and `DESC` definitions must be **indented** under their corresponding `NODE`.  
* The general convention is to define all `NODE`s first, followed by `CONN`s — however, the parser is flexible and supports interleaving. Keeping them grouped improves human readability.

## 🧱 Node definition (`NODE`)

Each node line starts with the keyword `NODE`, followed by:

1. A unique `[node_id]` (no spaces or special characters — use `snake_case` or `kebab-case`).  
2. The `[NODE_TYPE]` in uppercase: `START`, `END`, `STEP`, `DECISION`, or `ENTRYPOINT`.  
3. The `"[Node Name]"` — the main label that appears visually on the node, enclosed in double quotes.

**Syntax:**
```markdown
NODE [node_id] [NODE_TYPE] "[Node Name]"
NODE start_process START "Flow Start"
NODE user_input STEP "Fill Form"
NODE check_status DECISION "Valid Status?"
NODE process_complete END "Process Complete"
````

## 📦 Metadata (`META`)

You can add metadata to any node to provide additional context (e.g., category, owner, or version).
Each metadata line must be indented under the `NODE` and start with `META`, followed by:

1. The [key]
2. A colon (:)
3. The [value]

**Syntax:**

```markdown
META [key]: [value]
```

**Example:**

```markdown
NODE user_login ENTRYPOINT "Login Screen"
    META category: Authentication
    META createdBy: Alice
    META version: 1.2
```

## 📄 Detailed description (`DESC`)

For nodes of type `STEP`, `DECISION`, and `ENTRYPOINT`, you can add detailed description blocks to explain actions, inputs, rules, etc.
Each description line must be indented under the `NODE` and start with `DESC`, followed by:

1. The [Label] of the description (e.g., Action, Inputs, Validation, Feedback)
2. A colon (:)
3. The [Content] of the description

The [Content] can include plain text or multiple lines separated by `\n`. The parser preserves line breaks when rendering.

**Syntax:**

```markdown
DESC [Label]: [Content]
```

**Example:**

```markdown
NODE shipping_address STEP "Enter Shipping Address"
    META category: Checkout Form
    DESC Title: Shipping Details
    DESC Inputs: Full Name\nStreet Address\nCity\nPostcode\nCountry
    DESC Validation: All fields required; postcode format validation.
    DESC Option: Save address for future use? (Checkbox)
```

In this example, everything after “Inputs:” will be interpreted as a single string containing `\n`, which the plugin renders with line breaks.

## 🔗 Connection definition (`CONN`)

Each connection line starts with the keyword `CONN`, followed by:

1. The [source_node_id]
2. An arrow (`->`)
3. The [target_node_id]
4. Optionally, a `"[Condition Label]"` — text displayed on the connector, enclosed in double quotes.
5. Optionally, the `[SECONDARY]` flag — marks the connection as secondary (changes visual style).

**Syntax:**

```markdown
CONN [source_node_id] -> [target_node_id] "[Condition Label]" [SECONDARY]
```

**Example:**

```markdown
CONN review_cart -> shipping_address "Proceed to Shipping"
CONN payment_options -> cc_details "Selects Credit Card"
CONN payment_options -> paypal_redirect "Selects PayPal" [SECONDARY]
CONN cc_details -> order_confirmation
```

The condition label and `[SECONDARY]` flag are both optional.

## 💬 Comments

Example:

```markdown
# This is a comment about the flow
NODE start START "Start"
# First visible step
NODE welcome_screen ENTRYPOINT "Welcome Screen"
CONN start -> welcome_screen # Connects start to the first screen
