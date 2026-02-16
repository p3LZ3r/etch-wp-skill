---
name: etch-wp
description: Expert knowledge for Etch WP - a Unified Visual Development Environment for WordPress. Use when users ask to create Etch WP components, sections, patterns, or templates. Generates complete JSON in Gutenberg block format that can be directly imported/pasted into Etch WP. Handles blockName, attrs, innerBlocks, styles objects, component definitions with properties, and all Etch-specific block types (etch/element, etch/component, etch/text, etch/condition, etch/svg, etch/loop). All generated CSS uses Automatic.css (ACSS) v4 variables. Includes data modifiers, nested loops, gallery field integration, and conditional CSS classes.
license: CC BY-NC-SA 4.0
metadata:
  author: Torsten Linnecke
  version: 2.4.0
  created: 2025-12-20
  updated: 2026-02-15
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

## ⚠️ API Safety Rules

### Styles Endpoint — READ-ONLY

**CRITICAL: NEVER send PUT, POST, or DELETE requests to the `/styles` or `/stylesheets` endpoints.** These endpoints are strictly read-only. A previous incident caused the deletion of every CSS class on a production website due to a PUT call on the styles endpoint. Only `GET` requests are permitted for styles and stylesheets.

### Human-in-the-Loop — Required for ALL Write Operations

**CRITICAL: Any API call that modifies data (POST, PUT, DELETE) on ANY endpoint MUST require explicit user confirmation before execution.** Never auto-execute write operations. Before performing any write:

1. Clearly describe what will be created, updated, or deleted.
2. Show the full endpoint URL, HTTP method, and request body to the user.
3. Wait for explicit user approval before proceeding.
4. Each write operation requires its own confirmation — do not batch or assume prior approval.

**See**: `references/api-endpoints.md` for full details on endpoint restrictions and allowed methods.

---

## Workflow

### Project Initialization (REQUIRED)

**CRITICAL**: Before working on any Etch WP project, verify project setup:

1. **Check for CLAUDE.md** - Look for `CLAUDE.md` file in the project root
2. **Verify Symlink** - Ensure `CLAUDE.md` is symlinked to `AGENTS.md`:
   ```bash
   ls -la CLAUDE.md  # Should show: CLAUDE.md -> AGENTS.md
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

5. **Symlink CLAUDE.md**: After creating AGENTS.md, create the symlink:
   ```bash
   ln -s AGENTS.md CLAUDE.md
   ```

### Component Generation Workflow

Once project is initialized:

1. **Check Official Patterns FIRST** - See if https://patterns.etchwp.com/ has what the user needs
   - If yes → Recommend the official pattern (faster, tested, maintained)
   - If no or needs heavy customization → Generate custom
2. **Check the Target Site (separate from official patterns)** - Only after step 1, audit the specific website being built
   - Ensure project/site access is configured so authenticated Etch API calls are possible
   - Use Etch REST endpoints (`/wp-json/etch-api`) before building new JSON
   - Start with `components`, `components/list`, `patterns`, `styles` (GET only), `stylesheets` (GET only)
   - For structure-aware generation, also check `loops`, `queries`, `cms/field-group`, `post-types`, `taxonomies`
   - Reuse existing components/patterns/styles when they fit the request
   - **⚠️ NEVER write to `/styles` or `/stylesheets`** — these are read-only (see API Safety Rules above)
   - **⚠️ All write operations (POST/PUT/DELETE) require explicit user confirmation** before execution
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

When uncertain about Etch WP or ACSS details, use Context7 MCP **before** generating code.

| Library | ID | Use For |
|---------|-----|---------|
| **Automatic.css** | `/websites/automaticcss` | ACSS v4 variables, color system, spacing, typography |
| **Etch WP** | `/websites/etchwp` | Block types, loops, components, native elements |

**Mandatory** Context7 lookup for: ACSS variable names, `data-etch-element` values, unfamiliar block structures.

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

**NEVER create custom button styles.** No base `btn` class — use modifier classes directly: `btn--primary`, `btn--secondary`, `btn--tertiary`, `btn--link`. Size: `btn--small`, `btn--large` (combine: `btn--primary btn--large`).

```json
{ "tag": "a", "attributes": { "href": "{ctaUrl}", "class": "btn--primary" } }
```

If you MUST customize, use only layout/positioning CSS (flex, gap, margin) — never redefine button appearance (background, padding, border-radius).

### Styling with ACSS Variables

ACSS provides **variables**, not utility classes. Use custom BEM classes with ACSS variables:

```css
.ph-hero__title { font-size: var(--h1); color: var(--heading-color); }
.ph-grid { display: grid; gap: var(--space-m); }
```

**Never invent fake utility classes** (`.heading--h1`, `.grid--3-col`, `.flex--center` do NOT exist).

Create custom BEM classes for component-specific layout, positioning, alignment, and spacing.

**See**: `references/acss-variables.md` for the full variable reference. Use Context7 MCP (`/websites/automaticcss`) when uncertain.

### Borders - ALWAYS Use ACSS Variables

Always use `var(--border)`, `var(--border-light)`, or `var(--border-dark)` — never hardcode border values (`1px solid #e0e0e0`). Use `--border-light` on dark backgrounds, `--border` or `--border-dark` on light backgrounds.

