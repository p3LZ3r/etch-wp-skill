# Etch WP Agent Skill

An agent skill for generating Etch WP components with ACSS v4 styling.

## What is This?

AI agent skill that generates **complete, production-ready Etch WP JSON** — pasteable or API-pushable components, sections, and patterns. Uses Automatic.css (ACSS) v4 variables for styling.

## Quick Start

```bash
# Clone to Claude Code skills directory
git clone https://github.com/torstenlinnecke/etch-wp-skill.git ~/.claude/skills/etch-wp

# Initialize project (required before generating components)
cd ~/.claude/skills/etch-wp
node scripts/init-project.js

# Validate generated components
node scripts/validate-component.js your-component.json
```

## How It Works

1. **Project init** — Creates `.etch-project.json` with your CSS prefix and ACSS variables
2. **Resource check** — Searches existing patterns and components before building new
3. **Generate** — AI creates complete JSON structure based on your requirements
4. **Validate** — Automatic validation catches common errors before import

## What's New in v3.2

### Resource Reuse Enhancement

The skill now **proactively searches for and reuses existing resources** before building from scratch:

- **Local Pattern Search** — Checks 52+ downloaded patterns in `assets/templates/patterns/`
- **Component Reuse** — Discovers and reuses existing site components via `/wp-json/etch-api/components`
- **Decision Framework** — Clear hierarchy: Official patterns → Local patterns → Site components → Build new
- **New Reference** — `references/resource-reuse.md` with comprehensive reuse guide

### Updated Pattern Library

- 52 official patterns across 10 categories (Hero, Interactive, Features, Blog, Content, etc.)
- New CTAs category added
- Patterns automatically kept up-to-date via `scripts/collect-patterns.js`

### Core Rule 6

**"Resource Reuse — ALWAYS Check Existing Resources First"** ensures the skill saves tokens and maintains consistency by reusing existing resources when 80%+ match.

## Project Structure

```
etch-wp/
├── SKILL.md                    # Full skill documentation
├── README.md                   # This file
├── scripts/
│   ├── init-project.js         # Project initialization
│   ├── validate-component.js   # JSON validation
│   └── collect-patterns.js     # Download official patterns
├── assets/templates/patterns/  # 52+ official patterns
│   ├── hero/                   # Hero sections
│   ├── interactive/            # Carousels, accordions, etc.
│   ├── features/               # Feature cards, sections
│   └── INDEX.md                # Pattern index
├── references/
│   ├── json-structure.md       # JSON structure reference
│   ├── block-types.md          # All Etch block types
│   ├── props-system.md         # Props and slots
│   ├── acss-variables.md       # ACSS v4 variables
│   ├── css-architecture-rules.md # Style rules
│   ├── api-endpoints.md        # REST API reference
│   ├── resource-reuse.md       # NEW: Reuse guide (v3.2)
│   ├── official-patterns.md    # Official patterns guide
│   └── examples/               # Working JSON examples
└── LICENSE
```

## Requirements

- Claude Code CLI
- Node.js 16+ (for validation scripts)

## Resources

| Link | Purpose |
|------|---------|
| [SKILL.md](SKILL.md) | Complete skill documentation |
| [Etch WP](https://etchwp.com) | Etch WP homepage |
| [Etch Docs](https://docs.etchwp.com) | Etch WP documentation |
| [Patterns](https://patterns.etchwp.com) | Official patterns library |
| [ACSS](https://automaticcss.com) | Automatic.css |

## License

CC BY-NC-SA 4.0 — See LICENSE file for details.

---

**Author**: Torsten Linnecke
**Version**: 3.2.0
**Updated**: March 2026
