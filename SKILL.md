---
name: etch-wp
description: Expert knowledge for Etch WP - a Unified Visual Development Environment for WordPress. Use when users ask to create Etch WP components, sections, patterns, or templates. Generates complete JSON in Gutenberg block format that can be directly imported/pasted into Etch WP. Handles blockName, attrs, innerBlocks, styles objects, component definitions with properties, and all Etch-specific block types (etch/element, etch/component, etch/text, etch/condition, etch/svg, etch/loop). All generated CSS uses Automatic.css (ACSS) v4 variables. Includes data modifiers, nested loops, gallery field integration, and conditional CSS classes.
license: CC BY-NC-SA 4.0
metadata:
  author: Torsten Linnecke
  version: 2.9.0
  created: 2025-12-20
  updated: 2026-03-06
  category: wordpress
  tags: wordpress, gutenberg, etch-wp, acss, component-generator
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

### Styles/Stylesheets Endpoints — READ-ONLY

**CRITICAL: The `/styles` and `/stylesheets` endpoints are READ-ONLY. Only `GET` is allowed.**

| Endpoint | GET | PUT | POST | DELETE |
|----------|-----|-----|------|--------|
| `/styles` | ✅ Allowed | ❌ **PROHIBITED** | ❌ **PROHIBITED** | ❌ **PROHIBITED** |
| `/stylesheets` | ✅ Allowed | ❌ **PROHIBITED** | ❌ **PROHIBITED** | ❌ **PROHIBITED** |

**Styles must ALWAYS be provided inline** within the component, layout, section, or element JSON via `etchData.styles`. They travel with the component — never pushed separately.

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

**CRITICAL**: Before working on any Etch WP project, run the initialization script:

```bash
node scripts/init-project.js
```

This interactive script will create:
- `.etch-project.json` - Project configuration (name, prefix, dev URL, styles)
- `.etch-acss-index.toon` - ACSS variables and classes (TOON format for LLM efficiency)
- `.env` - API credentials (gitignored)
- `AGENTS.md` - Project-specific documentation
- `CLAUDE.md` - Symlink to AGENTS.md

**The initialization script:**
1. Guides you through project setup questionnaire
2. Fetches and indexes ACSS variables from your WordPress site
3. Validates ACSS configuration completeness
4. Generates project documentation with ACSS reference
5. Creates secure credential storage

After running the script, verify the setup:
```bash
ls -la CLAUDE.md  # Should show: CLAUDE.md -> AGENTS.md
```

If the project is already initialized:
1. **Check for CLAUDE.md** - Look for `CLAUDE.md` file in the project root
2. **Verify Symlink** - Ensure `CLAUDE.md` is symlinked to `AGENTS.md`:
   ```bash
   ls -la CLAUDE.md  # Should show: CLAUDE.md -> AGENTS.md
   ```

3. **If CLAUDE.md is missing** - Run the project initialization:
   ```bash
   node scripts/init-project.js
   ```

