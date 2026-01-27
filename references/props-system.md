# Etch WP Props & Slots System

## Overview

Etch WP provides two ways to pass content to components:

1. **Props** - For simple, primitive values (text, numbers, booleans, images)
2. **Slots** - For complex, nested content (components, multiple elements, rich layouts)

**When to use what:**
- Use **Props** for: titles, descriptions, URLs, boolean flags, select options, single images
- Use **Slots** for: nested components, card bodies, flexible content areas, anything with multiple child elements

---

## Component Properties Structure

Properties are defined in the `properties` array of each component:

```json
{
  "components": {
    "123": {
      "id": 123,
      "name": "Component Name",
      "key": "ComponentKey",
      "blocks": [...],
      "properties": [
        {
          "key": "propName",
          "name": "Display Name",
          "keyTouched": false,
          "type": {"primitive": "string"},
          "default": "Default value"
        }
      ],
      "description": "",
      "legacyId": ""
    }
  }
}
```

## Property Types

### String (Text)
```json
{
  "key": "title",
  "name": "Title",
  "keyTouched": false,
  "type": {"primitive": "string"},
  "default": "Default Title"
}
```

### Boolean
```json
{
  "key": "showIcon",
  "name": "Show Icon",
  "keyTouched": false,
  "type": {"primitive": "boolean"},
  "default": true
}
```

### Number
```json
{
  "key": "count",
  "name": "Count",
  "keyTouched": false,
  "type": {"primitive": "number"},
  "default": 0
}
```

### Select Dropdown
```json
{
  "key": "style",
  "name": "Style",
  "keyTouched": false,
  "type": {
    "primitive": "string",
    "specialized": "select"
  },
  "selectOptionsString": "Option 1\nOption 2\nOption 3",
  "default": "Option 1"
}
```

### Image
```json
{
  "key": "icon",
  "name": "Icon",
  "keyTouched": false,
  "type": {
    "primitive": "string",
    "specialized": "image"
  }
}
```

### URL
```json
{
  "key": "link",
  "name": "Link URL",
  "keyTouched": false,
  "type": {"primitive": "string"},
  "default": "#"
}
```

## Using Props in Components

### In etch/text
```json
{
  "blockName": "etch/text",
  "attrs": {
    "content": "{props.title}"
  }
}
```

