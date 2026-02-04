# Automatic.css v4 Variables for Etch WP

This reference provides the complete ACSS v4 variable system for use in Etch WP component CSS.

---

## ⚠️ CRITICAL: ACSS Automatic Styles (DO NOT REDEFINE)

**ACSS automatically applies certain styles to Etch WP elements. NEVER manually define these - they are redundant and cause maintenance issues.**

### Container Elements (data-etch-element="container")

These styles are **AUTOMATICALLY APPLIED** by ACSS - do NOT set them:

```css
/* REDUNDANT - ACSS sets these automatically */
max-width: var(--content-width);
width: 100%;
margin-inline: auto;
```

**When to override:**
- ✅ Narrower containers: `max-width: var(--width-800)` or `var(--content-width-safe)`
- ✅ Full-width containers: `max-width: none`
- ✅ Different alignment: `margin-inline: 0` or `margin-inline-start: 0`

### Section Elements (data-etch-element="section")

These styles are **AUTOMATICALLY APPLIED** by ACSS:

```css
/* REDUNDANT - ACSS handles section spacing */
padding-block: var(--section-space-m);  /* Default section padding */
padding-inline: var(--gutter);          /* Horizontal gutter */
```

**Automatic Contextual Spacing (ACSS 2.6+):**
- Container gaps between containers in sections
- Content gaps for direct children of sections
- Grid gaps for elements with grid utility classes

**When to override:**
- ✅ Different section spacing: `padding-block: var(--section-space-xl)`
- ✅ Remove padding: `padding-block: 0`
- ✅ Custom backgrounds: `background: var(--bg-dark)`

### Text Colors

Default text colors are **AUTOMATICALLY APPLIED** - do NOT set them unless different from standard:

```css
/* REDUNDANT - Headings use var(--heading-color) automatically */
color: var(--heading-color);

/* REDUNDANT - Body text uses default color automatically */
color: var(--text-dark);
```

**When to override:**
- ✅ Different color context: `color: var(--text-light)` on dark backgrounds
- ✅ Muted text: `color: var(--text-dark-muted)`
- ✅ Special brand color: `color: var(--accent)`

### Summary: Only Define What Deviates from Standard

| Element | Auto-Applied | Manual Override When |
|---------|--------------|---------------------|
| Container | `max-width`, `width: 100%`, `margin-inline: auto` | Different width, no centering |
| Section | `padding-block: var(--section-space-m)`, `padding-inline: var(--gutter)` | Different spacing, no padding |
| Gaps | Container gaps, content gaps, grid gaps | Custom gap sizes needed |
| Text | `--heading-color`, `--text-dark` | Different color context |

**Golden Rule:** Only define CSS properties that differ from ACSS defaults. If the design matches standard ACSS behavior, don't add redundant CSS.

## ⚠️ CRITICAL WARNING: NEVER INVENT ACSS VARIABLES

**ABSOLUTE RULE: You must NEVER create, guess, or invent ACSS variable names.**

### ❌ FORBIDDEN - Inventing Variables
```css
/* NEVER DO THIS - Guessing variable names! */
var(--padding-large)     /* Wrong naming - ACSS uses --space-* */
var(--color-secondary)   /* Making up names */
var(--btn-primary)       /* Wrong naming - use --primary instead */
var(--spacing-xl)        /* Wrong naming - ACSS uses --space-* */
var(--margin-top)        /* Wrong naming - use explicit values or --space-* */
var(--grid-columns-3)    /* Wrong naming - use --grid-3 or --grid-auto-3 */
```

**❌ Examples of invented/wrong names:**
- `--padding-*` → Use `--space-*` instead
- `--margin-*` → Use `--space-*` instead
- `--color-*` → Use assignment variables like `--bg-*` or `--text-*`
- `--btn-primary` → Use `--primary` directly

### ✅ REQUIRED Process for Using Variables

**BEFORE using ANY ACSS variable:**

