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
2. **Generate** — AI creates complete JSON structure based on your requirements
3. **Validate** — Automatic validation catches common errors before import

## Project Structure

```
etch-wp/
├── SKILL.md                    # Full skill documentation
├── scripts/
│   ├── init-project.js         # Project initialization
│   └── validate-component.js   # JSON validation
├── references/
│   ├── block-types.md          # All Etch block types
│   ├── acss-variables.md       # ACSS v4 variables
│   ├── css-architecture-rules.md
│   ├── props-system.md
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
**Version**: 3.0.0  
**Updated**: March 2026
