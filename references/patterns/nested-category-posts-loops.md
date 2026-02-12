# Nested Category Posts Loops Pattern

## Use Case
Display posts grouped by categories using nested loops (categories → posts).

## Working Example

### Categories Loop (Outer)

**Loop ID**: Random 7-char ID (e.g., `8esrv4f`)

**Config:**
```json
{
  "key": "categories",
  "name": "Post Categories",
  "global": true,
  "config": {
    "type": "wp-terms",
    "args": {
      "taxonomy": "category",
      "hide_empty": true,
      "orderby": "name",
      "order": "ASC"
    }
  }
}
```

### Posts Loop (Inner)

**Loop ID**: Random 7-char ID (e.g., `971co5p`)

**Config:**
```json
{
  "key": "postsByCategory",
  "name": "Posts by Category",
  "global": false,
  "config": {
    "type": "wp-query",
    "args": {
      "post_type": "post",
      "posts_per_page": 10,
      "post_status": "publish",
      "orderby": "date",
      "order": "DESC",
      "cat": "$cat_id"
    }
  }
}
```

## Critical: Parameter Passing

In the inner loop block, use `loopParams` (NOT `loopArgs`):

```json
{
  "blockName": "etch/loop",
  "attrs": {
    "loopId": "971co5p",
    "itemId": "post",
    "loopParams": {
      "$cat_id": "cat.id"
    }
  }
}
```

**Important**: Use `cat.id` NOT `{cat.id}` - no curly braces in the value!

## Common Mistakes

| Mistake | Correction |
|---------|------------|
| `"loopArgs"` | `"loopParams"` |
| `"{cat.id}"` | `"cat.id"` |
| `type: "terms"` | `type: "wp-terms"` |
| Complex `tax_query` | Simple `"cat": "$cat_id"` |
| Named loop IDs | Random 7-char IDs |

## Template Syntax (HTML-style)

```html
{#loop 8esrv4f as cat}
  <h3>{cat.name}</h3>

  {#loop 971co5p($cat_id: cat.id) as post}
    <article>
      <h4>{post.title}</h4>
      <span>{post.date.dateFormat('F Y')}</span>
    </article>
  {/loop}
{/loop}
```

## Related Patterns
- See also: `nested-taxonomy-loops.md` for custom taxonomies
- See also: `loop-parameters.md` for parameter syntax