### In Attributes
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "a",
    "attributes": {
      "href": "{props.url}",
      "class": "link {props.extraClass}",
      "aria-label": "{props.title}"
    }
  }
}
```

### In SVG src
```json
{
  "blockName": "etch/svg",
  "attrs": {
    "tag": "svg",
    "attributes": {
      "src": "{props.icon}"
    }
  }
}
```

### In Conditional Logic
```json
{
  "blockName": "etch/condition",
  "attrs": {
    "condition": {
      "leftHand": "props.showElement",
      "operator": "isTruthy",
      "rightHand": null
    },
    "conditionString": "props.showElement"
  }
}
```

## Passing Props to Components

When using a component via `etch/component`:

```json
{
  "blockName": "etch/component",
  "attrs": {
    "ref": 123,
    "attributes": {
      "title": "My Title",
      "showIcon": "{true}",
      "count": "{5}",
      "url": "#section"
    }
  }
}
```

### Static Values
```json
"title": "Static Text"
```

### Boolean Values
Must be strings:
```json
"showIcon": "{true}",
"hideElement": "{false}"
```

### Number Values
Can be strings:
```json
"count": "{10}",
"index": "{0}"
```

### Dynamic Values
From post data:
```json
"title": "{post.title}",
"image": "{post.featuredImage.url}",
"author": "{post.author.name}"
```

## Real-World Examples

### Feature Card Properties
```json
"properties": [
  {
    "key": "hasIcon",
    "name": "Has Icon",
    "keyTouched": false,
    "type": {"primitive": "boolean"},
    "default": true
  },
  {
    "key": "icon",
    "name": "Icon",
    "keyTouched": false,
    "type": {
      "primitive": "string",
      "specialized": "image"
    }
  },
  {
    "key": "heading",
    "name": "Heading",
    "keyTouched": false,
    "type": {"primitive": "string"},
    "default": "Feature Heading"
  },
  {
    "key": "description",
    "name": "Description",
    "keyTouched": false,
    "type": {"primitive": "string"},
    "default": "Feature description text."
  }
]
```

### Section Intro Properties
```json
"properties": [
  {
    "key": "style",
    "name": "Style",
    "keyTouched": false,
    "type": {
      "primitive": "string",
      "specialized": "select"
    },
    "selectOptionsString": "Left\nCenter\nTwo Column",
    "default": "Left"
  },
  {
    "key": "sectionHeading",
    "name": "Section Heading",
    "keyTouched": false,
    "type": {"primitive": "string"},
    "default": "Section Heading"
  },
  {
    "key": "showLede",
    "name": "Show Lede",
    "keyTouched": false,
    "type": {"primitive": "boolean"},
    "default": true
  },
  {
    "key": "primaryCtaUrl",
    "name": "Primary CTA URL",
    "keyTouched": false,
    "type": {"primitive": "string"},
    "default": "#"
  }
]
```

### Button Component Properties
```json
"properties": [
  {
    "key": "text",
    "name": "Button Text",
    "keyTouched": false,
    "type": {"primitive": "string"},
    "default": "Click Here"
  },
  {
    "key": "url",
    "name": "URL",
    "keyTouched": false,
    "type": {"primitive": "string"},
    "default": "#"
  },
  {
    "key": "style",
    "name": "Button Style",
    "keyTouched": false,
    "type": {
      "primitive": "string",
      "specialized": "select"
    },
    "selectOptionsString": "Primary\nSecondary\nOutline\nGhost",
    "default": "Primary"
  },
  {
    "key": "openInNewTab",
    "name": "Open in New Tab",
    "keyTouched": false,
    "type": {"primitive": "boolean"},
    "default": false
  }
]
```

## Property Naming Conventions

### Keys (camelCase)
- `title`, `heading`, `description`
- `showIcon`, `hasImage`, `isActive`
- `primaryUrl`, `secondaryText`
- `imageUrl`, `iconSrc`

### Names (Title Case)
- "Title", "Heading", "Description"
- "Show Icon", "Has Image", "Is Active"
- "Primary URL", "Secondary Text"
- "Image URL", "Icon Source"

## Using data-* Attributes with Props

Props can be used in data attributes for styling variants and configurations. This is the **ONLY** way to use props for styling purposes.

### Pattern: Props → Data Attributes → CSS Selectors

```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "div",
    "attributes": {
      "class": "sports-card",
      "data-variant": "{props.variant}",
      "data-size": "{props.size}"
    }
  },
  "styles": {
    "desktop": "&[data-variant='primary' i] {\n    background: var(--highlight, #0066cc);\n    color: white;\n  }\n  &[data-variant='outline' i] {\n    background: transparent;\n    border: 2px solid var(--highlight, #0066cc);\n    color: var(--highlight, #0066cc);\n  }\n  &[data-variant='default' i] {\n    background: var(--base, #f5f5f5);\n    color: var(--text, #333);\n  }\n  &[data-size='large' i] {\n    padding: 2rem;\n    font-size: 1.25em;\n  }\n  &[data-size='small' i] {\n    padding: 0.75rem;\n    font-size: 0.875em;\n  }"
  }
}
```

### Why Data Attributes?

**✅ Data attributes work because:**
- They're rendered in the HTML as actual attributes
- CSS can select and style based on their values
- Props are evaluated at render time and written to the DOM

**❌ These DON'T work:**
- `{props.variant}` in CSS files (CSS doesn't know about props)
- `{props.bgImage}` in CSS `url()` functions
- `{props.gradientFrom}` in CSS custom properties inline

### Complete Example: Card with Variants

**Component Properties:**
```json
"properties": [
  {
    "key": "variant",
    "name": "Card Variant",
    "type": {
      "primitive": "string",
      "specialized": "select"
    },
    "selectOptionsString": "Primary\nOutline\nDefault",
    "default": "Default"
  },
  {
    "key": "size",
    "name": "Card Size",
    "type": {
      "primitive": "string",
      "specialized": "select"
    },
    "selectOptionsString": "Small\nMedium\nLarge",
    "default": "Medium"
  }
]
```

**Component Definition:**
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "article",
    "attributes": {
      "class": "card",
      "data-variant": "{props.variant}",
      "data-size": "{props.size}"
    }
  },
  "styles": {
    "desktop": ".card {\n    border-radius: var(--radius, 0.5rem);\n    transition: all 0.2s ease;\n  }\n  .card[data-variant='primary' i] {\n    background: var(--primary, #0066cc);\n    color: white;\n    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);\n  }\n  .card[data-variant='outline' i] {\n    background: transparent;\n    border: 2px solid var(--primary, #0066cc);\n    color: var(--primary, #0066cc);\n  }\n  .card[data-variant='default' i] {\n    background: var(--base, #f5f5f5);\n    border: 1px solid var(--border, #ddd);\n    color: var(--text, #333);\n  }\n  .card[data-size='large' i] {\n    padding: var(--space-xl, 2rem);\n  }\n  .card[data-size='medium' i] {\n    padding: var(--space-md, 1.5rem);\n  }\n  .card[data-size='small' i] {\n    padding: var(--space-sm, 1rem);\n  }"
  }
}
```

