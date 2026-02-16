# Etch WP Skill Reference Files

This directory contains reference documentation for the Etch WP skill.

## Reference Files

| File | Purpose |
|------|---------|
| `acss-variables.md` | ACSS v4 variable reference (colors, spacing, typography) |
| `api-endpoints.md` | REST API endpoints for components, patterns, styles |
| `property-structure.md` | ⭐ Component property format reference (NEW) |
| `block-types.md` | All Etch WP block types and valid elements |
| `loops.md` | Loop implementations and nested loops |
| `official-patterns.md` | Official patterns library guide |
| `native-components.md` | Native component documentation |
| `data-modifiers.md` | Data modifier syntax and examples |
| `css-architecture-rules.md` | CSS architecture and component structure |
| `props-system.md` | Props vs Slots system |
| `responsive-design.md` | Container queries and responsive patterns |
| `examples/` | Working JSON examples |

## Quick Reference

### Creating Components via API

```bash
# 1. Create component
curl -X POST \
  -H "Content-Type: application/json" \
  -u "USER:PASS" \
  -d @component.json \
  "https://site.com/wp-json/etch-api/components"

# 2. Get returned ID
{
  "id": 1652,
  "name": "Component Name",
  "key": "ComponentKey"
}

# 3. Use in layouts
{
  "blockName": "etch/component",
  "attrs": {
    "ref": 1652,
    "attributes": {...}
  }
}
```

### Property Structure

```json
{
  "key": "propertyName",
  "name": "Property Name",
  "type": {"primitive": "string"},
  "default": "default value"
}
```

See `property-structure.md` for complete reference.

### ACSS Variables

- **Colors**: `var(--bg-light)`, `var(--text-dark)`, `var(--heading-color)`
- **Spacing**: `var(--space-m)`, `var(--space-l)`, `var(--section-space-l)`
- **Typography**: `var(--h1)`, `var(--h2)`, `var(--text-base)`

See `acss-variables.md` for complete reference.
