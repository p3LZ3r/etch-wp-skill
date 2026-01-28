---
name: etch-wp
description: Expert knowledge for Etch WP - a Unified Visual Development Environment for WordPress. Use when users ask to create Etch WP components, sections, patterns, or templates. Generates complete JSON in Gutenberg block format that can be directly imported/pasted into Etch WP. Handles blockName, attrs, innerBlocks, styles objects, component definitions with properties, and all Etch-specific block types (etch/element, etch/component, etch/text, etch/condition, etch/svg, etch/loop). All generated CSS uses Automatic.css (ACSS) v4 variables. Includes data modifiers, nested loops, gallery field integration, and conditional CSS classes.
license: CC BY-NC-SA 4.0
metadata:
  author: Torsten Linnecke
  version: 2.1.0
  created: 2025-12-20
  updated: 2026-01-27
  category: wordpress
  tags: wordpress, gutenberg, etch-wp, acss, component-generator
  homepage: https://etchwp.com
  documentation: https://docs.etchwp.com
  license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

# Etch WP JSON Generator with ACSS v4

## Overview

Etch WP requires components and patterns in a specific JSON format based on Gutenberg blocks. This skill generates complete, pasteable JSON structures that can be directly imported into Etch WP.

**All generated CSS uses ACSS v4 variables with PRIMARY focus on assignment variables** to ensure components integrate seamlessly with ACSS's contextual color system.

## Workflow

When generating Etch WP components:

1. **Check Official Patterns FIRST** - See if https://patterns.etchwp.com/ has what the user needs
   - If yes → Recommend the official pattern (faster, tested, maintained)
   - If no or needs heavy customization → Generate custom
2. **Read references** - Consult relevant reference files before generating
3. **Generate JSON** - Create complete, valid JSON structure
4. **Save to file** - ALWAYS save as `.json` file (never paste code in chat)
5. **Validate** - Run validation script automatically after generation
6. **Report** - Show validation results to user

### Post-Generation Validation

**CRITICAL**: After creating any Etch WP `.json` file, ALWAYS run:

```bash
node scripts/validate-component.js <filename>.json
```

This catches common errors before the user tries to import into Etch WP.

## Documentation Lookup Strategy

**CRITICAL:** When uncertain about Etch WP or ACSS implementation details, ALWAYS consult the official documentation via Context7 MCP before generating code.

### When to Use Context7 MCP

**MANDATORY** Context7 consultation when:
- ❗ **ACSS variable names** - NEVER guess, always verify
- ❗ **data-etch-element values** - Only 4 exist, verify if uncertain
- ❗ Block structures or syntax you're unsure about
- ❗ New or uncommon features

Use the `mcp__context7__resolve-library-id` and `mcp__context7__get-library-docs` tools in these situations:

#### 1. Etch WP Documentation (docs.etchwp.com):
   - Uncertain about block types or structure
   - Questions about loops, conditions, or dynamic data
   - Native components usage
   - Slot implementation details
   - Script integration patterns
   - **ANY data-etch-element questions**

#### 2. Automatic.css (ACSS) Documentation:
   - **ANY ACSS variable name uncertainty** ← MOST IMPORTANT
   - Questions about ACSS v4 features
   - Container query syntax
   - Grid/layout variables
   - Color system updates
   - Spacing scale
   - Typography variables

## Core Structure - The Golden Rule

**USUALLY layouts/components are structured with:**

```
section (data-etch-element="section")
  └─ container (data-etch-element="container")
       └─ flex-div (data-etch-element="flex-div") [optional]
            └─ content
```

### The 4 Special Etch Elements

**ONLY these 4 use `data-etch-element`:**

1. **`section`** - Full-width sections (tag: `section`, style: `etch-section-style`)
2. **`container`** - Content containers (tag: `div`, style: `etch-container-style`)
3. **`flex-div`** - Flex containers (tag: `div`, style: `etch-flex-div-style`)
4. **`iframe`** - iFrames (tag: `iframe`, style: `etch-iframe-style`)

