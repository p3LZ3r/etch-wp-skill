# Etch WP REST API Endpoints (Reuse-First Guide)

Base namespace: `/wp-json/etch-api`

Use these endpoints to check what already exists before creating new components or styles.

## Authentication

All Etch API endpoints require WordPress authentication:

- `GET`: `edit_posts`
- `POST/PUT/DELETE`: `edit_posts` + `manage_options`

## ⚠️ Styles Endpoint — READ-ONLY

**CRITICAL: The `/styles` and `/stylesheets` endpoints MUST only be used for reading (GET). NEVER send PUT, POST, or DELETE requests to these endpoints.**

A previous incident caused the deletion of every CSS class on a live website due to a PUT call to the styles endpoint. To prevent this from ever happening again:

- ✅ `GET /styles` — **Allowed** (read global styles)
- ✅ `GET /stylesheets` — **Allowed** (read saved stylesheets)
- ❌ `PUT /styles` — **FORBIDDEN**
- ❌ `POST /styles` — **FORBIDDEN**
- ❌ `DELETE /styles` — **FORBIDDEN**
- ❌ `PUT /stylesheets` — **FORBIDDEN**
- ❌ `POST /stylesheets` — **FORBIDDEN**
- ❌ `DELETE /stylesheets` — **FORBIDDEN**

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

**Remember: `/styles` and `/stylesheets` are fully excluded from write operations — they are read-only regardless of user confirmation.**

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
