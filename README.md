# Etch WP Agent Skill

An agent skill for generating Etch WP components with ACSS v4 styling.

## Overview

This skill enables AI agents to generate complete, production-ready Etch WP components in JSON format. It includes comprehensive documentation, validation scripts, and example templates to ensure generated components work correctly in Etch WP.

**Version**: 2.5.0
**Author**: Torsten Linnecke
**License**: CC BY-NC-SA 4.0 (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International)

## What is Etch WP?

Etch WP is a Unified Visual Development Environment for WordPress that uses Gutenberg blocks and integrates with Automatic.css (ACSS) for styling. This skill generates components in the specific JSON format Etch WP requires.

## Installation

### Quick Install

1. **Download the latest release**
   - Go to [Releases](https://github.com/torstenlinnecke/etch-wp-skill/releases)
   - Download `etch-wp-vX.X.X.zip`

2. **Extract to skills directory**
   ```bash
   # macOS/Linux
   cd ~/.claude/skills/
   unzip ~/Downloads/etch-wp-v2.0.0.zip

   # Windows
   cd %USERPROFILE%\.claude\skills\
   # Extract the zip file here
   ```

3. **Verify installation**
   ```bash
   cd ~/.claude/skills/etch-wp
   node scripts/validate-component.js references/examples/basic-structure.json
   ```

   You should see: `✅ Component validation passed!`

### Manual Installation

Clone the repository directly:

```bash
cd ~/.claude/skills/
git clone https://github.com/torstenlinnecke/etch-wp-skill.git etch-wp
cd etch-wp
```

### Requirements

- **Claude Code CLI** - The skill works with Claude Code
- **Node.js 16+** - Required for validation script (optional but recommended)

### Troubleshooting

**Skill not recognized:**
- Ensure folder is named exactly `etch-wp`
- Restart Claude Code
- Check that `SKILL.md` exists in the folder

**Validation script errors:**
- Install Node.js: [nodejs.org](https://nodejs.org)
- Make script executable: `chmod +x scripts/validate-component.js`

## Skill Structure

```
etch-wp/
├── SKILL.md                 # Main skill instructions (streamlined)
├── LICENSE                  # Usage license
├── README.md               # This file
├── scripts/
│   └── validate-component.js  # Post-generation validation script
├── references/
│   ├── acss-variables.md      # ACSS v4 variable reference
│   ├── block-types.md         # Etch block types documentation
│   ├── component-examples.md  # Annotated component examples
│   ├── css-architecture-rules.md  # Critical CSS structure rules
│   ├── json-structure.md      # JSON format specification
│   ├── loops.md              # Loop implementation guide
│   ├── native-components.md   # Native components reference
│   ├── props-system.md        # Props and slots documentation
│   └── examples/
│       ├── basic-structure.json        # Basic section/container/content
│       ├── component-with-props.json   # Component using properties
│       ├── component-with-slots.json   # Component with flexible slots
│       └── loop-example.json          # WordPress posts loop
└── assets/
    └── templates/
        └── (future component templates)
```

## Key Features

### 1. Streamlined Main Skill File
- Reduced from ~55KB to ~10KB
- Focuses on workflow and rules
- References detailed docs instead of inline examples
- Faster to load and easier to maintain

### 2. Automatic Validation
After generating any component, the skill automatically runs:
```bash
node scripts/validate-component.js <filename>.json
```

This catches common errors before import:
- Invalid JSON structure
- Missing required fields
- Incorrect boolean formats
- Style ID format issues
- ACSS variable name problems
- Component nesting issues

### 3. Enhanced Base64/JavaScript Validation
New in v2.1: The improved validator catches common encoding and typo issues:
```bash
node scripts/validate-component-improved.js <filename>.json
```

Additional checks include:
- Base64 validity (no line breaks, valid characters)
- JavaScript syntax validation
- Common typo detection (`SCrollTrigger`, `vvar`, `ggsap`, etc.)
- Quote consistency (no curly quotes)
- Brace/parenthesis matching
- GSAP plugin registration

### 4. Safe Script Encoding Tools
To avoid Base64 encoding issues, use the encoding helpers:

**encode-script.js** - Validates before encoding:
```bash
# Encode a JavaScript file
node scripts/encode-script.js my-script.js

# Or paste directly
cat << 'EOF' | node scripts/encode-script.js
your javascript here
EOF
```

**encode-safe.js** - Interactive mode:
```bash
node scripts/encode-safe.js
# Paste your JavaScript, then press Ctrl+D
```

These tools automatically:
- Detect and fix common typos
- Validate quote types (no curly quotes)
- Check brace/parenthesis balance
- Verify GSAP patterns
- Output clean Base64

### 3. Comprehensive References
Detailed documentation for every aspect:
- Block types and attributes
- ACSS v4 variable system
- CSS architecture rules
- Props vs. slots usage
- Loop implementations
- Native components

### 4. Working Examples
Real, validated JSON files that work in Etch WP:
- Basic structure (section/container/content)
- Components with properties
- Components with slots
- WordPress query loops

## Usage

### For AI Agents

When a user asks to create an Etch WP component:

1. **Read** relevant reference files
2. **Generate** complete JSON structure
3. **Save** to `.json` file (never paste in chat)
4. **Validate** using `scripts/validate-component.js`
5. **Report** validation results to user

### For Developers

To validate your own Etch WP components:

```bash
node scripts/validate-component.js your-component.json
```

The validator checks for:
- ✅ Valid JSON structure
- ✅ Required fields present
- ✅ Proper boolean formatting (`"{true}"` not `true`)
- ✅ Correct style ID format (7 random alphanumeric chars)
- ✅ No nested component classes in CSS
- ✅ Proper data-etch-element usage
- ✅ Script placement and encoding

## License

**Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**

You are free to:
- ✅ **Share** — copy and redistribute the material
- ✅ **Adapt** — remix, transform, and build upon the material

Under these terms:
- 📝 **Attribution** — Must credit Torsten Linnecke
- 🚫 **NonCommercial** — Not for commercial use or resale
- 🔄 **ShareAlike** — Derivatives must use the same license

**What this means:**
- ✅ Use for personal projects
- ✅ Use for educational purposes
- ✅ Modify and improve
- ✅ Share with others (non-commercial)
- ✅ Contribute back to community
- ❌ Sell this skill or derivatives
- ❌ Use in commercial products/services
- ❌ Remove attribution

See LICENSE file for complete legal terms.
License: https://creativecommons.org/licenses/by-nc-sa/4.0/

## Contributing

Contributions are welcome! By contributing, you agree your contributions will be licensed under the same terms.

To contribute:
1. Fork the repository
2. Make your changes
3. Test with validation script
4. Submit pull request

## Documentation Links

- **Etch WP**: https://etchwp.com
- **Etch WP Docs**: https://docs.etchwp.com
- **Automatic.css**: https://automaticcss.com
- **Agent Skills Spec**: https://agentskills.io

## Changelog

### v2.5.0 (2026-02-16)
- 🚨 **CRITICAL SAFETY**: Restricted styles endpoint to READ-ONLY (prevents catastrophic data loss)
- ✨ Added API component format support to validator
- ✨ Added accessibility checks to validator (a11y compliance)
- 📝 Streamlined SKILL.md (524 lines removed, reduced redundancy)
- 📝 Clarified output format rules (API vs clipboard format)
- 📝 Updated block-types documentation
- 🔧 Fixed agent.md → AGENTS.md references

### v2.4.0 (2026-02-15)
- ✨ Added mandatory API setup enforcement in project initialization (Q10)
- ✨ Added API endpoints reference documentation (`references/api-endpoints.md`)
- ✨ Added Application Password authentication guide for API access
- ✨ Added reuse-first workflow documentation (check before building)
- 📝 Added ACSS variables guide (clarify variables vs. utility classes)
- 📝 Added image best practices (figure + etch/dynamic-image)
- 📝 Added etch/text for dynamic content (loops, MetaBox fields)
- 📝 Updated loops.md with etch/text requirement

### v2.3.0 (2026-02-12)
- ✨ Added `init-project.js` interactive project initialization script
- ✨ Added strict BEM naming validation (2-4 letter prefix requirement)
- ✨ Added project configuration workflow with `.etch-project.json`
- ✨ Added Context7 integration for ACSS and Etch WP documentation
- ✨ Added border variable validation (`var(--border)`, `--border-light`, `--border-dark`)
- ✨ Removed deprecated `flex-div` element (now section/container/iframe only)
- 🔧 Fixed button class usage (no base `btn` class, use `btn--primary` directly)
- 🔧 Streamlined SKILL.md (~25% reduction, compact tables, removed redundancy)

### v2.1.0 (2026-01-28)
- ✨ Added `validate-component-improved.js` with Base64/JavaScript validation
- ✨ Added `encode-script.js` for safe Base64 encoding
- ✨ Added `encode-safe.js` interactive encoding tool
- ✨ Automatic typo detection (`SCrollTrigger`, `vvar`, `ggsap`, etc.)
- ✨ Quote validation (curly → straight)
- ✨ Brace/parenthesis matching checks
- ✨ GSAP plugin registration validation

### v2.0.0 (2024-12-20)
- ✨ Complete refactor with new structure
- ✨ Added automatic validation script
- ✨ Streamlined SKILL.md (55KB → 10KB)
- ✨ Added working JSON examples
- ✨ Added comprehensive LICENSE
- ✨ Improved documentation organization
- ✨ Added metadata and attribution

### v1.x (Previous)
- Initial version with inline examples

## Support

For issues or questions about:
- **This skill**: Open an issue in the repository
- **Etch WP**: Visit https://docs.etchwp.com
- **ACSS**: Visit https://automaticcss.com

---

**Created by**: Torsten Linnecke
**Version**: 2.5.0
**Last Updated**: February 16, 2026
