# Etch WP Component Property Reference

## Property Structure (Correct Format)

### String Property
```json
{
  "key": "propertyName",
  "name": "Property Name",
  "type": {
    "primitive": "string"
  },
  "default": "Default Value"
}
```

### Boolean Property
```json
{
  "key": "isEnabled",
  "name": "Is Enabled",
  "type": {
    "primitive": "boolean"
  },
  "default": true
}
```

### Select Property
```json
{
  "key": "style",
  "name": "Style",
  "type": {
    "primitive": "string",
    "specialized": "select"
  },
  "default": "option1",
  "selectOptionsString": "Option 1 Label : option1\nOption 2 Label : option2"
}
```

## Key Differences from What We Initially Used

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| `"id": "text"` | `"key": "text"` |
| `"label": "Button Text"` | `"name": "Button Text"` |
| `"type": "text"` | `"type": {"primitive": "string"}` |
| `"type": "select"` with `"options": [...]` | `"type": {"primitive": "string", "specialized": "select"}` + `"selectOptionsString"` |
| `"default": "primary"` with raw list | `"default": "value"` + `"selectOptionsString": "Label : value"` |

## Select Options Format

The `selectOptionsString` uses this format:
```
Display Label : value\n
Another Label : anotherValue
```

Example:
```
"selectOptionsString": "Primary : primary\nSecondary : secondary\nTertiary : tertiary"
```

## Auto-Generated Fields

These fields are automatically added by Etch WP and don't need to be included in the API request:
- `keyTouched` - Boolean flag, probably for tracking if key was manually edited
- Component `id` - Auto-generated on creation

## Complete Example: Button Component

```json
{
  "name": "PH Link Button",
  "key": "PhLinkButton",
  "description": "Simple link button with configurable text, URL, and style",
  "properties": [
    {
      "key": "text",
      "name": "Button Text",
      "type": {
        "primitive": "string"
      },
      "default": "Click Here"
    },
    {
      "key": "link",
      "name": "Button Link",
      "type": {
        "primitive": "string"
      },
      "default": "#"
    },
    {
      "key": "style",
      "name": "Button Style",
      "type": {
        "primitive": "string",
        "specialized": "select"
      },
      "default": "primary",
      "selectOptionsString": "Primary : primary\nSecondary : secondary\nTertiary : tertiary"
    }
  ],
  "blocks": [...]
}
```

## Working Component Examples

- Component 1113 (PH Badge) - String properties
- Component 1491 (PH Contact) - Boolean + Select properties
- Component 1615 (Contact Form) - Multiple string properties
- Component 1652 (PH Link Button) - String + Select properties

## API Methods

- **Create**: `POST /wp-json/etch-api/components`
- **Update**: `PUT /wp-json/etch-api/components/{id}`
- **Delete**: `DELETE /wp-json/etch-api/components/{id}`
- **Read**: `GET /wp-json/etch-api/components/{id}`
- **List**: `GET /wp-json/etch-api/components`
