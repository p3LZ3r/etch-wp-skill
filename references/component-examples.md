# Complete Component Examples

These are real Etch WP components that can be directly copy-pasted into Etch.

## Complete Feature Section (Real Example from Etch Patterns)

This is a complete section with multiple components - demonstrates the full structure:

```json
{
  "type": "block",
  "gutenbergBlock": {
    "blockName": "etch/element",
    "attrs": {
      "metadata": {"name": "Feature Section Frankfurt"},
      "tag": "section",
      "attributes": {
        "data-etch-element": "section",
        "class": "feature-section-frankfurt"
      },
      "styles": ["etch-section-style", "pzfpn8v"]
    },
    "innerBlocks": [
      {
        "blockName": "etch/component",
        "attrs": {
          "ref": 89,
          "attributes": {
            "style": "Center"
          }
        },
        "innerBlocks": [],
        "innerHTML": "\n\n",
        "innerContent": ["\n", "\n"]
      },
      {
        "blockName": "etch/element",
        "attrs": {
          "metadata": {"name": "Content Wrapper"},
          "tag": "div",
          "attributes": {
            "data-etch-element": "container",
            "class": "feature-section-frankfurt__content-wrapper"
          },
          "styles": ["etch-container-style", "4c2wkxp"]
        },
        "innerBlocks": [
          {
            "blockName": "etch/element",
            "attrs": {
              "metadata": {"name": "Media Group"},
              "tag": "div",
              "attributes": {
                "data-etch-element": "flex-div",
                "class": "feature-section-frankfurt__media-group"
              },
              "styles": ["etch-flex-div-style", "qvzaqsj"]
            },
            "innerBlocks": [
              {
                "blockName": "etch/element",
                "attrs": {
                  "metadata": {"name": "Media"},
                  "options": {
                    "imageData": {
                      "attachmentId": 34,
                      "size": ""
                    }
                  },
                  "tag": "img",
                  "attributes": {
                    "src": "https://patterns.etchwp.com/wp-content/uploads/image.webp",
                    "class": "feature-section-frankfurt__media",
                    "alt": "Coffee Cup"
                  },
                  "styles": ["hipwrck"]
                },
                "innerBlocks": [],
                "innerHTML": "\n\n",
                "innerContent": ["\n", "\n"]
              }
            ],
            "innerHTML": "\n\n",
            "innerContent": ["\n", null, "\n"]
          }
        ],
        "innerHTML": "\n\n",
        "innerContent": ["\n", null, "\n"]
      }
    ],
    "innerHTML": "\n\n\n\n",
    "innerContent": ["\n", null, "\n\n", null, "\n"]
  },
  "version": 2,
  "styles": {
    "etch-section-style": {
      "type": "element",
      "selector": ":where([data-etch-element=\"section\"])",
      "collection": "default",
      "css": "inline-size: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;",
      "readonly": true
    },
    "pzfpn8v": {
      "type": "class",
      "selector": ".feature-section-frankfurt",
      "collection": "default",
      "css": "display: flex;\n  flex-direction: column;\n  gap: var(--container-gap);\n  padding-block: var(--section-space-l);\n  padding-inline: var(--gutter);",
      "readonly": false
    },
    "etch-flex-div-style": {
      "type": "element",
      "selector": ":where([data-etch-element=\"flex-div\"])",
      "collection": "default",
      "css": "inline-size: 100%;\n  display: flex;\n  flex-direction: column;",
      "readonly": true
    },
    "qvzaqsj": {
      "type": "class",
      "selector": ".feature-section-frankfurt__media-group",
      "collection": "default",
      "css": "display: grid;\n  grid-template-columns: var(--grid-3);\n  gap: var(--content-gap);",
      "readonly": false
    },
    "hipwrck": {
      "type": "class",
      "selector": ".feature-section-frankfurt__media",
      "collection": "default",
      "css": "border-radius: var(--radius);\n  block-size: 100%;\n  inline-size: 100%;\n  object-fit: cover;",
      "readonly": false
    }
  },
  "components": {
    "89": {
      "id": 89,
      "name": "Section Intro",
      "key": "SectionIntro",
      "blocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "metadata": {"name": "Section Intro"},
            "tag": "div",
            "attributes": {
              "data-etch-element": "container",
              "class": "section-intro"
            },
            "styles": ["etch-container-style"]
          },
          "innerBlocks": [
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Headline"},
                "tag": "h2",
                "attributes": {
                  "class": "section-intro__headline"
                },
                "styles": []
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "metadata": {"name": "Text"},
                    "content": "{props.headline}"
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
          "innerHTML": "\n\n",
          "innerContent": ["\n", null, "\n"]
        }
      ],
      "properties": [
        {
          "key": "headline",
          "name": "Headline",
          "keyTouched": false,
          "type": {"primitive": "string"},
          "default": "Your Headline Here"
        }
      ],
      "description": "",
      "legacyId": ""
    }
  }
}
```

