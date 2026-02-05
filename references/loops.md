# Loops for Repetitive Elements in Etch WP

This document explains how to use loops for generating repetitive UI elements in Etch WP. Loops allow you to create templates that repeat for each item in a data source.

## When to Use Loops

Use loops when you have repetitive elements that share the same structure but different content, such as:
- Blog post grids
- Product listings
- Team member cards
- Testimonial sliders
- Feature lists

**Direct Inline Content Philosophy**: Content is embedded directly in the UI code. Loops generate repetitive elements inline, not as separate content layers.

## Loop Structure

### Loop Template Structure

The loop template defines the repeating UI structure:

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
        "attributes": {
          "class": "post-card"
        }
      },
      "innerBlocks": [
        {
          "blockName": "etch/text",
          "attrs": {
            "content": "{item.title}"
          }
        }
      ]
    }
  ]
}
```

### Loop Configuration

The loop configuration defines the data source and is placed in the `loops` object at root level:

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
          "order": "DESC",
          "post_status": "publish"
        }
      }
    }
  }
}
```

## Loop Types

### Main Query

The mainQuery loop type displays the current page's posts (for archive pages) or the current post's related content. You can override query parameters.

**Basic Usage:**
```json
{
  "blockName": "etch/loop",
  "attrs": {
    "metadata": {"name": "Main Query"},
    "loopId": "main123",
    "itemId": "post"
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "h2"
      },
      "innerBlocks": [
        {
          "blockName": "etch/text",
          "attrs": {
            "content": "{post.title}"
          }
        }
      ]
    }
  ]
}
```

**Loop Configuration:**
```json
"loops": {
  "main123": {
    "name": "Main Query",
    "key": "mainQuery",
    "global": true,
    "config": {
      "type": "main-query"
    }
  }
}
```

**Parameter Overrides:**

Override the number of items:
```json
{#loop mainQuery($count: 3) as post}
  <h2>{post.title}</h2>
{/loop}
```

Override ordering:
```json
{#loop mainQuery($orderby: "title", $order: "ASC") as post}
  <h2>{post.title}</h2>
{/loop}
```

Show all posts:
```json
{#loop mainQuery($count: -1) as post}
  <h2>{post.title}</h2>
{/loop}
```

Multiple overrides:
```json
{#loop mainQuery($count: 6, $orderby: "date", $order: "DESC") as post}
  <h2>{post.title}</h2>
{/loop}
```

### WP Query (Posts)

```json
"loops": {
  "loopId": {
    "name": "Posts",
    "key": "posts",
    "config": {
      "type": "wp-query",
      "args": {
        "post_type": "post",
        "posts_per_page": 6,
        "orderby": "date",
        "order": "DESC",
        "post_status": "publish"
      }
    }
  }
}
```

**Common WP Query args:**
- `post_type`: "post", "page", "product", custom post type
- `posts_per_page`: Number of items (-1 for all)
- `orderby`: "date", "title", "menu_order", "rand"
- `order`: "DESC", "ASC"
- `post_status`: "publish", "draft", "pending"
- `category_name`: Category slug
- `tag`: Tag slug
- `meta_query`: Custom field queries

### Terms (Taxonomies)

```json
"loops": {
  "abc123x": {
    "name": "Categories",
    "key": "categories",
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
}
```

**Note:** Loop IDs should be random 7-character strings (e.g., `abc123x`, `8esrv4f`).

### Users

```json
"loops": {
  "loopId": {
    "name": "Team Members",
    "key": "users",
    "config": {
      "type": "users",
      "args": {
        "role": "author",
        "orderby": "display_name",
        "order": "ASC"
      }
    }
  }
}
```

### JSON Data

```json
"loops": {
  "loopId": {
    "name": "Custom Data",
    "key": "customdata",
    "config": {
      "type": "json",
      "data": [
        {"title": "Item 1", "value": 100},
        {"title": "Item 2", "value": 200}
      ]
    }
  }
}
```

### External API

```json
"loops": {
  "loopId": {
    "name": "API Data",
    "key": "apidata",
    "config": {
      "type": "api",
      "url": "https://api.example.com/data",
      "method": "GET"
    }
  }
}
```

## Nested Loops

Nested loops allow you to loop through related data, such as categories and their posts, or terms and their items.

### Categories with Posts Pattern

Display categories, then show posts within each category:

**HTML Pattern:**
```html
{#loop categories as category}
  <div class="category-section">
    <h2>{category.name}</h2>
    <ul>
      {#loop posts($cat_id: category.id) as post}
        <li>{post.title}</li>
      {/loop}
    </ul>
  </div>
{/loop}
```

