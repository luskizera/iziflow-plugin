# 📜 IziFlow YAML syntax

This document describes the YAML syntax used by the IziFlow plugin to define user flow structures with precise control over positioning and layout. When written in this format, the plugin interprets and automatically generates the corresponding visual diagram in Figma or FigJam.

---

## 📋 Basic structure

An IziFlow YAML file consists of three main sections:

1. **`metadata`** - Global layout configuration (algorithm, units, spacing)
2. **`nodes`** - Node definitions with their properties and optional positioning
3. **`connections`** - Connection definitions between nodes with optional styling

**Example:**
```yaml
metadata:
  layout:
    algorithm: auto
    unit: 200
    first_node_position: center

nodes:
  welcome_screen:
    type: ENTRYPOINT
    name: "Welcome Screen"

connections:
  - from: welcome_screen
    to: next_step
```

**Notes:**
- All three sections are required (even if empty)
- Indentation matters in YAML - use 2 spaces per level
- Comments start with `#` and can appear anywhere
- Node IDs must be unique and use `snake_case` or `kebab-case`

---

## ⚙️ Metadata section

The `metadata` section defines global layout configuration that applies to the entire flow.

### layout

**Required fields:**
- `algorithm`: Must be `"auto"` (only supported mode currently)
- `unit`: Number representing pixels per unit (e.g., `200` means `1u = 200px`)
- `first_node_position`: Must be `"center"` (first node positioned at viewport center)

**Optional fields:**
- `spacing.horizontal`: Horizontal spacing between nodes (default: `1.5u`)
- `spacing.vertical`: Vertical spacing for bifurcations (default: `0.75u`)

**Syntax:**
```yaml
metadata:
  layout:
    algorithm: auto
    unit: 200
    first_node_position: center
    spacing:
      horizontal: 1.5u
      vertical: 0.75u
```

**Unit values:** Can be specified as:
- Relative units: `"2u"`, `"1.5u"`, `"0.75u"` (calculated as `value × unit`)
- Absolute pixels: `"400px"`, `"300px"` (used directly)
- Raw numbers: `400`, `300` (treated as pixels)

**Examples:**
```yaml
# Tight spacing
metadata:
  layout:
    algorithm: auto
    unit: 150
    first_node_position: center
    spacing:
      horizontal: 2u      # 300px
      vertical: 1u        # 150px

# Loose spacing
metadata:
  layout:
    algorithm: auto
    unit: 250
    first_node_position: center
    spacing:
      horizontal: 1.2u    # 300px
      vertical: 0.6u      # 150px
```

---

## 🧱 Nodes section

The `nodes` section defines all flow nodes. Each node has a unique ID used as its key.

### Node types

| Type | Description | Use case |
|------|-------------|----------|
| `ENTRYPOINT` | First user interaction point | Landing screen, initial form |
| `STEP` | Action or form in the flow | Data entry, content display |
| `DECISION` | Binary decision point | Yes/No, Login/Register |
| `END` | Flow termination point | Success, error, exit |

**Note:** `START` nodes are created automatically and should not be defined in YAML.

### Basic node definition

**Required fields:**
- `type`: Node type (ENTRYPOINT, STEP, DECISION, or END)
- `name`: Display name shown in the diagram (enclosed in quotes if contains special chars)

**Optional fields:**
- `description`: Longer explanatory text
- `content`: Detailed information (supports multi-line with `|`)
- `position`: Positioning control (anchor, offset, exit/entry points)

**Syntax:**
```yaml
nodes:
  [node_id]:
    type: [NODE_TYPE]
    name: "[Node Display Name]"
    description: "[Optional description]"
    content: "[Optional detailed content]"
    position:
      anchor: [reference_node_id]
      offset: {x: [value], y: [value]}
      exit: [top|right|bottom|left]
      entry: [top|right|bottom|left]
```

### Simple node examples