1. **Check this reference file first**
   - Is the variable listed in this document?
   - If YES → Use it
   - If NO or UNSURE → Go to step 2

2. **Verify via Context7 MCP** (MANDATORY if uncertain)
   - Call `mcp__context7__resolve-library-id` with "automatic css"
   - Call `mcp__context7__get-library-docs` with the library ID
   - Search for the specific variable name
   - Use ONLY the exact variable name from official docs

3. **If variable doesn't exist**
   - Use explicit CSS value instead
   - Example: `margin-top: 2rem;` for one-off spacing instead of inventing a variable

### How to Verify Variable Existence

**Example Workflow:**
```
Need to use a grid variable
↓
Not 100% certain of the exact name
↓
MUST call Context7 MCP for ACSS docs
↓
Search topic: "grid variables"
↓
Get exact variable names from documentation
↓
Use ONLY verified variable names
```

**If you find yourself guessing → STOP and verify via Context7 MCP**

---

## Critical Rule: Variable Hierarchy

**PRIMARY: Background & Text Assignment Variables**
- `var(--bg-light)`, `var(--bg-dark)`, `var(--bg-ultra-dark)`
- `var(--text-dark)`, `var(--text-light)`, `var(--text-dark-muted)`
- `var(--heading-color)`

**SECONDARY: Spacing, Typography, Layout Variables**
- `var(--space-l)`, `var(--section-space-xl)`, `var(--grid-gap)`
- `var(--h2)`, `var(--text-m)`, `var(--heading-font-family)`
- `var(--content-width)`, `var(--grid-3)`

**RARE EXCEPTIONS: Direct Brand Colors**
- `var(--primary)`, `var(--accent)`, `var(--success)`
- Only for explicit brand elements, CTAs, or status indicators

Always use ACSS variables. This ensures:
- Global design consistency
- Easy theme switching
- Centralized control via ACSS dashboard
- Responsive behavior built-in

⚠️ **IMPORTANT:** If a variable is not listed below, verify its existence via Context7 MCP before using it.

## Background & Text Assignment Variables (PRIMARY)

**Assignment variables are the PRIMARY color system in Etch WP components.** They map colors to contexts rather than specific values, enabling theme-ability and automatic dark mode support.

### Philosophy: Context Over Color

Instead of asking "what color?", ask "what context?" A dark section uses `var(--bg-dark)` regardless of the actual color assigned in the ACSS dashboard.

**Benefits:**
- Less cognitive load (work in light/dark contexts)
- Instant re-theming (change one assignment, update entire site)
- Automatic color scheme support
- Automatic Color Relationships (with utility classes)

### Complete Background Assignment Variables

Use these as PRIMARY background colors:

| Variable | Purpose | Example Usage |
|----------|---------|---------------|
| `--body-bg-color` | Default website background | Typically `var(--white)` |
| `--bg-light` | Light background sections | Off-white, subtle backgrounds |
| `--bg-ultra-light` | Ultra-light backgrounds | Very subtle differentiation |
| `--bg-dark` | Dark background sections | Dark themed sections |
| `--bg-ultra-dark` | Ultra-dark backgrounds | Hero sections, dramatic contrast |

### Complete Text Assignment Variables

Use these as PRIMARY text colors:

| Variable | Purpose | Example Usage |
|----------|---------|---------------|
| `--body-color` | Default website text | Main body text color |
| `--text-dark` | Dark text for light backgrounds | Primary text on light |
| `--text-dark-muted` | Muted dark text | Secondary text, meta info |
| `--text-light` | Light text for dark backgrounds | Text on dark sections |
| `--text-light-muted` | Muted light text | Secondary text on dark |
| `--heading-color` | Global heading color | All headings (if set) |

### When to Use Assignment Variables

#### ✅ ALWAYS Use Assignment Variables For:

1. **Section backgrounds**
   ```css
   "css": "background: var(--bg-light);"
   ```

2. **Content text**
   ```css
   "css": "color: var(--text-dark);"
   ```