4. **Create Project Config** - The script generates `.etch-project.json` with:
   ```json
   {
     "name": "project-name",
     "prefix": "pn",
     "created": "2026-02-12",
     "acssConfigured": true,
     "styles": {
       "aesthetic": "modern/minimal",
       "primaryColors": ["#007bff", "#6c757d"],
       "typography": "Inter + Playfair Display",
       "targetAudience": "Small business owners",
       "referenceSites": ["https://example.com"]
     }
   }
   ```

   **Credentials and URLs are stored in `.env`:**
   ```
   ETCH_API_USERNAME=your_username
   ETCH_API_PASSWORD=your_app_password
   ETCH_DEV_URL=https://project-name.torsten-linnecke.de
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
6. **Deliver via the correct method** — see Output Formats below
7. **Validate** - Run validation script automatically after generation
8. **Report** - Show validation results to user

### ⚠️ Output Formats: API vs Paste

**Two distinct JSON formats exist. Use the right one:**

| What | Format | Delivery | Save as file? |
|------|--------|----------|---------------|
| **Components** (reusable blocks) | API format | `POST /wp-json/etch-api/components` | ❌ Never — send via API only |
| **Layouts / Sections / Pages** | Paste format | Copy-paste into Etch frontend editor | ✅ Save as `.json` file |

**API component format** (`POST /wp-json/etch-api/components`):
```json
{
  "name": "Feature Card",
  "key": "FeatureCard",
  "blocks": [ /* block tree */ ],
  "properties": [ /* prop definitions */ ]
}
```
⚠️ `styles` is NOT accepted by `POST /components` — the server ignores it silently. **Styles must ALWAYS be inline** in `etchData.styles` within each block's metadata. Never use `PUT /styles` or `PUT /stylesheets` — these endpoints are read-only.

**Paste/layout format** (for frontend editor):
```json
{
  "type": "block",
  "gutenbergBlock": { /* block tree */ },
  "version": 2,
  "styles": { /* style objects */ },
  "components": { /* referenced component definitions */ }
}
```

**Rules:**
- **Components** are always created via API POST — do NOT save API component JSON as files in the project folder.
- **Layouts, sections, and pages** are saved as `.json` files and pasted into the Etch frontend editor.
- The validator auto-detects both formats and validates accordingly.

### Post-Generation Validation

**CRITICAL**: After generating any Etch WP JSON (either format), ALWAYS run:

```bash
node scripts/validate-component.js <filename>.json
```

The validator auto-detects the format (API component vs paste/layout) and validates accordingly.

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

**ALWAYS use `etch/dynamic-image` for all images in Etch WP — no exceptions.**

Never use `etch/element` with `tag: "img"`. The `etch/dynamic-image` block is the standard for all image rendering.

### With Media Picker (Components)

When the image comes from a WordPress media picker property:

```json
{
  "blockName": "etch/element",
  "attrs": {
    "metadata": {"name": "Featured Figure"},
    "tag": "figure",
    "attributes": { "class": "frm-featured__figure" }
  },
  "innerBlocks": [{
    "blockName": "etch/dynamic-image",
    "attrs": {
      "metadata": {"name": "Featured Image"},
      "tag": "img",
      "attributes": {
        "mediaId": "{props.featuredImage}",
        "class": "frm-featured__image",
        "loading": "lazy"
      }
    },
    "innerBlocks": [], "innerHTML": "", "innerContent": []
  }],
  "innerHTML": "\n\n", "innerContent": ["\n", "\n"]
}
```

**Key points:**
- Use `mediaId` — Etch auto-populates src and alt from media library
- No separate alt property needed (fetched from media library)
- Always wrap in `figure` for semantic markup

### With Dynamic Data (Loops/Layouts)

When the image URL comes from post data, MetaBox fields, or loops:

```json
{
  "blockName": "etch/element",
  "attrs": { "tag": "figure", "attributes": { "class": "ph-product-card__figure" } },
  "innerBlocks": [{
    "blockName": "etch/dynamic-image",
    "attrs": {
      "tag": "img",
      "attributes": {
        "src": "{prod.metabox.product_thumbnail}",
        "alt": "{prod.title}",
        "loading": "lazy"
      }
    },
    "innerBlocks": [], "innerHTML": "", "innerContent": []
  }],
  "innerHTML": "\n\n", "innerContent": ["\n", "\n"]
}
```

**Summary:**
- **Always** use `etch/dynamic-image` — never `etch/element` with `tag: "img"`
- Media picker images → `mediaId: "{props.imageProperty}"`
- Dynamic/URL images → `src: "{item.image}"` with explicit `alt`

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

| Block Type | Purpose | Key Attributes |
|------------|---------|----------------|
| **`etch/element`** | HTML elements (divs, headings, etc.) | `metadata.name`, `tag`, `attributes.class` |
| **`etch/text`** | Text content with dynamic props | `content` (e.g., `"{props.title}"`) |
| **`etch/svg`** | SVG icons and graphics | `metadata.name`, `viewBox`, `attributes.class` |
| **`etch/dynamic-image`** | Image elements with dynamic props | `metadata.name`, `attributes.mediaId` (components) or `attributes.src` (loops) |
| **`etch/component`** | Component references | `ref` (component ID), `attributes` |
| **`etch/loop`** | Loops for repetitive elements | `loopId`, `itemId`, `loopParams` |
| **`etch/condition`** | Conditional rendering | `metadata.name`, `condition` object, `conditionString` |
| **`etch/slot-placeholder`** | Slot placeholder in component definition | `name` |
| **`etch/slot-content`** | Slot content when using component | `name` |

**See**: `references/block-types.md` for detailed documentation

### Component-Specific Block Notes

**`etch/element` inside components:**
- MUST include `metadata: {name: "..."}` for Etch editor visibility
- Property references use `props.` prefix: `"href": "{props.linkUrl}"`

**`etch/dynamic-image` inside components:**
- Use `attributes.mediaId` (not `src`): `"mediaId": "{props.featuredImage}"`
- Etch auto-populates src and alt from media library
- Property should have `"specialized": "image"`

**`etch/condition` inside components:**
- MUST include `metadata.name` describing the condition
- Use object format: `condition: {leftHand, operator, rightHand}`
- Use `props.` prefix in `leftHand`: `"leftHand": "props.hasMedia"`

## Text Content Rules - ALL Text Uses `etch/text` Blocks

**CRITICAL: ALL text content MUST use `etch/text` blocks — NEVER put text directly in `innerHTML`.**

This applies to:
- ✅ **Static text** ("Products", "Read More", "Impressum") → `etch/text`
- ✅ **Dynamic text** (`{cat.name}`, `{prod.title}`, `{post.id}`) → `etch/text`
- ❌ **NEVER**: Text content in `innerHTML` of an element

### Correct Structure

```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "h2",
    "attributes": { "class": "my-heading" }
  },
  "innerBlocks": [
    {
      "blockName": "etch/text",
      "attrs": {
        "content": "My Heading Text"  // ← ALL text goes here
      },
      "innerBlocks": [],
      "innerHTML": "",
      "innerContent": []
    }
  ],
  "innerHTML": "\n\n",  // ← Just spacing, no text content
  "innerContent": ["\n", null, "\n"]
}
```

### Wrong Structure (Will Not Display Text)

```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "h2"
  },
  "innerBlocks": [],
  "innerHTML": "\nMy Heading Text\n",  // ❌ Text won't render!
  "innerContent": ["\nMy Heading Text\n"]
}
```

### Dynamic Text Example

```json
{
  "blockName": "etch/text",
  "attrs": {
    "content": "{cat.name}"  // ← Dynamic values work the same way
  },
  "innerBlocks": [],
  "innerHTML": "",
  "innerContent": []
}
```

### Mixed Content Example

For elements with HTML tags + text, nest them properly:

```json
{
  "blockName": "etch/element",
  "attrs": { "tag": "p" },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": { "tag": "strong" },
      "innerBlocks": [
        {
          "blockName": "etch/text",
          "attrs": { "content": "Bold text" }
        }
      ],
      "innerHTML": "\n\n",
      "innerContent": ["\n", null, "\n"]
    },
    {
      "blockName": "etch/text",
      "attrs": { "content": " regular text" }
    }
  ],
  "innerHTML": "\n\n\n",
  "innerContent": ["\n", null, "\n\n", null, "\n"]
}
```

**Rule**: If an element displays ANY text content, it MUST have `etch/text` blocks as children!

## Components: Props vs. Slots

**Props** = Simple, predefined values (text, numbers, booleans, URLs)
- Use for: titles, labels, URLs, colors, simple configs

**Slots** = Flexible content areas (any HTML structure)
- Use for: arbitrary content that varies per instance

**When to use what:**
- Need simple value? → Prop
- Need flexible, complex content? → Slot

**See**: `references/props-system.md` and `references/examples/component-with-*.json`

## Component Property References - ALWAYS Use `props.` Prefix

**CRITICAL: Inside component definitions, ALL property references MUST use the `props.` prefix.**

### ❌ WRONG - Missing `props.` prefix
```json
{
  "blockName": "etch/text",
  "attrs": {
    "content": "{itemLabel}"
  }
}
```

### ✅ CORRECT - With `props.` prefix
```json
{
  "blockName": "etch/text",
  "attrs": {
    "content": "{props.itemLabel}"
  }
}
```

**This applies to ALL property references inside components:**
- Text content: `"{props.title}"`
- Attribute values: `"href": "{props.linkUrl}"`
- Class conditions: `"class": "{props.isActive ? 'active' : ''}"`
- Image references: `"mediaId": "{props.featuredImage}"`

## Property Structure Requirements

**ALL properties MUST include `keyTouched: true`:**

```json
{
  "key": "itemLabel",
  "name": "Item Label",
  "keyTouched": true,
  "type": {
    "primitive": "string"
  },
  "default": "Default Value"
}
```

**Required fields:**
- `key` - Machine name (camelCase, unique within component)
- `name` - Display label in Etch editor
- `keyTouched: true` - REQUIRED flag indicating the key was explicitly set
- `type` - Object with `primitive` type (and optionally `specialized`)
- `default` - Default value for the property

### Image Properties

For image properties, add `"specialized": "image"` to the type:

```json
{
  "key": "featuredImage",
  "name": "Featured Image",
  "keyTouched": true,
  "type": {
    "primitive": "string",
    "specialized": "image"
  },
  "default": ""
}
```

**Note:** No separate `alt` property needed — Etch auto-populates src and alt from the media library when using `mediaId`.

## Condition Format for `etch/condition`

**Conditions MUST use object format with metadata name:**

```json
{
  "blockName": "etch/condition",
  "attrs": {
    "metadata": {"name": "If Has Media"},
    "condition": {
      "leftHand": "props.hasMedia",
      "operator": "===",
      "rightHand": "true"
    },
    "conditionString": "props.hasMedia === true"
  },
  "innerBlocks": [
    // Content to show when condition is true
  ]
}
```

**Required fields:**
- `metadata.name` - Display name in Etch editor (follows BEM naming)
- `condition.leftHand` - Left side of comparison (use `props.` prefix)
- `condition.operator` - Comparison operator (`===`, `!==`, `==`, `!=`, `>`, `<`, etc.)
- `condition.rightHand` - Right side of comparison
- `conditionString` - String representation for debugging

**Note:** Boolean values in `rightHand` should be strings: `"true"` or `"false"` (not `true` or `false`).

## Element Metadata Names

**ALL elements MUST have metadata names for visibility in the Etch editor:**

```json
{
  "blockName": "etch/element",
  "attrs": {
    "metadata": {"name": "Item Heading"},
    "tag": "h4",
    "attributes": {
      "class": "frm-dropdown-list__item-heading"
    }
  }
}
```

**Applies to:**
- `etch/element` - Use descriptive names following BEM (e.g., "Item Heading", "Featured Image")
- `etch/svg` - Use names like "Trigger Icon", "Arrow Icon"
- `etch/dynamic-image` - Use names like "Featured Image", "Product Thumbnail"
- `etch/condition` - Use names describing the condition (e.g., "If Has Media", "Show Description")

**Naming convention:** Use plain English describing the element's purpose (follows BEM structure in natural language).

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
- ✅ Visible focus indicators (`:focus-visible`) on all interactive elements — never `:hover` without `:focus-visible`
- ✅ Proper ARIA attributes (`role`, `aria-label`, `aria-labelledby`)
- ✅ Screen reader support where needed
- ✅ Alt text on all `<img>` elements (WCAG 1.1.1)
- ✅ Icon-only buttons need `aria-label`; decorative icons need `aria-hidden="true"` (WCAG 4.1.2)
- ✅ Dialog/modal elements need `role="dialog"` + `aria-labelledby` (WCAG 4.1.2)

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

## ⚠️ CRITICAL: Text Content MUST Use `etch/text` Blocks

**NEVER put text content directly in `innerHTML` of elements. All text must be in `etch/text` blocks!**

### ❌ WRONG - Text in innerHTML
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "h2"
  },
  "innerBlocks": [],
  "innerHTML": "\nMy Heading\n",  // WRONG: Text in innerHTML won't render!
  "innerContent": ["\nMy Heading\n"]
}
```

