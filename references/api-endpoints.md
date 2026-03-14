# Etch WP REST API Endpoints (Discovery-Only Guide)

Base namespace: `/wp-json/etch-api`

**IMPORTANT:** This API is for **discovery and reuse only**. It does NOT support creating complete components with styles. Use the **paste format** for creating new components or sections.

---

## Authentication

All Etch API endpoints require WordPress authentication:

- `GET`: `edit_posts`

Credentials are configured during project init (`node scripts/init-project.js` → Q10) and stored in `.etch-project.json` under `api`:

- **`application-password`** → Basic Auth: `curl -u "username:app-password" "https://site.com/wp-json/etch-api/..."`

---

## Components API (`/components`) — GET ONLY

Use these endpoints to discover existing components for reuse.

### GET /components
Returns all components with full details (without styles).

**Response:**
```json
[
  {
    "id": 123,
    "name": "Feature Card",
    "key": "FeatureCard",
    "blocks": [...],
    "properties": [...],
    "description": "A reusable card component",
    "legacyId": ""
  }
]
```

### GET /components/list
Returns lightweight list (id, key, name, legacyId only) for quick lookup.

### GET /components/{id}
Returns single component by ID.

**Note:** Styles are NOT included in component responses. Style IDs in `attrs.styles` reference styles that must be managed separately.

---

## Patterns API (`/patterns`) — GET ONLY

### GET /patterns
Returns all patterns (synced and unsynced wp_block posts).

### GET /patterns/{id}
Returns single pattern.

---

## Styles API (`/styles`) — GET ONLY

### GET /styles
Returns all Etch styles as an object keyed by style ID.

**Response:**
```json
{
  "abc123d": {
    "type": "class",
    "selector": ".my-class",
    "collection": "default",
    "css": "padding: var(--space-m);",
    "readonly": false
  }
}
```

---

## Discovery Endpoints

### Loops (`/loops`)
- `GET /loops` — All saved loop definitions

### Queries (`/queries`)
- `GET /queries` — All saved queries

### CMS/Field Groups (`/cms`)
- `GET /cms/field-groups` — All field groups
- `GET /cms/field-group/{id}` — Field group by ID

### Post Types (`/post-types`)
- `GET /post-types` — All post types
- `GET /post-types/{name}` — Specific post type

### Taxonomies (`/taxonomies`)
- `GET /taxonomies` — All taxonomies
- `GET /taxonomies/{id}` — Specific taxonomy

---

## Reuse-First Workflow

**See:** `references/resource-reuse.md` for complete resource reuse guide.

**Quick reference:**
1. Check official patterns (`patterns.etchwp.com`)
2. Check local patterns (`assets/templates/patterns/`)
3. Check site components via API (below)
4. Build new only when no reusable option exists

---

## Practical cURL Examples (Discovery Only)

```bash
# Get components list (fast)
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/components/list"

# Get full components
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/components"

# Get specific component
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/components/123"

# Get all styles
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/styles"

# Get patterns
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/patterns"

# Get loops (for dynamic data)
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/loops"

# Get queries
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/queries"

# Get field groups
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/cms/field-groups"
```

---

## Creating Components — Use Paste Format

**Do NOT use the API to create components.** The API does not support inline styles.

Instead, generate complete JSON with inline `styles` object and paste into the Etch WP editor:

```json
{
  "type": "block",
  "gutenbergBlock": {
    "blockName": "etch/component",
    "attrs": {"ref": 123, "attributes": {...}},
    "innerBlocks": [],
    "innerHTML": "\n\n",
    "innerContent": ["\n", "\n"]
  },
  "styles": {
    "abc123d": {
      "type": "class",
      "selector": ".my-class",
      "collection": "default",
      "css": "padding: var(--space-m);",
      "readonly": false
    }
  },
  "components": {
    "123": {
      "id": 123,
      "name": "My Component",
      "key": "MyComponent",
      "properties": [...],
      "blocks": [...]
    }
  }
}
```

---

## Minimum Endpoints to Check Before Building

1. **Existing reusable blocks**
   - `GET /components/list` (fast names + keys)
   - `GET /components` (full component payloads)
   - `GET /patterns` (saved patterns)

2. **Content structure for dynamic builds**
   - `GET /loops` (saved loop definitions)
   - `GET /queries` (saved query definitions)
   - `GET /cms/field-groups` (field groups)
   - `GET /post-types` and `GET /post-types/{post_type_name}`
   - `GET /taxonomies` and `GET /taxonomies/{id}`

3. **Existing styles**
   - `GET /styles` (to check for reusable style IDs)

---

## Summary: Component vs Pattern

| Aspect | Component | Pattern |
|--------|-----------|---------|
| Endpoint | `/components` | `/patterns` |
| Purpose | Template-renderable blocks | Editor-only reusable blocks |
| Properties | Yes | No |
| Key Field | Required (PascalCase) | N/A |
| API Support | GET only | GET only |
| Creation Method | Paste format only | Paste format only |

---

## Important Notes

- **API is read-only** for component/pattern creation purposes
- **Styles must be inline** in paste format; API does not accept styles
- **Always validate** generated JSON before pasting
- **Use official patterns** from patterns.etchwp.com when available
