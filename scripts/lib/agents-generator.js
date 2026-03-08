#!/usr/bin/env node

/**
 * AGENTS.md Generator - Creates project-specific AGENTS.md file
 *
 * Generates comprehensive documentation for Claude based on project
 * configuration and ACSS index data.
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse .env file and return key-value pairs
 * @param {string} envPath - Path to .env file
 * @returns {Object} - Environment variables
 */
function parseEnvFile(envPath = '.env') {
  const env = {};
  if (!fs.existsSync(envPath)) {
    return env;
  }

  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    // Skip comments and empty lines
    if (!line || line.startsWith('#')) return;

    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      env[match[1]] = match[2].trim();
    }
  });

  return env;
}

/**
 * Generate AGENTS.md content
 * @param {Object} config - Project configuration from .etch-project.json
 * @param {Object} acssIndex - ACSS index data (optional)
 * @param {Object} env - Environment variables from .env (optional)
 * @returns {string} - Markdown content
 */
function generateAgentsMd(config, acssIndex = null, env = null) {
  const prefix = config.prefix;
  const projectName = config.name;

  // Load env if not provided
  if (!env) {
    env = parseEnvFile();
  }

  // Get URLs from env or config (env takes precedence)
  const devUrl = env.ETCH_DEV_URL || config.devUrl || 'Not configured';
  const acssUrl = acssIndex?.source || (devUrl !== 'Not configured' ? `${devUrl.replace(/\/$/, '')}/wp-content/uploads/automatic-css/automatic.css` : 'Not configured');
  const apiUrl = devUrl !== 'Not configured' ? `${devUrl.replace(/\/$/, '')}/wp-json/etch-api` : 'Not configured';

  let md = `---
name: ${projectName}
description: Project-specific configuration for ${projectName} - Etch WP development with ACSS
---

# ${projectName} - Project Guide

## Project Metadata

| Property | Value |
|----------|-------|
| **Name** | ${projectName} |
| **Prefix** | ${prefix} |
| **Created** | ${config.created} |
| **Dev URL** | ${devUrl} |
| **ACSS URL** | ${acssUrl} |
`;

  // Add style information if available
  if (config.styles) {
    md += `\n## Design System\n\n`;

    if (config.styles.aesthetic) {
      md += `- **Aesthetic**: ${config.styles.aesthetic}\n`;
    }
    if (config.styles.typography) {
      md += `- **Typography**: ${config.styles.typography}\n`;
    }
    if (config.styles.primaryColors && config.styles.primaryColors.length > 0) {
      md += `- **Primary Colors**: ${config.styles.primaryColors.join(', ')}\n`;
    }
    if (config.styles.targetAudience) {
      md += `- **Target Audience**: ${config.styles.targetAudience}\n`;
    }
    if (config.styles.referenceSites && config.styles.referenceSites.length > 0) {
      md += `- **Reference Sites**: ${config.styles.referenceSites.join(', ')}\n`;
    }
  }

  // Add API configuration
  md += `\n## API Configuration\n\n`;
  md += `- **Base URL**: ${apiUrl}\n`;
  md += `- **Auth Method**: ${env.ETCH_API_USERNAME ? 'application-password' : 'Not configured'}\n`;
  md += `- **Username**: ${env.ETCH_API_USERNAME || config.api?.username || 'Not configured'}\n`;

  // Add ACSS configuration
  md += `\n## ACSS Configuration\n\n`;
  md += `- **ACSS URL**: ${acssUrl}\n`;

  if (acssIndex) {
    md += `- **Indexed**: ${acssIndex.generated}\n`;
    md += `- **Variables**: ${acssIndex.summary.totalVariables}\n`;
    md += `- **Utility Classes**: ${acssIndex.summary.totalClasses}\n\n`;

      // Add common variables section
      if (acssIndex.variables && Object.keys(acssIndex.variables).length > 0) {
        md += `### Common ACSS Variables\n\n`;

        const vars = acssIndex.variables;

        // Colors
        md += `**Colors:**\n`;
        md += `- \`--primary\`: ${vars['--primary'] || vars['--action-primary'] || 'N/A'}\n`;
        md += `- \`--secondary\`: ${vars['--secondary'] || vars['--action-secondary'] || 'N/A'}\n`;
        md += `- \`--accent\`: ${vars['--accent'] || 'N/A'}\n`;
        md += `- \`--heading-color\`: ${vars['--heading-color'] || 'N/A'}\n`;
        md += `- \`--text-color\`: ${vars['--text-color'] || vars['--body-color'] || 'N/A'}\n\n`;

        // Typography
        md += `**Typography:**\n`;
        md += `- \`--font-primary\`: ${vars['--font-primary'] || vars['--body-font'] || 'N/A'}\n`;
        md += `- \`--font-heading\`: ${vars['--font-heading'] || 'N/A'}\n`;
        md += `- \`--h1\`: ${vars['--h1'] || 'N/A'}\n`;
        md += `- \`--h2\`: ${vars['--h2'] || 'N/A'}\n`;
        md += `- \`--text-m\`: ${vars['--text-m'] || vars['--body-font-size'] || 'N/A'}\n\n`;

        // Spacing
        md += `**Spacing:**\n`;
        md += `- \`--space-xs\`: ${vars['--space-xs'] || 'N/A'}\n`;
        md += `- \`--space-s\`: ${vars['--space-s'] || 'N/A'}\n`;
        md += `- \`--space-m\`: ${vars['--space-m'] || 'N/A'}\n`;
        md += `- \`--space-l\`: ${vars['--space-l'] || 'N/A'}\n`;
        md += `- \`--space-xl\`: ${vars['--space-xl'] || 'N/A'}\n`;
        md += `- \`--section-space-m\`: ${vars['--section-space-m'] || 'N/A'}\n\n`;

        // Container
        md += `**Container:**\n`;
        md += `- \`--content-width\`: ${vars['--content-width'] || 'N/A'}\n`;
        md += `- \`--container-padding\`: ${vars['--container-padding'] || 'N/A'}\n\n`;
      }

      // Add utility classes section
      if (acssIndex.utilityClasses) {
        const uc = acssIndex.utilityClasses;

        if (uc.buttons && uc.buttons.length > 0) {
          md += `### Button Classes\n\n`;
          md += uc.buttons.slice(0, 10).map(c => `\`${c}\``).join(', ');
          if (uc.buttons.length > 10) {
            md += ` *(+${uc.buttons.length - 10} more)*`;
          }
          md += `\n\n`;
        }

        if (uc.grids && uc.grids.length > 0) {
          md += `### Grid Classes\n\n`;
          md += uc.grids.slice(0, 8).map(c => `\`${c}\``).join(', ');
          if (uc.grids.length > 8) {
            md += ` *(+${uc.grids.length - 8} more)*`;
          }
          md += `\n\n`;
        }
      }

      // Add warnings if any
      if (acssIndex.config && acssIndex.config.warnings.length > 0) {
        md += `### ⚠️ Configuration Warnings\n\n`;
        acssIndex.config.warnings.forEach(warning => {
          md += `- ${warning}\n`;
        });
        md += `\n> **Action Required**: Configure these settings in the ACSS Dashboard before generating components.\n\n`;
      }
  } else {
    md += `\n> ⚠️ ACSS index not found. Run project initialization to index ACSS variables.\n\n`;
  }

  // Add BEM naming guide
  md += `## BEM Naming Convention\n\n`;
  md += `**Format**: \`.${prefix}-{block}__{element}--{modifier}\`\n\n`;
  md += `**Examples**:\n`;
  md += `- \`.${prefix}-hero\` - Block\n`;
  md += `- \`.${prefix}-hero__title\` - Element\n`;
  md += `- \`.${prefix}-hero__cta-wrapper\` - Element (compound)\n`;
  md += `- \`.${prefix}-hero--dark\` - Block modifier\n`;
  md += `- \`.${prefix}-hero__button--primary\` - Element modifier\n\n`;

  // Add coding standards
  md += `## Coding Standards\n\n`;
  md += `### CSS Architecture\n`;
  md += `- Use ACSS utility classes FIRST (\`btn--primary\`, \`grid--3-col\`)\n`;
  md += `- Custom CSS only for layout/positioning (flex, gap, margin)\n`;
  md += `- NEVER redefine button appearance (background, padding, border-radius)\n`;
  md += `- Use CSS variables from ACSS (\`var(--primary)\`, \`var(--space-m)\`)\n\n`;

  md += `### Component Structure\n`;
  md += `- Section → Container → Content hierarchy\n`;
  md += `- Use \`data-etch-element="section"\` for sections\n`;
  md += `- Use \`data-etch-element="container"\` for containers\n`;
  md += `- ALL text content in \`etch/text\` blocks\n`;
  md += `- ALL images via \`etch/dynamic-image\`\n\n`;

  md += `### Accessibility\n`;
  md += `- Logical properties for RTL (\`margin-inline-start\`)\n`;
  md += `- Reduced motion alternatives\n`;
  md += `- Visible \`:focus-visible\` on interactive elements\n`;
  md += `- Proper ARIA attributes\n`;
  md += `- Alt text on all images\n\n`;

  // Add API workflow section
  md += `## API Workflow\n\n`;
  md += `### Before Creating Components\n`;
  md += `1. Check official patterns: https://patterns.etchwp.com/\n`;
  md += `2. Query target site API: GET ${config.api?.baseUrl || '/wp-json/etch-api'}/components/list\n`;
  md += `3. Reuse existing components when possible\n\n`;

  md += `### Creating Components\n`;
  md += `- Use API format for components\n`;
  md += `- POST to \`${config.api?.baseUrl || '/wp-json/etch-api'}/components\`\n`;
  md += `- NEVER save API component JSON as files\n`;
  md += `- Styles inline in \`etchData.styles\` only\n\n`;

  md += `### Creating Layouts/Sections\n`;
  md += `- Use paste format for layouts\n`;
  md += `- Save as \`.json\` files in project\n`;
  md += `- Paste into Etch frontend editor\n\n`;

  md += `### Validation\n`;
  md += '```bash\n';
  md += `# Validate generated JSON\n`;
  md += `node scripts/validate-component.js <filename>.json\n`;
  md += '```\n\n';

  // Add quick reference
  md += `## Quick Reference\n\n`;
  md += `### ACSS Utility Classes (Use These First)\n\n`;
  md += `**Buttons:**\n`;
  md += `- \`btn--primary\`, \`btn--secondary\`, \`btn--tertiary\`, \`btn--link\`\n`;
  md += `- \`btn--small\`, \`btn--large\`\n\n`;

  md += `**Common Variables:**\n`;
  md += '- Background: `var(--bg-light)`, `var(--bg-dark)`\n';
  md += '- Text: `var(--text-color)`, `var(--heading-color)`\n';
  md += '- Spacing: `var(--space-m)`, `var(--section-space-m)`\n';
  md += '- Colors: `var(--primary)`, `var(--secondary)`, `var(--accent)`\n\n';

  md += `### Block Types\n\n`;
  md += '| Block | Use For |\n';
  md += '|-------|---------|\n';
  md += '| `etch/element` | HTML elements (div, h1, p, etc.) |\n';
  md += '| `etch/text` | ALL text content |\n';
  md += '| `etch/dynamic-image` | Images (always use this) |\n';
  md += '| `etch/svg` | SVG icons |\n';
  md += '| `etch/component` | Component references |\n';
  md += '| `etch/loop` | Dynamic lists |\n';
  md += '| `etch/condition` | Conditional rendering |\n\n';

  // Add project files section
  md += `## Project Files\n\n`;
  md += '| File | Purpose |\n';
  md += '|------|---------|\n';
  md += '| `.etch-project.json` | Project configuration |\n';
  md += '| `.etch-acss-index.toon` | ACSS variables index (TOON format) |\n';
  md += '| `.env` | API credentials (gitignored) |\n';
  md += '| `AGENTS.md` | This file |\n';
  md += '| `CLAUDE.md` | Symlink to AGENTS.md |\n\n';

  // Add footer
  md += `---\n\n`;
  md += `*Generated by Etch WP Project Initializer*\n`;
  md += `*Last updated: ${new Date().toISOString().split('T')[0]}*\n`;

  return md;
}