### ✅ CORRECT - Text in etch/text block
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "h2"
  },
  "innerBlocks": [
    {
      "blockName": "etch/text",
      "attrs": {
        "content": "My Heading"  // Text goes here!
      },
      "innerBlocks": [],
      "innerHTML": "",
      "innerContent": []
    }
  ],
  "innerHTML": "\n\n",  // Just spacing
  "innerContent": ["\n", null, "\n"]
}
```

### Mixed Content Example
For elements with both tags and text, nest them properly:
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "p"
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "strong"
      },
      "innerBlocks": [
        {
          "blockName": "etch/text",
          "attrs": {
            "content": "Bold text"
          },
          "innerBlocks": [],
          "innerHTML": "",
          "innerContent": []
        }
      ],
      "innerHTML": "\n\n",
      "innerContent": ["\n", null, "\n"]
    },
    {
      "blockName": "etch/text",
      "attrs": {
        "content": " regular text"
      },
      "innerBlocks": [],
      "innerHTML": "",
      "innerContent": []
    }
  ],
  "innerHTML": "\n\n\n",
  "innerContent": ["\n", null, "\n\n", null, "\n"]
}
```

**Rule**: If an element displays text, it MUST have an `etch/text` block as a child!

## ⚠️ CRITICAL: Style Object Structure (Styles Won't Apply Without This)