3. **Card backgrounds**
   ```css
   "css": "background: var(--bg-light);"
   ```

4. **Headings**
   ```css
   "css": "color: var(--heading-color);"
   ```

5. **Muted/secondary text**
   ```css
   "css": "color: var(--text-dark-muted);"
   ```

6. **Any contextual color** (light/dark backgrounds, primary/secondary text)

### When to Use Direct Brand Colors (RARE)

#### ❌ Use Direct Brand Colors ONLY When:

1. **Explicit brand reference** (brand badges, logos)
   ```css
   "css": "background: var(--primary);\n  color: var(--white);"
   ```

2. **Interactive states requiring brand color**
   ```css
   "css": "background: var(--bg-light);\n  border: 2px solid var(--primary);"
   ```

3. **Accent elements** that must stay brand-colored
   ```css
   "css": "background: var(--accent);\n  color: var(--white);"
   ```

4. **Status indicators** (success, warning, danger)
   ```css
   "css": "background: var(--success);\n  color: var(--white);"
   ```

**Direct brand color variables:**
- `--primary`, `--primary-dark`, `--primary-light`, etc.
- `--secondary`, `--accent`, `--tertiary`
- `--success`, `--warning`, `--danger`, `--info`
- `--base` (rarely needed - use assignments instead)

### Color Scheme Compatibility

Assignment variables automatically support color scheme switching:

```css
/* These adapt automatically to light/dark mode */
background: var(--bg-light);      /* Adapts to scheme */
color: var(--text-dark);          /* Adapts to scheme */
```

```css
/* These do NOT adapt (hardcoded values) */
background: var(--primary);       /* Stays primary color */
color: var(--base-ultra-dark);    /* Stays exact color */
```

**Rule**: For maximum color scheme compatibility, use assignment variables.

### Quick Reference

#### Background Variables (in order of lightness)
```
var(--bg-ultra-light)    → Lightest
var(--bg-light)          → Light
var(--body-bg-color)     → Default
var(--bg-dark)           → Dark
var(--bg-ultra-dark)     → Darkest
```

#### Text Variables
```
var(--text-light)        → Light text (for dark backgrounds)
var(--text-light-muted)  → Muted light text
var(--body-color)        → Default text
var(--text-dark)         → Dark text (for light backgrounds)
var(--text-dark-muted)   → Muted dark text
var(--heading-color)     → Heading color
```

## Spacing Variables

### Standard Spacing: `var(--space-{size})`

Context-agnostic spacing for padding, margin, gap, or positioning:

```css
var(--space-xs)   /* Extra small */
var(--space-s)    /* Small */
var(--space-m)    /* Medium (base) */
var(--space-l)    /* Large */
var(--space-xl)   /* Extra large */
var(--space-2xl)  /* 2X large (v4: changed from xxl) */
```

**Example usage:**
```css
"css": "padding: var(--space-m);\n  gap: var(--space-s);"
```

### Section Spacing: `var(--section-space-{size})`

For section block padding (top/bottom):

```css
var(--section-space-xs)
var(--section-space-s)
var(--section-space-m)   /* Default for <section> */
var(--section-space-l)
var(--section-space-xl)
var(--section-space-2xl)
var(--gutter)             /* Inline (left/right) padding */
```

**Example usage:**
```css
"css": "padding-block: var(--section-space-l);\n  padding-inline: var(--gutter);"
```

### Contextual Spacing

Consistent spacing within specific contexts:

```css
var(--container-gap)  /* Gap between containers */
var(--content-gap)    /* Gap between content elements */
var(--grid-gap)       /* Gap between grid items */
var(--card-gap)       /* Gap within cards */
```

**Example usage:**
```css
"css": "display: flex;\n  flex-direction: column;\n  gap: var(--content-gap);"
```

### Using calc() for Fine-Tuning

