# Data Modifiers in Etch WP

Data modifiers transform and manipulate dynamic values in Etch WP. They work with props, loop items, and dynamic data keys.

## Basic Modifiers

### ceil()
Rounds a number up to the nearest integer.
```javascript
{item.value.ceil()}
```

### floor()
Rounds a number down to the nearest integer.
```javascript
{item.value.floor()}
```

### round()
Rounds a number to the nearest integer.
```javascript
{item.value.round()}
```

### toInt()
Converts a value to an integer. Truncates decimal parts.
```javascript
// "123" becomes 123
// "123.9" becomes 123
// "abc" remains unchanged
{item.value.toInt()}
```

### toString()
Converts any value to its string representation. Booleans become 'true' or 'false', scalars are cast directly, arrays/objects are JSON-encoded.
```javascript
{item.value.toString()}
```

### slice(start, end)
Extracts a section of an array. Useful for limiting loop items.
```javascript
// Get first 3 items from a prop array
{#loop props.myLoop.slice(0, 3) as item}
  <article>
    <h2>{item.title}</h2>
  </article>
{/loop}
```

### applyData()
Reapplies dynamic data replacement to a value containing placeholders. Used for template strings.
```javascript
// If item.text = "Hello {user.name}"
{item.text.applyData()}
// Renders: Hello John
```

### raw()
Outputs the raw value without escaping. Use with caution for trusted content only.

## Comparison Modifiers

### equal(compareTo, trueValue, falseValue)
Checks if value is strictly equal to comparison. Returns custom values if provided.
```javascript
{item.value.equal("active")}
{item.value.equal("active", "Is Active", "Is Inactive")}
```

### greater(compareTo, trueValue, falseValue)
Checks if value is greater than comparison.
```javascript
{item.price.greater(10)}
{item.price.greater(10, "Expensive", "Affordable")}
```

### less(compareTo, trueValue, falseValue)
Checks if value is less than comparison.
```javascript
{item.stock.less(5)}
{item.stock.less(5, "Low Stock", "In Stock")}
```

### greaterOrEqual(compareTo, trueValue, falseValue)
Checks if value is greater than or equal to comparison.
```javascript
{item.rating.greaterOrEqual(4)}
{item.rating.greaterOrEqual(4, "Recommended", "Standard")}
```

### lessOrEqual(compareTo, trueValue, falseValue)
Checks if value is less than or equal to comparison.
```javascript
{item.quantity.lessOrEqual(100)}
{item.quantity.lessOrEqual(100, "Available", "Limited")}
```

### includes(searchValue, trueValue, falseValue)
Checks if string contains substring or array contains value. Case-sensitive.
```javascript
// String check
{item.name.includes("foo")}

// Array check
{user.userRoles.includes("editor")}

// With custom return values
{item.name.includes("bar", "Yes", "No")}
```

## Usage Patterns

### In Props
Pass modified values to component props.
```json
{
  "blockName": "etch/component",
  "attrs": {
    "ref": 123,
    "attributes": {
      "itemCount": "{props.items.length}",
      "displayName": "{props.name.toString()}"
    }
  }
}
```

### In Loops
Modify loop items during iteration.
```json
{
  "blockName": "etch/text",
  "attrs": {
    "content": "{item.price.toString()}"
  }
}
```

### In Loop Arguments
Pass modified values to nested loop queries.
```json
{#loop props.myLoop($count: props.myCount.toInt()) as item}
  // loop content
{/loop}
```

### Conditional CSS Classes
Use modifiers for clean conditional class assignment.
```json
{
  "blockName": "etch/element",
  "attrs": {
    "tag": "div",
    "attributes": {
      "class": "{product.price.greater(10, 'product--expensive', 'product--affordable')}"
    }
  }
}
```

## Type Conversion Examples

### String to Integer
```javascript
// Prop value: "5"
props.count.toInt()
// Result: 5 (number)
```

### Number to String
```javascript
// Prop value: 42
props.id.toString()
// Result: "42" (string)
```

### Boolean to String
```javascript
// Prop value: true
props.isActive.toString()
// Result: "true" (string)
```

## Comparison Examples

### Price Thresholds
```javascript
{product.price.greater(100, "premium", "standard")}
```

### Stock Levels
```javascript
{product.stock.less(10, "low-stock", "in-stock")}
```

### Rating Checks
```javascript
{product.rating.greaterOrEqual(4, "recommended", "standard")}
```

### Role-Based Display
```javascript
{user.userRoles.includes("administrator", "admin-view", "user-view")}
```

## Common Use Cases

### Limit Loop Items
```javascript
{#loop props.items.slice(0, 6) as item}
  // Display first 6 items
{/loop}
```

### Conditional Styling
```json
"attributes": {
  "data-status": "{item.status.equal('active', 'active', 'inactive')}",
  "class": "{item.featured.equal('true', 'featured-card', 'standard-card')}"
}
```

### Number Formatting
```javascript
// Ensure numeric operations
{item.quantity.toInt()}
{item.price.greater(0)}
```

### Text Processing
```javascript
// Check for keywords
{item.title.includes("sale")}
{item.category.equal("featured")}
```

## Best Practices

1. Use type conversion modifiers before comparison modifiers for reliable results
2. Provide meaningful custom return values for better UX
3. Use .includes() for role checks and keyword searches
4. Combine modifiers with conditional logic for complex conditions
5. Test modifiers with sample data to ensure expected behavior
6. Use .toInt() when passing numeric values to loop arguments
7. Be careful with .raw() - only use for trusted content

## Important Notes

- All comparison modifiers are strict (===) unless specified
- .includes() is case-sensitive for strings
- .toInt() truncates decimals, use .round() for standard rounding
- .applyData() only works with dynamic data placeholders
- Modifiers chain from left to right