**ENTRYPOINT:**
```yaml
nodes:
  welcome_screen:
    type: ENTRYPOINT
    name: "Welcome Screen"
    description: "Initial app screen with branding"
```

**STEP:**
```yaml
nodes:
  user_login:
    type: STEP
    name: "Login Form"
    description: "User authentication"
```

**DECISION:**
```yaml
nodes:
  check_auth:
    type: DECISION
    name: "Login or Register?"
```

**END:**
```yaml
nodes:
  success_end:
    type: END
    name: "Dashboard"
    description: "Main app screen - logged in"
```

---

## 📝 Node content (multi-line)

For complex nodes, use multi-line content with the `|` (pipe) character. This preserves line breaks.

**Syntax:**
```yaml
nodes:
  [node_id]:
    type: STEP
    name: "Form Name"
    content: |
      Section: Details
      Field 1
      Field 2
      
      Section: Validation
      Rule 1
      Rule 2
```

**Example:**
```yaml
nodes:
  register_form:
    type: STEP
    name: "Registration Form"
    description: "New user account creation"
    content: |
      Inputs:
      - Full name (required, 2-50 chars)
      - Email (required, valid format)
      - Password (required, min 8 chars, 1 uppercase, 1 number)
      - Confirm password (must match)
      
      Validation:
      - Real-time email format check
      - Password strength indicator
      - "Passwords don't match" error if mismatch
      
      Errors:
      - "Email already registered"
      - "Password too weak"
      
      Success: Redirect to email verification screen
```

---

## 📍 Node positioning

The `position` field provides fine-grained control over node placement.

### Automatic positioning

**Omit the `position` field** to use automatic positioning:
- First node (ENTRYPOINT): Centered at viewport
- Subsequent nodes: Positioned by bifurcation algorithm

```yaml
nodes:
  welcome:
    type: ENTRYPOINT
    name: "Welcome"
    # No position = automatic (centered)
  
  next:
    type: STEP
    name: "Next"
    # No position = automatic (algorithm decides)
```

### Manual positioning with anchors

**Use `anchor` and `offset`** to position relative to another node:

```yaml
nodes:
  step_two:
    type: STEP
    name: "Step Two"
    position:
      anchor: step_one     # Reference node ID
      offset: {x: 2u, y: 0u}  # 400px right, 0px vertical (if unit=200)
```

**Offset directions:**
- Positive X: Right
- Negative X: Left
- Positive Y: Down
- Negative Y: Up

**Examples:**
```yaml
# Node 400px to the right
position:
  anchor: previous_node
  offset: {x: 2u, y: 0u}

# Node 300px above
position:
  anchor: previous_node
  offset: {x: 0u, y: -1.5u}

# Node 400px right and 150px down
position:
  anchor: previous_node
  offset: {x: 2u, y: 0.75u}

# Using pixels directly
position:
  anchor: previous_node
  offset: {x: 500px, y: 200px}
```

### Exit and entry points

**Optional:** Specify where connectors exit and enter nodes.

```yaml
position:
  anchor: decision_node
  offset: {x: 2u, y: -0.75u}
  exit: top        # Connector exits from top of anchor
  entry: left      # Connector enters from left of this node
```

**Valid values:** `top`, `right`, `bottom`, `left`

**When to specify:**
- Binary decisions (to control branch directions)
- Convergences (multiple paths meeting)
- When automatic calculation is incorrect

**When to omit:**
- Linear flows (calculated automatically based on offset direction)
- Most simple connections

**Automatic calculation rules:**
If `exit` and `entry` are not specified, they are calculated based on offset:

- If `offset.x > 0` (right): `exit: right`, `entry: left`
- If `offset.x < 0` (left): `exit: left`, `entry: right`
- If `offset.y > 0` (down): `exit: bottom`, `entry: top`
- If `offset.y < 0` (up): `exit: top`, `entry: bottom`
- If diagonal: Horizontal (x) takes priority