```css
/* Reduce by 10% */
"css": "padding: calc(var(--space-l) / 1.1);"

/* Increase by 10% */
"css": "margin-block: calc(var(--section-space-m) * 1.1);"

/* Double the gap */
"css": "gap: calc(var(--grid-gap) * 2);"

/* Create overlap */
"css": "margin-block-start: calc(var(--section-space-m) * -1);"
```

## Color Variables (RARE EXCEPTIONS ONLY)

**WARNING: Use assignment variables (--bg-*, --text-*) as PRIMARY color system.**

Direct brand colors should ONLY be used in rare exceptions:
- Explicit brand elements (brand badges, logos)
- Interactive states requiring brand color (CTAs, links)
- Status indicators (success, warning, danger)
- Color calculations requiring partials

### Brand Colors: `var(--{color})` (Use Sparingly)

```css
var(--primary)     /* Main brand/action color */
var(--secondary)   /* Secondary brand color */
var(--tertiary)    /* Third brand color */
var(--accent)      /* Accent/emphasis color */
var(--base)        /* Base color (typically dark) */
var(--white)       /* White (inverts with scheme) */
var(--black)       /* Black (inverts with scheme) */
```

### Color Shades: `var(--{color}-{shade})` (Rare Use)

Each brand color expands into **7 shades**:

```css
var(--primary-ultra-light)
var(--primary-light)
var(--primary-semi-light)
var(--primary)           /* base color */
var(--primary-semi-dark)
var(--primary-dark)
var(--primary-ultra-dark)
var(--primary-hover)     /* reserved for hover states */
```

**Available for all colors**: primary, secondary, tertiary, accent, base

### Semantic/Status Colors (Acceptable for Status)

```css
var(--success)   /* Success states (green) */
var(--warning)   /* Warning/caution states (yellow/orange) */
var(--danger)    /* Error/danger states (red) */
var(--info)      /* Information states (blue) */
```

Each status color also has shade variants: `--success-light`, `--success-dark`, etc.

### Acceptable Exception Examples

```css
/* ✅ ACCEPTABLE: CTA button with brand color */
"css": "background: var(--primary);\n  color: var(--white);\n  &:hover {\n    background: var(--primary-hover);\n  }"

/* ✅ ACCEPTABLE: Success message */
"css": "background: var(--success);\n  color: var(--white);"

/* ✅ ACCEPTABLE: Brand accent */
"css": "border-bottom: 2px solid var(--accent);"
```

### Wrong Usage (Use Assignments Instead)

```css
/* ❌ WRONG: Section background with direct color */
"css": "background: var(--base-ultra-light);"

/* ✅ RIGHT: Section background with assignment */
"css": "background: var(--bg-ultra-light);"

/* ❌ WRONG: Text with direct color */
"css": "color: var(--base-ultra-dark);"

/* ✅ RIGHT: Text with assignment */
"css": "color: var(--text-dark);"
```

### Transparency (v4 Approach)

Use `color-mix()` instead of predefined transparency tokens:

```css
/* 60% opacity */
"css": "background: color-mix(in oklch, var(--primary) 60%, transparent);"

/* 30% opacity */
"css": "box-shadow: 0 2px 8px color-mix(in oklch, var(--base) 30%, transparent);"
```

## Typography Variables

### Font Sizes

**Headings:**
```css
var(--h1) through var(--h6)
```

**Text (t-shirt sizing):**
```css
var(--text-xs)   /* Extra small */
var(--text-s)    /* Small */
var(--text-m)    /* Medium (base paragraph) */
var(--text-l)    /* Large */
var(--text-xl)   /* Extra large */
var(--text-2xl)  /* 2X large */
```

**Example usage:**
```css
"css": "font-size: var(--h3);"
"css": "font-size: var(--text-m);"
```

### Font Families

```css
var(--heading-font-family)   /* Global heading font */
var(--text-font-family)      /* Global body text font */
var(--h1-font-family)        /* Level-specific (if set) */
```

**Example usage:**
```css
"css": "font-family: var(--heading-font-family);"
```

### Line Heights

