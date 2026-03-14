# Resource Reuse Guide

## Overview

This guide explains how to reuse existing Etch WP resources instead of building from scratch. **Always check existing resources first** — this saves tokens, ensures consistency, and reduces validation errors.

## Resource Hierarchy

Check resources in this order:

| Priority | Resource | Location | Best For |
|----------|----------|----------|----------|
| 1 | Official Patterns | patterns.etchwp.com | Best quality, maintained by Etch team |
| 2 | Local Patterns | `assets/templates/patterns/` | Downloaded official patterns, ready to adapt |
| 3 | Site Components | `/wp-json/etch-api/components` | Existing reusable components on target site |
| 4 | Build New | — | Only when no suitable resource exists |

---

## 1. Reusing Local Patterns

Local patterns are downloaded from the official patterns library and stored in `assets/templates/patterns/`. These contain complete, valid JSON that can be adapted quickly.

### Step 1: Find Matching Pattern

**Option A: Read the index**
```bash
read "assets/templates/patterns/INDEX.md"
```

**Option B: Search by keyword**
```bash
grep -r "hero" assets/templates/patterns/
```

**Categories available:**
- `avatars/` - Team sections, avatar displays
- `blog/` - Article layouts, blog posts
- `content/` - Content sections
- `ctas/` - Call-to-action sections
- `features/` - Feature cards, flip boxes, feature sections
- `footer/` - Footer layouts
- `headers/` - Header layouts
- `hero/` - Hero sections (9 variations)
- `interactive/` - Carousels, navigation, accordions, galleries
- `introductions/` - Section intros

### Step 2: Load Pattern JSON

```bash
read "assets/templates/patterns/hero/hero-alpha.json"
```

### Step 3: Adapt to User Needs

The pattern JSON can be:
1. **Used directly** — Paste into Etch WP editor as-is
2. **Adapted for properties** — Convert static content to `{props.propertyName}`
3. **Modified for styling** — Update ACSS variables or class names

**Example adaptation:**

```json
// Original from pattern:
{
  "blockName": "etch/text",
  "attrs": {"content": "A compelling headline goes here"}
}

// Adapted for component properties:
{
  "blockName": "etch/text",
  "attrs": {"content": "{props.headline}"}
}
```

---

## 2. Reusing Site Components

When the user provides a site URL, check for existing reusable components before building new ones.

### Step 1: Discover Components

```bash
curl -u "username:app-password" "https://{site}/wp-json/etch-api/components/list"
```

**Response format:**
```json
[
  {"id": 123, "key": "FeatureCard", "name": "Feature Card"},
  {"id": 456, "key": "HeroSection", "name": "Hero Section"},
  {"id": 789, "key": "TestimonialBlock", "name": "Testimonial Block"}
]
```

### Step 2: Match User Request to Component Keys

Look for component names/keys that match what the user needs:

| User Request | Look For |
|--------------|----------|
| "hero section" | `Hero`, `HeroSection`, `HeroAlpha` |
| "feature card" | `Feature`, `FeatureCard`, `Card` |
| "testimonial" | `Testimonial`, `Quote`, `Review` |
| "pricing table" | `Pricing`, `PriceTable` |
| "team section" | `Team`, `TeamSection`, `Avatar` |

### Step 3: Get Full Component Details

```bash
curl -u "username:app-password" "https://{site}/wp-json/etch-api/components/{id}"
```

This returns the component's:
- `name` and `key`
- `properties` — Available props you can set
- `blocks` — Component structure (without styles)

### Step 4: Use via `etch/component` Block

Create an instance using the `ref` attribute:

```json
{
  "blockName": "etch/component",
  "attrs": {
    "ref": 123,
    "attributes": {
      "title": "My Feature",
      "description": "A compelling feature description",
      "showButton": "{true}"
    }
  },
  "innerBlocks": [],
  "innerHTML": "\n\n",
  "innerContent": ["\n", "\n"]
}
```

**Key points:**
- `ref` must match the component's `id` field (integer)
- Pass user values via `attributes` object
- Boolean values MUST be strings: `"{true}"` not `true`

### Property Mapping

| Component Property Type | JSON Format | Example |
|------------------------|-------------|---------|
| string | `"value"` | `"title": "My Title"` |
| number | `123` | `"count": 5` |
| boolean | `"{true}"` or `"{false}"` | `"showButton": "{true}"` |
| URL | `"https://..."` | `"url": "{post.link}"` |
| Dynamic | `"{props.name}"` | `"title": "{props.headline}"` |

---

## 3. Decision Framework

**ALWAYS follow this order**:

```
User request received
    |
    v
1. Official pattern exists? (patterns.etchwp.com)
    |-- YES --> Recommend URL, offer customization
    |-- NO --> Continue
    |
    v
2. Local pattern exists? (assets/templates/patterns/)
    |-- YES --> Load and adapt local JSON
    |-- NO --> Continue
    |
    v
3. Site component exists with 80%+ match?
    |-- YES --> Reuse via ref with property mapping
    |-- NO --> Continue
    |
    v
4. Build new from scratch
```

### When to Build New

Build from scratch only when:
- No official pattern matches the user's requirements
- No local pattern matches the user's requirements
- No site component has 80%+ feature overlap
- User explicitly wants custom implementation
- Required features are too different from existing resources

### What Constitutes an 80% Match

A component/pattern is an 80% match when:
- It has the same structural purpose (hero, feature, card, etc.)
- It requires only content changes (not structural changes)
- Styling can be adapted via ACSS variables
- Missing features can be added without major restructuring

---

## 4. Quick Reference

### Search Local Patterns

```bash
# View all categories
glob "assets/templates/patterns/*/"

# Search heroes
glob "assets/templates/patterns/hero/*.json"

# Search features
glob "assets/templates/patterns/features/*.json"

# Full-text search
grep -r "carousel" assets/templates/patterns/
```

### Check Site Components

```bash
# List all components
curl -u "user:app-pass" "https://site.com/wp-json/etch-api/components/list"

# Get specific component
curl -u "user:app-pass" "https://site.com/wp-json/etch-api/components/123"
```

### Create Component Reference

```json
{
  "blockName": "etch/component",
  "attrs": {
    "ref": <component_id>,
    "attributes": {
      "<propName>": "<value>"
    }
  },
  "innerBlocks": [],
  "innerHTML": "\n\n",
  "innerContent": ["\n", "\n"]
}
```