## Best Practices

1. **Descriptive keys** - Use clear, self-documenting names
2. **Sensible defaults** - Provide good default values
3. **Boolean for toggles** - Use boolean type for show/hide
4. **Select for variants** - Use select for predefined options
5. **Consistent naming** - Follow camelCase for keys
6. **Group related props** - Order logically (content → styling → behavior)
7. **Document with names** - Use clear display names
8. **Required vs optional** - Consider which props need defaults

## Common Prop Patterns

### Content Props
```json
{"key": "title", "type": {"primitive": "string"}, "default": "Title"}
{"key": "description", "type": {"primitive": "string"}, "default": "Description"}
{"key": "content", "type": {"primitive": "string"}, "default": "Content"}
```

### Visibility Props
```json
{"key": "showElement", "type": {"primitive": "boolean"}, "default": true}
{"key": "hideOnMobile", "type": {"primitive": "boolean"}, "default": false}
{"key": "visible", "type": {"primitive": "boolean"}, "default": true}
```

### Link Props
```json
{"key": "url", "type": {"primitive": "string"}, "default": "#"}
{"key": "linkText", "type": {"primitive": "string"}, "default": "Learn More"}
{"key": "openInNewTab", "type": {"primitive": "boolean"}, "default": false}
```

### Image Props
```json
{"key": "image", "type": {"primitive": "string", "specialized": "image"}}
{"key": "alt", "type": {"primitive": "string"}, "default": ""}
{"key": "showImage", "type": {"primitive": "boolean"}, "default": true}
```

### Style/Variant Props
```json
{
  "key": "variant",
  "type": {"primitive": "string", "specialized": "select"},
  "selectOptionsString": "Default\nPrimary\nSecondary",
  "default": "Default"
}
```

---

## Slots System

Slots are "drop zones" within components that accept complex content on a per-instance basis. They provide unlimited flexibility without creating numerous props.

### What Are Slots?

- **Flexible content areas** - Accept any content: text, images, components, multiple elements
- **Instance-specific** - Each component instance can have different slot content
- **Empty slots render nothing** - No wrappers or empty divs if unused
- **Unlimited slots** - Add as many slots as needed per component

### Defining Slots in Components

Slots are defined using the `{@slot slotName}` syntax in component definitions.

#### In HTML Editor
```html
<div class="card">
  <div class="card__header">
    {@slot header}
  </div>
  <div class="card__body">
    {@slot body}
  </div>
</div>
```

#### In JSON Structure
Slots appear as `etch/text` blocks with special slot syntax:

```json
{
  "blockName": "etch/text",
  "attrs": {
    "metadata": {"name": "Slot: header"},
    "content": "{@slot header}"
  },
  "innerBlocks": [],
  "innerHTML": "",
  "innerContent": []
}
```

### Using Slots in Component Instances

When using a component with slots, populate them using `{#slot slotName}{/slot}` syntax.

#### In HTML Editor
```html
{#slot header}
  <h2>My Custom Header</h2>
  <p>With multiple elements</p>
{/slot}

{#slot body}
  <p>Complex content here</p>
  <img src="image.jpg" alt="Image">
  <!-- Even other components -->
{/slot}
```

#### In JSON Structure (etch/component with slots)

Slots in component instances are represented as `innerBlocks`:

```json
{
  "blockName": "etch/component",
  "attrs": {
    "ref": 123,
    "attributes": {
      "title": "Card Title"
    }
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "metadata": {"name": "Slot: header"},
        "tag": "div",
        "attributes": {
          "data-slot": "header"
        }
      },
      "innerBlocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "tag": "h2"
          },
          "innerBlocks": [
            {
              "blockName": "etch/text",
              "attrs": {
                "content": "My Custom Header"
              }
            }
          ]
        }
      ]
    },
    {
      "blockName": "etch/element",
      "attrs": {
        "metadata": {"name": "Slot: body"},
        "tag": "div",
        "attributes": {
          "data-slot": "body"
        }
      },
      "innerBlocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "tag": "p"
          },
          "innerBlocks": [
            {
              "blockName": "etch/text",
              "attrs": {
                "content": "Complex content here"
              }
            }
          ]
        }
      ]
    }
  ],
  "innerHTML": "\n\n\n\n",
  "innerContent": ["\n", null, "\n\n", null, "\n"]
}
```