```css
var(--heading-line-height)   /* Global heading line height */
var(--text-line-height)      /* Global text line height */
var(--h2-line-height)        /* Level-specific */
```

### Font Weights

```css
var(--heading-font-weight)
var(--text-font-weight)
var(--h1-font-weight)
```

### Additional Typography

```css
var(--heading-letter-spacing)
var(--heading-text-transform)
var(--heading-color)
var(--text-color)
```

**Complete typography example:**
```css
"css": "font-size: var(--h3);\n  font-family: var(--heading-font-family);\n  line-height: var(--heading-line-height);\n  font-weight: var(--heading-font-weight);\n  color: var(--heading-color);"
```

## Layout & Grid Variables

### Grid Template Columns

```css
/* Equal columns */
var(--grid-1) through var(--grid-12)

/* Ratio grids */
var(--grid-1-2)    /* 1:2 ratio */
var(--grid-2-1)    /* 2:1 ratio */
var(--grid-1-3), var(--grid-3-1)
var(--grid-2-3), var(--grid-3-2)

/* Auto-responsive grids */
var(--grid-auto-1) through var(--grid-auto-12)
```

**Example usage:**
```css
"css": "display: grid;\n  grid-template-columns: var(--grid-3);\n  gap: var(--grid-gap);"
```

### Content Width

```css
var(--content-width)        /* Main site content width */
var(--content-width-safe)   /* With gutter protection */
```

**Example usage:**
```css
"css": "max-width: var(--content-width);\n  margin-inline: auto;"
```

### Width Variables

Based on content width (not percentages):

```css
var(--width-10) through var(--width-90)  /* Increments of 10 */
var(--width-full)                         /* 100% */

/* Legacy t-shirt sizes */
var(--width-xs), var(--width-s), var(--width-m), var(--width-l), var(--width-xl)
```

## Visual Styling Variables

### Border Radius

```css
var(--radius)        /* Global border radius */
var(--btn-radius)    /* Button-specific */
var(--card-radius)   /* Card-specific */
```

**Example usage:**
```css
"css": "border-radius: var(--radius);"
```

### Box Shadows

```css
var(--box-shadow-1)   /* First shadow style */
var(--box-shadow-2)   /* Second shadow style */
var(--box-shadow-3)   /* Third shadow style */
var(--card-shadow)    /* Card-specific shadow */
```

**Example usage:**
```css
"css": "box-shadow: var(--box-shadow-1);"
```

### Transitions

```css
var(--transition)            /* Complete transition */
var(--transition-duration)   /* Duration (e.g., 0.3s) */
var(--transition-timing)     /* Timing function */
```

**Example usage:**
```css
"css": "transition: var(--transition);"
```

## Button Token Variables

For button components, use locally scoped tokens:

```css
var(--btn-padding-block)
var(--btn-padding-inline)
var(--btn-background)
var(--btn-background-hover)
var(--btn-text-color)
var(--btn-text-color-hover)
var(--btn-font-size)
var(--btn-border-width)
var(--btn-border-color)
var(--btn-radius)
var(--btn-min-width)
```

**Example button CSS:**
```css
"css": "display: inline-flex;\n  align-items: center;\n  padding-block: var(--btn-padding-block);\n  padding-inline: var(--btn-padding-inline);\n  background: var(--btn-background);\n  color: var(--btn-text-color);\n  border-radius: var(--btn-radius);\n  transition: var(--transition);\n  &:hover {\n    background: var(--btn-background-hover);\n  }"
```

## Card Framework Variables

```css
var(--card-padding)   /* Main card padding */
var(--card-gap)       /* Gap between card elements */
var(--card-radius)    /* Card border radius */
var(--card-shadow)    /* Card shadow */
```

## Complete Component Examples with Assignment Variables

### Feature Card with ACSS Assignment Variables

