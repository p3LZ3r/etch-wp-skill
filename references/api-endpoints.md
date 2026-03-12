# Etch WP REST API Endpoints (Reuse-First Guide)

Base namespace: `/wp-json/etch-api`

Use these endpoints to check what already exists before creating new components or styles.

## Authentication

All Etch API endpoints require WordPress authentication:

- `GET`: `edit_posts`
- `POST/PUT/DELETE`: `edit_posts` + `manage_options`

## API Credentials

Credentials are configured during project init (`node scripts/init-project.js` → Q10) and stored in `.etch-project.json` under `api`. Use the auth method recorded there:

- **`application-password`** → Basic Auth: `curl -u "username:app-password" "https://site.com/wp-json/etch-api/..."`
- **`wp-admin-browser`** → Nonce header: `fetch('/wp-json/etch-api/...', { headers: { 'X-WP-Nonce': window.wpApiSettings.nonce } })`

---

## ⚠️ Human-in-the-Loop — Required for ALL Write Operations

**CRITICAL: Any API call that modifies data (POST, PUT, DELETE) on ANY endpoint MUST require explicit user confirmation before execution.**

Before performing any write operation:

1. **Describe the action** — Clearly explain what will be created, updated, or deleted.
2. **Show the target endpoint and payload** — Present the full URL, HTTP method, and request body to the user.
3. **Wait for explicit approval** — Do NOT proceed until the user confirms with an explicit "yes" or approval.
4. **Never auto-execute write operations** — Even if the user previously approved a similar action, each write operation requires its own confirmation.

This applies to all endpoints including but not limited to:
- `POST /components`, `PUT /components`, `DELETE /components`
- `POST /patterns`, `PUT /patterns`, `DELETE /patterns`
- `POST /loops`, `PUT /loops`, `DELETE /loops`
- `POST /queries`, `PUT /queries`, `DELETE /queries`

---

## Components API (`/components`)

Components are reusable blocks with properties (props).

### GET /components
Returns all components with full details.

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

### POST /components
**Creates a new component.**

**Request Body:**
```json
{
  "name": "Feature Card",
  "key": "FeatureCard",
  "description": "A reusable card component",
  "blocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "metadata": {
          "name": "Card Container"
        },
        "tag": "div",
        "attributes": {
          "class": "tl-card"
        },
        "styles": ["a1b2c3d"]
      },
      "innerBlocks": [...],
      "innerHTML": "\n\n",
      "innerContent": ["\n", null, "\n"]
    }
  ],
  "properties": [
    {
      "key": "title",
      "name": "Card Title",
      "type": "text",
      "default": "Default Title"
    }
  ]
}
```

**Important Notes:**
- `key` must be PascalCase (e.g., `FeatureCard`)
- `blocks` must be valid WordPress block objects with `blockName`, `attrs`, `innerBlocks`, `innerHTML`, `innerContent`
- `styles` inside `attrs` is an array of 7-character style IDs

### GET /components/{id}
Returns single component by ID.

### PUT /components/{id}
Updates an existing component.

### DELETE /components/{id}
Deletes a component.

---

## Patterns API (`/patterns`)

Patterns are standard wp_block posts (synced or unsynced).

### GET /patterns
Returns all patterns.

### GET /patterns/{id}
Returns single pattern.

### POST /patterns
**Creates a new pattern.**

**Request Body:**
```json
{
  "name": "Hero Pattern",
  "description": "A hero section pattern",
  "blocks": [...],
  "synced": true,
  "categories": ["header", "hero"]
}
```

### PUT /patterns/{id}
Updates a pattern.

### DELETE /patterns/{id}
Deletes a pattern.

---

## Block Parser API (`/blocks/parse`)

Converts Gutenberg HTML block comments into JSON block objects.

### POST /blocks/parse

**Request Body:**
```json
{
  "content": "<!-- wp:paragraph --><p>Hello</p><!-- /wp:paragraph -->"
}
```

**Response:**
```json
[
  {
    "blockName": "core/paragraph",
    "attrs": {},
    "innerBlocks": [],
    "innerHTML": "<p>Hello</p>",
    "innerContent": ["<p>Hello</p>"]
  }
]
```

---

## Complete Component Creation Example

### Component JSON Structure
```json
{
  "name": "Hero Section",
  "key": "HeroSection",
  "description": "A full-width hero section",
  "blocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "metadata": {"name": "Hero Container"},
        "tag": "section",
        "attributes": {
          "class": "tl-hero"
        },
        "styles": ["section-style-id"]
      },
      "innerBlocks": [
        {
          "blockName": "etch/text",
          "attrs": {
            "content": "{props.heading}"
          },
          "innerBlocks": [],
          "innerHTML": "",
          "innerContent": []
        }
      ],
      "innerHTML": "\n\n",
      "innerContent": ["\n", null, "\n"]
    }
  ],
  "properties": [
    {
      "key": "heading",
      "name": "Heading",
      "type": "text",
      "default": "Welcome"
    }
  ]
}
```

### POST Component
```bash
curl -u "user:pass" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @component.json \
  "https://site.com/wp-json/etch-api/components"
```

**Done!** The component is created with style IDs referencing existing styles.

---

## Styles

Styles are referenced via 7-character alphanumeric IDs in block `attrs.styles` arrays. See [JSON Structure Reference](./json-structure.md) for complete style format details.

---

## Other Useful Endpoints

### Loops (`/loops`)
- `GET /loops` — All saved loop definitions
- `POST /loops` — Create loop
- `PUT /loops/{id}` — Update loop

### Queries (`/queries`)
- `GET /queries` — All saved queries
- `POST /queries` — Create query

### CMS/Field Groups (`/cms`)
- `GET /cms/field-group/{id}` — Field group by ID
- `GET /cms/field-groups` — All field groups

### Post Types (`/post-types`)
- `GET /post-types` — All post types
- `GET /post-types/{name}` — Specific post type

### Taxonomies (`/taxonomies`)
- `GET /taxonomies` — All taxonomies
- `GET /taxonomies/{id}` — Specific taxonomy

---

## Minimum Endpoints to Check Before Building

1. **Existing reusable blocks**
   - `GET /components/list` (fast names + keys)
   - `GET /components` (full component payloads)
   - `GET /patterns` (saved patterns)

2. **Content structure for dynamic builds**
   - `GET /loops` (saved loop definitions)
   - `GET /queries` (saved query definitions)
   - `GET /cms/field-group/` (field groups)
   - `GET /post-types` and `GET /post-types/{post_type_name}`
   - `GET /taxonomies` and `GET /taxonomies/{id}`

## Reuse-First Workflow

1. Check official pattern library first (`patterns.etchwp.com`).
2. Call Etch API endpoints above to discover existing site components/patterns.
3. Reuse or adapt what exists.
4. Build new JSON only when no suitable reusable option exists.

---

## Practical cURL Examples

```bash
# Get components list (fast)
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/components/list"

# Get full components
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/components"

# Get patterns
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/patterns"

# Get loops
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/loops"

# Get queries
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/queries"

# Create component
curl -u "username:application-password" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Component",
    "key": "TestComponent",
    "blocks": [],
    "properties": []
  }' \
  "https://example.com/wp-json/etch-api/components"
```

---

## Summary: Component vs Pattern

| Aspect | Component | Pattern |
|--------|-----------|---------|
| Endpoint | `/components` | `/patterns` |
| Purpose | Template-renderable blocks | Editor-only reusable blocks |
| Properties | Yes | No |
| Key Field | Required (PascalCase) | N/A |
