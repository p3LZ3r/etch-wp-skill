# Etch WP Block Types Reference

## etch/element

Standard HTML element wrapper.

### Basic Structure
```json
{
  "blockName": "etch/element",
  "attrs": {
    "metadata": {"name": "Descriptive Name"},
    "tag": "HTML Tag",
    "attributes": {
      "data-etch-element": "HTML Tag",
      "class": "my-class"
    },
    "styles": ["etch-"whatever-element"-style", "reference-id-in-format->q2fy3v0"]
  },
  "innerBlocks": [],
  "innerHTML": "\n\n",
  "innerContent": ["\n", null, "\n"]
}
```

### Dynamic Tag Names

Use props to dynamically set the HTML tag:

```json
{
  "blockName": "etch/element",
  "attrs": {
    "metadata": {"name": "Dynamic Heading"},
    "tag": "{props.headingLevel}",
    "attributes": {
      "class": "heading"
    }
  },
  "innerBlocks": [
    {
      "blockName": "etch/text",
      "attrs": {
        "content": "{props.title}"
      }
    }
  ]
}
```

**Usage:**
```json
{
  "blockName": "etch/component",
  "attrs": {
    "ref": 123,
    "attributes": {
      "headingLevel": "h2",
      "title": "Section Title"
    }
  }
}
```

**Common Use Cases:**
- Headings with dynamic levels (h1-h6)
- Semantic elements based on context
- Component props controlling element type

### Common html tags without data-etch-element data attribute
- `div` - Generic containers
- `article` - Article/card wrappers
- `header` - Header elements
- `footer` - Footer elements
- `nav` - Navigation
- `ul`, `ol`, `li` - Lists
- `h1`, `h2`, `h3`, etc. - Headings
- `p` - Paragraphs
- `a` - Links
- `img` - Images

Also use other common html tags if it's semantically appropriate.

### Etch specific elements via data attribute > key data-etch-element with values ->
- `section` - Full-width sections auto sets styles for display: flex; flex-direction: column; align-items: center;
- `container` - Content containers auto sets styles for display: flex; flex-direction: column; width: 100%; max-width: var(--content-width); align-self: center;
- `iframe` - iFrames auto sets styles for inline-size: 100%; height: auto; aspect-ratio: 16/9;

### Image Element with options
```json
{
  "blockName": "etch/element",
  "attrs": {
    "metadata": {"name": "Media"},
    "options": {
      "imageData": {
        "attachmentId": 34,
        "size": ""
      }
    },
    "tag": "img",
    "attributes": {
      "src": "https://example.com/image.webp",
      "class": "image-class",
      "alt": "Image description"
    },
    "styles": ["image-style"]
  },
  "innerBlocks": [],
  "innerHTML": "\n\n",
  "innerContent": ["\n", "\n"]
}
```

## etch/component

Component instance reference.

### Structure
```json
{
  "blockName": "etch/component",
  "attrs": {
    "ref": 123,
    "attributes": {
      "propName": "Static Value",
      "dynamicProp": "{post.title}",
      "booleanProp": "{true}"
    }
  },
  "innerBlocks": [],
  "innerHTML": "\n\n",
  "innerContent": ["\n", "\n"]
}
```

### Key Points
- `ref` - Numeric ID matching component in `components` object
- `attributes` - Object with prop values
- Boolean values: Use `"{true}"` or `"{false}"` as strings
- Dynamic values: Use `{post.field}` or `{props.field}` syntax

## etch/text

Text content, often with dynamic props.

### Structure
```json
{
  "blockName": "etch/text",
  "attrs": {
    "metadata": {"name": "Text"},
    "content": "{props.propertyName}"
  },
  "innerBlocks": [],
  "innerHTML": "",
  "innerContent": []
}
```

### Usage Patterns
```json
// Static text
"content": "Hello World"

// Dynamic from props
"content": "{props.title}"

// Dynamic from post
"content": "{post.title}"

// Mixed
"content": "Posted by {post.author}"
```

## etch/condition

Conditional rendering logic.

### Data Source References

**CRITICAL:** Different data sources are available in conditions and content:

| Source | Syntax | Example |
|--------|--------|---------|
| Component props | `props.fieldName` | `props.showLede` |
| MetaBox fields | `this.metabox.field_name` | `{this.metabox.product_subtitle}` |
| Post data | `post.fieldName` | `{post.featuredImage.url}` |
| MetaBox group subfield | `this.metabox.group.subfield` | `{this.metabox.product_demographics.demo_sex}` |
| Loop item field | `item.fieldName` | `{proc.procedure_description}` |
| User data | `user.field` | `user.userRoles` |
| URL parameters | `url.parameter.name` | `url.parameter.budget` |

### Condition Format: Props vs Dynamic Data

**⚠️ IMPORTANT: The condition format differs based on data source.**

#### Component Props (isTruthy pattern)
For `props.*` references — use `isTruthy` operator, NO curly brackets on leftHand:
```json
{
  "blockName": "etch/condition",
  "attrs": {
    "metadata": {"name": "If (Condition)"},
    "condition": {
      "leftHand": "props.showElement",
      "operator": "isTruthy",
      "rightHand": null
    },
    "conditionString": "props.showElement"
  },
  "innerBlocks": [
    // Content shown when true
  ],
  "innerHTML": "\n\n",
  "innerContent": ["\n", null, "\n"]
}
```

#### Dynamic Data (MetaBox, Post, Loop items)
For `this.metabox.*`, `post.*`, and other dynamic references — use curly brackets on leftHand + `!== ""`:
```json
{
  "blockName": "etch/condition",
  "attrs": {
    "metadata": {"name": "If (Condition)"},
    "condition": {
      "leftHand": "{this.metabox.product_subtitle}",
      "operator": "!==",
      "rightHand": "\"\""
    },
    "conditionString": "{this.metabox.product_subtitle} !== \"\""
  },
  "innerBlocks": [
    // Content shown when field has value
  ],
  "innerHTML": "\n\n",
  "innerContent": ["\n", null, "\n"]
}
```

#### MetaBox Group Subfield Condition
```json
{
  "condition": {
    "leftHand": "{this.metabox.product_demographics.demo_sex}",
    "operator": "!==",
    "rightHand": "\"\""
  },
  "conditionString": "{this.metabox.product_demographics.demo_sex} !== \"\""
}
```

### Operators
- `isTruthy` - Check if truthy (use for `props.*`)
- `isFalsy` - Check if falsy
- `===` - Strict equality
- `!==` - Not equal (strict) — **use for dynamic data existence checks**
- `==` - Loose equality
- `!=` - Not equal (loose)
- `>` - Greater than
- `<` - Less than
- `>=` - Greater or equal
- `<=` - Less or equal
- `||` - OR (logical, for combining conditions)
- `&&` - AND (logical, for combining conditions)
- `!` - NOT
- `in` - Array membership check
- `contains` - String/array contains
- `matches` - Regex pattern match

### Complex Condition (OR) — Props
```json
{
  "condition": {
    "leftHand": {
      "leftHand": "props.showPrimary",
      "operator": "isTruthy",
      "rightHand": null
    },
    "operator": "||",
    "rightHand": {
      "leftHand": "props.showSecondary",
      "operator": "isTruthy",
      "rightHand": null
    }
  },
  "conditionString": "props.showPrimary || props.showSecondary"
}
```

### Complex Condition (OR) — Dynamic Data
```json
{
  "condition": {
    "leftHand": {
      "leftHand": "{this.metabox.product_video_url}",
      "operator": "!==",
      "rightHand": "\"\""
    },
    "operator": "||",
    "rightHand": {
      "leftHand": "{this.metabox.product_datasheet}",
      "operator": "!==",
      "rightHand": "\"\""
    }
  },
  "conditionString": "{this.metabox.product_video_url} !== \"\" || {this.metabox.product_datasheet} !== \"\""
}
```

### Complex Condition (AND)
```json
{
  "condition": {
    "leftHand": {
      "leftHand": "props.isPublished",
      "operator": "===",
      "rightHand": "true"
    },
    "operator": "&&",
    "rightHand": {
      "leftHand": "props.isFeatured",
      "operator": "===",
      "rightHand": "true"
    }
  },
  "conditionString": "props.isPublished === true && props.isFeatured === true"
}
```

## etch/svg

SVG icon/graphic element.