```json
"feature-card": {
  "type": "class",
  "selector": ".feature-card",
  "css": "display: flex;\n  flex-direction: column;\n  gap: var(--card-gap);\n  padding: var(--space-l);\n  background: var(--bg-light);\n  color: var(--text-dark);\n  border-radius: var(--card-radius);\n  box-shadow: var(--card-shadow);\n  transition: var(--transition);\n  &:hover {\n    box-shadow: var(--box-shadow-2);\n  }"
},
"feature-card__heading": {
  "type": "class",
  "selector": ".feature-card__heading",
  "css": "font-size: var(--h4);\n  font-family: var(--heading-font-family);\n  line-height: var(--heading-line-height);\n  color: var(--heading-color);\n  font-weight: var(--heading-font-weight);"
},
"feature-card__text": {
  "type": "class",
  "selector": ".feature-card__text",
  "css": "font-size: var(--text-s);\n  line-height: var(--text-line-height);\n  color: var(--text-dark-muted);"
}
```

### Section with ACSS Assignment Variables

```json
"feature-section": {
  "type": "class",
  "selector": ".feature-section",
  "css": "padding-block: var(--section-space-xl);\n  padding-inline: var(--gutter);\n  background: var(--bg-ultra-light);\n  color: var(--text-dark);"
},
"feature-section__grid": {
  "type": "class",
  "selector": ".feature-section__grid",
  "css": "display: grid;\n  grid-template-columns: var(--grid-auto-3);\n  gap: var(--grid-gap);"
}
```

### Dark Section with Assignment Variables

```json
"dark-hero": {
  "type": "class",
  "selector": ".dark-hero",
  "css": "padding-block: var(--section-space-2xl);\n  padding-inline: var(--gutter);\n  background: var(--bg-ultra-dark);\n  color: var(--text-light);\n  text-align: center;"
},
"dark-hero__headline": {
  "type": "class",
  "selector": ".dark-hero__headline",
  "css": "font-size: var(--h1);\n  color: var(--text-light);\n  margin-block-end: var(--space-l);"
}
```

### Button with Brand Color (Acceptable Exception)

```json
"btn-primary": {
  "type": "class",
  "selector": ".btn--primary",
  "css": "display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding-block: var(--btn-padding-block);\n  padding-inline: var(--btn-padding-inline);\n  background: var(--primary);\n  color: var(--white);\n  font-size: var(--btn-font-size);\n  font-weight: var(--heading-font-weight);\n  border-radius: var(--btn-radius);\n  border: none;\n  min-width: var(--btn-min-width);\n  transition: var(--transition);\n  cursor: pointer;\n  &:hover {\n    background: var(--primary-hover);\n  }"
}
```
Note: Button uses `var(--primary)` as an exception because it's an explicit brand action element.

## Best Practices

1. **ALWAYS use assignment variables first** - `var(--bg-light)`, `var(--text-dark)` for backgrounds/text
2. **Think contextually** - "Light section with dark text" not "white background with base-ultra-dark"
3. **Use contextual spacing** - Prefer `--content-gap`, `--grid-gap` over generic `--space-m`
4. **Reserve brand colors** - Only for CTAs, brand badges, explicit brand elements
5. **Leverage calc()** - Fine-tune spacing: `calc(var(--space-l) * 1.5)`
6. **Follow grid system** - Use `--grid-3`, `--grid-auto-4` instead of custom columns
7. **Apply button tokens** - Use `--btn-*` variables for buttons
8. **Maintain consistency** - Use `--radius` globally, not mixed values
9. **Never hardcode** - Always use ACSS variables
10. **Follow hierarchy** - Assignment → Spacing/Typography → Brand (rare)

## Common Patterns

### Responsive Grid
```css
"css": "display: grid;\n  grid-template-columns: var(--grid-auto-3);\n  gap: var(--grid-gap);"
```

### Custom Width Container (Override Default)
```css
/* ACSS sets max-width, margin-inline, width automatically.
   Only define when different from defaults: */
"css": "max-width: var(--width-800);  /* Narrower than default */\n  margin-inline: 0;              /* Left-aligned instead of centered */"
```