## Image Best Practices

Use `etch/dynamic-image` wrapped in a `figure` element for semantic markup and accessibility. Never use bare `etch/element` with `tag: "img"` for dynamic images.

```json
{
  "blockName": "etch/element",
  "attrs": { "tag": "figure", "attributes": { "class": "ph-product-card__figure" }, "styles": ["f1g2h3i"] },
  "innerBlocks": [{
    "blockName": "etch/dynamic-image",
    "attrs": { "tag": "img", "attributes": { "src": "{prod.metabox.product_thumbnail}", "alt": "{prod.title}", "loading": "lazy" } },
    "innerBlocks": [], "innerHTML": "", "innerContent": []
  }],
  "innerHTML": "\n\n", "innerContent": ["\n", "\n"]
}
```

- Dynamic images (loops/MetaBox) → `etch/dynamic-image` in `figure`
- Static placeholders → `etch/element` with `tag: "img"` or `etch/dynamic-image`

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
.tl-hero {
  background: var(--bg-light);
  padding-block: var(--section-space-l);
}
.tl-hero__title { color: var(--heading-color); }
.tl-hero__cta-wrapper {
  display: flex;
  gap: var(--space-m);
  margin-top: var(--space-l);
}
.tl-hero--dark { background: var(--bg-dark); }
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
    }
  }
}
```

**Mistakes to avoid:** No prefix (`.hero`), wrong separators (`.hero-title` instead of `.__`), camelCase (`.heroTitle`), generic names (`.button`, `.title`).

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

## Dynamic Content with etch/text

**CRITICAL:** For looped or dynamic data, **ALWAYS use `etch/text` blocks** — never put dynamic values in `innerHTML`.

```json
{
  "blockName": "etch/text",
  "attrs": { "tag": "h2", "text": "{cat.name}", "attributes": { "class": "category-title" } },
  "innerBlocks": [], "innerHTML": "", "innerContent": []
}
```

- Looped/dynamic content (`{cat.name}`, `{prod.title}`, `{post.id}`) → **etch/text**
- Static text ("Products", "Read More") → `etch/element` with innerHTML

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

**NEVER nest different components** in CSS. Each component gets its own style object. Allowed nesting: `:where()`, `&`, pseudo-selectors (`:hover`, `:focus`), state variants (`&[data-state='open']`).

**See**: `references/css-architecture-rules.md` for full rules

## ACSS v4 CSS Standards

ACSS auto-applies styles to containers (`max-width`, `margin-inline: auto`), sections (`padding-block`, `padding-inline`), and text (`--heading-color`, `--text-dark`). **Only define CSS properties that differ from ACSS defaults.**

**Variable priority:** 1) Assignment vars (`--bg-light`, `--text-dark`) → 2) Spacing/typography (`--space-m`, `--h2`) → 3) Brand colors (`--primary`, `--accent`) only for explicit brand elements.

**⚠️ NEVER invent ACSS variable names** — verify in `references/acss-variables.md` or Context7 MCP.

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

When passing parameters from outer to inner loops, use `"loopParams"` (NOT `"loopArgs"`), values without curly braces (`"cat.id"` not `"{cat.id}"`), and random 7-char loop IDs.

```json
{ "blockName": "etch/loop", "attrs": { "loopId": "posts456", "itemId": "post", "loopParams": { "$cat_id": "cat.id" } } }
```

**See**: `references/loops.md` and `references/examples/loop-example.json`

## Official Patterns Library ⭐

**ALWAYS check https://patterns.etchwp.com/ FIRST** before building common components (heroes, headers, footers, features, testimonials, content, blog, interactive, avatars — 10+ variants each).

**Workflow:**
1. User asks for a component → Check patterns.etchwp.com
2. If a site URL is available → Check `/wp-json/etch-api` for existing reusable components/patterns
3. Recommend official pattern or reuse existing → Offer to customize
4. Build custom only if neither fit

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
| 19 | PUT/POST/DELETE to `/styles` or `/stylesheets` | **NEVER** write to styles endpoints — read-only (GET only) |
| 20 | Auto-executing write API calls | **ALWAYS** require explicit user confirmation before any POST/PUT/DELETE |

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
