# Automatic.css v4 - Concepts & Best Practices

> **This reference explains ACSS philosophy and concepts. For project-specific variables and classes, see `.etch-acss-index.toon` (generated during initialization).**

---

## Core Philosophy: Context Over Concrete

ACSS uses **Assignment Variables** — variables that describe a context, not a concrete value.

```css
/* ❌ WRONG: Concrete color */
background: var(--base-ultra-light);
color: var(--base-ultra-dark);

/* ✅ RIGHT: Contextual assignment */
background: var(--bg-light);     /* "Light background" */
color: var(--text-dark);         /* "Dark text for light backgrounds" */
```

**Why?** When the color palette changes, `--bg-light` and `--text-dark` adapt automatically. Concrete colors remain fixed.

---

## Variable Hierarchy

### 1. Assignment Variables (Primary)
For backgrounds and text — always use these:

```css
/* Backgrounds — from light to dark */
var(--bg-ultra-light)
var(--bg-light)
var(--body-bg-color)      /* Default */
var(--bg-dark)
var(--bg-ultra-dark)

/* Text — for corresponding backgrounds */
var(--text-light)         /* For dark backgrounds */
var(--text-dark)          /* For light backgrounds */
var(--text-dark-muted)    /* Secondary text */
var(--heading-color)      /* Headings */
```

### 2. Functional Variables (Secondary)
For layout, spacing, typography:

```css
/* Spacing */
var(--space-s) through var(--space-2xl)
var(--section-space-m)    /* Default section padding */
var(--gutter)             /* Horizontal page padding */

/* Grid */
var(--grid-auto-3)        /* Auto-responsive 3 columns */
var(--grid-2-1)           /* 2:1 ratio */
var(--grid-gap)

/* Typography */
var(--h1) through var(--h6)
var(--text-m)             /* Base paragraph */
var(--heading-font-family)
```

### 3. Brand Colors (Exceptions)
Only for explicit brand elements:

```css
var(--primary)            /* CTA buttons, brand accents */
var(--accent)             /* Highlights */
var(--success)            /* Status indicators */
```

---

## Automatically Applied Styles

**ACSS applies these styles automatically — never define manually:**

### Container (`data-etch-element="container"`)
```css
/* These styles are REDUNDANT — ACSS sets them automatically: */
max-width: var(--content-width);
width: 100%;
margin-inline: auto;

/* Only override when deviating: */
max-width: var(--width-800);     /* Narrower */
max-width: none;                  /* Full width */
margin-inline: 0;                 /* Left-aligned */
```

### Section (`data-etch-element="section"`)
```css
/* Automatically set: */
padding-block: var(--section-space-m);
padding-inline: var(--gutter);

/* Only define when deviating: */
padding-block: var(--section-space-xl);   /* More spacing */
padding-block: 0;                          /* No padding */
background: var(--bg-dark);                /* Dark background */
```

### Text
```css
/* Automatic: */
/* - Headings: var(--heading-color) */
/* - Body text: Default color */

/* Only when deviating: */
color: var(--text-light);        /* On dark background */
color: var(--text-dark-muted);   /* Secondary text */
```

### Gaps (ACSS 2.6+)
```css
/* Automatically between: */
/* - Containers in sections: var(--container-gap) */
/* - Direct children of sections: var(--content-gap) */
/* - Grid elements: var(--grid-gap) */
```

---

## Container Queries

ACSS uses modern Container Queries instead of Media Queries:

```css
/* Container defines the query context */
.container {
  container-type: inline-size;
  container-name: card;
}

/* Responsive styles based on container width */
@container card (max-width: 400px) {
  .card {
    flex-direction: column;
  }
}
```

**Benefits:** Components are responsive independently of viewport.

---

## Utility Classes vs Custom CSS

### Use Utility Classes for:

| Task | ACSS Utility | Never Custom |
|------|--------------|--------------|
| Buttons | `btn--primary`, `btn--large` | `.my-button` |
| Grid | `grid--3`, `grid--auto-3` | Custom Grid CSS |
| Spacing | `space--m`, `pad-section--l` | `padding: 2rem` |
| Flex | `flex--row`, `flex--center` | `display: flex` |
| Visibility | `hide`, `hide-on--m` | Custom Media Queries |

### Custom CSS only for:
- Component-specific layout
- Visual details (borders, shadows)
- Animations/transitions
- Z-index and positioning

---

## Modern CSS with ACSS

### color-mix() instead of transparency tokens
```css
/* ✅ ACSS v4: color-mix for transparency */
background: color-mix(in oklch, var(--primary) 60%, transparent);
box-shadow: 0 2px 8px color-mix(in oklch, var(--base) 30%, transparent);

/* ❌ Legacy: transparency variables */
background: var(--primary-60);   /* No longer exists */
```

### calc() for fine-tuning
```css
/* 10% larger */
padding: calc(var(--space-l) * 1.1);

/* Create overlap */
margin-block-start: calc(var(--section-space-m) * -1);
```

---

## Best Practices

1. **Think in contexts** — "Light section with dark text" not "White background with black text"
2. **Never invent variables** — If unsure, check `.etch-acss-index.toon`
3. **Prefer utility classes** — `btn--primary` instead of custom button CSS
4. **Only define deviations** — If ACSS does it by default, don't repeat
5. **Assignment > Brand** — `--bg-light` instead of `--base-ultra-light`
6. **Use Container Queries** — For component-based responsiveness

---

## Project-Specific Reference

**Available after `node scripts/init-project.js`:**

```bash
# View the TOON index (human-readable, token-efficient format)
cat .etch-acss-index.toon

# Search for specific variables
grep "primary" .etch-acss-index.toon

# View all utility classes
grep "@classes" -A 50 .etch-acss-index.toon
```

---

## Summary

| Concept | Principle |
|---------|-----------|
| **Assignment Variables** | Describe context (`--bg-light`), not concrete values (`--white`) |
| **Automatic Styles** | Never manually define what ACSS does automatically |
| **Utility First** | Prefer ACSS classes, minimize custom CSS |
| **Container Queries** | Component-based responsiveness |
| **Modern CSS** | Use `color-mix()`, `calc()`, native features |

> **Golden Rule:** Only write CSS that deviates from the ACSS standard. If the design matches standard ACSS behavior, no CSS is needed.