### Structure
```json
{
  "blockName": "etch/svg",
  "attrs": {
    "metadata": {"name": "Icon"},
    "tag": "svg",
    "attributes": {
      "aria-hidden": "true",
      "src": "{props.icon}",
      "class": "icon-class"
    },
    "styles": ["icon-style"]
  },
  "innerBlocks": [],
  "innerHTML": "\n\n",
  "innerContent": ["\n", "\n"]
}
```

### Key Points
- Use `aria-hidden="true"` for decorative icons
- `src` can be prop reference: `"{props.icon}"`
- Or static SVG path/URL

### Building SVGs with etch/element

**IMPORTANT:** For complex SVGs or when you need more control, build them using `etch/element` instead:

```json
{
  "blockName": "etch/element",
  "attrs": {
    "metadata": {"name": "Icon SVG"},
    "tag": "svg",
    "attributes": {
      "aria-hidden": "true",
      "xmlns": "http://www.w3.org/2000/svg",
      "width": "24",
      "height": "24",
      "viewBox": "0 0 24 24",
      "fill": "none",
      "class": "icon"
    },
    "styles": ["icon-style"]
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "path",
        "attributes": {
          "d": "M12 2L2 7v10l10 5 10-5V7L12 2z",
          "stroke": "currentColor",
          "stroke-width": "2",
          "fill": "none"
        }
      },
      "innerBlocks": [],
      "innerHTML": "\n\n",
      "innerContent": ["\n", "\n"]
    },
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "circle",
        "attributes": {
          "cx": "12",
          "cy": "12",
          "r": "3",
          "fill": "currentColor"
        }
      },
      "innerBlocks": [],
      "innerHTML": "\n\n",
      "innerContent": ["\n", "\n"]
    }
  ],
  "innerHTML": "\n\n\n\n",
  "innerContent": ["\n", null, "\n\n", null, "\n"]
}
```

**Why use etch/element for SVGs?**
- Full control over SVG structure
- Support for multiple paths, circles, polygons
- Better for complex icons
- More reliable than HTML string props

### ❌ AVOID: HTML String Props for SVGs

**Don't use `core/html` or HTML string props for dynamic SVGs:**

```json
// ❌ WRONG - Don't do this
{
  "blockName": "core/html",
  "attrs": {
    "content": "{props.iconSvg}"  // HTML string as prop
  }
}
```

**Why this fails:**
- `core/html` is not reliable for dynamic component content
- HTML strings as props can cause parsing/injection issues
- Etch WP expects structured block elements, not raw HTML

