---
name: etch-wp
description: Expert knowledge for Etch WP - a Unified Visual Development Environment for WordPress. Use when users ask to create Etch WP components, sections, patterns, or templates. Generates complete JSON in Gutenberg block format that can be directly imported/pasted into Etch WP. Handles blockName, attrs, innerBlocks, styles objects, component definitions with properties, and all Etch-specific block types (etch/element, etch/component, etch/text, etch/condition, etch/svg, etch/loop). All generated CSS uses Automatic.css (ACSS) v4 variables. Includes data modifiers, nested loops, gallery field integration, and conditional CSS classes.
license: CC BY-NC-SA 4.0
metadata:
  author: Torsten Linnecke
  version: 2.3.0
  created: 2025-12-20
  updated: 2026-02-12
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

## Pre-Configuration Requirements ⚠️

**BEFORE generating any components, the user MUST configure these in the WordPress dev environment:**

1. **ACSS Dashboard Settings** - Go to ACSS Dashboard and set:
   - Brand colors (primary, secondary, accent)
   - Typography scale and fonts
   - Button styles (default, primary, secondary)
   - Spacing and section spacing preferences
   - Container widths and gutters

2. **Verify automatic.css Output** - Ensure the file at:
   `https://yoursite.com/wp-content/uploads/automatic-css/automatic.css`
   contains all configured variables and utility classes

3. **Why this matters**: Components rely on ACSS utility classes (`btn`, `btn--primary`, etc.) and variables (`var(--action-primary)`, etc.). If these aren't configured in the dashboard first, the components will not render correctly.

---

## Workflow

### Project Initialization (REQUIRED)

**CRITICAL**: Before working on any Etch WP project, verify project setup:

1. **Check for CLAUDE.md** - Look for `CLAUDE.md` file in the project root
2. **Verify Symlink** - Ensure `CLAUDE.md` is symlinked to `agent.md`:
   ```bash
   ls -la CLAUDE.md  # Should show: CLAUDE.md -> agent.md
   ```

3. **If CLAUDE.md is missing** - Run the project initialization:
   ```bash
   node scripts/init-project.js
   ```
   This interactive script collects: project name, 2-4 letter CSS prefix, dev URL, design requirements (aesthetic, colors, typography, target audience, references), and ACSS configuration status.

4. **Create Project Config** - Generate `.etch-project.json` with:
   ```json
   {
     "name": "project-name",
     "prefix": "pn",
     "devUrl": "https://project-name.torsten-linnecke.de",
     "acssUrl": "https://project-name.torsten-linnecke.de/wp-content/uploads/automatic-css/automatic.css",
     "created": "2026-02-12",
     "styles": {
       "aesthetic": "modern/minimal",
       "primaryColors": ["#007bff", "#6c757d"],
       "typography": "Inter + Playfair Display",
       "targetAudience": "Small business owners",
       "referenceSites": ["https://example.com"]
     }
   }
   ```

5. **Symlink CLAUDE.md**: After creating agent.md, create the symlink:
   ```bash
   ln -s agent.md CLAUDE.md
   ```

### Component Generation Workflow

Once project is initialized:

1. **Check Official Patterns FIRST** - See if https://patterns.etchwp.com/ has what the user needs
   - If yes → Recommend the official pattern (faster, tested, maintained)
   - If no or needs heavy customization → Generate custom
2. **Check the Target Site (separate from official patterns)** - Only after step 1, audit the specific website being built
   - Ensure project/site access is configured so authenticated Etch API calls are possible
   - Use Etch REST endpoints (`/wp-json/etch-api`) before building new JSON
   - Start with `components`, `components/list`, `patterns`, `styles`, `stylesheets`
   - For structure-aware generation, also check `loops`, `queries`, `cms/field-group`, `post-types`, `taxonomies`
   - Reuse existing components/patterns/styles when they fit the request
3. **Read references** - Consult relevant reference files before generating
4. **Fetch ACSS Variables** - If dev URL provided, fetch automatic.css for real variables
5. **Generate JSON** - Create complete, valid JSON structure with **project prefix**
6. **Save to file** - ALWAYS save as `.json` file (never paste code in chat)
7. **Validate** - Run validation script automatically after generation
8. **Report** - Show validation results to user