**Example - Binary decision:**
```yaml
nodes:
  auth_decision:
    type: DECISION
    name: "Login or Register?"
    position:
      anchor: welcome_screen
      offset: {x: 2u, y: 0u}
  
  login_form:
    type: STEP
    name: "Login"
    position:
      anchor: auth_decision
      offset: {x: 2u, y: -0.75u}
      exit: top      # Explicitly top branch
      entry: left
  
  register_form:
    type: STEP
    name: "Register"
    position:
      anchor: auth_decision
      offset: {x: 2u, y: 0.75u}
      exit: bottom   # Explicitly bottom branch
      entry: left
```

---

## 🔗 Connections section

The `connections` section defines how nodes are linked together.

### Basic connection

**Required fields:**
- `from`: Source node ID
- `to`: Target node ID

**Optional fields:**
- `label`: Text displayed on the connector
- `style`: Styling options (line type, exit/entry override)

**Syntax:**
```yaml
connections:
  - from: [source_node_id]
    to: [target_node_id]
    label: "[Connector text]"
    style:
      line_type: [STRAIGHT|ELBOWED]
      exit: [top|right|bottom|left]
      entry: [top|right|bottom|left]
```

### Simple connection examples

**Without label:**
```yaml
connections:
  - from: welcome_screen
    to: login_decision
```

**With label:**
```yaml
connections:
  - from: welcome_screen
    to: login_decision
    label: "Get Started"
```

**Multiple connections:**
```yaml
connections:
  - from: welcome_screen
    to: login_decision
    label: "Get Started"
  
  - from: login_decision
    to: login_form
    label: "Login"
  
  - from: login_decision
    to: register_form
    label: "Register"
```

---

## 🎨 Connection styling

The `style` field provides control over connector appearance.

### line_type

**Values:**
- `STRAIGHT`: Direct line between nodes
- `ELBOWED`: Line with right angles (default for most cases)

```yaml
connections:
  - from: step_one
    to: step_two
    style:
      line_type: STRAIGHT
```

**When to specify:**
- When you want straight lines instead of elbowed
- For specific aesthetic requirements

**When to omit:**
- Default behavior is usually correct (ELBOWED for decisions, automatic for others)

### exit and entry override

Override the automatic exit/entry calculation for specific connections:

```yaml
connections:
  - from: login_form
    to: forgot_password
    label: "Forgot password?"
    style:
      exit: bottom      # Exit from bottom instead of calculated
      entry: top        # Enter from top
      line_type: ELBOWED
```

**Use cases:**
- Binary decisions (control which branch goes up/down)
- Convergences (align incoming connectors)
- Loops (connections back to previous nodes)
- When automatic calculation doesn't match your intent

**Example - Decision with styled connections:**
```yaml
connections:
  # Top branch
  - from: payment_decision
    to: credit_card
    label: "Credit Card"
    style:
      exit: top
      entry: left
      line_type: ELBOWED
  
  # Bottom branch
  - from: payment_decision
    to: paypal
    label: "PayPal"
    style:
      exit: bottom
      entry: left
      line_type: ELBOWED
  
  # Convergence
  - from: credit_card
    to: order_confirmation
    label: "Payment success"
    style:
      exit: right
      entry: left
  
  - from: paypal
    to: order_confirmation
    label: "Payment success"
    style:
      exit: right
      entry: left
```

---

## 💬 Comments

Comments start with `#` and can appear anywhere in the YAML file.

**Examples:**
```yaml
# Main flow configuration
metadata:
  layout:
    algorithm: auto
    unit: 200  # 1 unit = 200 pixels
    first_node_position: center

nodes:
  # Entry point - always first
  welcome:
    type: ENTRYPOINT
    name: "Welcome Screen"
  
  # Main decision point
  auth_decision:
    type: DECISION
    name: "Login or Register?"  # User chooses path

connections:
  - from: welcome
    to: auth_decision
    # This is the main entry connection
```