**ALL style objects MUST include these 5 fields:**

```json
{
  "q2fy3v0": {
    "type": "class",           // REQUIRED: "class" or "element"
    "selector": ".my-class",   // REQUIRED: CSS selector
    "collection": "default",   // REQUIRED: ALWAYS "default"
    "css": "color: red;",      // REQUIRED: CSS properties
    "readonly": false          // REQUIRED: true for built-in, false for custom
  }
}
```

**❌ Missing ANY of these = CSS will NOT apply when pasted**

Common causes of styles not working:
- Missing `"collection": "default"`
- Missing `"readonly": false`
- Missing `"type": "class"`

### Including Built-in Etch Styles

When using `data-etch-element="section"` or `data-etch-element="container"`, MUST include their built-in styles:

```json
{
  "styles": {
    "etch-section-style": {
      "type": "element",
      "selector": ":where([data-etch-element=\"section\"])",
      "collection": "default",
      "css": "inline-size: 100%; display: flex; flex-direction: column; align-items: center;",
      "readonly": true
    },
    "etch-container-style": {
      "type": "element",
      "selector": ":where([data-etch-element=\"container\"])",
      "collection": "default",
      "css": "inline-size: 100%; display: flex; flex-direction: column; max-width: var(--content-width, 1366px); align-self: center;",
      "readonly": true
    }
    // ... your custom styles
  }
}
```

