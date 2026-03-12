#!/usr/bin/env node

/**
 * Etch WP Component Validator
 * Validates JSON format, Base64 encoding, and JavaScript syntax
 *
 * Usage: node validate-component.js <file.json>
 */

const fs = require('fs');
const path = require('path');

class EtchComponentValidator {
  // Style ID must be 7 random alphanumeric characters (lowercase) or etch- prefixed system styles
  static STYLE_ID_PATTERN = /^[a-z0-9]{7}$/;

  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.base64LineBreakCheck = true;
    this.projectConfig = this.loadProjectConfig();
    this.projectPrefix = this.projectConfig?.prefix || null;
    this.acssIndex = this.loadAcssIndex();
    this.usedStyleIds = new Set();
    this.definedStyleIds = new Set();
    this.componentRefs = new Set();
    this.contentType = null; // 'component' or 'layout'
  }

  validateFile(filePath) {
    console.log(`\n🔍 Validating Etch WP Component: ${path.basename(filePath)}\n`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      // Detect content type (component vs layout)
      this.contentType = this.detectContentType(data);

      // Validate root structure based on what fields are present
      this.validateRootStructure(data);

      // If root structure is invalid, stop here
      if (this.errors.length > 0) {
        this.reportResults();
        return false;
      }

      // Validate blocks - only gutenbergBlock is valid (blocks[] is old format, rejected above)
      if (data.gutenbergBlock) {
        this.validateBlock(data.gutenbergBlock, 'gutenbergBlock');
      }

      if (data.styles && typeof data.styles === 'object') {
        this.validateStyles(data.styles);
      }

      if (data.components) {
        this.validateComponents(data.components);
      }

      if (data.loops) {
        this.validateLoops(data.loops);
      }

      // Cross-reference style IDs
      this.validateStyleReferences();

      // Cross-reference component refs
      this.validateComponentReferences(data);

      this.reportResults();
      return this.errors.length === 0;

    } catch (error) {
      console.error(`❌ FATAL ERROR: ${error.message}`);
      return false;
    }
  }

  detectContentType(data) {
    // Detect if this is a component-based file or a layout/section
    // Component files contain etch/component references

    // Note: Files with name/key/blocks are INVALID - they use old wrong format
    // Valid files must have: type, gutenbergBlock, styles

    if (data.gutenbergBlock) {
      if (this.hasComponentReferences(data.gutenbergBlock)) {
        return 'component';
      }
    }

    return 'layout';
  }

  hasComponentReferences(block) {
    // Recursively check if block or any nested block is etch/component
    if (block.blockName === 'etch/component') {
      return true;
    }
    if (block.innerBlocks && Array.isArray(block.innerBlocks)) {
      for (const innerBlock of block.innerBlocks) {
        if (this.hasComponentReferences(innerBlock)) {
          return true;
        }
      }
    }
    return false;
  }

  validateRootStructure(data) {
    // CRITICAL: Reject old invalid structures
    // Files with name/key/blocks are using the WRONG format
    if (data.name !== undefined || data.key !== undefined) {
      this.errors.push(
        'INVALID STRUCTURE: Using old "name"/"key"/"blocks" format. ' +
        'Required fields: "type" (must be "block"), "gutenbergBlock", "styles"'
      );
      // Don't validate further - the structure is fundamentally wrong
      return;
    }

    // Check required root-level fields for the CORRECT format

    // Must have type: "block"
    if (data.type !== 'block') {
      if (data.type === undefined) {
        this.errors.push('Missing required root field: "type" (must be "block")');
      } else {
        this.errors.push(`Invalid root field "type": "${data.type}" (must be "block")`);
      }
    }

    // Must have gutenbergBlock
    if (!data.gutenbergBlock) {
      this.errors.push('Missing required root field: "gutenbergBlock"');
    } else if (typeof data.gutenbergBlock !== 'object') {
      this.errors.push('Invalid "gutenbergBlock": must be an object');
    }

    // Must have styles
    if (!data.styles) {
      this.errors.push('Missing required root field: "styles"');
    } else if (typeof data.styles !== 'object') {
      this.errors.push('Invalid "styles": must be an object');
    }

    // Components required if content type is component
    if (this.contentType === 'component') {
      if (!data.components) {
        this.errors.push(
          'Missing required root field: "components" (required when using etch/component blocks)'
        );
      } else if (typeof data.components !== 'object') {
        this.errors.push('Invalid "components": must be an object');
      } else if (Object.keys(data.components).length === 0) {
        this.errors.push(
          'Invalid "components": must contain at least one component definition'
        );
      }
    }
  }

  validateComponentReferences(data) {
    // Check that all referenced component IDs exist in the components object
    if (this.componentRefs.size === 0) {
      return;
    }

    const availableComponents = data.components || {};

    for (const refId of this.componentRefs) {
      if (!availableComponents[refId]) {
        this.errors.push(
          `Component reference "ref": ${refId} points to non-existent component in "components" object`
        );
      }
    }
  }

  validateBlock(block, blockPath = 'gutenbergBlock') {
    if (!block.blockName) {
      this.errors.push(`Missing "blockName" at ${blockPath}`);
      return;
    }

    // Validate block type
    const validBlockNames = [
      'etch/element', 'etch/text', 'etch/svg', 'etch/component',
      'etch/loop', 'etch/condition', 'etch/slot-content', 'etch/slot-placeholder',
      'etch/dynamic-image'
    ];

    if (!validBlockNames.includes(block.blockName) && !block.blockName.startsWith('core/')) {
      this.warnings.push(`Unknown blockName "${block.blockName}" at ${blockPath}`);
    }

    if (!block.attrs) {
      this.errors.push(`Missing "attrs" at ${blockPath}`);
      return;
    }

    // Validate specific block types
    if (block.blockName === 'etch/element') {
      this.validateElement(block, blockPath);
    }

    if (block.blockName === 'etch/component') {
      this.validateComponentUsage(block, blockPath);
    }

    // Validate innerContent consistency
    if (block.innerBlocks && Array.isArray(block.innerBlocks)) {
      const nullCount = block.innerContent ?
        block.innerContent.filter(i => i === null).length : 0;

      if (nullCount !== block.innerBlocks.length) {
        this.warnings.push(
          `innerContent null count (${nullCount}) doesn't match innerBlocks length (${block.innerBlocks.length}) at ${blockPath}`
        );
      }

      // Recursively validate nested blocks
      block.innerBlocks.forEach((innerBlock, index) => {
        this.validateBlock(innerBlock, `${blockPath}.innerBlocks[${index}]`);
      });
    }
  }

  validateElement(block, blockPath) {
    const attrs = block.attrs;

    if (!attrs.tag) {
      this.errors.push(`Missing "tag" attribute for etch/element at ${blockPath}`);
    }

    // Validate styles array if present
    if (attrs.styles && Array.isArray(attrs.styles)) {
      attrs.styles.forEach((styleId, index) => {
        this.validateStyleId(styleId, `${blockPath}.attrs.styles[${index}]`);
      });
    }

    // Check for data-etch-element usage
    if (attrs.attributes && attrs.attributes['data-etch-element']) {
      const etchElement = attrs.attributes['data-etch-element'];
      const validEtchElements = ['section', 'container', 'iframe'];

      if (!validEtchElements.includes(etchElement)) {
        this.errors.push(
          `Invalid data-etch-element="${etchElement}" at ${blockPath}. Must be one of: ${validEtchElements.join(', ')}`
        );
      }

      // Note: System styles (etch-section-style, etch-container-style, etch-iframe-style)
      // are automatically applied by Etch WP. Manual configuration is not required.
    }

    // Check for script placement
    if (attrs.script) {
      if (attrs.attributes && attrs.attributes.script) {
        this.errors.push(
          `Script should be in "attrs.script", NOT "attrs.attributes.script" at ${blockPath}`
        );
      }

      // Enhanced Base64 validation
      this.validateBase64Script(attrs.script, blockPath);
    }

    // Accessibility checks
    if (attrs.attributes) {
      // WCAG 4.1.2: role="dialog" should have aria-labelledby or aria-label
      if (attrs.attributes.role === 'dialog') {
        if (!attrs.attributes['aria-labelledby'] && !attrs.attributes['aria-label']) {
          this.warnings.push(
            `role="dialog" at ${blockPath} should have aria-labelledby or aria-label (WCAG 4.1.2)`
          );
        }
      }
    }

    // WCAG 1.1.1: img elements should have alt attribute
    if (attrs.tag === 'img' && (!attrs.attributes || !attrs.attributes.alt)) {
      this.warnings.push(
        `<img> at ${blockPath} is missing "alt" attribute (WCAG 1.1.1)`
      );
    }
  }

  validateBase64Script(script, blockPath) {
    if (!script.code) {
      this.errors.push(`Missing script.code at ${blockPath}`);
      return;
    }

    const code = script.code;

    // Check for line breaks in Base64
    if (code.includes('\n')) {
      this.errors.push(
        `Base64 encoded script must be a single line (no line breaks) at ${blockPath}`
      );
    }

    // Check for valid Base64 characters
    const validBase64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!validBase64Pattern.test(code)) {
      this.errors.push(
        `Base64 script contains invalid characters at ${blockPath}. Only A-Z, a-z, 0-9, +, /, = allowed.`
      );
    }

    // Check script ID format
    if (script.id && !/^[a-z0-9]{7}$/.test(script.id)) {
      this.warnings.push(
        `Script ID "${script.id}" should be 7 random alphanumeric characters at ${blockPath}`
      );
    }
  }

  validateStyleId(styleId, path) {
    // Track used style IDs
    this.usedStyleIds.add(styleId);

    // Check style ID format (7 random alphanumeric chars) or etch- prefixed system styles
    if (!EtchComponentValidator.STYLE_ID_PATTERN.test(styleId) && !styleId.startsWith('etch-')) {
      this.errors.push(
        `Style ID "${styleId}" at ${path} must be 7 random alphanumeric characters (e.g., "q2fy3v0") or etch- prefixed system style`
      );
    }
  }

  validateComponentUsage(block, blockPath) {
    const attrs = block.attrs;

    if (!attrs.ref) {
      this.errors.push(`Missing "ref" attribute for etch/component at ${blockPath}`);
    } else {
      // Track component reference for cross-validation
      const refId = String(attrs.ref);
      this.componentRefs.add(refId);
    }

    // Check boolean prop format
    if (attrs.attributes) {
      Object.entries(attrs.attributes).forEach(([key, value]) => {
        if (value === true || value === false) {
          this.errors.push(
            `Boolean prop "${key}" must be string-wrapped ("{true}" or "{false}"), not raw boolean at ${blockPath}`
          );
        }
      });
    }
  }

  validateStyles(styles) {
    Object.entries(styles).forEach(([id, style]) => {
      // Track defined style IDs
      this.definedStyleIds.add(id);

      // Check style ID format (7 random alphanumeric chars) or etch- prefixed system styles
      if (!EtchComponentValidator.STYLE_ID_PATTERN.test(id) && !id.startsWith('etch-')) {
        this.errors.push(
          `Style ID "${id}" must be 7 random alphanumeric characters (e.g., "q2fy3v0") or etch- prefixed system style`
        );
      }

      // Check required fields
      if (!style.type || !['class', 'element'].includes(style.type)) {
        this.errors.push(`Invalid style.type for "${id}" (must be "class" or "element")`);
      }

      if (!style.selector) {
        this.errors.push(`Missing selector for style "${id}"`);
      }

      // Check for common CSS issues
      if (style.css) {
        this.validateCSS(style.css, id, this.projectPrefix);
      }
    });
  }

  validateCSS(css, styleId, projectPrefix = null) {
    // Validate ACSS variables and utility classes
    this.validateAcssUsage(css, styleId);

    // Check for hardcoded values where ACSS variables should be used
    const hardcodedPatterns = {
      colors: /#[0-9a-f]{3,6}|rgba?\(/i,
      spacing: /\d+px(?!.*var\(--)/,
    };

    if (hardcodedPatterns.colors.test(css)) {
      this.warnings.push(
        `Style "${styleId}" contains hardcoded colors. Consider using ACSS color variables (var(--bg-light), var(--text-dark), etc.)`
      );
    }

    // Check for hardcoded borders (must use var(--border), var(--border-light), or var(--border-dark))
    const borderPattern = /border(?:-top|-right|-bottom|-left)?\s*:\s*[^;]*\b(?:\d+px|solid|dashed|dotted)[^;]*(?:#[0-9a-f]{3,6}|rgba?\(|var\((?!\-\-border))/i;
    if (borderPattern.test(css) && !/var\(\-\-border/.test(css)) {
      this.warnings.push(
        `Style "${styleId}" contains hardcoded border. Use ACSS border variables: var(--border), var(--border-light), or var(--border-dark)`
      );
    }

    // Check for invalid ACSS variable patterns (common mistakes)
    const invalidVarPatterns = [
      /var\(--padding-/,
      /var\(--margin-/,
      /var\(--color-/,
      /var\(--spacing-/,
      /var\(--btn-\)/,
    ];

    invalidVarPatterns.forEach(pattern => {
      if (pattern.test(css)) {
        this.warnings.push(
          `Style "${styleId}" may contain invalid ACSS variable name. Verify against ACSS index.`
        );
      }
    });

    // BEM and Prefix Validation
    this.validateBEMNaming(css, styleId, projectPrefix);

    // Accessibility: Check for :hover without :focus-visible (WCAG 2.4.7)
    if (css.includes(':hover') && !css.includes(':focus-visible')) {
      this.warnings.push(
        `Style "${styleId}" has :hover but no :focus-visible state. Add &:focus-visible for keyboard accessibility (WCAG 2.4.7)`
      );
    }
  }

  validateBEMNaming(css, styleId, projectPrefix = null) {
    // Extract class selectors from CSS
    const classSelectorPattern = /\.([a-z][a-z0-9-]*)(?:\s*[,{])/gi;
    const selectors = [];
    let match;

    while ((match = classSelectorPattern.exec(css)) !== null) {
      selectors.push(match[1]);
    }

    selectors.forEach(selector => {
      // Check for project prefix (if provided)
      if (projectPrefix && !selector.startsWith(projectPrefix + '-')) {
        // Allow etch- prefixed system classes
        if (!selector.startsWith('etch-')) {
          this.errors.push(
            `Style "${styleId}": Class ".${selector}" missing project prefix "${projectPrefix}-". ` +
            `Expected: .${projectPrefix}-${selector}`
          );
        }
      }

      // Check for BEM structure
      // Pattern: prefix-block__element--modifier
      const bemPattern = /^([a-z]{2,4})-([a-z][a-z0-9-]*?)(?:__([a-z][a-z0-9-]*?))?(?:--([a-z][a-z0-9-]*?))?$/;
      const bemMatch = selector.match(bemPattern);

      if (!bemMatch && !selector.startsWith('etch-')) {
        this.warnings.push(
          `Style "${styleId}": Class ".${selector}" doesn't follow BEM naming convention. ` +
          `Expected format: {prefix}-{block}__{element}--{modifier}`
        );
      }

      // Check for common mistakes
      // Wrong: .prefix-block-element (using - instead of __)
      if (/^[a-z]{2,4}-[a-z]+-[a-z]+__(?!_)/.test(selector)) {
        const suggested = selector.replace(/^([a-z]{2,4})-([a-z]+)-([a-z]+)__/, '$1-$2__$3--');
        this.warnings.push(
          `Style "${styleId}": Class ".${selector}" may have wrong separator. ` +
          `Did you mean: .${suggested} ?`
        );
      }

      // Check for camelCase (should be kebab-case)
      if (/[A-Z]/.test(selector)) {
        this.errors.push(
          `Style "${styleId}": Class ".${selector}" uses camelCase. ` +
          `BEM requires kebab-case: .${selector.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`
        );
      }

      // Check for double underscores not in BEM element position
      const elementCount = (selector.match(/__/g) || []).length;
      if (elementCount > 1) {
        this.errors.push(
          `Style "${styleId}": Class ".${selector}" has multiple elements (__) which is invalid in BEM.`
        );
      }

      // Check for double hyphens not in BEM modifier position
      const modifierCount = (selector.match(/--/g) || []).length;
      if (modifierCount > 1) {
        this.errors.push(
          `Style "${styleId}": Class ".${selector}" has multiple modifiers (--) which is invalid in BEM.`
        );
      }
    });
  }

  loadProjectConfig() {
    try {
      const fs = require('fs');
      const path = require('path');

      // Look for .etch-project.json in current directory and parent directories
      let currentDir = process.cwd();
      let config = null;

      while (currentDir !== path.dirname(currentDir)) {
        const configPath = path.join(currentDir, '.etch-project.json');
        if (fs.existsSync(configPath)) {
          config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          break;
        }
        currentDir = path.dirname(currentDir);
      }

      return config;
    } catch (error) {
      return null;
    }
  }

  loadAcssIndex() {
    try {
      const fs = require('fs');
      const path = require('path');

      // Look for .etch-acss-index.toon in current directory and parent directories
      let currentDir = process.cwd();
      let index = null;

      while (currentDir !== path.dirname(currentDir)) {
        const indexPath = path.join(currentDir, '.etch-acss-index.toon');
        if (fs.existsSync(indexPath)) {
          const content = fs.readFileSync(indexPath, 'utf8');
          index = this.parseToonIndex(content);
          break;
        }
        currentDir = path.dirname(currentDir);
      }

      return index;
    } catch (error) {
      return null;
    }
  }

  parseToonIndex(content) {
    // Parse TOON format (sections with @vars and @classes)
    const variables = {};
    const classes = [];

    const lines = content.split('\n');
    let inVarsSection = false;
    let inClassesSection = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Detect sections
      if (trimmed === '@vars') {
        inVarsSection = true;
        inClassesSection = false;
        continue;
      } else if (trimmed === '@classes') {
        inVarsSection = false;
        inClassesSection = true;
        continue;
      } else if (trimmed.startsWith('@')) {
        // Other sections like @meta, @summary - exit current section
        inVarsSection = false;
        inClassesSection = false;
        continue;
      }

      // Skip subsection markers like [other], [buttons]
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        continue;
      }

      // Parse variables: --name (just the name, no value needed)
      if (inVarsSection && trimmed.startsWith('--')) {
        const varName = trimmed; // Keep the -- prefix
        variables[varName] = true; // Just mark as existing
      }

      // Parse classes: .class-name or class patterns like btn--{s,m,l}
      if (inClassesSection) {
        // Match simple class names
        const classMatch = trimmed.match(/^\.([\w-{}]+)/);
        if (classMatch) {
          classes.push(classMatch[1]);
        }
      }
    }

    return { variables, classes };
  }

  validateAcssUsage(css, styleId) {
    if (!this.acssIndex) {
      return; // Skip validation if ACSS index not available
    }

    // Extract var() usage - match complete var(--name) pattern
    const varPattern = /var\(--[\w-]+\)/g;
    const foundVars = css.match(varPattern) || [];

    for (const varRef of foundVars) {
      // Extract just the variable name (--name) from var(--name)
      const varName = varRef.slice(4, -1); // Remove 'var(' and ')'
      if (!this.acssIndex.variables[varName]) {
        this.warnings.push(
          `Style "${styleId}" uses unknown ACSS variable "${varName}". Check .etch-acss-index.toon for available variables.`
        );
      }
    }

    // Extract utility classes (simple class names in @apply or similar)
    // Note: This is basic validation - complex class detection may need enhancement
    const utilityPattern = /@apply\s+\.([\w-]+)/g;
    const foundUtilities = [];
    let match;

    while ((match = utilityPattern.exec(css)) !== null) {
      foundUtilities.push(match[1]);
    }

    for (const utilClass of foundUtilities) {
      if (!this.acssIndex.classes.includes(utilClass)) {
        this.warnings.push(
          `Style "${styleId}" uses unknown utility class ".${utilClass}". Check .etch-acss-index.toon for available classes.`
        );
      }
    }
  }

  validateComponents(components) {
    Object.entries(components).forEach(([id, component]) => {
      if (component.id !== parseInt(id)) {
        this.errors.push(
          `Component ID mismatch: key "${id}" vs component.id "${component.id}"`
        );
      }

      if (!component.name || !component.key) {
        this.errors.push(`Missing name or key for component ${id}`);
      }

      if (!component.blocks || !Array.isArray(component.blocks)) {
        this.errors.push(`Invalid or missing blocks for component ${id}`);
      } else {
        // Validate component blocks
        component.blocks.forEach((block, index) => {
          this.validateBlock(block, `components.${id}.blocks[${index}]`);
        });
      }

      if (!component.properties || !Array.isArray(component.properties)) {
        this.warnings.push(`Missing properties array for component ${id}`);
      } else {
        // Validate properties
        component.properties.forEach((prop, index) => {
          if (!prop.key || !prop.name) {
            this.errors.push(
              `Missing key or name for property ${index} in component ${id}`
            );
          }

          if (!prop.type || !prop.type.primitive) {
            this.errors.push(
              `Invalid type for property "${prop.key}" in component ${id}`
            );
          }
        });
      }
    });
  }

  validateLoops(loops) {
    Object.entries(loops).forEach(([id, loop]) => {
      if (!loop.name || !loop.key) {
        this.errors.push(`Missing name or key for loop ${id}`);
      }

      if (!loop.config || !loop.config.type) {
        this.errors.push(`Missing config.type for loop ${id}`);
      }

      const validLoopTypes = ['wp-query', 'json', 'terms', 'users', 'api'];
      if (loop.config && !validLoopTypes.includes(loop.config.type)) {
        this.warnings.push(
          `Unknown loop type "${loop.config.type}" for loop ${id}`
        );
      }
    });
  }

  validateStyleReferences() {
    // Check for used styles that are not defined
    for (const usedId of this.usedStyleIds) {
      if (!this.definedStyleIds.has(usedId) && !usedId.startsWith('etch-')) {
        this.errors.push(
          `Style ID "${usedId}" is used in blocks but not defined in the styles object`
        );
      }
    }

    // Check for defined styles that are not used (warning)
    for (const definedId of this.definedStyleIds) {
      if (!this.usedStyleIds.has(definedId)) {
        this.warnings.push(
          `Style "${definedId}" is defined but not used in any block`
        );
      }
    }
  }

  reportResults() {
    let hasIssues = false;

    // Show content type
    if (this.contentType) {
      const typeLabel = this.contentType === 'component' ? '🔧 Component' : '📄 Layout/Section';
      console.log(`${typeLabel}\n`);
    }

    // Show project config info
    if (this.projectConfig) {
      console.log(`📁 Project: ${this.projectConfig.name} (prefix: ${this.projectConfig.prefix})\n`);
    } else {
      console.log('⚠️  No .etch-project.json found. Run: node scripts/init-project.js\n');
    }

    if (this.errors.length > 0) {
      hasIssues = true;
      console.log('❌ ERRORS (must fix):');
      this.errors.forEach(error => console.log(`   • ${error}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      hasIssues = true;
      console.log('⚠️  WARNINGS (should review):');
      this.warnings.forEach(warning => console.log(`   • ${warning}`));
      console.log('');
    }

    if (this.info.length > 0) {
      console.log('ℹ️  INFO:');
      this.info.forEach(info => console.log(`   • ${info}`));
      console.log('');
    }

    if (!hasIssues) {
      console.log('✅ Component validation passed!\n');
    } else {
      console.log(`Summary: ${this.errors.length} error(s), ${this.warnings.length} warning(s)\n`);
    }
  }
}

// CLI execution
if (require.main === module) {
  if (process.argv.length < 3) {
    console.log('Usage: node validate-component.js <file.json>');
    console.log('\nValidates Etch WP component JSON files for common issues:');
    console.log('  • Root structure (type, gutenbergBlock, styles, components)');
    console.log('  • Component vs Layout detection and validation');
    console.log('  • Component reference cross-validation');
    console.log('  • Style ID format (7 random alphanumeric chars)');
    console.log('  • Style ID cross-references (used vs defined)');
    console.log('  • Base64 validity (no line breaks, valid characters)');
    console.log('  • ACSS variable and utility class validation');
    console.log('  • BEM naming conventions');
    console.log('  • Accessibility checks (WCAG)');
    process.exit(1);
  }

  const validator = new EtchComponentValidator();
  const filePath = process.argv[2];

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const isValid = validator.validateFile(filePath);
  process.exit(isValid ? 0 : 1);
}

module.exports = EtchComponentValidator;
