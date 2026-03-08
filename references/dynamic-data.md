# Dynamic Data in Etch WP

This file covers loops, nested loops, and data modifiers for dynamic content in Etch WP.

---

## Loops

Loops generate repetitive UI elements from data sources (posts, terms, users, gallery fields).

### Loop Structure

```json
{
  "blockName": "etch/loop",
  "attrs": {
    "metadata": {"name": "Posts Loop"},
    "loopId": "k7mrbkq",
    "itemId": "item"
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "article",
        "attributes": {"class": "post-card"}
      },
      "innerBlocks": [
        {
          "blockName": "etch/text",
          "attrs": {"content": "{item.title}"}
        }
      ]
    }
  ]
}
```

**⚠️ CRITICAL:** The `itemId` value becomes the prefix for ALL data references inside the loop:
- `itemId: "post"` → `{post.title}`, `{post.excerpt}`
- `itemId: "cat"` → `{cat.name}`, `{cat.slug}`
- `itemId: "product"` → `{product.price}`, `{product.image}`

### Loop Configuration

The loop configuration is placed in the `loops` object at root level:

```json
{
  "type": "block",
  "gutenbergBlock": {...},
  "version": 2,
  "styles": {...},
  "components": {...},
  "loops": {
    "k7mrbkq": {
      "name": "Posts",
      "key": "posts",
      "global": true,
      "config": {
        "type": "wp-query",
        "args": {
          "post_type": "post",
          "posts_per_page": 10,
          "orderby": "date",
          "order": "DESC"
        }
      }
    }
  }
}
```

### Loop Types

| Type | Config Value | Use Case |
|------|--------------|----------|
| Posts | `wp-query` | Blog posts, products, custom post types |
| Terms | `wp-terms` | Categories, tags, custom taxonomies |
| Users | `wp-users` | Team members, authors |
| Main Query | `main-query` | Current page archive |
| Field-based | `this.metabox.*` | Gallery, repeater fields |

### Common Loop Configurations

**Posts:**
```json
{
  "type": "wp-query",
  "args": {
    "post_type": "post",
    "posts_per_page": 6,
    "orderby": "date",
    "order": "DESC"
  }
}
```

**Categories:**
```json
{
  "type": "wp-terms",
  "args": {
    "taxonomy": "category",
    "hide_empty": true,
    "orderby": "name"
  }
}
```

**Gallery Field (Meta Box):**
```json
{
  "key": "this.metabox.gallery_field",
  "global": true,
  "config": {}
}
```

---

## Nested Loops

Nested loops allow looping through related data (categories with posts, etc.).

### Structure

```json
{
  "blockName": "etch/loop",
  "attrs": {
    "loopId": "categories123",
    "itemId": "cat"
  },
  "innerBlocks": [
    {
      "blockName": "etch/text",
      "attrs": {"content": "{cat.name}"}
    },
    {
      "blockName": "etch/loop",
      "attrs": {
        "loopId": "posts456",
        "itemId": "post",
        "loopParams": {"$cat_id": "cat.id"}
      },
      "innerBlocks": [
        {
          "blockName": "etch/text",
          "attrs": {"content": "{post.title}"}
        }
      ]
    }
  ]
}
```

### Loop Configuration

```json
"loops": {
  "categories123": {
    "name": "Categories",
    "key": "categories",
    "global": true,
    "config": {
      "type": "wp-terms",
      "args": {"taxonomy": "category"}
    }
  },
  "posts456": {
    "name": "Posts by Category",
    "key": "postsByCategory",
    "global": false,
    "config": {
      "type": "wp-query",
      "args": {
        "post_type": "post",
        "posts_per_page": 5,
        "cat": "$cat_id"
      }
    }
  }
}
```

**⚠️ Important:**
- Use `"loopParams"` (NOT `"loopArgs"`)
- Use `"cat.id"` (no curly braces in JSON)
- Inner loop should have `"global": false`

---

## Data Modifiers

Data modifiers transform dynamic values. They work with props, loop items, and dynamic data.

### Type Conversion

| Modifier | Description | Example |
|----------|-------------|---------|
| `.toInt()` | Convert to integer | `{props.count.toInt()}` |
| `.toString()` | Convert to string | `{item.price.toString()}` |
| `.ceil()` | Round up | `{item.value.ceil()}` |
| `.floor()` | Round down | `{item.value.floor()}` |
| `.round()` | Round to nearest | `{item.value.round()}` |

### Comparison Modifiers

Return custom values based on comparisons:

```json
{"class": "{product.price.greater(100, 'expensive', 'affordable')}"}
{"class": "{item.stock.less(5, 'low-stock', 'in-stock')}"}
{"class": "{user.role.includes('admin', 'admin-panel', 'user-panel')}"}
```

| Modifier | Description |
|----------|-------------|
| `.equal(value, trueVal, falseVal)` | Strict equality check |
| `.greater(value, trueVal, falseVal)` | Greater than |
| `.less(value, trueVal, falseVal)` | Less than |
| `.greaterOrEqual(value, trueVal, falseVal)` | Greater or equal |
| `.lessOrEqual(value, trueVal, falseVal)` | Less or equal |
| `.includes(value, trueVal, falseVal)` | String/array contains |

### Common Use Cases

**Conditional CSS classes:**
```json
{
  "attributes": {
    "class": "{product.featured.equal('true', 'card--featured', 'card--standard')}"
  }
}
```

**Limit loop items:**
```json
{#loop props.items.slice(0, 6) as item}
```

---

## Dynamic Data Keys

Inside loops, access item data using these patterns:

### Posts
```
{post.title}              → Title
{post.excerpt}            → Excerpt
{post.permalink.relative} → Link
{post.featuredImage.url}  → Featured image
{post.author.name}        → Author name
```

### Terms
```
{cat.name}               → Name
{cat.slug}               → Slug
{cat.description}        → Description
{cat.count}              → Post count
```

### Custom Fields
```
{item.acf.field_name}      → ACF field
{item.metabox.field_name}  → Meta Box field
{item.jetengine.field_name} → JetEngine field
```

---

## Common Mistakes

| Wrong | Correct |
|-------|---------|
| `"loopArgs"` | `"loopParams"` |
| `{cat.id}` in JSON | `cat.id` (no braces) |
| `"type": "terms"` | `"type": "wp-terms"` |
| Loop ID: `"posts"` | Loop ID: `"k7mrbkq"` (random) |

---

## Best Practices

1. Use random 7-character loop IDs: `"k7mrbkq"`, `"abc123x"`
2. Set `global: false` for nested/context-specific loops
3. Use modifiers for conditional CSS classes
4. Always use `etch/text` for loop content values
5. Check existing loops first: `GET /wp-json/etch-api/loops`