**JSON Block Structure:**
```json
{
  "blockName": "etch/loop",
  "attrs": {
    "loopId": "a1b2c3d",
    "itemId": "cat"
  },
  "innerBlocks": [
    {
      "blockName": "etch/text",
      "attrs": {
        "content": "{cat.name}"
      }
    },
    {
      "blockName": "etch/loop",
      "attrs": {
        "loopId": "e4f5g6h",
        "itemId": "post",
        "loopParams": {
          "$cat_id": "cat.id"
        }
      },
      "innerBlocks": [
        {
          "blockName": "etch/text",
          "attrs": {
            "content": "{post.title}"
          }
        }
      ]
    }
  ]
}
```

**Loop Configuration:**
```json
"loops": {
  "a1b2c3d": {
    "name": "Categories",
    "key": "categories",
    "global": true,
    "config": {
      "type": "wp-terms",
      "args": {
        "taxonomy": "category",
        "hide_empty": false
      }
    }
  },
  "e4f5g6h": {
    "name": "Posts by Category",
    "key": "posts",
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

**Critical Points:**
- **JSON Format**: Use `"loopParams"` (NOT `"loopArgs"`)
- **JSON Format**: Use `"cat.id"` (NOT `"{cat.id}"`) - no curly braces in the value
- **HTML Format**: Use `{#loop posts($cat_id: category.id)}`
- Loop IDs should be random 7-character strings
- Inner loop `global` should be `false` for context-specific queries

### Nested Loop with Custom Post Types

```html
{#loop taxonomies as taxonomy}
  <div class="taxonomy-group">
    <h3>{taxonomy.name}</h3>
    {#loop posts($tax: taxonomy.slug, $taxonomy: taxonomy.taxonomy) as post}
      <article>
        <h4>{post.title}</h4>
      </article>
    {/loop}
  </div>
{/loop}
```

## Gallery Fields

Gallery fields from ACF, Meta Box, and Jet Engine allow looping through multiple images.

### ACF Gallery Field

```html
<ul class="gallery">
  {#loop this.acf.gallery_field as image}
    <li class="gallery-item">
      <figure>
        <img
          src="{image.url}"
          alt="{image.alt}"
          width="{image.width}"
          height="{image.height}"
        />
        {#if image.caption}
          <figcaption>{image.caption}</figcaption>
        {/if}
      </figure>
    </li>
  {/loop}
</ul>
```

**Available Fields:**
- `{image.url}` - Image URL
- `{image.alt}` - Alt text
- `{image.width}` - Width in pixels
- `{image.height}` - Height in pixels
- `{image.caption}` - Image caption

### Meta Box Gallery Field

```html
<ul class="gallery">
  {#loop this.metabox.gallery_field as image}
    <li class="gallery-item">
      <figure>
        <img
          src="{image.url}"
          alt="{image.alt}"
          width="{image.width}"
          height="{image.height}"
        />
        {#if image.caption}
          <figcaption>{image.caption}</figcaption>
        {/if}
      </figure>
    </li>
  {/loop}
</ul>
```

### Jet Engine Gallery Field

```html
<ul class="gallery">
  {#loop this.jetengine.gallery_field as image}
    <li class="gallery-item">
      <figure>
        <img
          src="{image.url}"
          alt="{image.alt}"
          width="{image.width}"
          height="{image.height}"
        />
        {#if image.caption}
          <figcaption>{image.caption}</figcaption>
        {/if}
      </figure>
    </li>
  {/loop}
</ul>
```

### JSON Block Structure for Gallery Loop

```json
{
  "blockName": "etch/loop",
  "attrs": {
    "metadata": {"name": "Gallery Loop"},
    "loopId": "gallery123",
    "itemId": "image"
  },
  "innerBlocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "tag": "figure",
        "attributes": {
          "class": "gallery-item"
        }
      },
      "innerBlocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "tag": "img",
            "attributes": {
              "src": "{image.url}",
              "alt": "{image.alt}",
              "width": "{image.width}",
              "height": "{image.height}",
              "class": "gallery-image"
            }
          }
        },
        {
          "blockName": "etch/condition",
          "attrs": {
            "condition": {
              "leftHand": "image.caption",
              "operator": "isTruthy",
              "rightHand": null
            }
          },
          "innerBlocks": [
            {
              "blockName": "etch/element",
              "attrs": {
                "tag": "figcaption"
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "content": "{image.caption}"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

**Loop Configuration:**
```json
"loops": {
  "gallery123": {
    "name": "Gallery",
    "key": "this.acf.gallery_field",
    "global": true,
    "config": {
      "type": "field"
    }
  }
}
```

## Dynamic Data Keys

Inside loop templates, access item data using dynamic keys:

### Posts
```
{item.title}              → Post title
{item.excerpt}            → Post excerpt
{item.content}            → Post content
{item.permalink.relative} → Relative permalink
{item.permalink.absolute} → Absolute permalink
{item.featuredImage.url}  → Featured image URL
{item.featuredImage.alt}  → Featured image alt text
{item.author.name}        → Author name
{item.author.url}         → Author URL
{item.date}               → Post date
```

### Custom Fields
```
{item.acf.field_name}      → ACF field
{item.metabox.field_name}  → Meta Box field
{item.jetengine.field_name} → JetEngine field
```

### Terms
```
{item.name}               → Term name
{item.slug}               → Term slug
{item.description}        → Term description
{item.count}              → Post count
{item.link}               → Term archive link
```

### Users
```
{item.display_name}       → Display name
{item.user_email}         → Email
{item.user_url}           → Website URL
```

## Complete Example: Blog Grid

### Design Layer
```json
{
  "type": "block",
  "gutenbergBlock": {
    "blockName": "etch/element",
    "attrs": {
      "metadata": {"name": "Blog Grid Section"},
      "tag": "section",
      "attributes": {
        "data-etch-element": "section",
        "class": "blog-grid-section"
      },
      "styles": ["etch-section-style", "blog-grid-section"]
    },
    "innerBlocks": [
      {
        "blockName": "etch/element",
        "attrs": {
          "metadata": {"name": "Container"},
          "tag": "div",
          "attributes": {
            "data-etch-element": "container"
          },
          "styles": ["etch-container-style"]
        },
        "innerBlocks": [
          {
            "blockName": "etch/element",
            "attrs": {
              "metadata": {"name": "Grid"},
              "tag": "div",
              "attributes": {
                "class": "blog-grid"
              },
              "styles": ["blog-grid"]
            },
            "innerBlocks": [
              {
                "blockName": "etch/loop",
                "attrs": {
                  "metadata": {"name": "Posts Loop"},
                  "loopId": "blog123",
                  "itemId": "post"
                },
                "innerBlocks": [
                  {
                    "blockName": "etch/element",
                    "attrs": {
                      "tag": "article",
                      "attributes": {
                        "class": "post-card"
                      },
                      "styles": ["post-card"]
                    },
                    "innerBlocks": [
                      {
                        "blockName": "etch/element",
                        "attrs": {
                          "tag": "img",
                          "attributes": {
                            "src": "{post.featuredImage.url}",
                            "alt": "{post.featuredImage.alt}",
                            "class": "post-card__image"
                          }
                        }
                      },
                      {
                        "blockName": "etch/element",
                        "attrs": {
                          "tag": "h3",
                          "attributes": {
                            "class": "post-card__title"
                          },
                          "styles": ["post-card__title"]
                        },
                        "innerBlocks": [
                          {
                            "blockName": "etch/text",
                            "attrs": {
                              "content": "{post.title}"
                            }
                          }
                        ]
                      },
                      {
                        "blockName": "etch/element",
                        "attrs": {
                          "tag": "p",
                          "attributes": {
                            "class": "post-card__excerpt"
                          },
                          "styles": ["post-card__excerpt"]
                        },
                        "innerBlocks": [
                          {
                            "blockName": "etch/text",
                            "attrs": {
                              "content": "{post.excerpt}"
                            }
                          }
                        ]
                      },
                      {
                        "blockName": "etch/element",
                        "attrs": {
                          "tag": "a",
                          "attributes": {
                            "href": "{post.permalink.relative}",
                            "class": "post-card__link"
                          }
                        },
                        "innerBlocks": [
                          {
                            "blockName": "etch/text",
                            "attrs": {
                              "content": "Read More"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "version": 2,
  "styles": {
    "etch-section-style": {...},
    "etch-container-style": {...},
    "blog-grid-section": {
      "type": "class",
      "selector": ".blog-grid-section",
      "css": "background: var(--bg-light);\n  padding-block: var(--section-space-l);\n  padding-inline: var(--gutter);",
      "readonly": false
    },
    "blog-grid": {
      "type": "class",
      "selector": ".blog-grid",
      "css": "display: grid;\n  grid-template-columns: var(--grid-auto-3);\n  gap: var(--grid-gap);",
      "readonly": false
    },
    "post-card": {
      "type": "class",
      "selector": ".post-card",
      "css": "display: flex;\n  flex-direction: column;\n  gap: var(--card-gap);\n  background: var(--bg-light);\n  border-radius: var(--card-radius);\n  overflow: hidden;\n  box-shadow: var(--card-shadow);",
      "readonly": false
    },
    "post-card__title": {
      "type": "class",
      "selector": ".post-card__title",
      "css": "font-size: var(--h4);\n  color: var(--heading-color);\n  padding-inline: var(--space-m);",
      "readonly": false
    },
    "post-card__excerpt": {
      "type": "class",
      "selector": ".post-card__excerpt",
      "css": "font-size: var(--text-s);\n  color: var(--text-dark-muted);\n  padding-inline: var(--space-m);",
      "readonly": false
    }
  },
  "loops": {
    "blog123": {
      "name": "Recent Posts",
      "key": "posts",
      "global": true,
      "config": {
        "type": "wp-query",
        "args": {
          "post_type": "post",
          "posts_per_page": 6,
          "orderby": "date",
          "order": "DESC",
          "post_status": "publish"
        }
      }
    }
  }
}
```

## Response Format

When generating components with loops, provide:

1. **Complete Etch JSON** with loop template structure
2. **Loops configuration** in the `loops` object at root level
3. **Inline content philosophy**: Content is embedded directly in the UI code, loops generate repetitive elements inline

Optional: Provide loop configuration as a separate JSON string for easier editing:

```json
// Loop configuration for reuse
{
  "blog123": {
    "name": "Recent Posts",
    "key": "posts",
    "global": true,
    "config": {
      "type": "wp-query",
      "args": {
        "post_type": "post",
        "posts_per_page": 6,
        "orderby": "date",
        "order": "DESC"
      }
    }
  }
}
```

## Best Practices

1. **Use descriptive loopIds**: `blog123`, `teamMembers`, `products456`
2. **Name loops clearly**: "Recent Posts", "Team Members", "Product Grid"
3. **Set appropriate limits**: Don't fetch all posts if you only display 6
4. **Use global: true** for loops that should be available globally
5. **Provide sensible defaults**: Default to published posts, date-ordered
6. **Document dynamic keys**: Comment which fields are available in template
7. **Consider performance**: Limit posts_per_page, use pagination for large datasets

## Common Loop Configurations

### Blog Posts (Recent)
```json
{
  "type": "wp-query",
  "args": {
    "post_type": "post",
    "posts_per_page": 6,
    "orderby": "date",
    "order": "DESC",
    "post_status": "publish"
  }
}
```

### Products (WooCommerce)
```json
{
  "type": "wp-query",
  "args": {
    "post_type": "product",
    "posts_per_page": 8,
    "orderby": "menu_order",
    "order": "ASC",
    "post_status": "publish"
  }
}
```

### Team Members (Custom Post Type)
```json
{
  "type": "wp-query",
  "args": {
    "post_type": "team_member",
    "posts_per_page": -1,
    "orderby": "menu_order",
    "order": "ASC"
  }
}
```

### Categories
```json
{
  "type": "wp-terms",
  "args": {
    "taxonomy": "category",
    "hide_empty": true,
    "orderby": "name",
    "order": "ASC"
  }
}
```

## Common Mistakes

### Nested Loops: JSON vs HTML Syntax

When passing parameters to nested loops, the syntax differs between HTML templates and JSON block structures:

| Format | Wrong | Correct |
|--------|-------|---------|
| **JSON** | `"loopArgs": {"$cat_id": "{cat.id}"}` | `"loopParams": {"$cat_id": "cat.id"}` |
| **JSON** | `"{cat.id}"` (with braces) | `"cat.id"` (without braces) |
| **HTML** | `{#loop posts($cat_id: {cat.id})}` | `{#loop posts($cat_id: cat.id)}` |

### Loop IDs

| Wrong | Correct |
|-------|---------|
| Descriptive names like `"categories"`, `"posts"` | Random 7-char strings like `"8esrv4f"`, `"971co5p"` |

### Loop Types

| Wrong | Correct |
|-------|---------|
| `"type": "terms"` | `"type": "wp-terms"` |
| `"type": "users"` | `"type": "wp-users"` |

### Filter by Category in WP Query

| Wrong | Correct |
|-------|---------|
| Complex `tax_query` array | Simple `"cat": "$cat_id"` |

### Example: Complete Working Nested Loop

**Outer Loop (Categories):**
```json
"8esrv4f": {
  "key": "categories",
  "name": "Categories",
  "global": true,
  "config": {
    "type": "wp-terms",
    "args": {
      "taxonomy": "category",
      "hide_empty": true
    }
  }
}
```

**Inner Loop (Posts):**
```json
"971co5p": {
  "key": "postsByCategory",
  "name": "Posts by Category",
  "global": false,
  "config": {
    "type": "wp-query",
    "args": {
      "post_type": "post",
      "posts_per_page": 10,
      "cat": "$cat_id"
    }
  }
}
```

**Inner Loop Block with Parameters:**
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
