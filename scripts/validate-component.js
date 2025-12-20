#!/usr/bin/env node

/**
 * Etch WP Component Validator
 * Automatically validates generated Etch WP JSON components
 *
 * Usage: node validate-component.js <file.json>
 */

const fs = require('fs');
const path = require('path');

class EtchComponentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  validateFile(filePath) {
    console.log(`\n🔍 Validating Etch WP Component: ${path.basename(filePath)}\n`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      this.validateStructure(data);

      if (data.gutenbergBlock) {
        this.validateBlock(data.gutenbergBlock);
      }

      if (data.styles) {
        this.validateStyles(data.styles);
      }

      if (data.components) {
        this.validateComponents(data.components);
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

  validateStructure(data) {
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
      const validEtchElements = ['section', 'container', 'flex-div', 'iframe'];

      if (!validEtchElements.includes(etchElement)) {
        this.errors.push(
          `Invalid data-etch-element="${etchElement}" at ${blockPath}. Must be one of: ${validEtchElements.join(', ')}`
        );
      }

      // Validate corresponding system style
      const expectedStyles = {
        'section': 'etch-section-style',
        'container': 'etch-container-style',
        'flex-div': 'etch-flex-div-style',
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

      if (attrs.script.code && attrs.script.code.includes('\n')) {
        this.errors.push(
          `Base64 encoded script must be a single line (no line breaks) at ${blockPath}`
        );
      }

      if (attrs.script.id && !/^[a-z0-9]{7}$/.test(attrs.script.id)) {
        this.warnings.push(
          `Script ID "${attrs.script.id}" should be 7 random alphanumeric characters at ${blockPath}`
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
        this.validateCSS(style.css, id);
      }
    });
  }

  validateCSS(css, styleId) {
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

    // Check for invalid ACSS variable patterns (common mistakes)
    const invalidVarPatterns = [
      /var\(--padding-/,
      /var\(--margin-/,
      /var\(--color-/,
      /var\(--spacing-/,
      /var\(--btn-/,
    ];

    invalidVarPatterns.forEach(pattern => {
      if (pattern.test(css)) {
        this.warnings.push(
          `Style "${styleId}" may contain invalid ACSS variable name. Verify against documentation.`
        );
      }
    });
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
    console.log('\nValidates Etch WP component JSON files for common issues.');
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
