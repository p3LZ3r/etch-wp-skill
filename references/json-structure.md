# Etch WP JSON Structure Reference

## Complete Structure Overview

```json
{
  "type": "block",
  "gutenbergBlock": {
    "blockName": "etch/element",
    "attrs": {
      "metadata": {"name": "Element Name"},
      "tag": "section",
      "attributes": {
        "data-etch-element": "section",
        "class": "my-section"
      },
      "styles": ["etch-section-style", "custom-style-id"],
      "options": {}
    },
    "innerBlocks": [],
    "innerHTML": "\n\n",
    "innerContent": ["\n", null, "\n"]
  },
  "version": 2,
  "styles": {},
  "components": {}
}
```

## Root Level Fields

### type
Always `"block"` for Etch elements

### gutenbergBlock
Main content structure - contains the actual element/component

### version
Always `2` for current Etch format

### styles
Object containing all CSS class definitions referenced in the structure

### components
Object containing all component definitions referenced by `ref` in etch/component blocks

## gutenbergBlock Structure

### blockName
Specifies the type of block:
- `etch/element` - HTML elements
- `etch/component` - Component instances
- `etch/text` - Text content
- `etch/condition` - Conditional logic
- `etch/svg` - SVG elements
- `etch/loop` - Loop structures

### attrs
Block attributes object containing:

#### metadata
```json
"metadata": {"name": "Descriptive Name"}
```
Used for identification in Etch editor structure panel

#### tag
HTML tag name (for etch/element):
```json
"tag": "div" | "section" | "article" | "header" | "footer" | etc.
```

#### attributes
HTML attributes object:
```json
"attributes": {
  "data-etch-element": "container" | "flex-div" | "section",
  "class": "class-name",
  "id": "element-id",
  "href": "{props.url}",
  "aria-label": "Label text"
}
```

#### styles
Array of style IDs referencing the styles object:
```json
"styles": ["etch-section-style", "pzfpn8v"]
```

#### options
Additional configuration (for images, etc.):
```json
"options": {
  "imageData": {
    "attachmentId": 34,
    "size": ""
  }
}
```

### innerBlocks
Array of nested blocks - each block has same structure

### innerHTML
Static HTML string representation (usually `"\n\n"` for containers)

### innerContent
Array mixing strings and nulls:
- Strings: Static text/HTML
- `null`: Placeholder for innerBlocks
- Pattern: `["\n", null, "\n", null, "\n"]` for multiple blocks

## innerContent Patterns

### Single inner block:
```json
"innerContent": ["\n", null, "\n"]
```

### Multiple inner blocks:
```json
"innerContent": ["\n", null, "\n\n", null, "\n\n", null, "\n"]
```

### No inner blocks:
```json
"innerContent": ["\n", "\n"]
```

### With text:
```json
"innerContent": ["Text here ", null, " more text"]
```

## Styles Object Format

```json
"styles": {
  "style-id": {
    "type": "class",
    "selector": ".class-name",
    "collection": "default",
    "css": "display: flex;\n  gap: 1em;",
    "readonly": false
  },
  "etch-section-style": {
    "type": "element",
    "selector": ":where([data-etch-element=\"section\"])",
    "collection": "default",
    "css": "inline-size: 100%;\n  display: flex;",
    "readonly": true
  }
}
```

### Style Fields

- **type**: "class" | "element"
- **selector**: CSS selector string
- **collection**: Usually "default"
- **css**: CSS rules as multi-line string
- **readonly**: true for system styles, false for custom

## Components Object Format

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

- **id**: Numeric ID (referenced by etch/component ref)
- **name**: Display name
- **key**: PascalCase key
- **blocks**: Array of block structures (component content)
- **properties**: Array of prop definitions
- **description**: Optional description
- **legacyId**: Usually empty string

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

## Using Props in Content

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

## Conditional Logic Structure

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
    // Content shown when condition is true
  ]
}
```

### Condition Operators

- `isTruthy` - Check if value is truthy
- `===` - Strict equality
- `!==` - Not equal
- `>` - Greater than
- `<` - Less than
- `||` - OR
- `&&` - AND

### Complex Conditions

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

## Component Reference Structure

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

## data-etch-element Values

Common values for `data-etch-element`:
- `section` - Section containers
- `container` - Generic containers
- `flex-div` - Flex containers
- `grid` - Grid containers

## Best Practices

1. **Always include metadata.name** - For editor clarity
2. **Use semantic tags** - article, section, header, nav, etc.
3. **Consistent style IDs** - Use readable, unique IDs
4. **Proper innerContent** - Match innerBlocks count
5. **Complete components object** - Include all referenced components
6. **Type-safe props** - Use correct primitive types
7. **Descriptive names** - Clear component and prop names
