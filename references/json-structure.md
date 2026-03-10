# Etch WP JSON Structure Reference

## Complete Structure Overview

```json
{
  "type": "block",
  "gutenbergBlock": {
    "blockName": "etch/element",
    "attrs": {
      "metadata": {"name": "Card"},
      "tag": "div",
      "attributes": {
        "class": "card"
      },
      "styles": ["random-7-digit-style-id"]
    },
    "innerBlocks": [
      {
        "blockName": "etch/element",
        "attrs": {
          "metadata": { "name": "Heading" },
          "tag": "h2",
          "attributes": { "class": "heading" },
          "styles": ["another-random-7-digit-style-id"]
        }
      }
    ],
    "innerHTML": "\n\n",
    "innerContent": ["\n", null, "\n"]
  },
  "styles": {
    "random-7-digit-style-id": {
      "type": "class",
      "selector": ".card",
      "collection": "default",
      "css": "background: var(--bg-light);\n  padding: var(--space-l);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow-m);\n  display: flex;\n  flex-direction: column;\n  gap: var(--content-gap);",
      "readonly": false
    },
    "another-random-7-digit-style-id": {
      "type": "class",
      "selector": ".heading",
      "collection": "default",
      "css": "font-size: var(--h1);",
      "readonly": false
    }
  },
  "components": {}
}
```

## Root Level Fields

### type
Always `"block"` for Etch elements

### gutenbergBlock
Main content structure - contains the actual element/component

### styles
Object containing all CSS class definitions referenced in the structure. Stored in WordPress options (`etch_styles`).

### components
Object containing all component definitions referenced by `ref` in etch/component blocks

## Block Types

### Block Name → PHP Class Mapping

| Block Name | PHP Class | Purpose |
|------------|-----------|---------|
| `etch/element` | ElementBlock | Standard HTML elements (div, section, etc.) |
| `etch/text` | TextBlock | Text content with dynamic replacement |
| `etch/dynamic-image` | DynamicImageBlock | WordPress media images with mediaId |
| `etch/component` | ComponentBlock | Reusable component references |
| `etch/condition` | ConditionBlock | Conditional rendering |
| `etch/loop` | LoopBlock | Loop/repeat content |
| `etch/svg` | SvgBlock | SVG icons |
| `etch/slot` | SlotContentBlock | Component slots (content insertion) |
| `etch/slot-placeholder` | SlotPlaceholderBlock | Slot placeholders in components |
| `etch/raw-html` | RawHtmlBlock | Raw HTML output |
| `etch/dynamic-element` | DynamicElementBlock | Dynamic element variations |

## Block Attributes (attrs)

Block attributes object containing:

### metadata
```json
"metadata": {"name": "Descriptive Name"}
```
Used for identification in Etch editor structure panel

### tag
HTML tag name (for etch/element):
```json
"tag": "div" | "section" | "article" | "header" | "footer" | etc.
```

### attributes
HTML attributes object:
```json
"attributes": {
  "data-etch-element": "container" | "section" | "iframe",
  "class": "class-name",
  "id": "element-id",
  "href": "{props.url}",
  "aria-label": "Label text"
}
```

### data-etch-element Values

**⚠️ ONLY 3 values exist:**

| Value | Use For | Required Style |
|-------|---------|----------------|
| `section` | Full-width sections | `etch-section-style` |
| `container` | Content containers | `etch-container-style` |
| `iframe` | iFrames | `etch-iframe-style` |

### styles
Array of style IDs referencing the styles object via their unique 7-character IDs:
```json
"styles": ["pzfpn8v"]
```

