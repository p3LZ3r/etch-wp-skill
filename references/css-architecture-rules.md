# CSS Architecture Rules - Etch WP

## ⚠️ CRITICAL: Style Object Structure Requirements

**ALL style objects in Etch WP MUST include these 5 required fields:**

```json
{
  "random-7-digit-style-id": {
    "type": "class",           // REQUIRED: "class" or "element"
    "selector": ".my-class",   // REQUIRED: CSS selector
    "collection": "default",   // REQUIRED: Always "default"
    "css": "color: red;",      // REQUIRED: CSS properties
    "readonly": false          // REQUIRED: true for built-in, false for custom
  }
}
```

### Including Built-in Etch Element Styles

**You do NOT need to define or include `etch-section-style` or `etch-container-style` in your styles object.**

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

### ⚠️ Don't Over-Engineer BEM Classes

**NOT every element needs a unique class if it looks like any other element on the page.** 

```json
// ❌ OVER-ENGINEERED - Every p has a class
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "p",
    "attributes": { "class": "my-section__paragraph" },
    "styles": ["random-7-digit-style-id"]
  }
}

// ✅ CORRECT - Most paragraphs use default styling
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "p"
    // No class, no styles = uses ACSS default paragraph styles
  }
}
```

**Only create custom classes for elements that need specific styling for example:**
- Headings with custom sizes/colors
- Containers with custom spacing
- Elements with custom backgrounds/borders
- Specific interactive elements (links, buttons)

---

## Naming Conventions

### BEM Methodology
Use BEM (Block Element Modifier) for consistent naming:

```css
/* Block */
.test-card {}

/* Elements */
.test-card__title {}
.test-card__description {}
.test-card__image-wrapper {}
.test-card__image {}
```

## Implementation Checklist

### Before Generating CSS
- [ ] Identify all unique elements in the design
- [ ] Create a naming hierarchy (parent → child → modifier)
- [ ] Plan which elements need separate style definitions

### While Generating CSS
- [ ] Style selectors target only ONE class/element
- [ ] Try to prevent nested selectors or CSS nesting syntax but for state handeling
- [ ] Use ACSS variables (never hardcoded values)

### After Generating CSS
- [ ] Verify each style object has only one selector
- [ ] Ensure all elements reference their correct style IDs

## Correct Implementation Flow

### Step 1: Analyze Components
```
Footer Section
├── Footer Container
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
  "random-7-digit-style-id": { ".gg-footer" },
  "random-7-digit-style-id": { ".gg-footer__container" },
  "random-7-digit-style-id": { ".gg-footer__grid" },
  "random-7-digit-style-id": { ".gg-footer__grid-column" },
  "random-7-digit-style-id": { ".gg-footer__column-main" },
  "random-7-digit-style-id": { ".gg-footer__logo" },
  "random-7-digit-style-id": { ".gg-footer__tagline" },
  "random-7-digit-style-id": { ".gg-footer__description" },
  "random-7-digit-style-id": { ".gg-footer__nav" },
  "random-7-digit-style-id": { ".gg-footer__nav-link" },
  "random-7-digit-style-id": { ".gg-footer__column-social" },
  "random-7-digit-style-id": { ".gg-footer__bottom" },
  "random-7-digit-style-id": { ".gg-footer__copyright" },
  "random-7-digit-style-id": { ".gg-footer__link" }
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
    "styles": ["random-7-digit-style-id"]  // Only this element's styles
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "div",
        "attributes": { "class": "gg-footer__container" },
        "styles": ["random-7-digit-style-id"]  // Only inner styles
      }
    }
  ]
}
```