/**
 * Save AGENTS.md file
 * @param {string} content - Markdown content
 * @param {string} outputPath - Path to save (default: AGENTS.md)
 */
function saveAgentsMd(content, outputPath = 'AGENTS.md') {
  fs.writeFileSync(outputPath, content);
  console.log(`📝 Created: ${outputPath}`);
}

/**
 * Create symlink CLAUDE.md -> AGENTS.md
 * @param {string} agentsPath - Path to AGENTS.md
 * @param {string} claudePath - Path to CLAUDE.md
 */
function createSymlink(agentsPath = 'AGENTS.md', claudePath = 'CLAUDE.md') {
  try {
    // Check if CLAUDE.md exists
    if (fs.existsSync(claudePath)) {
      const stats = fs.lstatSync(claudePath);
      if (stats.isSymbolicLink()) {
        console.log(`✅ Symlink exists: ${claudePath} -> ${fs.readlinkSync(claudePath)}`);
        return;
      }
      // Backup existing file
      const backupPath = `${claudePath}.backup-${Date.now()}`;
      fs.renameSync(claudePath, backupPath);
      console.log(`📦 Backed up existing ${claudePath} to ${backupPath}`);
    }

    fs.symlinkSync(agentsPath, claudePath);
    console.log(`🔗 Created symlink: ${claudePath} -> ${agentsPath}`);
  } catch (error) {
    console.error(`❌ Failed to create symlink: ${error.message}`);
    console.log(`   Manual command: ln -s ${agentsPath} ${claudePath}`);
  }
}

// Export for use as module
module.exports = {
  generateAgentsMd,
  saveAgentsMd,
  createSymlink
};

// CLI usage
if (require.main === module) {
  const configPath = process.argv[2] || '.etch-project.json';
  const indexPath = process.argv[3] || '.etch-acss-index.toon';

  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config not found: ${configPath}`);
    console.log('Usage: node agents-generator.js [config-path] [acss-index-path]');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const acssIndex = fs.existsSync(indexPath)
    ? JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    : null;

  const content = generateAgentsMd(config, acssIndex);
  saveAgentsMd(content);
  createSymlink();

  console.log('\n✨ AGENTS.md generation complete!');
}
