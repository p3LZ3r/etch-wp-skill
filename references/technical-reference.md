# Etch WP Technical Reference

This document contains technical details about the Etch WP plugin's internal structure, discovered through code analysis.

## Block Types (PHP Backend)

The plugin registers these custom Gutenberg blocks:

| Block Name | Class | Purpose |
|------------|-------|---------|
| `etch/element` | ElementBlock | Standard HTML elements (div, section, etc.) |
| `etch/text` | TextBlock | Text content with dynamic replacement |
| `etch/dynamic-image` | DynamicImageBlock | WordPress media images with mediaId |
| `etch/component` | ComponentBlock | Reusable component references |
| `etch/condition` | ConditionBlock | Conditional rendering |
| `etch/loop` | LoopBlock | Loop/repeat content |
| `etch/svg` | SvgBlock | SVG icons |
| `etch/slot` | SlotContentBlock | Component slots (content insertion) |
| `etch/slot-placeholder` | SlotPlaceholderBlock | Slot placeholders in components |
| `etch/raw-html` | RawHtmlBlock | Raw HTML output |
| `etch/dynamic-element` | DynamicElementBlock | Dynamic element variations |

## EtchData Structure

The `etchData` object inside `metadata` has this structure:

```json
{
  "origin": "etch",
  "name": "Block Name",
  "type": "html|loop|component|condition|slot|slot-placeholder",
  "tag": "div",
  "attributes": {
    "class": "tl-element",
    "data-etch-element": "section"
  },
  "styles": ["style-id-1", "style-id-2"],
  "hidden": false,
  "removeWrapper": false,
  "block": {
    "type": "html",
    "tag": "div",
    "specialized": null
  },
  "script": {
    "id": "unique-script-id",
    "code": "base64-encoded-javascript"
  },
  "misc": {},
  "nestedData": {},
  "loop": {
    "target": "loop-target",
    "itemId": "item",
    "indexId": "index",
    "loopParams": {}
  },
  "component": 123,
  "condition": {
    "leftHand": {"type": "path", "value": "{item.name}"},
    "operator": "==",
    "rightHand": {"type": "value", "value": "test"}
  },
  "conditionString": "{item.name} == 'test'",
  "slot": "slot-name"
}
```

### Field Details

| Field | Type | Description |
|-------|------|-------------|
| `origin` | string | Must be `"etch"` (or `"gutenberg"` for legacy) |
| `name` | string | Display name in Etch editor |
| `type` | string | Block type: `html`, `loop`, `component`, `condition`, `slot`, `slot-placeholder` |
| `tag` | string | HTML tag (default: `"div"`) |
| `attributes` | object | HTML attributes as key-value strings |
| `styles` | string[] | Array of 7-character style IDs |
| `hidden` | boolean | Whether block is hidden |
| `removeWrapper` | boolean | Remove wrapper element |
| `block` | object | Block definition with `type`, `tag`, `specialized` |
| `script` | object | JavaScript with `id` and base64 `code` |
| `misc` | object | Miscellaneous data |
| `nestedData` | object | Nested EtchData objects |
| `loop` | object | Loop configuration |
| `component` | integer | Component post ID |
| `condition` | object | Condition with `leftHand`, `operator`, `rightHand` |
| `slot` | string | Slot name for slot/placeholder blocks |

## Condition Operators

Valid condition operators (from `EtchDataCondition.php`):

| Operator | Description | Right Hand Required |
|----------|-------------|---------------------|
| `==` | Loose equality | Yes |
| `===` | Strict equality | Yes |
| `!=` | Loose inequality | Yes |
| `!==` | Strict inequality | Yes |
| `<` | Less than | Yes |
| `>` | Greater than | Yes |
| `<=` | Less than or equal | Yes |
| `>=` | Greater than or equal | Yes |
| `\|\|` | Logical OR | Yes |
| `&&` | Logical AND | Yes |
| `isTruthy` | Truthy check | No |
| `isFalsy` | Falsy check | No |

## Property Types

Component properties support these primitive types (from `EtchDataComponentProperty.php`):

| Primitive | Description | Specialized Variants |
|-----------|-------------|---------------------|
| `string` | Text values | `""` (empty) for basic, can have specialized |
| `number` | Numeric values | - |
| `boolean` | True/false | - |
| `array` | Arrays | `array` specialized |
| `object` | Objects | `group` specialized |

### Property Format

```json
{
  "key": "propertyName",
  "name": "Property Label",
  "type": {
    "primitive": "string",
    "specialized": ""
  },
  "default": "default value"
}
```

Or legacy format (still supported):
```json
{
  "key": "propertyName",
  "name": "Property Label",
  "type": "text",
  "default": "default value"
}
```

## Loop Configuration

Loop data structure (from `EtchDataLoop.php`):

```json
{
  "target": "loop-target-field",
  "itemId": "item",
  "indexId": "index",
  "loopParams": {},
  "version": 2
}
```

**Legacy formats also supported:**
- `loopId` → becomes `target`
- `targetItemId` + `targetPath` → combined as `"targetItemId.targetPath"`

## JavaScript Handling

Scripts in Etch WP are:
1. Stored in `etchData.script.code` as **Base64-encoded** JavaScript
2. Registered during block processing
3. Output in `wp_head` as `<script type="module" defer>`
4. Deduplicated based on content hash

**Important:** JavaScript code must be Base64 encoded (no line breaks) when stored in JSON.

## Component Processing Flow

When a component is rendered (`ComponentBlock.php`):