**✅ CORRECT - Use structured etch/element:**
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "svg",
    "attributes": {
      "viewBox": "0 0 24 24"
    }
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "path",
        "attributes": {
          "d": "..."
        }
      }
    }
  ]
}
```

## etch/dynamic-image

Dynamic image element for use with props. **This is the preferred method for images in components.**

### Basic Structure
```json
{
  "blockName": "etch/dynamic-image",
  "attrs": {
    "metadata": {"name": "Image"},
    "tag": "img",
    "attributes": {
      "class": "card__img",
      "src": "{props.imageUrl}",
      "alt": "{props.imageAlt}",
      "loading": "lazy"
    },
    "styles": ["a1b2c3d"]
  },
  "innerBlocks": [],
  "innerHTML": "\n\n",
  "innerContent": ["\n", "\n"]
}
```

### Key Points
- Use `etch/dynamic-image` instead of `etch/element` with `tag: "img"` when the image source comes from props
- Supports all standard `img` attributes: `src`, `alt`, `loading`, `width`, `height`, etc.
- Props syntax works for dynamic values: `{props.imageUrl}`, `{post.featured_image}`, etc.

### Image with Figure Wrapper (Recommended Pattern)

For semantic markup and styling flexibility, wrap `etch/dynamic-image` in a `figure` element:

```json
{
  "blockName": "etch/element",
  "attrs": {
    "metadata": {"name": "Figure"},
    "tag": "figure",
    "attributes": {
      "class": "card__figure"
    },
    "styles": ["f1g2h3i"]
  },
  "innerBlocks": [
    {
      "blockName": "etch/dynamic-image",
      "attrs": {
        "metadata": {"name": "Image"},
        "tag": "img",
        "attributes": {
          "class": "card__img",
          "src": "{props.imageUrl}",
          "alt": "{props.imageAlt}",
          "loading": "lazy"
        },
        "styles": ["j4k5l6m"]
      },
      "innerBlocks": [],
      "innerHTML": "\n\n",
      "innerContent": ["\n", "\n"]
    }
  ],
  "innerHTML": "\n\n",
  "innerContent": ["\n", null, "\n"]
}
```

### Component Properties for Images

When defining image props in a component, use the `specialized: "image"` type:

```json
{
  "properties": [
    {
      "key": "imageUrl",
      "name": "Image URL",
      "type": {
        "primitive": "string",
        "specialized": "image"
      }
    },
    {
      "key": "imageAlt",
      "name": "Image Alt Text",
      "type": {
        "primitive": "string"
      },
      "default": ""
    }
  ]
}
```

### Passing Image Props from Loops

When using components inside loops, pass post data to image props:

```json
{
  "blockName": "etch/component",
  "attrs": {
    "ref": 101,
    "attributes": {
      "imageUrl": "{post.featured_image}",
      "imageAlt": "{post.title}"
    }
  }
}
```

### Common Image Styles

```json
"img-style": {
  "type": "element",
  "selector": ".card__img",
  "collection": "default",
  "css": "inline-size: 100%;\nblock-size: 100%;\nobject-fit: cover;"
}
```

### Image with Hover Zoom Effect

```json
"figure-style": {
  "type": "element",
  "selector": ".card__figure",
  "collection": "default",
  "css": "overflow: hidden;\naspect-ratio: 16/9;"
},
"img-style": {
  "type": "element",
  "selector": ".card__img",
  "collection": "default",
  "css": "inline-size: 100%;\nblock-size: 100%;\nobject-fit: cover;\ntransition: transform 0.4s ease;"
},
"img-hover-style": {
  "type": "element",
  "selector": ".card:hover .card__img",
  "collection": "default",
  "css": "transform: scale(1.05);"
}
```

## etch/loop

Loop structure for dynamic content.

### Basic Loop
```json
{
  "blockName": "etch/loop",
  "attrs": {
    "metadata": {"name": "Posts Loop"},
    "loopType": "posts",
    "loopArgs": {
      "post_type": "post",
      "posts_per_page": 6
    }
  },
  "innerBlocks": [
    // Template for each item
  ],
  "innerHTML": "\n\n",
  "innerContent": ["\n", null, "\n"]
}
```

### Common Loop Types
- `posts` - WP_Query posts
- `terms` - Taxonomies/categories
- `users` - User queries
- `json` - JSON data
- `api` - External API data

## innerContent Patterns

### No inner blocks
```json
"innerContent": ["\n", "\n"]
```

### Single inner block
```json
"innerContent": ["\n", null, "\n"]
```

### Two inner blocks
```json
"innerContent": ["\n", null, "\n\n", null, "\n"]
```

### Three inner blocks
```json
"innerContent": ["\n", null, "\n\n", null, "\n\n", null, "\n"]
```

### Pattern
- Start with `"\n"`
- Add `null` for each block
- Add `"\n\n"` between blocks
- End with `"\n"`

## innerHTML Patterns

### No content
```json
"innerHTML": ""
```

### Has inner blocks
```json
"innerHTML": "\n\n"
```

### Multiple inner blocks
```json
"innerHTML": "\n\n\n\n"
```

Count: `\n` + `\n` * number_of_blocks

# CSS Formatting and BEM Naming Convention

## CSS Formatting

### Multi-line with proper spacing
```json
"css": "display: flex;\n  flex-direction: column;\n  gap: var(--space-m);\n  padding: var(--space-l);"
```

### Common Patterns with ACSS Variables

#### Flexbox
```json
"css": "display: flex;\n  flex-direction: column;\n  gap: var(--content-gap);"
```

#### Grid
```json
"css": "display: grid;\n  grid-template-columns: var(--grid-auto-3);\n  gap: var(--grid-gap);"
```

#### Container with Max Width
```json
"css": "max-width: var(--content-width);\n  margin-inline: auto;\n  padding-inline: var(--gutter);"
```

## BEM Naming Convention

Etch follows BEM (Block Element Modifier) methodology:

### Block
```json
"selector": ".feature-card"
```

### Element
```json
"selector": ".feature-card__heading",
"selector": ".feature-card__description",
"selector": ".feature-card__icon"
```

### Modifier
```json
"selector": ".feature-card--large",
"selector": ".feature-card__heading--primary"
```

## Linking Styles to Elements

In `attrs.styles` array, reference style IDs:

```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "div",
    "attributes": {
      "class": "feature-card"
    },
    "styles": ["feature-card"]
  }
}
```

Order matters:
1. System styles first (`etch-*-style`)
2. Custom styles second

## Modern CSS Features

Etch supports modern CSS:

### Logical Properties
```json
"css": "inline-size: 100%;\n  block-size: 100%;\n  padding-inline: 1em;\n  padding-block: 2em;"
```

### Container Queries
```json
"css": "container-type: inline-size;\n  @container (width >= 768px) {\n    grid-template-columns: repeat(2, 1fr);\n  }"
```

**Container Query Syntax:**
- Use comparison operators: `>`, `<`, `>=`, `<=`, `=`
- Size features: `width`, `height`, `inline-size`, `block-size`
- Example: `@container (width >= 400px)` NOT `@container (min-width: 400px)`

### Nesting
```json
"css": "display: flex;\n  > * {\n    flex: 1;\n  }\n  &:hover {\n    opacity: 0.8;\n  }"
```

### Custom Functions
```json
"css": "@media (width >= to-rem(768px)) {\n    font-size: 2rem;\n  }"
```

# Valid Etch WP Elements Reference

This section consolidates valid elements and data attributes from etch-elements.md. **Never invent elements not listed here.**

## Core Element Types

### etch/element

Standard HTML element wrapper. The `tag` attribute specifies the HTML element.

#### Container Elements with data-etch-element

These require both `data-etch-element` attribute AND corresponding system style:

**Section Container:**
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "section",
    "attributes": {
      "data-etch-element": "section"
    },
    "styles": ["etch-section-style"]
  }
}
```

