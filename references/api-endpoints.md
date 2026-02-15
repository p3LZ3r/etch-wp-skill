# Etch WP REST API Endpoints (Reuse-First Guide)

Base namespace: `/wp-json/etch-api`

Use these endpoints to check what already exists before creating new components or styles.

## Authentication

All Etch API endpoints require WordPress authentication:

- `GET`: `edit_posts`
- `POST/PUT/DELETE`: `edit_posts` + `manage_options`

Outside the WP admin/browser context, use WordPress Application Passwords over HTTPS:

```bash
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/components/list"
```

Inside a logged-in WP browser context, authenticated requests can use nonce-based headers:

```js
fetch('/wp-json/etch-api/components/list', {
  headers: { 'X-WP-Nonce': window.wpApiSettings.nonce }
})
```

## Minimum Endpoints to Check Before Building

### 1) Existing reusable blocks

- `GET /components/list` (fast names + keys)
- `GET /components` (full component payloads)
- `GET /patterns` (saved patterns)

### 2) Existing style systems

- `GET /styles` (global styles)
- `GET /stylesheets` (saved stylesheets)

### 3) Content structure for dynamic builds

- `GET /loops` (saved loop definitions)
- `GET /queries` (saved query definitions)
- `GET /cms/field-group/` (field groups)
- `GET /post-types` and `GET /post-types/{post_type_name}`
- `GET /taxonomies` and `GET /taxonomies/{id}`

## Reuse-First Workflow

1. Check official pattern library first (`patterns.etchwp.com`).
2. Call Etch API endpoints above to discover existing site components/patterns/styles.
3. Reuse or adapt what exists.
4. Build new JSON only when no suitable reusable option exists.

## Practical cURL Examples

```bash
# Components
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/components/list"

# Patterns
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/patterns"

# Stylesheets
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/stylesheets"

# Loops and queries (for data structure understanding)
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/loops"
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/queries"
```