1. Load component data from `wp_block` post
2. Extract properties from `etch_component_properties` meta
3. Extract slot contents from inner blocks with `etch/slot` type
4. Merge default props with instance attributes
5. Replace slot placeholders with slot content
6. Process all component blocks with merged context

Context structure during component rendering:
```php
$component_context = array_merge(
    $parent_context,     // Parent data (this, post, etc.)
    array('props' => $component_props)  // Component properties
);
```

## Meta Keys Used

The plugin stores component data using these meta keys:

| Meta Key | Description |
|----------|-------------|
| `etch_component_html_key` | Component key for PHP usage (`etch_component('Key')`) |
| `etch_component_properties` | Serialized property definitions |
| `etch_component_post_id` | For legacy migration |

## Block Attributes Structure

Complete block structure expected by the plugin:

```json
{
  "blockName": "etch/element",
  "attrs": {
    "metadata": {
      "name": "Element Name",
      "etchData": { /* see EtchData structure above */ }
    },
    "tag": "div",
    "attributes": {
      "class": "tl-element"
    }
  },
  "innerBlocks": [],
  "innerHTML": "<div class=\"tl-element\"></div>",
  "innerContent": ["<div class=\"tl-element\">", null, "</div>"]
}
```

## Important Implementation Details

1. **EtchData Validation:** A block is only considered an "etch block" if `etchData.origin` is `"etch"` or `"gutenberg"` (legacy support).

2. **Component Properties:** Properties with `{props.xxx}` in their default value return empty string to prevent infinite loops.

3. **Slot Content Context:** Slot content uses parent context (from before component processing), not component context.

4. **Array Property Resolution:** Array properties can reference:
   - Global loop presets by key
   - Context expressions
   - JSON-encoded strings
   - Comma-separated values

5. **Style IDs:** Style IDs are 7-character alphanumeric strings stored in `etchData.styles` array.

6. **Dynamic Images:** Must use `etch/dynamic-image` block type with `mediaId` attribute, never `etch/element` with `tag: "img"`.

7. **Text Content:** All text must use `etch/text` blocks with `{props.propertyName}` or `{this.field}` syntax. Never put raw text in `innerHTML`.

8. **Inner Content:** The `innerContent` array uses `null` placeholders for child blocks. One `null` per child in `innerBlocks`.

## Default Element Styles (Built-in)

The plugin automatically applies styles to elements with `data-etch-element` attributes:

| Element Type | Attribute | Built-in Style |
|--------------|-----------|----------------|
| Section | `data-etch-element="section"` | Full width, flex column, centered |
| Container | `data-etch-element="container"` | Max-width 1366px, centered |
| Flex Div | `data-etch-element="flex-div"` | Flex column |
| Iframe | `data-etch-element="iframe"` | 16:9 aspect ratio |
| Root | `:root` | CSS variables placeholder |

**Usage:** When creating sections and containers, include these attributes to get automatic styling:

```json
{
  "attributes": {
    "class": "tl-section",
    "data-etch-element": "section"
  }
}
```

These styles are `readonly: true` and stored as `etch-section-style`, `etch-container-style`, etc. in the styles system.

## Condition Evaluation Details

### Truthiness Rules

From `ConditionEvaluator.php`:

- Empty values (`empty()` in PHP) are **falsy**
- String `"false"` (case-insensitive) is explicitly **falsy**
- Everything else follows PHP's truthiness rules

### Operator Encoding

Operators can be Unicode-encoded in condition strings:
- `u0026u0026` → `&&`
- `u007cu007c` → `||`
- `u003e` → `>`
- `u003c` → `<`
- `u003d` → `=`
- `u0021` → `!`

### Value Decoding

Values are automatically decoded:
- `u0022` (Unicode quote) is removed
- `&#8217;` (WordPress apostrophe) is normalized to `'`

## Dynamic Image Details

The `etch/dynamic-image` block:

1. **Default placeholder:** Uses `https://placehold.co/1920x1080` if no image
2. **mediaId:** Resolves WordPress attachment metadata
3. **useSrcSet:** Boolean for responsive images (string values: `"true"`, `"1"`, `"yes"`, `"on"`)
4. **maximumSize:** Image size to use (default: `"full"`)
5. **Fallback:** Returns `<img/>` if attachment not found

## Slot System Architecture

The slot system involves three components:

1. **etch/slot (SlotContentBlock)** - Used in component instances to provide content
2. **etch/slot-placeholder (SlotPlaceholderBlock)** - Used in component definitions to mark insertion point
3. **ComponentSlotContextProvider** - Manages slot context during rendering

### Slot Rendering Behavior

- Slot content uses **parent context** (not component context) to avoid props leakage
- Recursion guard prevents infinite slot rendering
- Dynamic content entries are preserved and restored after slot rendering
- Empty slot content renders nothing (no placeholder)

## Style System Structure

Styles are stored in WordPress options (`etch_styles`) with this structure:

```json
{
  "style-id-123": {
    "type": "class|element",
    "selector": ".class-name or [data-etch-element=\"type\"]",
    "collection": "default|custom",
    "css": "property: value;",
    "readonly": false|true
  }
}
```

### Style Types

- `type: "element"` - For structural elements (section, container, etc.)
- `type: "class"` - For custom CSS classes
- `readonly: true` - System styles that auto-update
- `readonly: false` - User-customizable styles

### Style Collections

- `collection: "default"` - Built-in and plugin styles
- Custom collections can be created for organization