---

## ✅ Complete example: E-commerce checkout

```yaml
metadata:
  layout:
    algorithm: auto
    unit: 200
    first_node_position: center
    spacing:
      horizontal: 1.5u
      vertical: 0.75u

nodes:
  # Entry point
  cart_review:
    type: ENTRYPOINT
    name: "Review Cart"
    description: "Customer reviews items before checkout"
    content: |
      Display:
      - List of cart items with images
      - Quantity controls (+/-)
      - Subtotal, tax, shipping estimate
      - "Proceed to Checkout" button
      - "Continue Shopping" link

  # Shipping details
  shipping_address:
    type: STEP
    name: "Shipping Address"
    description: "Enter delivery address"
    content: |
      Inputs:
      - Full name (required)
      - Street address (required)
      - City (required)
      - State/Province (required)
      - Postal code (required, format validation)
      - Country (dropdown, required)
      
      Options:
      - "Save as default address" (checkbox)
      - "Bill to same address" (checkbox, default checked)
      
      Validation:
      - All required fields must be filled
      - Postal code format check
      
      Errors:
      - "Invalid postal code format"
      - "Address not found"
    position:
      anchor: cart_review
      offset: {x: 2u, y: 0u}

  # Payment method decision
  payment_method:
    type: DECISION
    name: "Payment Method"
    description: "Customer selects payment type"
    position:
      anchor: shipping_address
      offset: {x: 2u, y: 0u}

  # Credit card payment
  credit_card_form:
    type: STEP
    name: "Credit Card Details"
    description: "Enter card information"
    content: |
      Inputs:
      - Card number (required, 16 digits)
      - Cardholder name (required)
      - Expiry date (MM/YY, required)
      - CVV (required, 3-4 digits)
      
      Validation:
      - Luhn algorithm for card number
      - Expiry date must be future
      - CVV numeric only
      
      Errors:
      - "Invalid card number"
      - "Card expired"
      - "Payment declined"
      
      Security:
      - Display security badges
      - PCI compliance notice
    position:
      anchor: payment_method
      offset: {x: 2u, y: -0.75u}
      exit: top
      entry: left

  # PayPal redirect
  paypal_redirect:
    type: STEP
    name: "PayPal Authentication"
    description: "Redirect to PayPal login"
    content: |
      Action:
      - Redirect to PayPal secure login
      - Wait for authentication callback
      
      Display:
      - "Redirecting to PayPal..." message
      - PayPal logo
      - "Cancel and return to checkout" link
      
      Errors:
      - "PayPal authentication failed"
      - "PayPal account has insufficient funds"
    position:
      anchor: payment_method
      offset: {x: 2u, y: 0.75u}
      exit: bottom
      entry: left

  # Order confirmation
  order_confirmation:
    type: STEP
    name: "Order Confirmation"
    description: "Display order summary and confirmation"
    content: |
      Display:
      - Order number
      - Estimated delivery date
      - Complete order summary
      - Shipping address
      - Payment method used
      - Total amount charged
      
      Actions:
      - "View order details" button
      - "Continue shopping" button
      - Email confirmation sent
    position:
      anchor: credit_card_form
      offset: {x: 2u, y: 0.375u}

  # Success end
  order_complete:
    type: END
    name: "Order Complete"
    description: "Customer successfully placed order"
    position:
      anchor: order_confirmation
      offset: {x: 2u, y: 0u}

connections:
  # Main flow
  - from: cart_review
    to: shipping_address
    label: "Proceed to Checkout"
  
  - from: shipping_address
    to: payment_method
    label: "Continue to Payment"
  
  # Payment branches
  - from: payment_method
    to: credit_card_form
    label: "Credit Card"
    style:
      exit: top
      entry: left
  
  - from: payment_method
    to: paypal_redirect
    label: "PayPal"
    style:
      exit: bottom
      entry: left
  
  # Convergence to confirmation
  - from: credit_card_form
    to: order_confirmation
    label: "Payment authorized"
    style:
      exit: right
      entry: left
  
  - from: paypal_redirect
    to: order_confirmation
    label: "PayPal payment complete"
    style:
      exit: right
      entry: left
  
  # Final step
  - from: order_confirmation
    to: order_complete
    label: "Order placed"
```