## Simple Feature Card Component

```json
{
  "type": "block",
  "gutenbergBlock": {
    "blockName": "etch/component",
    "attrs": {
      "ref": 1,
      "attributes": {
        "hasIcon": "{false}",
        "heading": "Feature Heading",
        "description": "Feature description text here."
      }
    },
    "innerBlocks": [],
    "innerHTML": "\n\n",
    "innerContent": ["\n", "\n"]
  },
  "version": 2,
  "styles": {
    "etch-flex-div-style": {
      "type": "element",
      "selector": ":where([data-etch-element=\"flex-div\"])",
      "collection": "default",
      "css": "inline-size: 100%;\n  display: flex;\n  flex-direction: column;",
      "readonly": true
    },
    "feature-card": {
      "type": "class",
      "selector": ".feature-card",
      "collection": "default",
      "css": "display: flex;\n  flex-direction: column;\n  gap: var(--card-gap);\n  padding: var(--card-padding);\n  background: var(--white);\n  border-radius: var(--card-radius);\n  box-shadow: var(--card-shadow);\n  transition: var(--transition);\n  &:hover {\n    box-shadow: var(--box-shadow-2);\n  }",
      "readonly": false
    },
    "feature-card__icon": {
      "type": "class",
      "selector": ".feature-card__icon",
      "collection": "default",
      "css": "inline-size: 38px;",
      "readonly": false
    },
    "feature-card__heading": {
      "type": "class",
      "selector": ".feature-card__heading",
      "collection": "default",
      "css": "font-size: var(--h4);\n  font-family: var(--heading-font-family);\n  line-height: var(--heading-line-height);\n  font-weight: var(--heading-font-weight);\n  color: var(--heading-color);",
      "readonly": false
    },
    "feature-card__description": {
      "type": "class",
      "selector": ".feature-card__description",
      "collection": "default",
      "css": "font-size: var(--text-s);\n  line-height: var(--text-line-height);\n  color: var(--text-dark-muted);",
      "readonly": false
    }
  },
  "components": {
    "1": {
      "id": 1,
      "name": "Feature Card",
      "key": "FeatureCard",
      "blocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "metadata": {"name": "Feature Card"},
            "tag": "article",
            "attributes": {
              "data-etch-element": "flex-div",
              "class": "feature-card"
            },
            "styles": ["etch-flex-div-style", "feature-card"]
          },
          "innerBlocks": [
            {
              "blockName": "etch/condition",
              "attrs": {
                "metadata": {"name": "If (Condition)"},
                "condition": {
                  "leftHand": "props.hasIcon",
                  "operator": "isTruthy",
                  "rightHand": null
                },
                "conditionString": "props.hasIcon"
              },
              "innerBlocks": [
                {
                  "blockName": "etch/svg",
                  "attrs": {
                    "metadata": {"name": "Icon"},
                    "tag": "svg",
                    "attributes": {
                      "aria-hidden": "true",
                      "src": "{props.icon}",
                      "class": "feature-card__icon"
                    },
                    "styles": ["feature-card__icon"]
                  },
                  "innerBlocks": [],
                  "innerHTML": "\n\n",
                  "innerContent": ["\n", "\n"]
                }
              ],
              "innerHTML": "\n\n",
              "innerContent": ["\n", null, "\n"]
            },
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Heading"},
                "tag": "h2",
                "attributes": {
                  "class": "feature-card__heading"
                },
                "styles": ["feature-card__heading"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "metadata": {"name": "Text"},
                    "content": "{props.heading}"
                  },
                  "innerBlocks": [],
                  "innerHTML": "",
                  "innerContent": []
                }
              ],
              "innerHTML": "\n\n",
              "innerContent": ["\n", null, "\n"]
            },
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Description"},
                "tag": "p",
                "attributes": {
                  "class": "feature-card__description"
                },
                "styles": ["feature-card__description"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "metadata": {"name": "Text"},
                    "content": "{props.description}"
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
          "innerHTML": "\n\n\n\n\n\n",
          "innerContent": ["\n", null, "\n\n", null, "\n\n", null, "\n"]
        }
      ],
      "properties": [
        {
          "key": "hasIcon",
          "name": "Has Icon",
          "keyTouched": false,
          "type": {"primitive": "boolean"},
          "default": true
        },
        {
          "key": "icon",
          "name": "Icon",
          "keyTouched": false,
          "type": {
            "primitive": "string",
            "specialized": "image"
          }
        },
        {
          "key": "heading",
          "name": "Heading",
          "keyTouched": false,
          "type": {"primitive": "string"},
          "default": "Feature Heading"
        },
        {
          "key": "description",
          "name": "Description",
          "keyTouched": false,
          "type": {"primitive": "string"},
          "default": "Feature description text."
        }
      ],
      "description": "",
      "legacyId": ""
    }
  }
}
```