### Post-Generation Validation

**CRITICAL**: After creating any Etch WP `.json` file, ALWAYS run:

```bash
node scripts/validate-component.js <filename>.json
```

This catches common errors before the user tries to import into Etch WP.

**For components with JavaScript**, also run the enhanced validator:

```bash
node scripts/validate-component-improved.js <filename>.json
```

This additionally checks:
- Base64 encoding validity (no line breaks, valid characters)
- JavaScript syntax and common typos (`SCrollTrigger`, `vvar`, `ggsap`, etc.)
- Quote consistency (curly quotes → straight quotes)
- Brace/parenthesis matching
- GSAP plugin registration

## Documentation Lookup Strategy

**CRITICAL:** When uncertain about Etch WP or ACSS implementation details, ALWAYS consult the official documentation via Context7 MCP before generating code.

### Context7 Library IDs

Use these exact library IDs with the `mcp__plugin_context7_context7__query-docs` tool:

| Library | ID | Use For |
|---------|-----|---------|
| **Automatic.css** | `/websites/automaticcss` | ACSS v4 variables, color system, spacing, typography |
| **Etch WP** | `/websites/etchwp` | Block types, loops, components, native elements |

### When to Use Context7 MCP

**MANDATORY** Context7 consultation when:
- ❗ **ACSS variable names** - NEVER guess, always verify
- ❗ **data-etch-element values** - Only 3 exist, verify if uncertain
- ❗ Block structures or syntax you're unsure about
- ❗ New or uncommon features

Use the `mcp__plugin_context7_context7__query-docs` tool in these situations:

#### 1. Etch WP Documentation (`/websites/etchwp`):
   ```
   Query: "How to implement nested loops with parameters"
   Query: "etch/condition block syntax for dynamic data"
   Query: "Native accordion component structure"
   ```

#### 2. Automatic.css Documentation (`/websites/automaticcss`):
   ```
   Query: "List all background color assignment variables"
   Query: "Section spacing variables for padding-block"
   Query: "Typography variables for font sizes"
   ```

**Example workflow:**
```
User: "Create a dark section with large spacing"
→ Query Context7: "ACSS dark background and large section spacing variables"
→ Use results: var(--bg-dark), var(--section-space-l)
→ Generate component with verified variables
```

## Core Structure - The Golden Rule

**USUALLY layouts/components are structured with:**

```
section (data-etch-element="section")
  └─ container (data-etch-element="container")
       └─ content
```

### The 3 Special Etch Elements

**ONLY these 3 use `data-etch-element`:**

1. **`section`** - Full-width sections (tag: `section`, style: `etch-section-style`)
2. **`container`** - Content containers (tag: `div`, style: `etch-container-style`)
3. **`iframe`** - iFrames (tag: `iframe`, style: `etch-iframe-style`)

All other HTML elements (`h1`, `p`, `a`, `button`, etc.) do NOT use `data-etch-element`.

**See**: `references/examples/basic-structure.json` for complete example

## ACSS Utility Classes - USE THESE FIRST

**CRITICAL: Always use ACSS utility classes before creating custom styles.**

### Buttons - USE ACSS CLASSES ONLY

**NEVER create custom button styles. ACSS buttons use style modifier classes only:**

```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "a",
    "attributes": {
      "href": "{ctaUrl}",
      "class": "btn--primary"
    }
  }
}
```

**Available Button Classes:**
- `btn--primary` - Primary action (uses --action-primary from dashboard)
- `btn--secondary` - Secondary action (uses --action-secondary from dashboard)
- `btn--tertiary` - Tertiary/outline style
- `btn--link` - Link-style button
- `btn--small`, `btn--large` - Size variants (combine with style: `btn--primary btn--large`)

**⚠️ CRITICAL:** ACSS buttons do NOT use a base `btn` class. The button styles are applied directly through the modifier classes (`btn--primary`, `btn--secondary`, etc.). These classes are generated based on your ACSS Dashboard configuration.

**Custom Button Styling (ONLY when necessary):**
If you MUST customize a button, use only layout/positioning CSS, NOT color/typography:

```css
/* ✅ CORRECT - Only layout */
.tl-hero__cta-wrapper {
  display: flex;
  gap: var(--space-m);
  margin-top: var(--space-l);
}

/* ❌ WRONG - Never redefine button appearance */
.tl-hero__button {
  background: #007bff;      /* Don't do this */
  padding: 12px 24px;       /* Don't do this */
  border-radius: 4px;       /* Don't do this */
}
```

### Other ACSS Utility Classes

**Layout:**
- `grid`, `grid--2-col`, `grid--3-col`, `grid--4-col`
- `flex`, `flex--column`, `flex--center`
- `container`, `container--narrow`, `container--wide`

**Typography:**
- `text--center`, `text--left`, `text--right`
- `heading--h1` through `heading--h6`

**Spacing:**
- `pad--xs` through `pad--xxl`
- `margin--xs` through `margin--xxl`
- `gap--xs` through `gap--xxl`

**Visibility:**
- `hide`, `hide--mobile`, `hide--desktop`
- `visually-hidden`

### When to Create Custom Classes

Create custom BEM classes ONLY for:
- Component-specific layout (grids, flex containers)
- Positioning and alignment
- Component-specific spacing
- Custom decorative elements

**Query Context7 for the full list of utility classes:**
```
mcp__plugin_context7_context7__query-docs with libraryId: "/websites/automaticcss"
query: "List all utility classes for buttons, layout, typography, spacing"
```

### Borders - ALWAYS Use ACSS Variables

**CRITICAL: Borders must ALWAYS use ACSS border variables:**

```css
/* ✅ CORRECT - Always use ACSS border variables */
border: var(--border);
border: var(--border-light);
border: var(--border-dark);

/* ✅ CORRECT - Specific border properties */
border-top: var(--border);
border-bottom: var(--border-light);

/* ✅ CORRECT - With specific width/style if needed */
border: 1px solid var(--border-color);  /* If you need specific style */
```

**❌ WRONG - Never hardcode border values:**
```css
/* Don't do this */
border: 1px solid #e0e0e0;
border: 1px solid rgba(0,0,0,0.1);
border: 1px solid var(--gray-light);  /* Even ACSS utility colors */
```

**Border Variable Usage:**
- `var(--border)` - Default border (uses --border-color)
- `var(--border-light)` - For dark backgrounds
- `var(--border-dark)` - For light backgrounds where more contrast needed

**When to use which:**
- Light sections: `var(--border)` or `var(--border-dark)`
- Dark sections: `var(--border-light)`

## BEM Class Naming Convention (STRICT)

**ALL CSS classes MUST follow BEM (Block Element Modifier) naming with project prefix:**

### Format
```
.{prefix}-{block}__{element}--{modifier}
```

### Rules

1. **Project Prefix (REQUIRED)**: Every project has a unique 2-4 letter prefix stored in `.etch-project.json`
   - Read prefix from: `.etch-project.json` → `prefix` field
   - If no project config exists, ask user for prefix before generating
   - Examples: `tl` (torsten-linnecke), `ac` (acme-corp), `bdp` (brand-project)

2. **Block**: The component/section name (kebab-case)
   - ✅ `hero`, `nav-bar`, `pricing-table`, `cta-section`

3. **Element**: Child element within the block (prefixed with `__`)
   - ✅ `{prefix}-hero__title`, `{prefix}-hero__button`, `{prefix}-nav-bar__logo`

4. **Modifier**: Variant or state (prefixed with `--`)
   - ✅ `{prefix}-hero__button--primary`, `{prefix}-hero__button--large`

### Examples

```css
/* Hero Section - Block */
.tl-hero {
  background: var(--bg-light);
  padding-block: var(--section-space-l);
}

/* Hero Elements - Layout only, NOT button styles */
.tl-hero__title {
  color: var(--heading-color);
}

.tl-hero__cta-wrapper {
  display: flex;
  gap: var(--space-m);
  margin-top: var(--space-l);
}

/* Section Modifiers */
.tl-hero--dark {
  background: var(--bg-dark);
}

.tl-hero--centered {
  text-align: center;
}
```

### JSON Structure with BEM