---

## ✅ Complete example: User authentication

```yaml
metadata:
  layout:
    algorithm: auto
    unit: 200
    first_node_position: center
    spacing:
      horizontal: 1.5u
      vertical: 0.75u

nodes:
  welcome_screen:
    type: ENTRYPOINT
    name: "Welcome Screen"
    description: "App entry point"
    content: |
      Display:
      - App logo
      - Tagline: "Manage your tasks effortlessly"
      - "Get Started" button

  auth_decision:
    type: DECISION
    name: "Login or Register?"
    description: "User authentication choice"
    position:
      anchor: welcome_screen
      offset: {x: 2u, y: 0u}

  login_form:
    type: STEP
    name: "Login Form"
    description: "Existing user login"
    content: |
      Inputs:
      - Email (required, format validation)
      - Password (required, masked)
      
      Options:
      - "Remember me" (checkbox)
      - "Forgot password?" (link)
      
      Validation:
      - Valid email format
      - Non-empty password
      
      Errors:
      - "Invalid email or password"
      - "Account locked - too many attempts"
      - "Please verify your email first"
    position:
      anchor: auth_decision
      offset: {x: 2u, y: -0.75u}
      exit: top
      entry: left

  register_form:
    type: STEP
    name: "Registration Form"
    description: "New user registration"
    content: |
      Inputs:
      - Full name (required, 2-50 chars)
      - Email (required, format validation)
      - Password (required, min 8 chars, 1 uppercase, 1 number)
      - Confirm password (must match)
      
      Validation:
      - Real-time email availability check
      - Password strength indicator
      - Password match validation
      
      Errors:
      - "Email already registered"
      - "Password too weak"
      - "Passwords don't match"
      
      Success: Account created, verification email sent
    position:
      anchor: auth_decision
      offset: {x: 2u, y: 0.75u}
      exit: bottom
      entry: left

  forgot_password:
    type: STEP
    name: "Password Recovery"
    description: "Reset password flow"
    content: |
      Inputs:
      - Email (required)
      
      Validation:
      - Valid email format
      - Account exists check
      
      Success: "Recovery email sent - check your inbox"
      Errors:
      - "Email not found"
      - "Too many recovery attempts - try again later"
    position:
      anchor: login_form
      offset: {x: 0u, y: 1.5u}
      exit: bottom
      entry: top

  dashboard:
    type: END
    name: "Dashboard"
    description: "Main app - user logged in"
    position:
      anchor: login_form
      offset: {x: 2u, y: 0.375u}

connections:
  - from: welcome_screen
    to: auth_decision
    label: "Get Started"

  - from: auth_decision
    to: login_form
    label: "Login"
    style:
      exit: top
      entry: left

  - from: auth_decision
    to: register_form
    label: "Register"
    style:
      exit: bottom
      entry: left

  - from: login_form
    to: dashboard
    label: "Login success"

  - from: login_form
    to: forgot_password
    label: "Forgot password?"
    style:
      exit: bottom
      entry: top

  - from: register_form
    to: dashboard
    label: "Account created"

  - from: forgot_password
    to: login_form
    label: "Back to login"
    style:
      exit: left
      entry: bottom
      line_type: ELBOWED
```

---

## 📚 Quick reference

### Metadata
```yaml
metadata:
  layout:
    algorithm: auto
    unit: [number]
    first_node_position: center
    spacing:
      horizontal: [value]
      vertical: [value]
```

