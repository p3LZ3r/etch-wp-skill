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
  "loopId": {
    "name": "Categories",
    "key": "categories",
    "config": {
      "type": "terms",
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
  "type": "terms",
  "args": {
    "taxonomy": "category",
    "hide_empty": true,
    "orderby": "name",
    "order": "ASC"
  }
}
```