And reference them in elements:
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "section",
    "attributes": { "data-etch-element": "section" },
    "styles": ["your-custom-style", "etch-section-style"]
  }
}
```

**See**: `references/css-architecture-rules.md` for complete CSS architecture guide.

### Built-in Etch Element Styles

**You do NOT need to include `etch-section-style` or `etch-container-style` in your styles object.**

These are automatically applied by Etch when you use the data attributes:
- `data-etch-element="section"` → Automatically gets section styles
- `data-etch-element="container"` → Automatically gets container styles

**Correct usage:**
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "section",
    "attributes": {
      "data-etch-element": "section"
    }
    // No styles array needed for built-in behavior
  }
}
```

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
| 13 | `isTruthy` operator | Does NOT exist - use `!= ""` or `!== ""` instead |
| 14 | Bare field paths in conditions | Wrap in `{}`: `"{this.metabox.field}"` |
| 15 | Using `flex-div` | Use standard `div` (deprecated) |
| 16 | `"type": "field"` in loop configs | Use field path as loop `key` with empty `config: {}` |
| 17 | Non-standard loop attrs | Only `loopId`, `itemId`, `metadata`, `loopParams` allowed |
| 18 | Mismatched loop item prefix | `itemId: "spec"` → use `{spec.name}` not `{item.name}` |
| 19 | PUT/POST/DELETE to `/styles` or `/stylesheets` | **NEVER** write to styles endpoints — read-only (GET only) |
| 20 | Auto-executing write API calls | **ALWAYS** require explicit user confirmation before any POST/PUT/DELETE |
| 21 | Saving API component JSON as project file | Components → API POST only. Layouts/sections/pages → `.json` file + paste |
| 22 | Using paste format for components | Components use API format (`{ name, key, blocks, properties }`) |
| 23 | **Missing style object fields** | **ALL styles need: `type`, `selector`, `collection`, `css`, `readonly`** |
| 24 | **Missing `"collection": "default"`** | **Required in all style objects or CSS won't apply** |
| 25 | **Missing `"readonly": false/true`** | **Required in all style objects or CSS won't apply** |
| 26 | **Over-engineering BEM classes** | Don't create classes for standard paragraphs - use ACSS defaults |
| 27 | **Text content in innerHTML** | **Use `etch/text` blocks - NEVER put text in innerHTML!** |
| 28 | **`styles` at root of POST /components body** | Server silently ignores it — **always use inline styles** in `etchData.styles` within each block |
| 29 | **Wrong property format** | Use `"name"` not `"label"`. Type must be `{"primitive": "string"}` not `"text"`, and select must be `{"primitive": "string", "specialized": "select"}` not `"select"` |
| 30 | **Missing `props.` prefix** | ALWAYS use `props.propertyName` inside components: `{props.itemLabel}` not `{itemLabel}` |
| 31 | **Missing `keyTouched: true`** | All properties MUST include `"keyTouched": true` or they won't work |
| 32 | **Condition as string** | Conditions need object format with `metadata.name`, `leftHand`, `operator`, `rightHand`, `conditionString` |
| 33 | **Image with `src` attribute** | ALWAYS use `etch/dynamic-image` (never `etch/element` with `tag: "img"`). Use `mediaId` for media picker, `src` for URLs |
| 34 | **Missing element metadata** | All `etch/element`, `etch/svg`, `etch/dynamic-image` need `metadata: {name: "..."}` for Etch editor visibility |

