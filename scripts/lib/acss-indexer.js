#!/usr/bin/env node

/**
 * ACSS Indexer - Extracts variables and utility classes from automatic.css
 *
 * This module fetches the automatic.css file from a WordPress site,
 * extracts CSS variables and important utility classes, and creates
 * a searchable index JSON file (without storing the full CSS).
 */

const https = require('https');
const http = require('http');

/**
 * Fetch CSS content from URL
 * @param {string} url - URL to fetch CSS from
 * @returns {Promise<string>} - CSS content
 */
function fetchCSS(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;

    const req = client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirects
        fetchCSS(res.headers.location).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: Failed to fetch CSS`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Extract CSS custom properties (variables) from CSS content
 * @param {string} css - CSS content
 * @returns {Object} - Object with variable names as keys and values
 */
function extractVariables(css) {
  const variables = {};

  // Match CSS custom properties: --variable-name: value;
  const varRegex = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let match;

  while ((match = varRegex.exec(css)) !== null) {
    const name = `--${match[1]}`;
    const value = match[2].trim();

    // Skip if already captured (keep first occurrence - usually :root)
    if (!variables[name]) {
      variables[name] = value;
    }
  }

  return variables;
}

/**
 * Extract important utility classes from CSS content
 * @param {string} css - CSS content
 * @returns {Object} - Categorized utility classes
 */
function extractUtilityClasses(css) {
  const classes = {
    buttons: [],
    grids: [],
    flex: [],
    typography: [],
    spacing: [],
    colors: [],
    containers: [],
    other: []
  };

  // Extract class names from CSS selectors
  const classRegex = /\.([a-zA-Z0-9_-]+)/g;
  const foundClasses = new Set();
  let match;

  while ((match = classRegex.exec(css)) !== null) {
    foundClasses.add(match[1]);
  }

  // Categorize classes
  foundClasses.forEach(className => {
    if (className.startsWith('btn--')) {
      classes.buttons.push(className);
    } else if (className.startsWith('grid--')) {
      classes.grids.push(className);
    } else if (className.startsWith('flex--')) {
      classes.flex.push(className);
    } else if (className.startsWith('text--')) {
      classes.typography.push(className);
    } else if (className.startsWith('space--')) {
      classes.spacing.push(className);
    } else if (className.startsWith('color--')) {
      classes.colors.push(className);
    } else if (className.startsWith('container--')) {
      classes.containers.push(className);
    } else if (
      className.includes('heading') ||
      className.includes('body') ||
      className.includes('display')
    ) {
      classes.typography.push(className);
    } else if (
      className.startsWith('section--') ||
      className.startsWith('content--')
    ) {
      classes.other.push(className);
    }
  });

  // Sort each category
  Object.keys(classes).forEach(key => {
    classes[key].sort();
  });

  return classes;
}

/**
 * Extract ACSS configuration hints from CSS content
 * @param {string} css - CSS content
 * @returns {Object} - Configuration hints and warnings
 */
function extractConfigHints(css) {
  const hints = {
    hasFonts: false,
    hasColors: false,
    hasButtons: false,
    hasSpacing: false,
    warnings: []
  };

  const variables = extractVariables(css);

  // Check for font variables
  if (variables['--font-primary'] || variables['--body-font']) {
    hints.hasFonts = true;
  }

  // Check for color variables
  if (variables['--primary'] || variables['--action-primary']) {
    hints.hasColors = true;
  }

  // Check for button-related variables
  if (variables['--btn-padding'] || css.includes('.btn--primary')) {
    hints.hasButtons = true;
  }

  // Check for spacing variables
  if (variables['--space-m'] || variables['--section-space-m']) {
    hints.hasSpacing = true;
  }

  // Generate warnings
  if (!hints.hasFonts) {
    hints.warnings.push('No font variables found. Configure typography in ACSS Dashboard.');
  }
  if (!hints.hasColors) {
    hints.warnings.push('No primary color variables found. Configure brand colors in ACSS Dashboard.');
  }
  if (!hints.hasButtons) {
    hints.warnings.push('No button styles found. Configure button styles in ACSS Dashboard.');
  }
  if (!hints.hasSpacing) {
    hints.warnings.push('No spacing variables found. Configure spacing in ACSS Dashboard.');
  }

  return hints;
}

/**
 * ACSS CSS files to fetch (in order of priority)
 * @type {string[]}
 */
const ACSS_FILES = [
  'automatic-token.css',
  'automatic-variables.css',
  'automatic.css'
];

/**
 * Fetch multiple CSS files and combine them
 * @param {string} baseUrl - Base URL to ACSS directory (e.g., https://example.com/wp-content/uploads/automatic-css/)
 * @returns {Promise<{css: string, sources: string[], failed: string[]}>} - Combined CSS and metadata
 */
async function fetchMultipleCSS(baseUrl) {
  // Ensure baseUrl ends with /
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  const results = await Promise.allSettled(
    ACSS_FILES.map(file => fetchCSS(`${normalizedBase}${file}`))
  );

  const cssParts = [];
  const sources = [];
  const failed = [];

  results.forEach((result, index) => {
    const file = ACSS_FILES[index];
    if (result.status === 'fulfilled') {
      cssParts.push(`/* === ${file} === */\n${result.value}`);
      sources.push(`${normalizedBase}${file}`);
    } else {
      failed.push(file);
      console.log(`   ⚠️  Could not fetch ${file}: ${result.reason.message}`);
    }
  });

  if (cssParts.length === 0) {
    throw new Error(`Failed to fetch any ACSS files from ${normalizedBase}`);
  }

  return {
    css: cssParts.join('\n\n'),
    sources,
    failed
  };
}

/**
 * Create ACSS index from URL
 * @param {string} url - URL to ACSS directory or automatic.css file
 * @returns {Promise<Object>} - Index object with variables, classes, and metadata
 */
async function fetchAndIndexACSS(url) {
  // If URL points to a specific file, get the base directory
  let baseUrl = url;
  if (url.endsWith('.css')) {
    baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
  }

  console.log(`🔍 Fetching ACSS from: ${baseUrl}`);
  console.log(`   Looking for: ${ACSS_FILES.join(', ')}`);

  try {
    const { css, sources, failed } = await fetchMultipleCSS(baseUrl);
    console.log(`✅ Downloaded ${(css.length / 1024).toFixed(1)} KB of CSS from ${sources.length} file(s)`);
    if (failed.length > 0) {
      console.log(`   ⚠️  Missing files: ${failed.join(', ')}`);
    }

    const index = {
      generated: new Date().toISOString(),
      source: baseUrl,
      sources,
      failed,
      metadata: {
        cssSize: css.length,
        cssSizeKb: Math.round(css.length / 1024 * 10) / 10,
        filesFetched: sources.length,
        filesFailed: failed.length
      },
      variables: extractVariables(css),
      utilityClasses: extractUtilityClasses(css),
      config: extractConfigHints(css)
    };

    // Add summary statistics
    index.summary = {
      totalVariables: Object.keys(index.variables).length,
      totalClasses: Object.values(index.utilityClasses)
        .reduce((sum, arr) => sum + arr.length, 0),
      categories: Object.keys(index.utilityClasses).reduce((obj, key) => {
        obj[key] = index.utilityClasses[key].length;
        return obj;
      }, {})
    };

    return index;

  } catch (error) {
    console.error(`❌ Failed to fetch ACSS: ${error.message}`);
    throw error;
  }
}

/**
 * Save index to file
 * @param {Object} index - ACSS index object
 * @param {string} outputPath - Path to save file (default: .etch-acss-index.json)
 */
function saveIndex(index, outputPath = '.etch-acss-index.json') {
  const fs = require('fs');
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`💾 Saved ACSS index to: ${outputPath}`);
  console.log(`   - ${index.summary.totalVariables} variables`);
  console.log(`   - ${index.summary.totalClasses} utility classes`);
}

/**
 * Load existing index from file
 * @param {string} indexPath - Path to index file
 * @returns {Object|null} - Index object or null if not found
 */
function loadIndex(indexPath = '.etch-acss-index.json') {
  const fs = require('fs');

  if (!fs.existsSync(indexPath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  } catch (error) {
    console.error(`❌ Failed to load index: ${error.message}`);
    return null;
  }
}

/**
 * Get commonly used ACSS variables for quick reference
 * @param {Object} index - ACSS index object
 * @returns {Object} - Categorized common variables
 */
function getCommonVariables(index) {
  const vars = index.variables;

  return {
    colors: {
      primary: vars['--primary'] || vars['--action-primary'],
      secondary: vars['--secondary'] || vars['--action-secondary'],
      accent: vars['--accent'],
      heading: vars['--heading-color'],
      text: vars['--text-color'] || vars['--body-color']
    },
    fonts: {
      primary: vars['--font-primary'] || vars['--body-font'],
      heading: vars['--font-heading'],
      accent: vars['--font-accent']
    },
    spacing: {
      xs: vars['--space-xs'],
      s: vars['--space-s'],
      m: vars['--space-m'],
      l: vars['--space-l'],
      xl: vars['--space-xl']
    },
    typography: {
      h1: vars['--h1'],
      h2: vars['--h2'],
      h3: vars['--h3'],
      body: vars['--text-m'] || vars['--body-font-size']
    },
    containers: {
      width: vars['--content-width'],
      wide: vars['--wide-width'],
      full: vars['--full-width']
    }
  };
}

// Export for use as module
module.exports = {
  fetchAndIndexACSS,
  saveIndex,
  loadIndex,
  extractVariables,
  extractUtilityClasses,
  getCommonVariables
};

// CLI usage
if (require.main === module) {
  const url = process.argv[2];

  if (!url) {
    console.log('Usage: node acss-indexer.js <acss-directory-url>');
    console.log('');
    console.log('Examples:');
    console.log('  node acss-indexer.js https://example.com/wp-content/uploads/automatic-css/');
    console.log('  node acss-indexer.js https://example.com/wp-content/uploads/automatic-css/automatic.css');
    console.log('');
    console.log('Fetches these files (if available):');
    console.log('  - automatic-token.css');
    console.log('  - automatic-variables.css');
    console.log('  - automatic.css');
    process.exit(1);
  }

  fetchAndIndexACSS(url)
    .then(index => {
      saveIndex(index);

      if (index.config.warnings.length > 0) {
        console.log('\n⚠️  Configuration Warnings:');
        index.config.warnings.forEach(w => console.log(`   - ${w}`));
      }

      console.log('\n✨ Indexing complete!');
    })
    .catch(error => {
      console.error(`\n❌ Error: ${error.message}`);
      process.exit(1);
    });
}