All other HTML elements (`h1`, `p`, `a`, `button`, etc.) do NOT use `data-etch-element`.

**See**: `references/examples/basic-structure.json` for complete example

## Available Block Types

- **`etch/element`** - HTML elements (divs, headings, etc.)
- **`etch/text`** - Text content with dynamic props
- **`etch/svg`** - SVG icons and graphics
- **`etch/dynamic-image`** - Image elements with dynamic props
- **`etch/component`** - Component references
- **`etch/loop`** - Loops for repetitive elements
- **`etch/condition`** - Conditional rendering
- **`etch/slot-placeholder`** - Slot placeholder in component definition
- **`etch/slot-content`** - Slot content when using component

**See**: `references/block-types.md` for detailed documentation

## Components: Props vs. Slots

**Props** = Simple, predefined values (text, numbers, booleans, URLs)
- Use for: titles, labels, URLs, colors, simple configs

**Slots** = Flexible content areas (any HTML structure)
- Use for: arbitrary content that varies per instance

**When to use what:**
- Need simple value? → Prop
- Need flexible, complex content? → Slot

**See**: `references/props-system.md` and `references/examples/component-with-*.json`

## Data Modifiers

Transform and manipulate dynamic values using modifiers:

**Type Conversion:**
- `.toInt()` - Convert to integer
- `.toString()` - Convert to string
- `.ceil()`, `.floor()`, `.round()` - Rounding

**Comparison:**
- `.equal()`, `.greater()`, `.less()` - Value comparisons
- `.includes()` - String/array contains check
- Return custom values: `{item.price.greater(10, 'expensive', 'affordable')}`

**Usage in props:**
```json
"attributes": {
  "class": "{product.price.greater(100, 'premium', 'standard')}"
}
```

**See**: `references/data-modifiers.md` for complete reference

## CSS Architecture Rules

**CRITICAL - NEVER nest different components:**

❌ **WRONG:**
```css
.footer-grid {
  .footer-column { /* WRONG - separate component */ }
}
```

✅ **CORRECT:**
```css
.footer-grid {
  display: grid;
  /* only styles for THIS component */
}

.footer-column {
  /* separate style object */
}
```

**ALLOWED nesting:**
- `:where()`, `&`, pseudo-selectors (`:hover`, `:focus`)
- State variants (`&[data-state='open']`)

**See**: `references/css-architecture-rules.md` for full rules

## ACSS v4 CSS Standards

**Hierarchy (in order of preference):**

1. **PRIMARY: Assignment Variables** - `var(--bg-light)`, `var(--text-dark)`, `var(--border-default)`
2. **SECONDARY: Spacing/Typography** - `var(--space-m)`, `var(--h2)`, `var(--content-width)`
3. **RARE: Direct Brand Colors** - `var(--primary)`, `var(--accent)` only for explicit brand elements

**⚠️ NEVER invent ACSS variable names**
- If uncertain → check `references/acss-variables.md`
- Still uncertain → use Context7 MCP to verify
- Only use documented variables

**See**: `references/acss-variables.md` for complete variable reference

## Responsive Design

**ALWAYS use Container Queries** for responsive components:

```css
.component {
  container-type: inline-size;

  @container (width >= 600px) {
    /* responsive styles */
  }
}
```

**See**: `references/responsive-design.md` for patterns (if exists)

## Accessibility Requirements

ALL components must include:
- ✅ Logical properties for RTL support (`margin-inline-start`, not `margin-left`)
- ✅ Reduced motion alternatives (`@media (prefers-reduced-motion: reduce)`)
- ✅ Visible focus indicators (`:focus-visible`)
- ✅ Proper ARIA attributes
- ✅ Screen reader support where needed

## Loops for Repetitive Content

Use `etch/loop` for dynamic, repetitive elements:

```json
{
  "blockName": "etch/loop",
  "attrs": {
    "loopId": "posts123",
    "itemId": "post"
  }
}
```

**Loop Types:**
- `wp-query` - WordPress posts/pages
- `json` - Embedded JSON data
- `terms` - Taxonomy terms
- `users` - WordPress users

**See**: `references/loops.md` and `references/examples/loop-example.json`

## Official Patterns Library ⭐

**ALWAYS check patterns.etchwp.com FIRST** before building common components!

**URL**: https://patterns.etchwp.com/

Available categories:
- **Hero** (10+ variants) - hero-alpha, hero-bravo, hero-charlie, etc.
- **Headers** - Navigation, drawers, mobile menus
- **Footer** - Multi-column, newsletter, social icons
- **Features** - Grid layouts, showcase sections
- **Testimonials** - Cards, ratings, avatars
- **Content** - Article grids, content blocks
- **Blog** - Post layouts, archives
- **Interactive** - Accordions, dialogs, drawers
- **Avatars** - Profile cards, team grids

**Why use official patterns:**
- ✅ Production-ready and tested
- ✅ ACSS v4 integrated
- ✅ Accessibility built-in
- ✅ Responsive design
- ✅ Free to use and modify
- ✅ Maintained by Etch team

**Workflow:**
1. User asks for hero/footer/header/etc.
2. → Recommend appropriate pattern from patterns.etchwp.com
3. → Provide URL and explain benefits
4. → Offer to help customize if needed
5. → Build custom only if pattern doesn't fit

**See**: `references/official-patterns.md` for complete guide

## Native Components

**Before building Accordion, Dialog, Off-Canvas, or Navigation:**

→ Check https://docs.etchwp.com/components-native/overview first!

Currently available native components (December 2024):
- Accordion
- Dialog
- Off Canvas
- Basic Nav

These are accessibility-optimized and tested. Always recommend using native components when available.

**See**: `references/native-components.md`

## Style IDs

**MUST be 7 random alphanumeric characters:**

✅ Correct: `"q2fy3v0"`, `"ndqe17f"`, `"ieasrk9"`
❌ Wrong: `"banner-style"`, `"content-style"`

## Critical Lessons - Common Mistakes

1. ❌ **NO `core/html` blocks** - Use `etch/element` instead
2. ❌ **NO raw booleans** - Use `"{true}"` not `true`
3. ❌ **NO complex inline styles** - Move to CSS classes
4. ❌ **NO nesting different components** - One component = one style object
5. ❌ **NO inventing ACSS variables** - Always verify first

## Response Format

When generating Etch WP code:

1. **Create `.json` file** - NEVER paste code in chat
2. **Complete JSON structure** - type, gutenbergBlock, version, styles, components
3. **Run validation script** - `node scripts/validate-component.js <file>.json`
4. **Report results** - Show validation output to user

## Reference Files

Consult these before generating code:

- **`references/official-patterns.md`** - Official Etch WP patterns library (CHECK FIRST!)
- **`references/block-types.md`** - All block types and valid elements
- **`references/acss-variables.md`** - Complete ACSS v4 variable system
- **`references/css-architecture-rules.md`** - Critical CSS structure rules
- **`references/props-system.md`** - Component properties and slots
- **`references/data-modifiers.md`** - Data transformation and comparison modifiers
- **`references/loops.md`** - Loop implementations
- **`references/json-structure.md`** - Detailed JSON format spec
- **`references/component-examples.md`** - Annotated component examples
- **`references/native-components.md`** - Native components reference
- **`references/examples/*.json`** - Working JSON examples

## Examples

Quick reference examples are in `references/examples/`:

- `basic-structure.json` - Section > Container > Flex-Div pattern
- `component-with-props.json` - Component using properties
- `component-with-slots.json` - Component with flexible content slots
- `loop-example.json` - WordPress posts loop

For detailed, annotated examples, see `references/component-examples.md`.