```json
{
  "styles": {
    "q2fy3v0": {
      "type": "class",
      "selector": ".tl-hero",
      "css": "background: var(--bg-light);"
    },
    "ndqe17f": {
      "type": "class",
      "selector": ".tl-hero__title",
      "css": "color: var(--heading-color);"
    },
    "ieasrk9": {
      "type": "class",
      "selector": ".tl-hero__cta-wrapper",
      "css": "display: flex; gap: var(--space-m); margin-top: var(--space-l);"
    }
  }
}
```

### ❌ Common Mistakes

```css
/* WRONG - No prefix */
.hero { }
.hero__title { }

/* WRONG - Wrong separator */
.hero-title { }     /* Use __ for elements */
.hero-primary { }   /* Use -- for modifiers */

/* WRONG - CamelCase */
.heroTitle { }
.heroButtonPrimary { }

/* WRONG - Too generic */
.button { }
.title { }
.container { }
```

### ✅ Correct Patterns

```css
/* CORRECT - With prefix, BEM structure */
.tl-hero { }
.tl-hero__title { }
.tl-hero__button { }
.tl-hero__button--primary { }
.tl-hero__button--large { }

/* CORRECT - Multiple blocks in component */
.tl-pricing { }
.tl-pricing__grid { }
.tl-pricing-card { }           /* Separate block */
.tl-pricing-card__title { }
.tl-pricing-card__price { }
.tl-pricing-card--featured { } /* Modifier on block */
```

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

### Automatic Styles - DO NOT REDEFINE

**CRITICAL: ACSS automatically applies certain styles. NEVER manually define redundant CSS:**

| Element | Auto-Applied by ACSS | Manual Override Only When |
|---------|---------------------|---------------------------|
| Container | `max-width`, `width: 100%`, `margin-inline: auto` | Different width, no centering |
| Section | `padding-block: var(--section-space-m)`, `padding-inline: var(--gutter)` | Different spacing, no padding |
| Gaps | Container gaps, content gaps, grid gaps | Custom gap sizes needed |
| Text | `--heading-color`, `--text-dark` | Different color context required |

**Only define CSS properties that differ from ACSS defaults.**

### Variable Hierarchy (in order of preference):

1. **PRIMARY: Assignment Variables** - `var(--bg-light)`, `var(--text-dark)`, `var(--border-default)`
2. **SECONDARY: Spacing/Typography** - `var(--space-m)`, `var(--h2)`, `var(--content-width)`
3. **RARE: Direct Brand Colors** - `var(--primary)`, `var(--accent)` only for explicit brand elements

**⚠️ NEVER invent ACSS variable names**
- If uncertain → check `references/acss-variables.md`
- Still uncertain → use Context7 MCP to verify
- Only use documented variables

**See**: `references/acss-variables.md` for complete variable reference including automatic styles and JavaScript/GSAP integration

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

**⚠️ CRITICAL: `itemId` determines the data prefix.** The `itemId` value becomes the prefix for ALL data references inside the loop. If `itemId` is `"spec"`, then all child expressions MUST use `{spec.name}`, `{spec.slug}`, etc. — NOT `{specialty.name}` or `{item.name}`.

Template equivalent: `{#loop medicalSpecialties($post_id: this.id) as spec}` → `{spec.name}`

**Loop Types:**
- `wp-query` - WordPress posts/pages
- `json` - Embedded JSON data
- `wp-terms` - Taxonomy terms (categories, tags)
- `wp-users` - WordPress users
- `main-query` - Current page's main query (archives)
- **Field-based** - Gallery/repeater fields use `this.metabox.*` / `this.acf.*` as the loop `key` with empty `config: {}`

### Nested Loops with Parameters

**Critical: JSON vs HTML Syntax Difference**

When passing parameters from outer to inner loops:

**HTML Template:**
```html
{#loop categories as cat}
  {#loop posts($cat_id: cat.id) as post}
    <h3>{post.title}</h3>
  {/loop}
{/loop}
```

**JSON Block Structure:**
```json
{
  "blockName": "etch/loop",
  "attrs": {
    "loopId": "posts456",
    "itemId": "post",
    "loopParams": {
      "$cat_id": "cat.id"
    }
  }
}
```

