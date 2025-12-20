# Etch Native Components - Copy/Paste from Documentation

## ⚠️ IMPORTANT: Use Predefined Components, Don't Build Yourself!

Before building components like Accordion, Dialog, Navigation or Off-Canvas yourself:
→ **CHECK THE ETCH WP DOCUMENTATION FIRST: https://docs.etchwp.com/components-native/overview**

Etch WP provides predefined, tested Native Components that you can simply copy/paste.

## Currently Available Native Components (December 2025)

### 1. Accordion
**Purpose:** Collapsible content sections
**Documentation:** https://docs.etchwp.com/components-native/accordion
**When to use:** FAQ sections, collapsible content, toggleable content
**Benefits:** Accessibility built-in, tested, maintainable, ARIA attributes

**Workflow:**
1. User asks for Accordion/FAQ/Collapsible content
2. → Reference Etch WP documentation
3. → Recommend: "Copy/paste from docs instead of building yourself"

**Example Response:**
```
"I recommend using the predefined Etch WP Accordion component.
It's already accessibility-optimized and tested.

Documentation: https://docs.etchwp.com/components-native/accordion

Benefits:
- ARIA attributes for screen readers
- Keyboard navigation (Enter/Space to toggle)
- Smooth animations
- Tested and maintainable

Would you like to use the Native Component (recommended) or should I
build a custom solution?"
```

---

### 2. Dialog (Modal)
**Purpose:** Modal/popup component
**Documentation:** https://docs.etchwp.com/components-native/dialog
**When to use:** Popups, modals, overlays, confirmation dialogs
**Benefits:** Accessibility (Focus trap, ESC-key), ARIA attributes, backdrop

**Workflow:**
1. User asks for Modal/Dialog/Popup/Overlay
2. → Reference Etch WP documentation
3. → Recommend: "Copy/paste from docs instead of building yourself"

**Example Response:**
```
"I recommend using the predefined Etch WP Dialog component.
It's already accessibility-optimized and tested.

Documentation: https://docs.etchwp.com/components-native/dialog

Benefits:
- Focus trap (focus stays in dialog)
- ESC-key to close
- Backdrop/Overlay
- ARIA attributes for accessibility
- Tested and maintainable

Would you like to use the Native Component (recommended) or should I
build a custom solution?"
```

---

### 3. Off Canvas
**Purpose:** Slide-out panel
**Documentation:** https://docs.etchwp.com/components-native/off-canvas
**When to use:** Mobile menus, sidebars, filter panels, slide-out navigation
**Benefits:** Smooth animations, accessibility, responsive

**Workflow:**
1. User asks for Slide-out/Off-Canvas/Mobile Menu/Sidebar
2. → Reference Etch WP documentation
3. → Recommend: "Copy/paste from docs instead of building yourself"

**Example Response:**
```
"I recommend using the predefined Etch WP Off Canvas component.
It's already accessibility-optimized and tested.

Documentation: https://docs.etchwp.com/components-native/off-canvas

Benefits:
- Smooth slide-in/out animations
- Accessibility features
- Responsive behavior
- Close on backdrop click
- Tested and maintainable

Would you like to use the Native Component (recommended) or should I
build a custom solution?"
```

---

### 4. Basic Nav
**Purpose:** Navigation menu
**Documentation:** https://docs.etchwp.com/components-native/basic-nav
**When to use:** Website navigation, header menu, main navigation
**Benefits:** Responsive, accessibility, aria-current, mobile-friendly

**Workflow:**
1. User asks for Navigation/Nav Menu/Header Menu
2. → Reference Etch WP documentation
3. → Recommend: "Copy/paste from docs instead of building yourself"

**Example Response:**
```
"I recommend using the predefined Etch WP Basic Nav component.
It's already accessibility-optimized and tested.

Documentation: https://docs.etchwp.com/components-native/basic-nav

Benefits:
- Responsive behavior
- aria-current for active page
- Keyboard navigation
- Mobile-friendly
- Tested and maintainable

Would you like to use the Native Component (recommended) or should I
build a custom solution?"
```

---

## Planned Components (NOT YET AVAILABLE)

These components are planned but not yet available:

- **Advanced Nav** - Advanced navigation
- **Alert** - Alert/notification component
- **Before After** - Image comparison slider
- **Carousel** - Image/content carousel
- **Copy To Clipboard** - Copy button functionality
- **Countdown** - Countdown timer
- **Hotspot** - Interactive hotspots
- **Lightbox** - Image lightbox/gallery
- **Map** - Interactive maps
- **Read More** - Text expand/collapse
- **Slide Menu** - Advanced menu with submenus
- **Star Rating** - Rating component
- **Switch** - Toggle switch
- **Table** - Data tables
- **Table Of Contents** - Auto-generated TOC
- **Tabs** - Tab navigation
- **Tooltip** - Hover tooltips

**For these:** Build them yourself with `etch/element` and `etch/component` since they're not available as Native Components yet.

---

## Integration with Context7 MCP

When uncertain about Native Components availability:
1. Call `mcp__context7__resolve-library-id` with "etch wp"
2. Call `mcp__context7__get-library-docs` with topic "native components"
3. Check current availability in documentation

---

## Best Practice: Check Docs First

**BEFORE building a component, check:**

### Decision Tree:
```
User asks: "Create an accordion for FAQs"
↓
STOP! Check: Does a Native Component exist for this?
↓
YES → Etch WP Accordion exists ✅
↓
Recommend: "I recommend using the predefined Etch WP Accordion.
You can simply copy it from the documentation:
https://docs.etchwp.com/components-native/accordion

Benefits:
- Already accessibility-optimized
- Tested and maintainable
- Saves development time
- ARIA attributes built-in

Would you like to use the Native Component (recommended) or should I
build a custom solution?"
```

### When User Wants Custom Solution:
Only when user explicitly says:
- "No, build it yourself"
- "I need a custom solution"
- "The Native Component doesn't fit"

→ **THEN** build it with `etch/element` and `etch/component`

---

## Dynamic Data & Loops - NOT Part of Native Components

**IMPORTANT:** Loops and Dynamic Data are NOT part of Native Components!

### For Loops & Dynamic Content:
→ See **loops.md**

### For Props & Component Properties:
→ See **props-system.md**

**Native Components** are predefined UI components with built-in JavaScript and styling.
**Loops** are for repetitive content (posts, lists, etc.).
**Props** are for component parameters.

→ These are separate concepts and should not be confused.

---

## Summary

✅ **Use Native Components for:**
- Accordion, Dialog, Off-Canvas, Basic Nav

✅ **ALWAYS recommend:**
- Copy/paste from https://docs.etchwp.com/components-native/[component]
- Explain benefits (Accessibility, tested, maintainable)

✅ **Only build yourself when:**
- No Native Component exists (see "Planned Components")
- User explicitly wants custom build

⚠️ **DO NOT confuse with:**
- Loops (see loops.md)
- Props (see props-system.md)
- Dynamic Data (see loops.md)
