#!/usr/bin/env node

/**
 * Etch WP Component Validator (Improved)
 * Enhanced validation with Base64 and JavaScript checks
 *
 * Usage: node validate-component-improved.js <file.json>
 */

const fs = require('fs');
const path = require('path');

class EtchComponentValidator {
  // Component key must be PascalCase (e.g., FeatureCard, HeroSection)
  static PASCAL_CASE_PATTERN = /^[A-Z][A-Za-z0-9]*$/;

  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.base64LineBreakCheck = true;
    this.projectConfig = this.loadProjectConfig();
    this.projectPrefix = this.projectConfig?.prefix || null;
  }

  /**
   * Detect JSON format: 'api' (component for POST to /components) or 'paste' (layout/section for frontend editor)
   *
   * API format:  { name, key, blocks, properties, styles? }
   * Paste format: { type: "block", gutenbergBlock, version, styles, components? }
   */
  detectFormat(data) {
    if (data.type === 'block' && data.gutenbergBlock) {
      return 'paste';
    }
    if (data.name && data.key && data.blocks) {
      return 'api';
    }
    // Fallback: check for paste-like shape
    if (data.gutenbergBlock || data.type) {
      return 'paste';
    }
    return 'unknown';
  }

  validateFile(filePath) {
    console.log(`\n🔍 Validating Etch WP Component: ${path.basename(filePath)}\n`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      const format = this.detectFormat(data);

      if (format === 'api') {
        console.log('📦 Format: API component (POST to /wp-json/etch-api/components)\n');
        this.validateApiComponentStructure(data);

        // Validate blocks within the API component
        if (data.blocks && Array.isArray(data.blocks)) {
          data.blocks.forEach((block, index) => {
            this.validateBlock(block, `blocks[${index}]`);
          });
        }

        if (data.styles && typeof data.styles === 'object') {
          this.validateStyles(data.styles);
        }
      } else if (format === 'paste') {
        console.log('📋 Format: Paste/layout (for frontend editor)\n');
        this.validatePasteStructure(data);

        if (data.gutenbergBlock) {
          this.validateBlock(data.gutenbergBlock);
        }

        if (data.styles) {
          this.validateStyles(data.styles);
        }

        if (data.components) {
          this.validateComponents(data.components);
        }
      } else {
        this.errors.push(
          'Unrecognized JSON format. Expected either:\n' +
          '   • API component: { name, key, blocks, properties }\n' +
          '   • Paste/layout:  { type: "block", gutenbergBlock, version: 2, styles }'
        );
      }

      if (data.loops) {
        this.validateLoops(data.loops);
      }

      this.reportResults();
      return this.errors.length === 0;

    } catch (error) {
      console.error(`❌ FATAL ERROR: ${error.message}`);
      return false;
    }
  }

  /**
   * Validate paste/layout format: { type, gutenbergBlock, version, styles }
   */
  validatePasteStructure(data) {
    if (!data.type || data.type !== 'block') {
      this.errors.push('Missing or invalid "type" property (must be "block")');
    }

    if (!data.gutenbergBlock) {
      this.errors.push('Missing "gutenbergBlock" property');
    }

    if (data.version !== 2) {
      this.errors.push('Invalid version (must be 2)');
    }

    if (!data.styles || typeof data.styles !== 'object') {
      this.warnings.push('Missing "styles" object (usually required)');
    }
  }

  /**
   * Validate API component format: { name, key, blocks, properties, styles? }
   * This is the structure sent via POST to /wp-json/etch-api/components
   */
  validateApiComponentStructure(data) {
    if (!data.name || typeof data.name !== 'string') {
      this.errors.push('Missing or invalid "name" (string required for API component)');
    }

    if (!data.key || typeof data.key !== 'string') {
      this.errors.push('Missing or invalid "key" (string required for API component)');
    } else if (!EtchComponentValidator.PASCAL_CASE_PATTERN.test(data.key)) {
      this.warnings.push(
        `Component key "${data.key}" should be PascalCase (e.g., "FeatureCard", "HeroSection")`
      );
    }

    if (!data.blocks || !Array.isArray(data.blocks)) {
      this.errors.push('Missing or invalid "blocks" array (required for API component)');
    } else if (data.blocks.length === 0) {
      this.warnings.push('Component "blocks" array is empty');
    }

    if (!data.properties || !Array.isArray(data.properties)) {
      this.warnings.push('Missing "properties" array for API component');
    } else {
      data.properties.forEach((prop, index) => {
        if (!prop.key || !prop.name) {
          this.errors.push(
            `Missing key or name for property ${index} in API component`
          );
        }
        if (!prop.type || !prop.type.primitive) {
          this.errors.push(
            `Invalid type for property "${prop.key || index}" in API component`
          );
        }
      });
    }

    if (data.styles && typeof data.styles !== 'object') {
      this.errors.push('"styles" must be an object if provided');
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
      'etch/loop', 'etch/condition', 'etch/slot-content', 'etch/slot-placeholder'
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

    // Check for data-etch-element usage
    if (attrs.attributes && attrs.attributes['data-etch-element']) {
      const etchElement = attrs.attributes['data-etch-element'];
      const validEtchElements = ['section', 'container', 'iframe'];

      if (!validEtchElements.includes(etchElement)) {
        this.errors.push(
          `Invalid data-etch-element="${etchElement}" at ${blockPath}. Must be one of: ${validEtchElements.join(', ')}`
        );
      }

      // Validate corresponding system style
      const expectedStyles = {
        'section': 'etch-section-style',
        'container': 'etch-container-style',
        'iframe': 'etch-iframe-style'
      };

      const expectedStyle = expectedStyles[etchElement];
      if (expectedStyle && (!attrs.styles || !attrs.styles.includes(expectedStyle))) {
        this.warnings.push(
          `data-etch-element="${etchElement}" should include "${expectedStyle}" in styles array at ${blockPath}`
        );
      }
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

    // Try to decode and validate JavaScript
    try {
      const decoded = Buffer.from(code, 'base64').toString('utf8');
      this.validateJavaScript(decoded, blockPath);
    } catch (e) {
      this.errors.push(
        `Base64 decoding failed at ${blockPath}: ${e.message}`
      );
    }
  }

  validateJavaScript(jsCode, blockPath) {
    // Common typo patterns to check
    const commonTypos = [
      { pattern: /SCrollTrigger/g, correct: 'ScrollTrigger', name: 'SCrollTrigger' },
      { pattern: /vvar\s/g, correct: 'var', name: 'vvar' },
      { pattern: /ggsap\./g, correct: 'gsap.', name: 'ggsap' },
      { pattern: /doccument/g, correct: 'document', name: 'doccument' },
      { pattern: /querrySelector/g, correct: 'querySelector', name: 'querrySelector' },
      { pattern: /addeventListener/g, correct: 'addEventListener', name: 'addeventListener' },
      { pattern: /funtion/g, correct: 'function', name: 'funtion' },
      { pattern: /retunr/g, correct: 'return', name: 'retunr' },
    ];

    commonTypos.forEach(({ pattern, correct, name }) => {
      if (pattern.test(jsCode)) {
        this.errors.push(
          `JavaScript typo detected at ${blockPath}: "${name}" should be "${correct}"`
        );
      }
    });

    // Check for logical operators that might be typos
    // Single & or | where && or || is likely intended (outside of valid bitwise contexts)
    const singleAmpersandPattern = /\w+\s+&\s*\w+/;
    if (singleAmpersandPattern.test(jsCode)) {
      this.warnings.push(
        `Possible typo at ${blockPath}: Single '&' detected. Did you mean '&&' (logical AND)?`
      );
    }

    // Check for common quote issues
    if (jsCode.includes('\u2018') || jsCode.includes('\u2019')) {
      this.warnings.push(
        `Curly quotes detected at ${blockPath}. Use straight quotes ' or " instead.`
      );
    }

    // Check for console.log (warning for production)
    if (/console\.log\s*\(/.test(jsCode)) {
      this.info.push(`console.log found at ${blockPath}. Consider removing for production.`);
    }

    // Basic syntax check - try to find unclosed braces/parens
    const openBraces = (jsCode.match(/\{/g) || []).length;
    const closeBraces = (jsCode.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      this.errors.push(
        `Unmatched braces at ${blockPath}: ${openBraces} opening, ${closeBraces} closing`
      );
    }

    const openParens = (jsCode.match(/\(/g) || []).length;
    const closeParens = (jsCode.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      this.errors.push(
        `Unmatched parentheses at ${blockPath}: ${openParens} opening, ${closeParens} closing`
      );
    }

    // Check for GSAP/ScrollTrigger common patterns
    if (jsCode.includes('gsap') && jsCode.includes('ScrollTrigger')) {
      if (!jsCode.includes('gsap.registerPlugin(ScrollTrigger)') &&
          !jsCode.includes('registerPlugin(ScrollTrigger)')) {
        this.errors.push(
          `ScrollTrigger is used but gsap.registerPlugin(ScrollTrigger) is missing at ${blockPath}`
        );
      }
    }
  }

  validateComponentUsage(block, blockPath) {
    const attrs = block.attrs;

    if (!attrs.ref) {
      this.errors.push(`Missing "ref" attribute for etch/component at ${blockPath}`);
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
      // Check style ID format (7 random alphanumeric chars)
      if (!/^[a-z0-9]{7}$/.test(id) && !id.startsWith('etch-')) {
        this.warnings.push(
          `Style ID "${id}" should be 7 random alphanumeric characters (e.g., "q2fy3v0")`
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
    // Check for nested component classes (common error)
    const nestedComponentPattern = /\.\w+-\w+\s+\.\w+-\w+/;
    if (nestedComponentPattern.test(css)) {
      this.warnings.push(
        `Style "${styleId}" may contain nested components. Each component should have its own style object.`
      );
    }

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
          `Style "${styleId}" may contain invalid ACSS variable name. Verify against documentation.`
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

  reportResults() {
    let hasIssues = false;

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
    console.log('Usage: node validate-component-improved.js <file.json>');
    console.log('\nValidates Etch WP component JSON files for common issues.');
    console.log('\nEnhanced checks include:');
    console.log('  • Base64 validity (no line breaks, valid characters)');
    console.log('  • JavaScript syntax and common typos');
    console.log('  • GSAP/ScrollTrigger patterns');
    console.log('  • Quote consistency');
    console.log('  • Brace/parenthesis matching');
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