**Content Container:**
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "div",
    "attributes": {
      "data-etch-element": "container"
    },
    "styles": ["etch-container-style"]
  }
}
```

**Iframe:**
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "iframe",
    "attributes": {
      "data-etch-element": "iframe",
      "src": "",
      "title": ""
    },
    "styles": ["etch-iframe-style"]
  }
}
```

#### Valid data-etch-element Values

⚠️ **CRITICAL: ONLY 3 VALUES EXIST IN ETCH WP**

ONLY these values are allowed:
- `section` - Full-width sections (requires `etch-section-style`)
- `container` - Content containers (requires `etch-container-style`)
- `iframe` - iFrames (requires `etch-iframe-style`)

**❌ ABSOLUTELY FORBIDDEN - Do NOT invent:**
- ❌ `flex-div` - DEPRECATED, no longer valid
- ❌ `grid` - DOES NOT EXIST
- ❌ `wrapper` - DOES NOT EXIST
- ❌ `group` - DOES NOT EXIST
- ❌ `block` - DOES NOT EXIST
- ❌ `card` - DOES NOT EXIST
- ❌ `heading` - Normal h1-h6 don't use data-etch-element
- ❌ `button` - Normal buttons don't use data-etch-element
- ❌ ANY other value you might think of

**✅ REMEMBER:**
- 99% of HTML elements DO NOT use `data-etch-element`
- Only use for the 3 special Etch containers above
- If uncertain → Check Context7 MCP for Etch WP docs

#### Standard HTML Elements (without data-etch-element)

Use `etch/element` with standard HTML tags for content:

**Text Elements:**
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings
- `p` - Paragraphs
- `span` - Inline text

**Structure:**
- `div` - Generic containers (without data-etch-element)
- `article` - Article wrappers
- `header` - Headers
- `footer` - Footers
- `nav` - Navigation
- `main` - Main content
- `aside` - Sidebars

**Lists:**
- `ul` - Unordered lists
- `ol` - Ordered lists
- `li` - List items

**Links & Media:**
- `a` - Links (requires `href` attribute)
- `img` - Images (requires `src` attribute)

## System Styles (readonly: true)

These must be included when using corresponding data-etch-element:

### etch-section-style
```json
"etch-section-style": {
  "type": "element",
  "selector": ":where([data-etch-element=\"section\"])",
  "collection": "default",
  "css": "inline-size: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;",
  "readonly": true
}
```

