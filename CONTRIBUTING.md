# Contributing to Etch WP Agent Skill

Thank you for your interest in contributing! This skill is designed to help AI agents generate high-quality Etch WP components.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion:

1. Check if the issue already exists in [GitHub Issues](https://github.com/torstenlinnecke/etch-wp-skill/issues)
2. If not, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Example component JSON (if applicable)

### Suggesting Enhancements

For feature requests or improvements:

1. Open an issue with the `enhancement` label
2. Describe the use case
3. Explain how it would improve the skill
4. Provide examples if possible

### Contributing Code

#### Before You Start

1. Fork the repository
2. Create a branch for your changes: `git checkout -b feature/your-feature-name`
3. Review the code structure and existing patterns

#### Making Changes

**For Documentation:**
- Keep SKILL.md concise and workflow-focused
- Add detailed information to reference files
- Include examples in `references/examples/`
- Update README.md if installation changes

**For Code (validation script):**
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Ensure all existing tests still pass

**For Examples:**
- Create valid, working JSON files
- Test in actual Etch WP environment
- Validate using `scripts/validate-component.js`
- Add to `references/examples/` with descriptive filename

#### Testing Your Changes

Before submitting:

```bash
# Validate all examples
cd references/examples
for file in *.json; do
  node ../../scripts/validate-component.js "$file"
done

# Test the skill in Claude Code
# (manual testing required)
```

#### Commit Guidelines

Write clear commit messages:

```
feat: Add container query example
fix: Correct boolean format in validation
docs: Update ACSS variable reference
refactor: Improve validation error messages
```

Use conventional commit format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

#### Pull Request Process

1. Update documentation if needed
2. Add/update examples if relevant
3. Ensure all validations pass
4. Create pull request with:
   - Clear title and description
   - Reference any related issues
   - List of changes made
   - Screenshots/examples if applicable

5. Wait for review and address feedback

### Areas We Need Help

- **Examples**: More component patterns and use cases
- **Documentation**: Improving clarity and examples
- **Validation**: Additional error checks and warnings
- **Testing**: Edge cases and error scenarios
- **Accessibility**: A11y pattern improvements
- **Performance**: Optimization suggestions

### Code of Conduct

- Be respectful and constructive
- Focus on the work, not the person
- Welcome newcomers and help them learn
- Give credit where credit is due

### Questions?

- Open a [GitHub Discussion](https://github.com/torstenlinnecke/etch-wp-skill/discussions)
- Check existing documentation in `references/`
- Ask in your pull request or issue

## Development Setup

### Prerequisites

- Node.js 16+ (for validation script)
- Git
- Text editor (VS Code recommended)
- Claude Code CLI (for testing)

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/etch-wp-skill.git
cd etch-wp-skill

# Create feature branch
git checkout -b feature/my-improvement

# Make changes...

# Test validation script
node scripts/validate-component.js references/examples/basic-structure.json

# Test in Claude Code
# Copy to your skills directory
cp -r . ~/.claude/skills/etch-wp-dev

# Use Claude Code to test the skill
```

### File Structure

```
etch-wp/
├── SKILL.md                 # Main skill file (keep concise!)
├── LICENSE                  # CC BY-NC-SA 4.0
├── README.md               # User documentation
├── CONTRIBUTING.md         # This file
├── scripts/
│   └── validate-component.js  # Validation logic
├── references/
│   ├── *.md                # Detailed documentation
│   └── examples/           # Working JSON examples
└── assets/
    └── templates/          # Future templates
```

### Style Guide

**Markdown:**
- Use headers hierarchically (no skipping levels)
- Add blank lines around code blocks
- Use emoji sparingly for emphasis
- Keep lines under 100 characters when possible

**JSON:**
- 2-space indentation
- No trailing commas
- Validate against Etch WP schema
- Include all required fields

**JavaScript:**
- 2-space indentation
- Semicolons required
- ES6+ features allowed
- Clear variable names
- Comment complex logic

## License

By contributing, you agree that your contributions will be licensed under the CC BY-NC-SA 4.0 license, the same as the original project.

Your contributions will be attributed in:
- Git commit history
- Release notes (for significant contributions)
- CONTRIBUTORS.md file (if we create one)

## Recognition

Contributors who make significant improvements will be:
- Listed in release notes
- Mentioned in the README (for major features)
- Given credit in commit messages

Thank you for helping make this skill better! 🎉

---

**Maintainer**: Torsten Linnecke
**License**: CC BY-NC-SA 4.0
**Repository**: https://github.com/torstenlinnecke/etch-wp-skill