### Card Component
```css
"css": "padding: var(--card-padding);\n  gap: var(--card-gap);\n  border-radius: var(--card-radius);\n  box-shadow: var(--card-shadow);\n  background: var(--white);"
```

### Section Padding (Override Default)
```css
/* ACSS applies padding-block: var(--section-space-m) automatically.
   Only define when different from defaults: */
"css": "padding-block: var(--section-space-xl);  /* More spacing than default */\n  background: var(--bg-ultra-light);        /* Custom background */"
```

### Typography Stack
```css
"css": "font-size: var(--h3);\n  font-family: var(--heading-font-family);\n  line-height: var(--heading-line-height);\n  font-weight: var(--heading-font-weight);\n  color: var(--heading-color);"
```

### Hover State with Color Mix
```css
"css": "background: var(--primary);\n  transition: var(--transition);\n  &:hover {\n    background: var(--primary-hover);\n    box-shadow: 0 4px 12px color-mix(in oklch, var(--primary) 40%, transparent);\n  }"
```

---

## JavaScript Integration

**JavaScript can be added to ANY element, not just components.** Use the `script` field in element attributes.

### Adding Scripts to Elements

**CRITICAL: Scripts must be Base64-encoded.** The script object has `id` and `code` properties:

```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "div",
    "attributes": {
      "class": "animated-card",
      "data-animate": "fade-up"
    },
    "script": {
      "id": "a1b2c3d",
      "code": "Y29uc3QgY2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbmltYXRlZC1jYXJkJyk7CmNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7CiAgY2FyZC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1hY3RpdmUnKTsKfSk7"
    }
  }
}
```

### Script Requirements

- **MUST be Base64-encoded** - Raw JavaScript will not execute
- **Script ID** - 7 random alphanumeric characters (e.g., "a1b2c3d")
- **Single line** - The Base64 string must not contain line breaks
- **Placement** - Must be in `attrs.script`, NOT `attrs.attributes.script`

### Base64 Encoding Example

```javascript
// Original JavaScript
const js = `const card = document.querySelector('.animated-card');
card.addEventListener('click', () => {
  card.classList.toggle('is-active');
});`;

// Base64-encoded for Etch WP (single line, no breaks)
const encoded = btoa(js); // Y29uc3QgY2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbmltYXRlZC1jYXJkJyk7CmNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7CiAgY2FyZC5jbGFzc0xpc3QudG9nZ2xlKCdpcy1hY3RpdmUnKTsKfSk7
```

---

## GSAP Animations

**GSAP can be integrated for advanced animations.** When GSAP is needed, include a reference to implementation patterns.

### GSAP Implementation Example

```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "section",
    "attributes": {
      "class": "hero-section",
      "id": "hero"
    },
    "script": {
      "id": "x9y8z7w",
      "code": "Z3NhcC5mcm9tKCcuaGVyby1zZWN0aW9uIGgxJywgeyBvcGFjaXR5OiAwLCB5OiA1MCwgZHVyYXRpb246IDEsIGVhc2U6ICdwb3dlcjMub3V0JyB9KTs="
    }
  }
}
```

**Note:** The `code` value is Base64-encoded JavaScript:
```javascript
gsap.from('.hero-section h1', { opacity: 0, y: 50, duration: 1, ease: 'power3.out' });
```

### When to Use GSAP

**Use GSAP for:**
- Complex timeline animations
- Scroll-triggered animations (ScrollTrigger)
- Morphing and path animations
- High-performance transforms
- Advanced easing functions

**Use CSS transitions for:**
- Simple hover states
- Basic fade/slide effects
- Color transitions
- Transform transitions

### PHP Implementation Reference

For GSAP implementations, refer to PHP code demonstrating:
- ScrollTrigger setup for scroll animations
- Timeline sequencing for complex animations
- Performance optimization techniques
- Responsive animation handling
- Proper wp_enqueue_script() usage for GSAP library loading

**Note:** Ensure GSAP library is loaded via theme or plugin (functions.php) before using GSAP in element scripts.