**Key Differences:**
- JSON uses `"loopParams"` (NOT `"loopArgs"`)
- JSON value is `"cat.id"` (NOT `"{cat.id}"`) - NO curly braces
- Loop IDs must be random 7-char strings (e.g., `abc123x`, `8esrv4f`)

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
3. → If a site URL is available, check `/wp-json` for Etch routes that expose existing reusable components/patterns
4. → Reuse/refactor what already exists when it satisfies the request
5. → Provide URL and explain benefits
6. → Offer to help customize if needed
7. → Build custom only if neither official patterns nor site API components fit

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

## JavaScript & GSAP

**JavaScript can be added to ANY element** (not just components) via the `script` attribute.

**CRITICAL: Scripts must be Base64-encoded.** Use format: `{"id": "abc1234", "code": "base64encodedstring"}`

**GSAP animations** can be integrated for advanced animations. Reference PP scripts for implementation patterns.

### Safe Base64 Encoding

To avoid encoding issues (invalid characters, typos, curly quotes), use the encoding helper:

```bash
# Method 1: Encode from file
node scripts/encode-script.js my-script.js

# Method 2: Interactive mode (paste JS, press Ctrl+D)
node scripts/encode-safe.js
```

These tools automatically:
- ✅ Detect/fix common typos (`SCrollTrigger` → `ScrollTrigger`)
- ✅ Reject curly quotes
- ✅ Check brace/parenthesis balance
- ✅ Verify GSAP plugin registration
- ✅ Output clean, single-line Base64

**See**: `references/acss-variables.md` (JavaScript Integration & GSAP sections)

## Critical Lessons - Common Mistakes

| # | Mistake | Correct |
|---|---------|---------|
| 1 | `core/html` blocks | Use `etch/element` |
| 2 | Raw booleans (`true`) | String-wrapped: `"{true}"` |
| 3 | Complex inline styles | Move to CSS classes |
| 4 | Nesting component classes | One component = one style object |
| 5 | Inventing ACSS variables | Verify in `references/acss-variables.md` or Context7 |
| 6 | Redundant container styles | ACSS auto-sets `max-width`, `margin-inline: auto` |
| 7 | Default section padding | ACSS auto-applies `padding-block: var(--section-space-m)` |
| 8 | Raw JavaScript in script field | Base64-encoded: `{"id": "xxx", "code": "base64..."}` |
| 9 | `"loopArgs"` in nested loops | Use `"loopParams"` |
| 10 | `"{item.id}"` with braces in loopParams | Use `"item.id"` (no curly braces) |
| 11 | `"type": "terms"` | Use `"type": "wp-terms"` |
| 12 | Descriptive loop IDs | Random 7-char: `"8esrv4f"` not `"categories"` |
| 13 | `isTruthy` for dynamic data | Use `!== ""` for `this.metabox.*`, `post.*`. `isTruthy` = only for `props.*` |
| 14 | Bare field paths in conditions | Wrap in `{}`: `"{this.metabox.field}"` |
| 15 | Using `flex-div` | Use standard `div` (deprecated) |
| 16 | `"type": "field"` in loop configs | Use field path as loop `key` with empty `config: {}` |
| 17 | Non-standard loop attrs | Only `loopId`, `itemId`, `metadata`, `loopParams` allowed |
| 18 | Mismatched loop item prefix | `itemId: "spec"` → use `{spec.name}` not `{item.name}` |

## Response Format

When generating Etch WP code:

1. **Create `.json` file** - NEVER paste code in chat
2. **Complete JSON structure** - type, gutenbergBlock, version, styles, components
3. **Run validation script** - `node scripts/validate-component.js <file>.json`
4. **Report results** - Show validation output to user

## Reference Files

| File | Purpose |
|------|---------|
| `references/official-patterns.md` | **CHECK FIRST** - Official patterns library |
| `references/api-endpoints.md` | Etch REST endpoints for reuse-first workflow (`/wp-json/etch-api`) |
| `references/acss-variables.md` | ACSS v4 variable reference |
| `references/block-types.md` | All block types and valid elements |
| `references/loops.md` | Loop implementations & nested loops |
| `references/examples/*.json` | Working JSON examples |

**Full list:** See `references/README.md`