### Combining Props and Slots

Components can use both props and slots together:

```json
{
  "components": {
    "456": {
      "id": 456,
      "name": "Feature Card",
      "key": "FeatureCard",
      "properties": [
        {
          "key": "title",
          "name": "Card Title",
          "type": {"primitive": "string"},
          "default": "Feature"
        },
        {
          "key": "showIcon",
          "name": "Show Icon",
          "type": {"primitive": "boolean"},
          "default": true
        }
      ],
      "blocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "tag": "div",
            "attributes": {
              "class": "feature-card"
            }
          },
          "innerBlocks": [
            {
              "blockName": "etch/element",
              "attrs": {
                "tag": "h3"
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "content": "{props.title}"
                  }
                }
              ]
            },
            {
              "blockName": "etch/text",
              "attrs": {
                "content": "{@slot content}"
              }
            }
          ]
        }
      ]
    }
  }
}
```

### Slot Naming Conventions

Use descriptive, semantic names:

**Good slot names:**
- `header`, `body`, `footer`
- `content`, `sidebar`, `aside`
- `media`, `actions`, `meta`
- `intro`, `main`, `outro`

**Avoid:**
- Generic names like `slot1`, `slot2`
- Overly specific names like `redButtonArea`

### Best Practices

1. **Use slots for nested content** - Anytime you need to nest components or complex HTML
2. **Use props for simple values** - Text strings, booleans, URLs
3. **Name slots semantically** - Use names that describe their purpose
4. **Document slot purpose** - Make it clear what each slot is for
5. **Empty slots are fine** - They render nothing, no wrappers
6. **Combine with props** - Use props for configuration, slots for content
7. **Consider flexibility** - Slots give users complete control over content structure

### Common Slot Patterns

#### Accordion/FAQ Item
```json
"content": "{@slot question}"
"content": "{@slot answer}"
```

#### Card Component
```json
"content": "{@slot header}"
"content": "{@slot body}"
"content": "{@slot footer}"
```

#### Feature Section
```json
"content": "{@slot media}"
"content": "{@slot content}"
"content": "{@slot cta}"
```

#### Layout Component
```json
"content": "{@slot main}"
"content": "{@slot sidebar}"
```

---

## 🚨 REAL-WORLD IMPLEMENTATION NOTES

### SVG Props - Common Pitfalls

**❌ AVOID: HTML Strings for SVG Props**
```json
// WRONG - This often fails in Etch WP
{
  "key": "iconSvg",
  "name": "Icon SVG",
  "type": {"primitive": "string"},
  "default": "<svg>...</svg>"
}
```

**✅ CORRECT Approaches:**

1. **Fixed SVG Structure with Color Prop:**
```json
{
  "key": "iconColor",
  "name": "Icon Color",
  "type": {"primitive": "string"},
  "default": "currentColor"
}
```

