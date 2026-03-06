# Component JSON Structure Reference

This document defines the exact JSON structure required for successfully creating components via the Etch WP REST API.

## Overview

Components are created via `POST /wp-json/etch-api/components` with a specific JSON structure that differs from the paste format used for layouts/sections.

## Root Level Fields

```json
{
  "name": "Component Name",
  "key": "ComponentKey",
  "description": "Optional description",
  "blocks": [...],
  "properties": [...]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | Display name in Etch editor |
| `key` | string | ✅ Yes | PascalCase identifier for PHP usage: `etch_component('Key')` |
| `description` | string | ❌ No | Optional description shown in editor |
| `blocks` | array | ✅ Yes | Array of WordPress block objects |
| `properties` | array | ❌ No | Array of property definitions |

**Note:** `styles` is NOT accepted at root level. Push styles separately via `PUT /styles`.

---

## Block Object Structure

Each block in the `blocks` array must be a valid WordPress Gutenberg block object:

```json
{
  "blockName": "etch/element",
  "attrs": {
    "metadata": {
      "name": "Element Name",
      "etchData": {
        "origin": "etch",
        "component": "div",
        "styles": ["styleId1", "styleId2"],
        "attributes": {
          "class": "prefix-block__element",
          "data-etch-element": "section"
        },
        "block": {
          "type": "html",
          "tag": "div"
        }
      }
    },
    "tag": "div",
    "attributes": {
      "class": "prefix-block__element"
    }
  },
  "innerBlocks": [...],
  "innerHTML": "<div class=\"prefix-block__element\"></div>",
  "innerContent": ["<div class=\"prefix-block__element\">", null, "</div>"]
}
```

### Required Block Fields

| Field | Type | Description |
|-------|------|-------------|
| `blockName` | string | Block type: `etch/element`, `etch/text`, `etch/dynamic-image`, etc. |
| `attrs` | object | Block attributes including `metadata` with `etchData` |
| `innerBlocks` | array | Child blocks (empty array for leaf nodes) |
| `innerHTML` | string | Complete HTML representation |
| `innerContent` | array | HTML parts with `null` placeholders for inner blocks |

### The `etchData` Object

The `etchData` object inside `metadata` is crucial for Etch to properly render and style the element:

```json
{
  "etchData": {
    "origin": "etch",
    "component": "div",
    "styles": ["abc1234", "def5678"],
    "attributes": {
      "class": "tl-hero__container"
    },
    "block": {
      "type": "html",
      "tag": "div"
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `origin` | string | Always `"etch"` for Etch-created elements |
| `component` | string | Component type: `"div"`, `"section"`, etc. |
| `styles` | array | Array of 7-character style IDs to apply |
| `attributes` | object | HTML attributes including `class` |
| `block` | object | Block definition with `type` and `tag` |

---

## innerContent Format

The `innerContent` array uses `null` to mark where child blocks are inserted:

```json
// Element with no children
"innerContent": ["<div class='box'></div>"]

// Element with one child
"innerContent": ["<div class='box'>", null, "</div>"]

// Element with two children
"innerContent": ["<div class='box'>", null, null, "</div>"]
```

**Rule:** One `null` per child block in `innerBlocks`.

---

## Property Structure

Properties define configurable values for component instances:

```json
{
  "key": "headingText",
  "name": "Heading Text",
  "type": "text",
  "default": "Default Heading"
}
```

### Property Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | ✅ Yes | camelCase identifier for templates |
| `name` | string | ✅ Yes | Display label in Etch editor |
| `type` | string | ✅ Yes | Property type: `text`, `image`, `boolean`, `number`, `select` |
| `default` | any | ✅ Yes | Default value |

### Property Types

| Type | Usage | Example Default |
|------|-------|-----------------|
| `text` | Strings, URLs | `"Default Text"` |
| `image` | Media library images | `""` or image URL |
| `boolean` | True/false flags | `false` |
| `number` | Numeric values | `0` |
| `select` | Dropdown options | `"option1"` |

### Image Properties

For image properties, use the `etch/dynamic-image` block with `mediaId`:

```json
// Property definition
{
  "key": "featuredImage",
  "name": "Featured Image",
  "type": "image",
  "default": ""
}

// Block usage
{
  "blockName": "etch/dynamic-image",
  "attrs": {
    "metadata": {
      "name": "Featured Image",
      "etchData": {
        "origin": "etch",
        "component": "image",
        "attributes": {
          "mediaId": "{props.featuredImage}",
          "class": "tl-card__image"
        },
        "block": {
          "type": "html",
          "tag": "img"
        }
      }
    },
    "tag": "img",
    "attributes": {
      "mediaId": "{props.featuredImage}",
      "class": "tl-card__image"
    }
  },
  "innerBlocks": [],
  "innerHTML": "",
  "innerContent": []
}
```

---

## Text Content with `etch/text`

**CRITICAL:** All text content must use `etch/text` blocks, never raw text in `innerHTML`.

### Static Text

```json
{
  "blockName": "etch/element",
  "attrs": {
    "metadata": {
      "name": "Title Element",
      "etchData": {
        "origin": "etch",
        "component": "heading",
        "attributes": {
          "class": "tl-card__title"
        },
        "block": {
          "type": "html",
          "tag": "h2"
        }
      }
    },
    "tag": "h2",
    "attributes": {
      "class": "tl-card__title"
    }
  },
  "innerBlocks": [
    {
      "blockName": "etch/text",
      "attrs": {
        "content": "{props.headingText}"
      },
      "innerBlocks": [],
      "innerHTML": "",
      "innerContent": []
    }
  ],
  "innerHTML": "<h2 class=\"tl-card__title\"></h2>",
  "innerContent": ["<h2 class=\"tl-card__title\">", null, "</h2>"]
}
```

### Dynamic Text (Properties)

Use `{props.propertyName}` syntax:

```json
{
  "blockName": "etch/text",
  "attrs": {
    "content": "{props.headingText}"
  },
  "innerBlocks": [],
  "innerHTML": "",
  "innerContent": []
}
```

---

## Complete Working Example

```json
{
  "name": "Blog Card",
  "key": "BlogCard",
  "description": "A card component for blog posts",
  "blocks": [
    {
      "blockName": "etch/element",
      "attrs": {
        "metadata": {
          "name": "Card Container",
          "etchData": {
            "origin": "etch",
            "component": "article",
            "styles": ["a1b2c3d"],
            "attributes": {
              "class": "tl-blog-card"
            },
            "block": {
              "type": "html",
              "tag": "article"
            }
          }
        },
        "tag": "article",
        "attributes": {
          "class": "tl-blog-card"
        }
      },
      "innerBlocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "metadata": {
              "name": "Image Wrapper",
              "etchData": {
                "origin": "etch",
                "component": "div",
                "attributes": {
                  "class": "tl-blog-card__image-wrapper"
                },
                "block": {
                  "type": "html",
                  "tag": "div"
                }
              }
            },
            "tag": "div",
            "attributes": {
              "class": "tl-blog-card__image-wrapper"
            }
          },
          "innerBlocks": [
            {
              "blockName": "etch/dynamic-image",
              "attrs": {
                "metadata": {
                  "name": "Featured Image",
                  "etchData": {
                    "origin": "etch",
                    "component": "image",
                    "attributes": {
                      "mediaId": "{props.featuredImage}",
                      "class": "tl-blog-card__image",
                      "loading": "lazy"
                    },
                    "block": {
                      "type": "html",
                      "tag": "img"
                    }
                  }
                },
                "tag": "img",
                "attributes": {
                  "mediaId": "{props.featuredImage}",
                  "class": "tl-blog-card__image",
                  "loading": "lazy"
                }
              },
              "innerBlocks": [],
              "innerHTML": "",
              "innerContent": []
            }
          ],
          "innerHTML": "<div class=\"tl-blog-card__image-wrapper\"></div>",
          "innerContent": ["<div class=\"tl-blog-card__image-wrapper\">", null, "</div>"]
        },
        {
          "blockName": "etch/element",
          "attrs": {
            "metadata": {
              "name": "Content Wrapper",
              "etchData": {
                "origin": "etch",
                "component": "div",
                "attributes": {
                  "class": "tl-blog-card__content"
                },
                "block": {
                  "type": "html",
                  "tag": "div"
                }
              }
            },
            "tag": "div",
            "attributes": {
              "class": "tl-blog-card__content"
            }
          },
          "innerBlocks": [
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {
                  "name": "Title",
                  "etchData": {
                    "origin": "etch",
                    "component": "heading",
                    "attributes": {
                      "class": "tl-blog-card__title"
                    },
                    "block": {
                      "type": "html",
                      "tag": "h2"
                    }
                  }
                },
                "tag": "h2",
                "attributes": {
                  "class": "tl-blog-card__title"
                }
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "content": "{props.title}"
                  },
                  "innerBlocks": [],
                  "innerHTML": "",
                  "innerContent": []
                }
              ],
              "innerHTML": "<h2 class=\"tl-blog-card__title\"></h2>",
              "innerContent": ["<h2 class=\"tl-blog-card__title\">", null, "</h2>"]
            },
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {
                  "name": "Excerpt",
                  "etchData": {
                    "origin": "etch",
                    "component": "paragraph",
                    "attributes": {
                      "class": "tl-blog-card__excerpt"
                    },
                    "block": {
                      "type": "html",
                      "tag": "p"
                    }
                  }
                },
                "tag": "p",
                "attributes": {
                  "class": "tl-blog-card__excerpt"
                }
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "content": "{props.excerpt}"
                  },
                  "innerBlocks": [],
                  "innerHTML": "",
                  "innerContent": []
                }
              ],
              "innerHTML": "<p class=\"tl-blog-card__excerpt\"></p>",
              "innerContent": ["<p class=\"tl-blog-card__excerpt\">", null, "</p>"]
            }
          ],
          "innerHTML": "<div class=\"tl-blog-card__content\"></div>",
          "innerContent": ["<div class=\"tl-blog-card__content\">", null, null, "</div>"]
        }
      ],
      "innerHTML": "<article class=\"tl-blog-card\"></article>",
      "innerContent": ["<article class=\"tl-blog-card\">", null, null, "</article>"]
    }
  ],
  "properties": [
    {
      "key": "title",
      "name": "Title",
      "type": "text",
      "default": "Blog Post Title"
    },
    {
      "key": "excerpt",
      "name": "Excerpt",
      "type": "text",
      "default": "A brief description of the blog post..."
    },
    {
      "key": "featuredImage",
      "name": "Featured Image",
      "type": "image",
      "default": ""
    }
  ]
}
```

---

## cURL Commands

### Create Component

```bash
curl -u "username:application-password" \
  -X POST \
  -H "Content-Type: application/json" \
  -d @component.json \
  "https://yoursite.com/wp-json/etch-api/components"
```

### Get Component (to verify)

```bash
curl -u "username:application-password" \
  "https://yoursite.com/wp-json/etch-api/components/123"
```

### Update Component

```bash
curl -u "username:application-password" \
  -X PUT \
  -H "Content-Type: application/json" \
  -d @updated-component.json \
  "https://yoursite.com/wp-json/etch-api/components/123"
```

### Delete Component

```bash
curl -u "username:application-password" \
  -X DELETE \
  "https://yoursite.com/wp-json/etch-api/components/123"
```

---

## Common Mistakes to Avoid

| Mistake | Correct |
|---------|---------|
| Putting `styles` at root level | Push styles separately via `PUT /styles` |
| Text in `innerHTML` | Use `etch/text` blocks |
| Missing `metadata.etchData` | Always include complete `etchData` object |
| Wrong property reference | Use `{props.propertyName}` not `{propertyName}` |
| Missing `null` in `innerContent` | One `null` per child block |
| Using `src` instead of `mediaId` for images | Use `mediaId` for WordPress media |
| Wrong `blockName` | Use `etch/element`, not `core/html` |
| Missing `innerBlocks` array | Always include (can be empty `[]`) |