### Node
```yaml
nodes:
  [node_id]:
    type: ENTRYPOINT|STEP|DECISION|END
    name: "[Display name]"
    description: "[Optional]"
    content: "[Optional]" or |
      Multi-line
      content
    position:
      anchor: [node_id]
      offset: {x: [value], y: [value]}
      exit: top|right|bottom|left
      entry: top|right|bottom|left
```

### Connection
```yaml
connections:
  - from: [node_id]
    to: [node_id]
    label: "[Optional]"
    style:
      line_type: STRAIGHT|ELBOWED
      exit: top|right|bottom|left
      entry: top|right|bottom|left
```

### Units
- Relative: `2u`, `1.5u`, `0.75u` → `value × unit`
- Absolute: `400px`, `300px` → direct pixels
- Numbers: `400`, `300` → treated as pixels

---

## ⚠️ Common mistakes

### Missing required fields
```yaml
# ❌ WRONG - missing type
nodes:
  welcome:
    name: "Welcome"

# ✅ CORRECT
nodes:
  welcome:
    type: ENTRYPOINT
    name: "Welcome"
```

### Invalid node reference
```yaml
# ❌ WRONG - anchor references non-existent node
nodes:
  step_two:
    type: STEP
    name: "Step Two"
    position:
      anchor: nonexistent_node  # This node doesn't exist!
      offset: {x: 2u, y: 0u}
```

### Circular anchor references
```yaml
# ❌ WRONG - circular reference
nodes:
  node_a:
    type: STEP
    name: "A"
    position:
      anchor: node_b
      offset: {x: 2u, y: 0u}
  
  node_b:
    type: STEP
    name: "B"
    position:
      anchor: node_a  # Circular!
      offset: {x: 2u, y: 0u}
```

### Invalid connection
```yaml
# ❌ WRONG - connection to non-existent node
connections:
  - from: welcome
    to: nonexistent_node
```

### Incorrect indentation
```yaml
# ❌ WRONG - inconsistent indentation
nodes:
  welcome:
  type: ENTRYPOINT  # Should be indented 2 spaces
    name: "Welcome"  # Inconsistent with type

# ✅ CORRECT
nodes:
  welcome:
    type: ENTRYPOINT
    name: "Welcome"
```

---

## 🎯 Best practices

1. **Start simple** - Begin with basic nodes and connections, add positioning later
2. **Use relative units** - `2u` instead of `400px` for consistent scaling
3. **Group by section** - Keep related nodes together in the file
4. **Comment liberally** - Explain complex positioning or business logic
5. **Consistent naming** - Use `snake_case` for node IDs
6. **Let automation work** - Only specify `position`, `exit`, `entry` when needed
7. **Test incrementally** - Add nodes gradually and test the layout
8. **Use meaningful IDs** - `login_form` instead of `node_7`

---

## 🔄 Migration from Markdown

The YAML format replaces the Markdown syntax. Here's how to convert:

### Node definition
```markdown
# Markdown (OLD)
NODE welcome_screen ENTRYPOINT "Welcome Screen"
    DESC Action: Display app logo and tagline
```

```yaml
# YAML (NEW)
nodes:
  welcome_screen:
    type: ENTRYPOINT
    name: "Welcome Screen"
    content: "Display app logo and tagline"
```

### Connection definition
```markdown
# Markdown (OLD)
CONN welcome_screen -> login_form "Get Started"
```

```yaml
# YAML (NEW)
connections:
  - from: welcome_screen
    to: login_form
    label: "Get Started"
```

### Positioning
Markdown had no positioning control - this is new in YAML:

```yaml
# YAML (NEW) - Manual positioning
nodes:
  login_form:
    type: STEP
    name: "Login"
    position:
      anchor: welcome_screen
      offset: {x: 2u, y: 0u}
```

---

**For more information:**
- Full specification: `/docs/iziflow-yaml-specification.md`
- Examples: `/examples/flows/`
- Troubleshooting: `/docs/troubleshooting.md`