2. **Use `etch/element` for Complex SVGs:**
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "svg",
    "attributes": {
      "viewBox": "0 0 24 24",
      "xmlns": "http://www.w3.org/2000/svg"
    }
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "path",
        "attributes": {
          "d": "M12 2L2 7v10l10 5 10-5V7L12 2z"
        }
      }
    }
  ]
}
```

3. **Simple Icon Selection via Select Prop:**
```json
{
  "key": "iconType",
  "name": "Icon Type",
  "type": {"primitive": "string", "specialized": "select"},
  "selectOptionsString": "Football : football\nBasketball : basketball\nTennis : tennis",
  "default": "football"
}
```

### Boolean Prop Values in Component Usage

**❌ WRONG: Raw booleans**
```json
"attributes": {
  "showIcon": true,      // ❌ Fails
  "isVisible": false
}
```

**✅ CORRECT: String-wrapped booleans**
```json
"attributes": {
  "showIcon": "{true}",  // ✅ Works
  "isVisible": "{false}"
}
```

### Complex Style Attributes

**❌ AVOID: Props in style attributes or CSS files**
```json
"attributes": {
  "style": "background: linear-gradient(135deg, {props.colorFrom} 0%, {props.colorTo} 100%)"
}
```

**❌ AVOID: Props in CSS custom properties**
```json
"attributes": {
  "style": "--gradient-from: {props.colorFrom}; --gradient-to: {props.colorTo};"
}
```
This doesn't work because CSS cannot access prop values.

**✅ CORRECT: Use data attributes for variant-based styling**
```json
"attributes": {
  "class": "gradient-card",
  "data-gradient-style": "{props.gradientStyle}"
}
```

Then in CSS:
```json
"styles": {
  "desktop": ".gradient-card[data-gradient-style='blue' i] {\n    background: linear-gradient(135deg, #0066cc 0%, #004499 100%);\n  }\n  .gradient-card[data-gradient-style='sunset' i] {\n    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);\n  }\n  .gradient-card[data-gradient-style='forest' i] {\n    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);\n  }"
}
```

**Key Pattern:**
- Props control **which** variant to use (via data attributes)
- CSS defines **how** each variant looks
- Select props → choose variant → CSS matches on data attribute

### Conditional CSS Classes with Modifiers

Use comparison modifiers to apply CSS classes conditionally based on prop values.

**Basic Pattern:**
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "div",
    "attributes": {
      "class": "{product.price.greater(10, 'product--expensive', 'product--affordable')}"
    }
  }
}
```

**Usage in Loop:**
```json
{
  "blockName": "etch/loop",
  "attrs": {
    "loopId": "products",
    "itemId": "product"
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "div",
        "attributes": {
          "class": "{product.price.greater(10, 'product--expensive', 'product--affordable')} {product.stock.less(5, 'product--low-stock', 'product--in-stock')}"
        }
      },
      "innerBlocks": [
        {
          "blockName": "etch/text",
          "attrs": {
            "content": "{product.title}"
          }
        }
      ]
    }
  ]
}
```

**Common Use Cases:**

Price-based classes:
```json
"class": "{product.price.greater(100, 'product--premium', 'product--standard')}"
```

Stock status:
```json
"class": "{product.stock.less(10, 'product--limited', 'product--available')}"
```

Featured status:
```json
"class": "{product.featured.equal('true', 'product--featured', 'product--regular')}"
```

Role-based:
```json
"class": "{user.role.includes('administrator', 'admin--panel', 'user--panel')}"
```

Rating thresholds:
```json
"class": "{product.rating.greaterOrEqual(4, 'product--recommended', 'product--standard')}"
```

**Benefits:**
- No conditional logic blocks needed
- Cleaner template code
- Multiple classes in one attribute
- Type-safe comparisons with modifiers
- Easy to maintain

### Working Component Pattern

**Successful props for Sports Bento Card:**
```json
"properties": [
  {
    "key": "title",
    "name": "Sport Title",
    "type": {"primitive": "string"},
    "default": "Sport Name"
  },
  {
    "key": "tagline",
    "name": "Tagline",
    "type": {"primitive": "string"},
    "default": "Your sport tagline"
  },
  {
    "key": "bgImage",
    "name": "Background Image URL",
    "type": {"primitive": "string"},
    "default": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200"
  },
  {
    "key": "contactName",
    "name": "Contact Person Name",
    "type": {"primitive": "string"},
    "default": "Contact Name"
  },
  {
    "key": "contactEmail",
    "name": "Contact Email",
    "type": {"primitive": "string"},
    "default": "contact@example.com"
  }
]
```

**Props to AVOID (caused insertion failures):**
- `icon` (SVG HTML string)
- `gridArea` (complex CSS value)
- `gradientFrom`/`gradientTo`/`gradientStyle` (these should be select props mapped to data attributes, NOT used in inline styles)
- Complex `style` attributes with multiple props
- Any prop intended for use in CSS `url()` functions or dynamic values

### Troubleshooting Checklist

If your component fails to insert into Etch WP:

1. **Check for `core/html` blocks** - Replace with structured `etch/element`
2. **Avoid props in inline styles** - Use data attributes + CSS selectors instead
3. **Verify boolean prop format** - Must be `"{true}"` not `true`
4. **Fixed SVG structure** - Use `etch/element` not HTML string props
5. **Test with minimal props** - Start with simple text props, add complexity gradually

**Remember:** Etch WP prefers structured block elements over HTML strings, data attributes over props in CSS, and CSS classes over inline styles.
