# Official Etch WP Patterns Reference

## Overview

The official Etch WP patterns library at **https://patterns.etchwp.com/** contains dozens of production-ready, professionally designed patterns built by the Etch team.

**Use these patterns as a PRIMARY reference** when users ask for common components.

## When to Use Official Patterns

✅ **ALWAYS check patterns.etchwp.com first** when users request:
- Hero sections
- Headers/Navigation
- Footers
- Feature sections
- Testimonials
- Content layouts
- Blog layouts
- Interactive components (accordions, dialogs, drawers)
- Avatar/profile components

## Available Pattern Categories

### 1. Hero Sections
**URL**: https://patterns.etchwp.com/layouts/ (filter: Hero)

Common variants:
- `hero-alpha` - Classic centered hero
- `hero-bravo` - Split layout with image
- `hero-charlie` - Full-width background
- `hero-delta` - Asymmetric design
- `hero-echo` - Minimal text focus
- `hero-foxtrot` - Video background
- `hero-golf` - Multi-CTA
- `hero-juliet` - Feature grid
- `hero-victor` - Zigzag layout

### 2. Headers/Navigation
**URL**: https://patterns.etchwp.com/layouts/ (filter: Headers)

Common variants:
- `header-alpha` - Standard navigation
- `nav-alpha` - Main navigation
- `drawer-alpha` - Mobile drawer menu
- Additional headers with search, CTA buttons, mega menus

### 3. Footer Sections
**URL**: https://patterns.etchwp.com/layouts/ (filter: Footer)

Common variants:
- `footer-alpha` - Multi-column footer
- Additional variants with newsletter, social icons, sitemap

### 4. Features
**URL**: https://patterns.etchwp.com/layouts/ (filter: Features)

Common variants:
- `features-alpha` - Grid layout
- `features-section-alpha` - Feature showcase
- Additional variants with icons, images, cards

### 5. Testimonials
**URL**: https://patterns.etchwp.com/layouts/ (filter: Testimonials)

Common variants:
- `testimonials-alpha` - Card grid
- `testimonial-section-alpha` - Featured testimonial
- Additional variants with ratings, avatars

### 6. Content Sections
**URL**: https://patterns.etchwp.com/layouts/ (filter: Content)

Common variants:
- `content-alpha` - Standard content block
- `articles-section-alpha` - Article grid
- Additional text-heavy layouts

### 7. Interactive Components
**URL**: https://patterns.etchwp.com/layouts/ (filter: Interactive)

Common variants:
- `accordion-alpha` - FAQ accordion
- `dialog-alpha` - Modal dialog
- `drawer-alpha` - Slide-out drawer
- Additional interactive patterns

### 8. Blog Layouts
**URL**: https://patterns.etchwp.com/layouts/ (filter: Blog)

Common variants:
- Blog card grids
- Featured post layouts
- Archive pages

### 9. Avatars & Profiles
**URL**: https://patterns.etchwp.com/layouts/ (filter: Avatars)

Common variants:
- Profile cards
- Team member grids
- Author bylines

## How to Use Patterns

### Recommended Workflow

1. **User Request**: User asks for a component
   ```
   "Create a hero section for my homepage"
   ```

2. **Check Patterns Site**:
   ```
   Look at https://patterns.etchwp.com/layouts/
   Filter by "Hero"
   Find appropriate variant (hero-alpha, hero-bravo, etc.)
   ```

3. **Recommend Pattern**:
   ```
   "I recommend using the official Etch WP pattern 'hero-alpha'
   which provides a classic centered hero section.

   You can view it here: https://patterns.etchwp.com/layouts/hero-alpha/

   To use it:
   1. Visit the pattern page
   2. Click 'Copy Code'
   3. Paste into Etch WP
   4. Customize the content (text, images, colors)

   This pattern includes:
   - Centered heading and description
   - CTA button
   - ACSS v4 variables
   - Responsive design
   - Accessibility features

   Would you like me to help customize it, or would you prefer
   a custom-built hero section?
   ```

4. **If User Wants Customization**: Fetch the pattern and modify it

5. **If User Wants Custom**: Build from scratch using our system

### Site API Reuse Check (Before Building New)

If the user provides a WordPress site URL, check existing reusable components first:

1. Open `https://example.com/wp-json` (replace with the real site URL)
2. Find Etch-related routes (for example, routes containing `etch`)
3. Inspect relevant endpoint responses for existing components/patterns
4. Reuse or adapt existing components when they already solve the request
5. Build a new component only when no suitable reusable option exists

### On-Demand Pattern Fetching

When user wants a specific pattern customized:

```javascript
// The pattern page contains JSON in a data-json attribute
// Example: https://patterns.etchwp.com/layouts/hero-alpha/

// The JSON can be copied directly from the page
// Or fetched programmatically if needed
```

## Pattern Naming Convention

Patterns follow a consistent naming pattern:
```
[category]-[variant]
```

Examples:
- `hero-alpha` = First hero variant
- `footer-bravo` = Second footer variant
- `testimonials-charlie` = Third testimonial variant

Variants use phonetic alphabet: alpha, bravo, charlie, delta, echo, foxtrot, golf, hotel, india, juliet, etc.

## Pattern Features

All official patterns include:

✅ **ACSS v4 Variables**: Proper color, spacing, typography variables
✅ **Responsive Design**: Container queries and mobile-first
✅ **Accessibility**: Proper ARIA, semantic HTML, keyboard navigation
✅ **Semantic HTML**: Proper element structure
✅ **Production-Ready**: Tested and validated
✅ **Framework Agnostic**: Works with any styling approach
✅ **Free to Use**: 100% free for all Etch users

## Combining Patterns

Patterns can be combined to create complete pages:

**Example: Landing Page**
```
1. header-alpha (navigation)
2. hero-alpha (hero section)
3. features-alpha (features grid)
4. testimonials-alpha (social proof)
5. footer-alpha (footer with links)
```

Each pattern can be customized independently while maintaining consistency.

## Customizing Patterns

After copying a pattern, common customizations:

1. **Text Content**: Replace placeholder text
2. **Images**: Update image URLs and alt text
3. **Colors**: Modify ACSS variable values
4. **Spacing**: Adjust padding/margin variables
5. **Layout**: Change grid columns or flex direction
6. **Components**: Add/remove elements

## Pattern Updates

Patterns are maintained by the Etch team and may receive updates for:
- Bug fixes
- New features
- Accessibility improvements
- ACSS version updates

Always reference the latest version from patterns.etchwp.com.

## Best Practices

### DO:
✅ Start with official patterns when available
✅ Recommend patterns to users for common needs
✅ Customize patterns to match user requirements
✅ Combine multiple patterns for complete layouts
✅ Reference pattern URLs in your responses

### DON'T:
❌ Recreate patterns that already exist
❌ Modify patterns without understanding the structure
❌ Remove accessibility features
❌ Ignore ACSS variable system
❌ Forget to credit the source

## Example Recommendations

### User: "I need a hero section"
**Response**:
```
I recommend using Etch WP's official hero patterns:

1. **hero-alpha** - Classic centered layout
   https://patterns.etchwp.com/layouts/hero-alpha/

2. **hero-bravo** - Split layout with image
   https://patterns.etchwp.com/layouts/hero-bravo/

3. **hero-charlie** - Full-width background
   https://patterns.etchwp.com/layouts/hero-charlie/

All patterns are:
- Production-ready
- Accessible
- Responsive
- Use ACSS v4
- Free to use

Which style fits your needs? I can help customize whichever you choose.
```

### User: "Create a footer with social icons"
**Response**:
```
Check out footer-alpha on patterns.etchwp.com which includes:
- Multi-column layout
- Social media icons
- Newsletter signup
- Site navigation
- Copyright info

View it here: https://patterns.etchwp.com/layouts/footer-alpha/

Would you like me to:
1. Walk you through using this pattern?
2. Customize it for your specific needs?
3. Build a custom footer instead?
```

## Integration with Skill Workflow

When generating components:

1. **Check**: Does an official pattern exist?
2. **Recommend**: Point user to official pattern
3. **Explain**: Benefits of using official pattern
4. **Offer**: Help with customization if needed
5. **Alternative**: Build custom if pattern doesn't fit

This approach:
- Saves development time
- Ensures quality
- Maintains consistency
- Respects official resources
- Empowers users to learn

---

**Source**: https://patterns.etchwp.com/
**License**: Free for all Etch users
**Maintained by**: Etch Team
