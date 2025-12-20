# CSS Architecture Rules - Etch WP

## Golden Rule: One Component = One Style Definition

**ABSOLUTELY FORBIDDEN: Never nest selectors in CSS blocks**

This is the #1 cause of maintenance issues and double-nesting problems in Etch WP.

### ❌ WRONG - NEVER DO THIS

```json
{
  "styles": {
    "footer-grid-style": {
      "type": "class",
      "selector": ".gg-footer-grid",
      "collection": "default",
      "css": ".gg-footer-grid {\n  display: grid;\n  gap: var(--grid-gap);\n\n  .gg-footer-column {\n    /* WRONG: Nested selector */\n    padding: var(--space-m);\n  }\n\n  .gg-footer-logo {\n    /* WRONG: Another nested selector */\n    max-width: 180px;\n  }\n\n  .gg-footer-link {\n    /* WRONG: Yet another nested selector */\n    color: var(--text-light);\n  }\n}",
      "readonly": false
    }
  }
}
```

### ✅ CORRECT - ALWAYS DO THIS

```json
{
  "styles": {
    "footer-grid-style": {
      "type": "class",
      "selector": ".gg-footer-grid",
      "collection": "default",
      "css": "display: grid;\ngrid-template-columns: var(--grid-4);\ngap: var(--grid-gap);\nmargin-bottom: var(--space-xxl);",
      "readonly": false
    },
    "footer-column-style": {
      "type": "class",
      "selector": ".gg-footer-column",
      "collection": "default",
      "css": "/* Base column styles */",
      "readonly": false
    },
    "footer-logo-style": {
      "type": "class",
      "selector": ".gg-footer-logo",
      "collection": "default",
      "css": "max-width: var(--width-180);\nheight: auto;\ndisplay: block;\nmargin-bottom: var(--space-l);",
      "readonly": false
    },
    "footer-link-style": {
      "type": "class",
      "selector": ".gg-footer-link",
      "collection": "default",
      "css": "color: var(--text-light);\ntext-decoration: none;\ntransition: var(--transition);\n\n&:hover {\n  color: var(--accent);\n}",
      "readonly": false
    }
  }
}
```

## Architecture Benefits

### Separation of Concerns
- **Single Responsibility**: Each style object handles only one component
- **Maintainability**: Easy to find and modify specific component styles
- **Reusability**: Components can be used independently
- **Testability**: Each component can be styled and tested in isolation

### Performance Benefits
- **Reduced CSS Size**: No duplication or nesting overhead
- **Faster Parsing**: Simpler selectors are quicker to process
- **Better Caching**: Individual components can be cached separately

## Component Naming Conventions

### BEM Methodology
Use BEM (Block Element Modifier) for consistent naming:

```css
/* Block */
.card {}

/* Elements */
.card__title {}
.card__description {}
.card__image {}

/* Modifiers */
.card--featured {}
.card__title--large {}
```

### Style ID Naming
Use descriptive, hierarchical style IDs:

```json
{
  "hero-section": { ... },
  "hero-title": { ... },
  "hero-subtitle": { ... },
  "hero-button": { ... },
  "hero-button--primary": { ... }
}
```

## Implementation Checklist

### Before Generating CSS
- [ ] Identify all unique components in the design
- [ ] Create a naming hierarchy (parent → child → modifier)
- [ ] Plan which components need separate style definitions

### While Generating CSS
- [ ] Each component gets exactly ONE style object
- [ ] Style selectors target only ONE class/element
- [ ] No nested selectors or CSS nesting syntax
- [ ] Use ACSS variables (never hardcoded values)
- [ ] Keep CSS focused and component-specific

### After Generating CSS
- [ ] Verify each style object has only one selector
- [ ] Check for accidental nesting or combined selectors
- [ ] Ensure all components reference their correct style IDs
- [ ] Test components in isolation if possible

## Common Anti-Patterns to Avoid

### 1. The "Kitchen Sink" Style
```css
/* ANTI-PATTERN: Too much in one style */
.footer-style {
  /* Footer styles */
  background: var(--dark);

  /* Grid styles (WRONG) */
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  /* Column styles (WRONG) */
  padding: var(--space-m);

  /* Link styles (WRONG) */
  color: var(--light);
  text-decoration: none;
}
```

### 2. Nested Selectors
```css
/* ANTI-PATTERN: Nested selectors */
.footer-style {
  background: var(--dark);

  .footer-grid { /* WRONG */
    display: grid;
  }

  .footer-link { /* WRONG */
    color: var(--light);
  }
}
```

### 3. Combined Selectors
```css
/* ANTI-PATTERN: Multiple selectors in one style */
.footer-combined {
  /* WRONG: Multiple components */
}

.footer-grid, .footer-column, .footer-link {
  /* WRONG: Combined selectors */
}
```

## Correct Implementation Flow

### Step 1: Analyze Components
```
Footer Container
├── Footer Inner
│   ├── Footer Grid
│   │   ├── Footer Column (Main)
│   │   │   ├── Logo
│   │   │   ├── Tagline
│   │   │   └── Description
│   │   ├── Footer Column (Nav)
│   │   │   └── Navigation Links
│   │   └── Footer Column (Social)
│   │       └── Social Icons
│   └── Footer Bottom
│       ├── Copyright
│       └── Legal Links
```

### Step 2: Create Style Objects
```json
{
  "footer-style": { ".gg-footer" },
  "footer-inner-style": { ".gg-footer__inner" },
  "footer-grid-style": { ".gg-footer-grid" },
  "footer-column-style": { ".gg-footer-column" },
  "footer-column-main-style": { ".gg-footer-column--main" },
  "footer-logo-style": { ".gg-footer-logo" },
  "footer-tagline-style": { ".gg-footer-tagline" },
  "footer-description-style": { ".gg-footer-description" },
  "footer-nav-style": { ".gg-footer-nav" },
  "footer-link-style": { ".gg-footer-link" },
  "footer-social-style": { ".gg-footer-social" },
  "footer-bottom-style": { ".gg-footer-bottom" },
  "footer-copyright-style": { ".gg-footer-copyright" },
  "footer-legal-style": { ".gg-footer-legal" },
  "footer-legal-link-style": { ".gg-footer-legal-link" }
}
```

### Step 3: Apply Styles to Elements
Each element references ONLY its own styles:
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "footer",
    "attributes": { "class": "gg-footer" },
    "styles": ["footer-style"]  // Only this element's styles
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "div",
        "attributes": { "class": "gg-footer__inner" },
        "styles": ["footer-inner-style"]  // Only inner styles
      }
    }
  ]
}
```

This architecture ensures clean, maintainable CSS without nesting issues.