### etch-container-style
```json
"etch-container-style": {
  "type": "element",
  "selector": ":where([data-etch-element=\"container\"])",
  "collection": "default",
  "css": "inline-size: 100%;\n  display: flex;\n  flex-direction: column;\n  max-width: var(--content-width);\n  align-self: center;",
  "readonly": true
}
```

### etch-iframe-style
```json
"etch-iframe-style": {
  "type": "element",
  "selector": ":where([data-etch-element=\"iframe\"])",
  "collection": "default",
  "css": "inline-size: 100%;\n  height: auto;\n  aspect-ratio: 16/9;",
  "readonly": true
}
```

## Common Patterns

### Section with Container
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "section",
    "attributes": {
      "data-etch-element": "section",
      "class": "my-section"
    },
    "styles": ["etch-section-style", "my-section-style"]
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "div",
        "attributes": {
          "data-etch-element": "container"
        },
        "styles": ["etch-container-style"]
      },
      "innerBlocks": [
        // Content here
      ]
    }
  ]
}
```

### Heading with Text
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "h2",
    "attributes": {
      "class": "section__heading"
    }
  },
  "innerBlocks": [
    {
      "blockName": "etch/text",
      "attrs": {
        "content": "My Heading"
      }
    }
  ]
}
```

### Image Element
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "img",
    "attributes": {
      "src": "https://example.com/image.jpg",
      "alt": "Description",
      "class": "responsive-image"
    },
    "options": {
      "imageData": {
        "attachmentId": 34,
        "size": ""
      }
    }
  }
}
```

### Link Element
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "a",
    "attributes": {
      "href": "{props.url}",
      "class": "link"
    }
  },
  "innerBlocks": [
    {
      "blockName": "etch/text",
      "attrs": {
        "content": "Click Here"
      }
    }
  ]
}
```

## Critical Rules

1. **Only use elements listed in this document**
2. **data-etch-element values**: Only `section`, `container`, `iframe`
3. **Include system styles**: Always add corresponding `etch-*-style` when using data-etch-element
4. **Standard HTML**: Use regular HTML tags without data-etch-element for content elements
5. **Never invent**: Don't create custom data-etch-element values like `grid`, `wrapper`, `flex-div`, etc.

## Invalid Examples (Do NOT Use)

⚠️ **COMMON MISTAKES TO AVOID:**

### ❌ MISTAKE 1: Invented data-etch-element values
```json
"attributes": {
  "data-etch-element": "grid"  // INVALID - doesn't exist
}
```
```json
"attributes": {
  "data-etch-element": "wrapper"  // INVALID - doesn't exist
}
```
```json
"attributes": {
  "data-etch-element": "card"  // INVALID - doesn't exist
}
```

### ❌ MISTAKE 2: Using data-etch-element on normal HTML elements
```json
{
  "tag": "h2",
  "attributes": {
    "data-etch-element": "heading"  // INVALID - normal headings don't use this
  }
}
```
```json
{
  "tag": "button",
  "attributes": {
    "data-etch-element": "button"  // INVALID - normal buttons don't use this
  }
}
```
```json
{
  "tag": "div",
  "attributes": {
    "data-etch-element": "div"  // INVALID - normal divs don't use this
  }
}
```

### ❌ MISTAKE 3: Missing system style
```json
{
  "attributes": {
    "data-etch-element": "section"
  },
  "styles": []  // INVALID - missing etch-section-style
}
```

### ❌ MISTAKE 4: Wrong system style
```json
{
  "attributes": {
    "data-etch-element": "container"
  },
  "styles": ["etch-flex-div-style"]  // INVALID - wrong system style
}
```

## Valid Examples (Correct Usage)

✅ Section with proper style:
```json
{
  "tag": "section",
  "attributes": {
    "data-etch-element": "section"
  },
  "styles": ["etch-section-style", "custom-style"]
}
```

✅ Standard div without data-etch-element:
```json
{
  "tag": "div",
  "attributes": {
    "class": "card"
  },
  "styles": ["card-style"]
}
```

✅ Container with proper style:
```json
{
  "tag": "div",
  "attributes": {
    "data-etch-element": "container"
  },
  "styles": ["etch-container-style"]
}
```