## Response Format

When generating Etch WP code:

1. **Determine output type** — Component → API format; Layout/section/page → Paste format
2. **Components (API)** — Single-step push (requires explicit user confirmation):
   - `POST /wp-json/etch-api/components` with `{ name, key, blocks, properties }` — creates the component with inline styles
3. **Layouts/sections/pages (Paste)**: Save as `.json` file, validate, then user pastes in frontend editor.
4. **Run validation** - `node scripts/validate-component.js <file>.json` (auto-detects format)
5. **Report results** - Show validation output to user

**Note:** Styles are always inline via `etchData.styles`. Never use `PUT /styles` or `PUT /stylesheets`.

## Reference Files

| File | Purpose |
|------|---------|
| `references/official-patterns.md` | **CHECK FIRST** - Official patterns library |
| `references/api-endpoints.md` | Etch REST endpoints for reuse-first workflow (`/wp-json/etch-api`) |
| `references/component-json-structure.md` | ⭐ Exact JSON structure for API component creation |
| `references/technical-reference.md` | ⭐ Technical internals (EtchData, conditions, properties, loops) |
| `references/acss-variables.md` | ACSS v4 variable reference |
| `references/block-types.md` | All block types and valid elements |
| `references/loops.md` | Loop implementations & nested loops |
| `references/examples/*.json` | Working JSON examples |

**Full list:** See `references/README.md`
