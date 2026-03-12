---
name: etch-wp
description: Expert knowledge for Etch WP - a Unified Visual Development Environment for WordPress. Generates complete JSON in Gutenberg block format for components, sections, patterns, or templates. Uses Automatic.css (ACSS) v4 variables. See reference files for complete documentation.
license: CC BY-NC-SA 4.0
metadata:
  author: Torsten Linnecke
  version: 3.0.12
  created: 2025-12-20
  updated: 2026-03-12
  category: wordpress
  tags: wordpress, gutenberg, etch-wp, acss, component-generator
  license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
---

# Etch WP JSON Generator

## Overview

Etch WP is a visual development environment for WordPress that uses Gutenberg blocks in a specific JSON format. This skill generates complete JSON structures using Automatic.css (ACSS) v4 variables.

**Output:**
- Complete JSON for Etch WP editor (paste) or REST API (push)

## Project Initialization (REQUIRED)

**Before generating any components**, you MUST initialize the project:

**macOS/Linux:**
```bash
node ~/.claude/skills/etch-wp/scripts/init-project.js
```

**Windows:**
```bash
node %USERPROFILE%\.claude\skills\etch-wp\scripts\init-project.js
```

This script creates:
- `.etch-project.json` — Project config (prefix, styles)
- `.etch-acss-index.toon` — Indexed ACSS variables
- `.env` — API credentials
- `AGENTS.md` — Project documentation

**Guard:** If these files don't exist, the skill will refuse to generate any components.

**Why it matters:** Components need your project's CSS prefix and ACSS variables. Without initialization, generated components won't render correctly.

### Generation Workflow

Once project is initialized:

1. **Check Official Patterns FIRST** - See if [https://patterns.etchwp.com/](https://patterns.etchwp.com/) has what the user needs
   - If yes → Recommend the official pattern (faster, tested, maintained)
   - If no or needs heavy customization → Generate custom

2. **Check the Target Site** - Audit the specific website being built
   - Use Etch REST endpoints (`/wp-json/etch-api`) before building new JSON
   - Start with `components/list`, then check specific components via `/components/{id}` if they can be reused
   - For structure-aware generation, also check `loops`, `queries`, `post-types`, `taxonomies`

3. **Read references** - Consult relevant reference files before generating

4. **Fetch ACSS** - Check ACSS variables, tokens and utility classes via `.etch-acss-index.toon`

5. **Use Context7 MCP** - When uncertain about Etch WP or ACSS details

   | Library | ID | Use For |
   |---------|-----|---------|
   | Automatic CSS | `/websites/automaticcss` | ACSS v4 variables, color system, spacing, typography |
   | Etch WP | `/websites/etchwp` | Block types, loops, components, native elements |

6. **Generate JSON** - Create complete, valid JSON structure

7. **Deliver via correct method** — see Output Formats below

8. **Validate** - Run validation script automatically after generation

### Output Formats

Components and patterns use the same JSON structure. Delivery method depends on target:

| Target | Delivery |
|--------|----------|
| **Components** (reusable blocks) | `POST /wp-json/etch-api/components` |
| **Layouts / Sections / Pages** | Copy-paste into Etch frontend editor |

- Save as `.json` file
- The validator handles all formats

### Post-Generation Validation

**CRITICAL**: After generating any Etch WP JSON, ALWAYS run:

**macOS/Linux:**
```bash
node ~/.claude/skills/etch-wp/scripts/validate-component.js <filename>.json
```

**Windows:**
```bash
node %USERPROFILE%\.claude\skills\etch-wp\scripts\validate-component.js <filename>.json
```

The validator auto-detects the format and includes Base64 encoding checks and JavaScript syntax validation.

## Core Rules

### 1. Text Content — ALWAYS Use `etch/text`

All text content MUST be in `etch/text` blocks, never in `innerHTML`:

```json
{
  "blockName": "etch/element",
  "attrs": {"tag": "h2"},
  "innerBlocks": [
    {
      "blockName": "etch/text",
      "attrs": {"content": "{props.title}"}
    }
  ]
}
```

**See:** `references/block-types.md` → "etch/text"

### 2. Props Reference — ALWAYS Use `props.` Prefix

When referencing component properties, ALWAYS use the `props.` prefix:

```json
{"content": "{props.title}"}
{"href": "{props.url}"}
```

**Never:** `{title}` or `{propertyName}`

**See:** `references/props-system.md` → "Using Props in Components"

### 3. data-etch-element — ONLY 3 Values Exist

**See:** `references/css-architecture-rules.md` → "Including Built-in Etch Element Styles"

### 4. Style Object — 5 Required Fields

**See:** `references/css-architecture-rules.md` → "CRITICAL: Style Object Structure Requirements"

### 5. BEM Naming Convention

**See:** `references/css-architecture-rules.md` → "Naming Conventions"

---

## Critical Pitfalls

1. **Text in innerHTML** — Use `etch/text` blocks instead
2. **Missing props. prefix** — Always use `{props.propertyName}`
3. **Wrong data-etch-element values** — Only `section`, `container`, `iframe`
4. **Missing style fields** — Always include all 5 required fields
5. **No BEM prefix** — Prefix classes with block name (`.hero__title`, not `.__title`)
6. **core/html blocks** — Use `etch/element` instead
7. **Props in inline styles** — Use data attributes + CSS selectors
8. **Boolean values as raw** — Use `"{true}"` not `true`

---

## Reference Files

| File | Purpose |
|------|---------|
| `references/json-structure.md` | Complete JSON structure, root fields, innerContent patterns, block types, conditions, style system |
| `references/block-types.md` | All block types (etch/element, etch/text, etch/condition, etch/loop, etc.) |
| `references/props-system.md` | Props, slots, property types, passing props to components |
| `references/dynamic-data.md` | Loops, nested loops, data modifiers, gallery fields |
| `references/css-architecture-rules.md` | Style object structure, BEM naming, built-in Etch styles |
| `references/acss-variables.md` | ACSS v4 philosophy, assignment variables, automatic styles, container queries |
| `references/api-endpoints.md` | REST API endpoints with curl examples |
| `references/native-components.md` | Native component documentation |
| `references/official-patterns.md` | Official patterns library guide |

---

## Examples

Working JSON examples are available in: `references/examples/`

- `basic-structure.json` — Simple element structure
- `component-with-props.json` — Component with properties
- `component-with-slots.json` — Component with slots
- `loop-example.json` — Loop with dynamic data

---

## Response Format

When generating code, always provide:

1. **Complete, valid JSON** — Ready to paste into Etch WP
2. **Explanation** — Brief description of what was generated
3. **API command** — Optional curl command if using API format

For components, include both the JSON and the curl command for API push.