### options
Additional configuration (for images, etc.):
```json
"options": {
  "imageData": {
    "attachmentId": 34,
    "size": "full"
  }
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `origin` | string | Must be `"etch"` (or `"gutenberg"` for legacy) |
| `name` | string | Display name in Etch editor |
| `type` | string | Block type: `html`, `loop`, `component`, `condition`, `slot`, `slot-placeholder` |
| `tag` | string | HTML tag (default: `"div"`) |
| `attributes` | object | HTML attributes as key-value strings |
| `styles` | string[] | Array of 7-character style IDs |
| `hidden` | boolean | Whether block is hidden |
| `removeWrapper` | boolean | Remove wrapper element |
| `block` | object | Block definition with `type`, `tag`, `specialized` |
| `script` | object | JavaScript with `id` and base64 `code` |
| `misc` | object | Miscellaneous data |
| `nestedData` | object | Nested EtchData objects |
| `loop` | object | Loop configuration |
| `component` | integer | Component post ID |
| `condition` | object | Condition with `leftHand`, `operator`, `rightHand` |
| `slot` | string | Slot name for slot/placeholder blocks |

## Nested Content Structure

### innerBlocks
Array of nested blocks - each block has same structure

### innerHTML
Static HTML string representation (usually `"\n\n"` for containers)

### innerContent
Array mixing strings and nulls:
- Strings: Static text/HTML
- `null`: Placeholder for innerBlocks
- Pattern: `["\n", null, "\n", null, "\n"]` for multiple blocks

#### innerContent Patterns

**Single inner block:**
```json
"innerContent": ["\n", null, "\n"]
```

**Multiple inner blocks:**
```json
"innerContent": ["\n", null, "\n\n", null, "\n\n", null, "\n"]
```

**No inner blocks:**
```json
"innerContent": ["\n", "\n"]
```

**With text:**
```json
"innerContent": ["Text here ", null, " more text"]
```

## Styles System

### Style Object Format

```json
"styles": {
  "pzfpn8v": {
    "type": "class",
    "selector": ".class-name",
    "collection": "default",
    "css": "display: flex;\n  gap: 1em;",
    "readonly": false
  }
}
```

Styles are stored in WordPress options (`etch_styles`) with this structure:

```json
{
  "style-id-123": {
    "type": "class",
    "selector": ".class-name",
    "collection": "default|custom",
    "css": "property: value;",
    "readonly": false|true
  }
}
```

### Style Fields

- **type**: `"class"` | `"element"`
- **selector**: CSS selector string
- **collection**: `"default"` for built-in/plugin styles, or custom collection name
- **css**: CSS rules as multi-line string
- **readonly**: `true` for system styles (auto-update), `false` for user-customizable

### Style Collections

- `collection: "default"` - Built-in and plugin styles
- Custom collections can be created for organization

## Components

### Components Object Format

```json
"components": {
  "123": {
    "id": 123,
    "name": "Component Name",
    "key": "ComponentKey",
    "blocks": [
      {
        "blockName": "etch/element",
        "attrs": {},
        "innerBlocks": []
      }
    ],
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
```

### Component Fields

- **id**: Numeric ID (referenced by etch/component `ref`)
- **name**: Display name
- **key**: PascalCase key
- **blocks**: Array of block structures (component content)
- **properties**: Array of prop definitions
- **description**: Optional description
- **legacyId**: Usually empty string

### Component Reference Structure

```json
{
  "blockName": "etch/component",
  "attrs": {
    "ref": 123,
    "attributes": {
      "propName": "value",
      "dynamicProp": "{post.title}",
      "booleanProp": "{true}"
    }
  },
  "innerBlocks": [],
  "innerHTML": "\n\n",
  "innerContent": ["\n", "\n"]
}
```

## Property Types

### String
```json
{
  "key": "title",
  "name": "Title",
  "type": {"primitive": "string"},
  "default": "Default Title"
}
```

### Boolean
```json
{
  "key": "showIcon",
  "name": "Show Icon",
  "type": {"primitive": "boolean"},
  "default": true
}
```

### Select
```json
{
  "key": "style",
  "name": "Style",
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
  "type": {
    "primitive": "string",
    "specialized": "image"
  }
}
```

### Number
```json
{
  "key": "count",
  "name": "Count",
  "type": {"primitive": "number"},
  "default": 0
}
```

## Props and Dynamic Data

### Using Props in Content

Props are referenced using curly braces:
```json
{
  "blockName": "etch/text",
  "attrs": {
    "content": "{props.title}"
  }
}
```

Or in attributes:
```json
{
  "attributes": {
    "href": "{props.url}",
    "class": "link {props.additionalClass}"
  }
}
```

### Data Source References

| Source | Syntax | Curly brackets in condition? |
|--------|--------|------------------------------|
| Component props | `props.fieldName` | No |
| MetaBox fields | `this.metabox.field_name` | Yes: `{this.metabox.field_name}` |
| MetaBox group subfield | `this.metabox.group.subfield` | Yes |
| Post data | `post.fieldName` | Yes: `{post.featuredImage.url}` |
| Loop item | `item.fieldName` | Yes |
| User data | `user.field` | Depends on context |

## Conditional Logic

### Component Props Condition

```json
{
  "blockName": "etch/condition",
  "attrs": {
    "metadata": { "name": "If (Show Button)" },
    "condition": {
      "leftHand": "props.showButton",
      "operator": "isTruthy",
      "rightHand": null
    },
    "conditionString": "props.showButton"
  },
  "innerBlocks": [
    // Content shown when condition is true
  ]
}
```

### Dynamic Data Condition

For `this.metabox.*`, `post.*`, loop items — wrap leftHand in `{}` and use `!== ""`:

```json
{
  "blockName": "etch/condition",
  "attrs": {
    "metadata": {"name": "If (Condition)"},
    "condition": {
      "leftHand": "this.metabox.field_name",
      "operator": "!==",
      "rightHand": "\"\""
    },
    "conditionString": "this.metabox.field_name !== \"\""
  },
  "innerBlocks": [
    // Content shown when field has value
  ]
}
```

### Condition Operators

| Operator | Description | Right Hand Required |
|----------|-------------|---------------------|
| `==` | Loose equality | Yes |
| `===` | Strict equality | Yes |
| `!=` | Loose inequality | Yes |
| `!==` | Strict inequality | Yes |
| `<` | Less than | Yes |
| `>` | Greater than | Yes |
| `<=` | Less than or equal | Yes |
| `>=` | Greater than or equal | Yes |
| `\|\|` | Logical OR | Yes |
| `&&` | Logical AND | Yes |
| `isTruthy` | Truthy check | No |
| `isFalsy` | Falsy check | No |

### Complex Conditions (OR)

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

### Condition Evaluation Details

#### Truthiness Rules

- Empty values (`empty()` in PHP) are **falsy**
- String `"false"` (case-insensitive) is explicitly **falsy**
- Everything else follows PHP's truthiness rules

#### Operator Encoding

Operators can be Unicode-encoded in condition strings:
- `u0026u0026` → `&&`
- `u007cu007c` → `||`
- `u003e` → `>`
- `u003c` → `<`
- `u003d` → `=`
- `u0021` → `!`

#### Value Decoding

Values are automatically decoded:
- `u0022` (Unicode quote) is removed
- `&#8217;` (WordPress apostrophe) is normalized to `'`

## Loops

### Loop Configuration

```json
{
  "target": "loop-target-field",
  "itemId": "item",
  "indexId": "index",
  "loopParams": {},
  "version": 2
}
```

### Loop Fields

| Field | Description |
|-------|-------------|
| `target` | The data source to loop over |
| `itemId` | Variable name for each item (default: `"item"`) |
| `indexId` | Variable name for index (default: `"index"`) |
| `loopParams` | Additional loop parameters |
| `version` | Loop format version (usually 2) |

## Dynamic Images

### etch/dynamic-image Block

| Feature | Description |
|---------|-------------|
| **Default placeholder** | Uses `https://placehold.co/1920x1080` if no image |
| **mediaId** | Resolves WordPress attachment metadata |
| **useSrcSet** | Boolean for responsive images (string values: `"true"`, `"1"`, `"yes"`, `"on"`) |
| **maximumSize** | Image size to use (default: `"full"`) |
| **Fallback** | Returns `<img/>` if attachment not found |

## Slots

### Slot System Architecture

The slot system involves three components:

1. **etch/slot (SlotContentBlock)** - Used in component instances to provide content
2. **etch/slot-placeholder (SlotPlaceholderBlock)** - Used in component definitions to mark insertion point
3. **ComponentSlotContextProvider** - Manages slot context during rendering

### Slot Rendering Behavior

- Slot content uses **parent context** (not component context) to avoid props leakage
- Recursion guard prevents infinite slot rendering
- Dynamic content entries are preserved and restored after slot rendering
- Empty slot content renders nothing (no placeholder)

## JavaScript

### JavaScript Handling

Scripts in Etch WP are:
1. Stored as **Base64-encoded** JavaScript
2. Registered during block processing
3. Output in `wp_head` as `<script type="module" defer>`
4. Deduplicated based on content hash

**Important:** JavaScript code must be Base64 encoded (no line breaks) when stored in JSON.

## Important Implementation Details

1. **Component Properties:** Properties with `{props.xxx}` in their default value return empty string to prevent infinite loops.

2. **Slot Content Context:** Slot content uses parent context (from before component processing), not component context.

3. **Array Property Resolution:** Array properties can reference:
   - Global loop presets by key
   - Context expressions
   - JSON-encoded strings
   - Comma-separated values

4. **Style IDs:** Style IDs are 7-character alphanumeric strings stored in `etchData.styles` array.

5. **Dynamic Images:** Must use `etch/dynamic-image` block type with `mediaId` attribute, never `etch/element` with `tag: "img"`.

6. **Text Content:** All text must use `etch/text` blocks with `{props.propertyName}` or `{this.field}` syntax. Never put raw text in `innerHTML`.

7. **Inner Content:** The `innerContent` array uses `null` placeholders for child blocks. One `null` per child in `innerBlocks`.

## Best Practices

1. **Always include metadata.name** - For editor clarity
2. **Use semantic tags** - article, section, header, nav, etc.
3. **Unique random style IDs** - Use unique IDs like pzfpn8v
4. **Proper innerContent** - Match innerBlocks count
5. **Type-safe props** - Use correct primitive types
6. **Descriptive names** - Clear component and prop names