## Section with Multiple Components

```json
{
  "type": "block",
  "gutenbergBlock": {
    "blockName": "etch/element",
    "attrs": {
      "metadata": {"name": "Features Section"},
      "tag": "section",
      "attributes": {
        "data-etch-element": "section",
        "class": "features-section"
      },
      "styles": ["etch-section-style", "features-section"]
    },
    "innerBlocks": [
      {
        "blockName": "etch/element",
        "attrs": {
          "metadata": {"name": "Container"},
          "tag": "div",
          "attributes": {
            "data-etch-element": "container",
            "class": "features-section__container"
          },
          "styles": ["etch-container-style", "features-section__container"]
        },
        "innerBlocks": [
          {
            "blockName": "etch/element",
            "attrs": {
              "metadata": {"name": "Heading"},
              "tag": "h2",
              "attributes": {
                "class": "features-section__heading"
              },
              "styles": ["features-section__heading"]
            },
            "innerBlocks": [
              {
                "blockName": "etch/text",
                "attrs": {
                  "metadata": {"name": "Text"},
                  "content": "Our Features"
                },
                "innerBlocks": [],
                "innerHTML": "",
                "innerContent": []
              }
            ],
            "innerHTML": "\n\n",
            "innerContent": ["\n", null, "\n"]
          },
          {
            "blockName": "etch/element",
            "attrs": {
              "metadata": {"name": "Features Grid"},
              "tag": "div",
              "attributes": {
                "data-etch-element": "flex-div",
                "class": "features-section__grid"
              },
              "styles": ["etch-flex-div-style", "features-section__grid"]
            },
            "innerBlocks": [
              {
                "blockName": "etch/component",
                "attrs": {
                  "ref": 1,
                  "attributes": {
                    "hasIcon": "{false}",
                    "heading": "Fast Performance",
                    "description": "Lightning-fast load times for better user experience."
                  }
                },
                "innerBlocks": [],
                "innerHTML": "\n\n",
                "innerContent": ["\n", "\n"]
              },
              {
                "blockName": "etch/component",
                "attrs": {
                  "ref": 1,
                  "attributes": {
                    "hasIcon": "{false}",
                    "heading": "Responsive Design",
                    "description": "Looks great on all devices and screen sizes."
                  }
                },
                "innerBlocks": [],
                "innerHTML": "\n\n",
                "innerContent": ["\n", "\n"]
              },
              {
                "blockName": "etch/component",
                "attrs": {
                  "ref": 1,
                  "attributes": {
                    "hasIcon": "{false}",
                    "heading": "SEO Optimized",
                    "description": "Built with search engines in mind."
                  }
                },
                "innerBlocks": [],
                "innerHTML": "\n\n",
                "innerContent": ["\n", "\n"]
              }
            ],
            "innerHTML": "\n\n\n\n\n\n",
            "innerContent": ["\n", null, "\n\n", null, "\n\n", null, "\n"]
          }
        ],
        "innerHTML": "\n\n\n\n",
        "innerContent": ["\n", null, "\n\n", null, "\n"]
      }
    ],
    "innerHTML": "\n\n",
    "innerContent": ["\n", null, "\n"]
  },
  "version": 2,
  "styles": {
    "etch-section-style": {
      "type": "element",
      "selector": ":where([data-etch-element=\"section\"])",
      "collection": "default",
      "css": "inline-size: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;",
      "readonly": true
    },
    "etch-container-style": {
      "type": "element",
      "selector": ":where([data-etch-element=\"container\"])",
      "collection": "default",
      "css": "inline-size: 100%;\n  display: flex;\n  flex-direction: column;\n  max-width: var(--content-width);\n  align-self: center;",
      "readonly": true
    },
    "etch-flex-div-style": {
      "type": "element",
      "selector": ":where([data-etch-element=\"flex-div\"])",
      "collection": "default",
      "css": "inline-size: 100%;\n  display: flex;\n  flex-direction: column;",
      "readonly": true
    },
    "features-section": {
      "type": "class",
      "selector": ".features-section",
      "collection": "default",
      "css": "padding-block: var(--section-space-xl);\n  padding-inline: var(--gutter);\n  background: var(--bg-ultra-light);",
      "readonly": false
    },
    "features-section__container": {
      "type": "class",
      "selector": ".features-section__container",
      "collection": "default",
      "css": "gap: var(--container-gap);",
      "readonly": false
    },
    "features-section__heading": {
      "type": "class",
      "selector": ".features-section__heading",
      "collection": "default",
      "css": "font-size: var(--h2);\n  font-family: var(--heading-font-family);\n  line-height: var(--heading-line-height);\n  font-weight: var(--heading-font-weight);\n  color: var(--heading-color);\n  text-align: center;",
      "readonly": false
    },
    "features-section__grid": {
      "type": "class",
      "selector": ".features-section__grid",
      "collection": "default",
      "css": "display: grid;\n  grid-template-columns: var(--grid-auto-3);\n  gap: var(--grid-gap);",
      "readonly": false
    },
    "feature-card": {
      "type": "class",
      "selector": ".feature-card",
      "collection": "default",
      "css": "display: flex;\n  flex-direction: column;\n  gap: var(--card-gap);\n  padding: var(--card-padding);\n  background: var(--white);\n  border-radius: var(--card-radius);\n  box-shadow: var(--card-shadow);",
      "readonly": false
    },
    "feature-card__heading": {
      "type": "class",
      "selector": ".feature-card__heading",
      "collection": "default",
      "css": "font-size: var(--h4);\n  font-family: var(--heading-font-family);\n  line-height: var(--heading-line-height);\n  font-weight: var(--heading-font-weight);\n  color: var(--heading-color);",
      "readonly": false
    },
    "feature-card__description": {
      "type": "class",
      "selector": ".feature-card__description",
      "collection": "default",
      "css": "font-size: var(--text-s);\n  line-height: var(--text-line-height);\n  color: var(--text-dark-muted);",
      "readonly": false
    }
  },
  "components": {
    "1": {
      "id": 1,
      "name": "Feature Card",
      "key": "FeatureCard",
      "blocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "metadata": {"name": "Feature Card"},
            "tag": "article",
            "attributes": {
              "data-etch-element": "flex-div",
              "class": "feature-card"
            },
            "styles": ["etch-flex-div-style", "feature-card"]
          },
          "innerBlocks": [
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Heading"},
                "tag": "h3",
                "attributes": {
                  "class": "feature-card__heading"
                },
                "styles": ["feature-card__heading"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "metadata": {"name": "Text"},
                    "content": "{props.heading}"
                  },
                  "innerBlocks": [],
                  "innerHTML": "",
                  "innerContent": []
                }
              ],
              "innerHTML": "\n\n",
              "innerContent": ["\n", null, "\n"]
            },
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Description"},
                "tag": "p",
                "attributes": {
                  "class": "feature-card__description"
                },
                "styles": ["feature-card__description"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "metadata": {"name": "Text"},
                    "content": "{props.description}"
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
          "innerHTML": "\n\n\n\n",
          "innerContent": ["\n", null, "\n\n", null, "\n"]
        }
      ],
      "properties": [
        {
          "key": "hasIcon",
          "name": "Has Icon",
          "keyTouched": false,
          "type": {"primitive": "boolean"},
          "default": false
        },
        {
          "key": "heading",
          "name": "Heading",
          "keyTouched": false,
          "type": {"primitive": "string"},
          "default": "Feature Heading"
        },
        {
          "key": "description",
          "name": "Description",
          "keyTouched": false,
          "type": {"primitive": "string"},
          "default": "Feature description."
        }
      ],
      "description": "",
      "legacyId": ""
    }
  }
}
```

