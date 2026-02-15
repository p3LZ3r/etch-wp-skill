# Etch WP REST API Endpoints (Reuse-First Guide)

Base namespace: `/wp-json/etch-api`

Use these endpoints to check what already exists before creating new components or styles.

## Authentication

All Etch API endpoints require WordPress authentication:

- `GET`: `edit_posts`
- `POST/PUT/DELETE`: `edit_posts` + `manage_options`

## How to Get API Credentials

You cannot retrieve an API key for any arbitrary WordPress website. You must have authorized access to that specific site.

Recommended method (WordPress Application Passwords):

1. Log in to that site's WordPress admin (`/wp-admin`).
2. Go to **Users → Profile** (or **Users → Your Profile**).
3. In **Application Passwords**, create a new password (for example: `Etch API`).
4. Copy the generated password (shown once).
5. Use `username:application-password` for Basic Auth over HTTPS.

```bash
curl -u "username:application-password" \
  "https://example.com/wp-json/etch-api/components/list"
```

If you cannot access wp-admin/profile for that site, ask the site owner/admin to create credentials for you.

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
