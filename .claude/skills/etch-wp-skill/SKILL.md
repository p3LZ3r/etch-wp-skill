# etch-wp-skill Development Patterns

> Auto-generated skill from repository analysis

## Overview

This codebase manages WordPress component development with a focus on ACSS (Atomic CSS) variables, JSON-based component definitions, and comprehensive documentation workflows. The project emphasizes conventional commits, structured documentation updates, and maintaining consistency across component examples and validation scripts.

## Coding Conventions

### File Naming
- Use **kebab-case** for all file names
- Example: `validate-component.js`, `init-project.js`, `acss-variables.md`

### Import/Export Style
- Mixed import styles are acceptable based on context
- Maintain consistency within individual files
- Use ES6 modules where possible

### Commit Convention
- Follow conventional commit format
- Common prefixes: `docs:`, `feat:`, `fix:`, `refactor:`, `chore:`
- Keep commit messages around 58 characters average
- Examples:
  ```
  docs: update ACSS variable examples in component guide
  feat: add new validation checks for accessibility attrs
  fix: correct JSON structure in button component example
  ```

## Workflows

### Documentation Update
**Trigger:** When documentation needs updates or corrections
**Command:** `/update-docs`

1. Update `SKILL.md` with new patterns or corrections
2. Update relevant reference files in `references/` directory
3. Fix examples in `references/examples/*.json` files
4. Update version numbers across documentation
5. Verify cross-references between documentation files
6. Test example JSON structures for validity

### Version Release
**Trigger:** When preparing a new version release
**Command:** `/release-version`

1. Update version number in `README.md`
2. Update version number in `SKILL.md`
3. Update package/release scripts in `scripts/package-release.sh`
4. Update GitHub workflow files in `.github/workflows/release.yml`
5. Add changelog entries documenting changes
6. Verify all documentation reflects new version

### Example Component Update
**Trigger:** When example components need improvements or fixes
**Command:** `/update-examples`

1. Update component JSON structure in `references/examples/*.json`
2. Add or improve accessibility attributes
3. Fix ACSS variable usage and references
4. Update `references/component-examples.md` documentation
5. Update `references/block-types.md` if component types change
6. Validate JSON syntax and structure

Example component structure:
```json
{
  "name": "button-primary",
  "type": "interactive",
  "acss": {
    "bg": "var(--primary-color)",
    "color": "var(--text-on-primary)"
  },
  "accessibility": {
    "role": "button",
    "aria-label": "Primary action button"
  }
}
```

### Validation Script Enhancement
**Trigger:** When validation rules need to be added or improved
**Command:** `/enhance-validator`

1. Update `scripts/validate-component.js` with new validation logic
2. Add new validation checks for component structure
3. Improve error messages for better developer experience
4. Update documentation to reflect new validation rules
5. Test validation against existing component examples

### ACSS Variables Documentation
**Trigger:** When ACSS variable documentation needs updates
**Command:** `/update-acss-docs`

1. Update `references/acss-variables.md` with new variables
2. Add practical examples of variable usage
3. Update conceptual explanations and best practices
4. Update related references in other documentation files
5. Ensure examples demonstrate proper CSS custom property syntax

Example ACSS variable documentation:
```css
/* Color Variables */
--primary-color: #007cba;
--secondary-color: #666;
--text-on-primary: #ffffff;

/* Usage in components */
.button-primary {
  background: var(--primary-color);
  color: var(--text-on-primary);
}
```

### API Safety Hardening
**Trigger:** When API safety issues are discovered or need to be prevented
**Command:** `/harden-api-safety`

1. Update API endpoint restrictions in documentation
2. Add safety warnings to `references/api-endpoints.md`
3. Update validation rules to prevent destructive operations
4. Add human-in-the-loop requirements for critical operations
5. Document safety measures in `SKILL.md`

### Project Initialization Enhancement
**Trigger:** When project setup workflow needs improvements
**Command:** `/enhance-init-project`

1. Update `scripts/init-project.js` with new features
2. Add new configuration options and parameters
3. Enhance validation for project setup
4. Update library files in `scripts/lib/*.js`
5. Update initialization documentation in `SKILL.md`
6. Test initialization process with various configurations

## Testing Patterns

- Test files follow `*.test.*` naming pattern
- Focus on validating JSON component structures
- Test ACSS variable resolution and usage
- Validate documentation examples against actual implementations
- Test scripts functionality with various input scenarios

## Commands

| Command | Purpose |
|---------|---------|
| `/update-docs` | Update documentation files and examples |
| `/release-version` | Prepare new version release with updated docs |
| `/update-examples` | Update component JSON examples and structure |
| `/enhance-validator` | Improve component validation script |
| `/update-acss-docs` | Update ACSS variables documentation |
| `/harden-api-safety` | Add safety measures to API endpoints |
| `/enhance-init-project` | Improve project initialization workflow |