## Key Patterns with ACSS Variables

### Component Reference Pattern
```json
{
  "blockName": "etch/component",
  "attrs": {
    "ref": 1,
    "attributes": {
      "propName": "value"
    }
  }
}
```

### Conditional Content Pattern
```json
{
  "blockName": "etch/condition",
  "attrs": {
    "condition": {
      "leftHand": "props.show",
      "operator": "isTruthy",
      "rightHand": null
    },
    "conditionString": "props.show"
  },
  "innerBlocks": [/* content when true */]
}
```

### Text with Props Pattern
```json
{
  "blockName": "etch/text",
  "attrs": {
    "content": "{props.propertyName}"
  }
}
```

### Grid Layout Pattern with ACSS
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "div",
    "attributes": {
      "class": "grid"
    },
    "styles": ["grid-style"]
  }
}
```

With CSS using ACSS variables:
```json
"grid-style": {
  "css": "display: grid;\n  grid-template-columns: var(--grid-auto-3);\n  gap: var(--grid-gap);"
}
```

### Card Component Pattern with ACSS
```json
"card-style": {
  "css": "display: flex;\n  flex-direction: column;\n  gap: var(--card-gap);\n  padding: var(--card-padding);\n  background: var(--white);\n  border-radius: var(--card-radius);\n  box-shadow: var(--card-shadow);"
}
```

### Section Pattern with ACSS
```json
"section-style": {
  "css": "padding-block: var(--section-space-l);\n  padding-inline: var(--gutter);\n  background: var(--bg-ultra-light);"
}
```

### Typography Pattern with ACSS
```json
"heading-style": {
  "css": "font-size: var(--h3);\n  font-family: var(--heading-font-family);\n  line-height: var(--heading-line-height);\n  font-weight: var(--heading-font-weight);\n  color: var(--heading-color);"
}
```

---

## Component with Slots Examples

Slots provide flexible content areas within components. Use slots when you need to nest complex content, multiple components, or give users complete control over what goes inside.

### Simple Card Component with Slots

This card component uses props for simple values (title) and slots for complex content (body, footer):

```json
{
  "type": "block",
  "gutenbergBlock": {
    "blockName": "etch/component",
    "attrs": {
      "ref": 100,
      "attributes": {
        "title": "Card Title"
      }
    },
    "innerBlocks": [
      {
        "blockName": "etch/element",
        "attrs": {
          "metadata": {"name": "Slot: body"},
          "tag": "div",
          "attributes": {
            "data-slot": "body"
          }
        },
        "innerBlocks": [
          {
            "blockName": "etch/element",
            "attrs": {
              "tag": "p"
            },
            "innerBlocks": [
              {
                "blockName": "etch/text",
                "attrs": {
                  "content": "This is custom body content with full flexibility."
                }
              }
            ]
          },
          {
            "blockName": "etch/element",
            "attrs": {
              "tag": "img",
              "attributes": {
                "src": "https://example.com/image.jpg",
                "alt": "Image"
              }
            }
          }
        ],
        "innerHTML": "\n\n\n\n",
        "innerContent": ["\n", null, "\n\n", null, "\n"]
      },
      {
        "blockName": "etch/element",
        "attrs": {
          "metadata": {"name": "Slot: footer"},
          "tag": "div",
          "attributes": {
            "data-slot": "footer"
          }
        },
        "innerBlocks": [
          {
            "blockName": "etch/element",
            "attrs": {
              "tag": "a",
              "attributes": {
                "href": "#",
                "class": "btn"
              }
            },
            "innerBlocks": [
              {
                "blockName": "etch/text",
                "attrs": {
                  "content": "Learn More"
                }
              }
            ]
          }
        ],
        "innerHTML": "\n\n",
        "innerContent": ["\n", null, "\n"]
      }
    ],
    "innerHTML": "\n\n\n\n",
    "innerContent": ["\n", null, "\n\n", null, "\n"]
  },
  "version": 2,
  "styles": {
    "card-style": {
      "type": "class",
      "selector": ".card",
      "collection": "default",
      "css": "display: flex;\n  flex-direction: column;\n  gap: var(--card-gap);\n  padding: var(--card-padding);\n  background: var(--bg-light);\n  border-radius: var(--card-radius);\n  box-shadow: var(--card-shadow);",
      "readonly": false
    },
    "card__header-style": {
      "type": "class",
      "selector": ".card__header",
      "collection": "default",
      "css": "padding-bottom: var(--space-s);\n  border-bottom: 1px solid var(--border-color);",
      "readonly": false
    },
    "card__title-style": {
      "type": "class",
      "selector": ".card__title",
      "collection": "default",
      "css": "font-size: var(--h4);\n  font-weight: var(--heading-font-weight);\n  color: var(--text-dark);",
      "readonly": false
    },
    "card__body-style": {
      "type": "class",
      "selector": ".card__body",
      "collection": "default",
      "css": "display: flex;\n  flex-direction: column;\n  gap: var(--space-m);",
      "readonly": false
    },
    "card__footer-style": {
      "type": "class",
      "selector": ".card__footer",
      "collection": "default",
      "css": "padding-top: var(--space-s);\n  border-top: 1px solid var(--border-color);",
      "readonly": false
    }
  },
  "components": {
    "100": {
      "id": 100,
      "name": "Card with Slots",
      "key": "CardWithSlots",
      "blocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "metadata": {"name": "Card"},
            "tag": "article",
            "attributes": {
              "class": "card"
            },
            "styles": ["card-style"]
          },
          "innerBlocks": [
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Card Header"},
                "tag": "div",
                "attributes": {
                  "class": "card__header"
                },
                "styles": ["card__header-style"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/element",
                  "attrs": {
                    "tag": "h3",
                    "attributes": {
                      "class": "card__title"
                    },
                    "styles": ["card__title-style"]
                  },
                  "innerBlocks": [
                    {
                      "blockName": "etch/text",
                      "attrs": {
                        "content": "{props.title}"
                      }
                    }
                  ],
                  "innerHTML": "\n\n",
                  "innerContent": ["\n", null, "\n"]
                }
              ],
              "innerHTML": "\n\n",
              "innerContent": ["\n", null, "\n"]
            },
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Card Body"},
                "tag": "div",
                "attributes": {
                  "class": "card__body"
                },
                "styles": ["card__body-style"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "metadata": {"name": "Slot: body"},
                    "content": "{@slot body}"
                  }
                }
              ],
              "innerHTML": "\n\n",
              "innerContent": ["\n", null, "\n"]
            },
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Card Footer"},
                "tag": "div",
                "attributes": {
                  "class": "card__footer"
                },
                "styles": ["card__footer-style"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "metadata": {"name": "Slot: footer"},
                    "content": "{@slot footer}"
                  }
                }
              ],
              "innerHTML": "\n\n",
              "innerContent": ["\n", null, "\n"]
            }
          ],
          "innerHTML": "\n\n\n\n\n\n",
          "innerContent": ["\n", null, "\n\n", null, "\n\n", null, "\n"]
        }
      ],
      "properties": [
        {
          "key": "title",
          "name": "Card Title",
          "keyTouched": false,
          "type": {"primitive": "string"},
          "default": "Card Title"
        }
      ],
      "description": "Card component with flexible body and footer slots",
      "legacyId": ""
    }
  }
}
```

### Accordion/FAQ Item with Slots

Perfect for FAQ sections where questions and answers need complex formatting:

```json
{
  "type": "block",
  "gutenbergBlock": {
    "blockName": "etch/component",
    "attrs": {
      "ref": 200,
      "attributes": {
        "isOpen": "{false}"
      }
    },
    "innerBlocks": [
      {
        "blockName": "etch/element",
        "attrs": {
          "metadata": {"name": "Slot: question"},
          "tag": "div",
          "attributes": {
            "data-slot": "question"
          }
        },
        "innerBlocks": [
          {
            "blockName": "etch/element",
            "attrs": {
              "tag": "h3"
            },
            "innerBlocks": [
              {
                "blockName": "etch/text",
                "attrs": {
                  "content": "How do I get started?"
                }
              }
            ]
          }
        ],
        "innerHTML": "\n\n",
        "innerContent": ["\n", null, "\n"]
      },
      {
        "blockName": "etch/element",
        "attrs": {
          "metadata": {"name": "Slot: answer"},
          "tag": "div",
          "attributes": {
            "data-slot": "answer"
          }
        },
        "innerBlocks": [
          {
            "blockName": "etch/element",
            "attrs": {
              "tag": "p"
            },
            "innerBlocks": [
              {
                "blockName": "etch/text",
                "attrs": {
                  "content": "Getting started is easy! Follow these steps:"
                }
              }
            ]
          },
          {
            "blockName": "etch/element",
            "attrs": {
              "tag": "ol"
            },
            "innerBlocks": [
              {
                "blockName": "etch/element",
                "attrs": {
                  "tag": "li"
                },
                "innerBlocks": [
                  {
                    "blockName": "etch/text",
                    "attrs": {
                      "content": "Sign up for an account"
                    }
                  }
                ]
              },
              {
                "blockName": "etch/element",
                "attrs": {
                  "tag": "li"
                },
                "innerBlocks": [
                  {
                    "blockName": "etch/text",
                    "attrs": {
                      "content": "Complete your profile"
                    }
                  }
                ]
              },
              {
                "blockName": "etch/element",
                "attrs": {
                  "tag": "li"
                },
                "innerBlocks": [
                  {
                    "blockName": "etch/text",
                    "attrs": {
                      "content": "Start creating!"
                    }
                  }
                ]
              }
            ],
            "innerHTML": "\n\n\n\n\n\n",
            "innerContent": ["\n", null, "\n\n", null, "\n\n", null, "\n"]
          }
        ],
        "innerHTML": "\n\n\n\n",
        "innerContent": ["\n", null, "\n\n", null, "\n"]
      }
    ],
    "innerHTML": "\n\n\n\n",
    "innerContent": ["\n", null, "\n\n", null, "\n"]
  },
  "version": 2,
  "styles": {
    "accordion-item-style": {
      "type": "class",
      "selector": ".accordion-item",
      "collection": "default",
      "css": "border: 1px solid var(--border-color);\n  border-radius: var(--radius);\n  overflow: hidden;",
      "readonly": false
    },
    "accordion-header-style": {
      "type": "class",
      "selector": ".accordion-item__header",
      "collection": "default",
      "css": "display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: var(--space-m);\n  background: var(--bg-light);\n  cursor: pointer;\n  &:hover {\n    background: var(--bg-base);\n  }",
      "readonly": false
    },
    "accordion-question-style": {
      "type": "class",
      "selector": ".accordion-item__question",
      "collection": "default",
      "css": "flex: 1;",
      "readonly": false
    },
    "accordion-body-style": {
      "type": "class",
      "selector": ".accordion-item__body",
      "collection": "default",
      "css": "padding: var(--space-m);\n  background: var(--bg-ultra-light);\n  &[data-is-open='false'] {\n    display: none;\n  }",
      "readonly": false
    },
    "accordion-answer-style": {
      "type": "class",
      "selector": ".accordion-item__answer",
      "collection": "default",
      "css": "display: flex;\n  flex-direction: column;\n  gap: var(--space-s);",
      "readonly": false
    }
  },
  "components": {
    "200": {
      "id": 200,
      "name": "Accordion Item",
      "key": "AccordionItem",
      "blocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "metadata": {"name": "Accordion Item"},
            "tag": "div",
            "attributes": {
              "class": "accordion-item"
            },
            "styles": ["accordion-item-style"]
          },
          "innerBlocks": [
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Header"},
                "tag": "button",
                "attributes": {
                  "class": "accordion-item__header",
                  "type": "button"
                },
                "styles": ["accordion-header-style"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/element",
                  "attrs": {
                    "tag": "div",
                    "attributes": {
                      "class": "accordion-item__question"
                    },
                    "styles": ["accordion-question-style"]
                  },
                  "innerBlocks": [
                    {
                      "blockName": "etch/text",
                      "attrs": {
                        "metadata": {"name": "Slot: question"},
                        "content": "{@slot question}"
                      }
                    }
                  ],
                  "innerHTML": "\n\n",
                  "innerContent": ["\n", null, "\n"]
                }
              ],
              "innerHTML": "\n\n",
              "innerContent": ["\n", null, "\n"]
            },
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Body"},
                "tag": "div",
                "attributes": {
                  "class": "accordion-item__body",
                  "data-is-open": "{props.isOpen}"
                },
                "styles": ["accordion-body-style"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/element",
                  "attrs": {
                    "tag": "div",
                    "attributes": {
                      "class": "accordion-item__answer"
                    },
                    "styles": ["accordion-answer-style"]
                  },
                  "innerBlocks": [
                    {
                      "blockName": "etch/text",
                      "attrs": {
                        "metadata": {"name": "Slot: answer"},
                        "content": "{@slot answer}"
                      }
                    }
                  ],
                  "innerHTML": "\n\n",
                  "innerContent": ["\n", null, "\n"]
                }
              ],
              "innerHTML": "\n\n",
              "innerContent": ["\n", null, "\n"]
            }
          ],
          "innerHTML": "\n\n\n\n",
          "innerContent": ["\n", null, "\n\n", null, "\n"]
        }
      ],
      "properties": [
        {
          "key": "isOpen",
          "name": "Is Open",
          "keyTouched": false,
          "type": {"primitive": "boolean"},
          "default": false
        }
      ],
      "description": "Accordion item with flexible question and answer slots",
      "legacyId": ""
    }
  }
}
```

### Feature Section with Media Slot

This pattern shows how to use slots for complex media areas (images, videos, multiple components):

```json
{
  "type": "block",
  "gutenbergBlock": {
    "blockName": "etch/component",
    "attrs": {
      "ref": 300,
      "attributes": {
        "heading": "Amazing Feature",
        "description": "This feature will change everything.",
        "layout": "image-left"
      }
    },
    "innerBlocks": [
      {
        "blockName": "etch/element",
        "attrs": {
          "metadata": {"name": "Slot: media"},
          "tag": "div",
          "attributes": {
            "data-slot": "media"
          }
        },
        "innerBlocks": [
          {
            "blockName": "etch/element",
            "attrs": {
              "tag": "img",
              "attributes": {
                "src": "https://example.com/feature-image.jpg",
                "alt": "Feature visualization"
              }
            }
          }
        ],
        "innerHTML": "\n\n",
        "innerContent": ["\n", null, "\n"]
      }
    ],
    "innerHTML": "\n\n",
    "innerContent": ["\n", null, "\n"]
  },
  "version": 2,
  "styles": {
    "feature-split-style": {
      "type": "class",
      "selector": ".feature-split",
      "collection": "default",
      "css": "display: grid;\n  grid-template-columns: 1fr;\n  gap: var(--grid-gap);\n  align-items: center;\n  @media (width >= to-rem(768px)) {\n    grid-template-columns: repeat(2, 1fr);\n  }\n  &[data-layout='image-right'] {\n    .feature-split__media {\n      order: 2;\n    }\n  }",
      "readonly": false
    },
    "feature-split-content-style": {
      "type": "class",
      "selector": ".feature-split__content",
      "collection": "default",
      "css": "display: flex;\n  flex-direction: column;\n  gap: var(--content-gap);",
      "readonly": false
    },
    "feature-split-heading-style": {
      "type": "class",
      "selector": ".feature-split__heading",
      "collection": "default",
      "css": "font-size: var(--h2);\n  font-weight: var(--heading-font-weight);\n  color: var(--text-dark);",
      "readonly": false
    },
    "feature-split-description-style": {
      "type": "class",
      "selector": ".feature-split__description",
      "collection": "default",
      "css": "font-size: var(--text-m);\n  line-height: var(--text-line-height);\n  color: var(--text-dark-muted);",
      "readonly": false
    },
    "feature-split-media-style": {
      "type": "class",
      "selector": ".feature-split__media",
      "collection": "default",
      "css": "border-radius: var(--radius);\n  overflow: hidden;",
      "readonly": false
    }
  },
  "components": {
    "300": {
      "id": 300,
      "name": "Feature Split",
      "key": "FeatureSplit",
      "blocks": [
        {
          "blockName": "etch/element",
          "attrs": {
            "metadata": {"name": "Feature Split"},
            "tag": "div",
            "attributes": {
              "class": "feature-split",
              "data-layout": "{props.layout}"
            },
            "styles": ["feature-split-style"]
          },
          "innerBlocks": [
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Content"},
                "tag": "div",
                "attributes": {
                  "class": "feature-split__content"
                },
                "styles": ["feature-split-content-style"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/element",
                  "attrs": {
                    "tag": "h2",
                    "attributes": {
                      "class": "feature-split__heading"
                    },
                    "styles": ["feature-split-heading-style"]
                  },
                  "innerBlocks": [
                    {
                      "blockName": "etch/text",
                      "attrs": {
                        "content": "{props.heading}"
                      }
                    }
                  ],
                  "innerHTML": "\n\n",
                  "innerContent": ["\n", null, "\n"]
                },
                {
                  "blockName": "etch/element",
                  "attrs": {
                    "tag": "p",
                    "attributes": {
                      "class": "feature-split__description"
                    },
                    "styles": ["feature-split-description-style"]
                  },
                  "innerBlocks": [
                    {
                      "blockName": "etch/text",
                      "attrs": {
                        "content": "{props.description}"
                      }
                    }
                  ],
                  "innerHTML": "\n\n",
                  "innerContent": ["\n", null, "\n"]
                }
              ],
              "innerHTML": "\n\n\n\n",
              "innerContent": ["\n", null, "\n\n", null, "\n"]
            },
            {
              "blockName": "etch/element",
              "attrs": {
                "metadata": {"name": "Media"},
                "tag": "div",
                "attributes": {
                  "class": "feature-split__media"
                },
                "styles": ["feature-split-media-style"]
              },
              "innerBlocks": [
                {
                  "blockName": "etch/text",
                  "attrs": {
                    "metadata": {"name": "Slot: media"},
                    "content": "{@slot media}"
                  }
                }
              ],
              "innerHTML": "\n\n",
              "innerContent": ["\n", null, "\n"]
            }
          ],
          "innerHTML": "\n\n\n\n",
          "innerContent": ["\n", null, "\n\n", null, "\n"]
        }
      ],
      "properties": [
        {
          "key": "heading",
          "name": "Heading",
          "keyTouched": false,
          "type": {"primitive": "string"},
          "default": "Feature Heading"
        },
        {
          "key": "description",
          "name": "Description",
          "keyTouched": false,
          "type": {"primitive": "string"},
          "default": "Feature description text."
        },
        {
          "key": "layout",
          "name": "Layout",
          "keyTouched": false,
          "type": {
            "primitive": "string",
            "specialized": "select"
          },
          "selectOptionsString": "image-left\nimage-right",
          "default": "image-left"
        }
      ],
      "description": "Feature section with flexible media slot and layout options",
      "legacyId": ""
    }
  }
}
```

### Key Takeaways from Slot Examples

1. **Slot Definition** - Use `{@slot slotName}` in component definition within `etch/text` blocks
2. **Slot Usage** - Pass content via `innerBlocks` in `etch/component` with `data-slot` attribute
3. **Combine Props & Slots** - Props for simple config (title, layout), slots for complex content
4. **Empty Slots** - Render nothing if not populated, no empty wrappers
5. **Naming** - Use semantic names: `body`, `footer`, `media`, `question`, `answer`
6. **Flexibility** - Slots accept anything: text, images, lists, nested components
