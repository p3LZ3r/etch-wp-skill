#!/usr/bin/env node

/**
 * Etch WP Pattern Collector
 * Crawls patterns.etchwp.com and saves patterns as templates
 *
 * Usage: node scripts/collect-patterns.js [options]
 * Options:
 *   --category <name>  Collect specific category (hero, footer, etc.)
 *   --all              Collect all patterns (default)
 *   --output <dir>     Output directory (default: assets/templates/patterns)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Pattern categories from patterns.etchwp.com
const CATEGORIES = [
  'hero',
  'headers',
  'footer',
  'features',
  'testimonials',
  'content',
  'blog',
  'interactive',
  'introductions',
  'avatars'
];

// Known patterns (we'll update this as we discover more)
const PATTERNS = {
  hero: [
    'hero-alpha',
    'hero-bravo',
    'hero-charlie',
    'hero-delta',
    'hero-echo',
    'hero-foxtrot',
    'hero-golf',
    'hero-hotel',
    'hero-india',
    'hero-juliet'
  ],
  // Add more as discovered...
};

class PatternCollector {
  constructor(options = {}) {
    this.outputDir = options.output || path.join(__dirname, '../assets/templates/patterns');
    this.category = options.category || null;
    this.verbose = options.verbose || false;

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Fetch HTML from patterns.etchwp.com
   */
  async fetchPattern(patternSlug) {
    return new Promise((resolve, reject) => {
      const url = `https://patterns.etchwp.com/layouts/${patternSlug}/`;

      if (this.verbose) {
        console.log(`Fetching: ${url}`);
      }

      https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          }
        });
      }).on('error', reject);
    });
  }

  /**
   * Extract JSON from data-json attribute in HTML
   */
  extractJSON(html) {
    // Look for data-json attribute
    const matches = html.match(/data-json=["']({.*?})["']/s);

    if (!matches || !matches[1]) {
      // Try alternative: might be HTML-encoded
      const encodedMatch = html.match(/data-json=["']([^"']+)["']/);
      if (encodedMatch) {
        // Decode HTML entities
        const decoded = encodedMatch[1]
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#039;/g, "'");

        try {
          return JSON.parse(decoded);
        } catch (e) {
          return null;
        }
      }
      return null;
    }

    try {
      return JSON.parse(matches[1]);
    } catch (e) {
      console.error('Failed to parse JSON:', e.message);
      return null;
    }
  }

  /**
   * Extract pattern metadata from HTML
   */
  extractMetadata(html, slug) {
    const metadata = {
      slug,
      name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      category: slug.split('-')[0],
      description: '',
      tags: []
    };

    // Try to extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) {
      metadata.name = titleMatch[1].replace(' - Etch Patterns', '').trim();
    }

    // Try to extract description
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    if (descMatch) {
      metadata.description = descMatch[1];
    }

    return metadata;
  }

  /**
   * Save pattern to file
   */
  savePattern(slug, json, metadata) {
    const category = metadata.category;
    const categoryDir = path.join(this.outputDir, category);

    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const filename = `${slug}.json`;
    const filepath = path.join(categoryDir, filename);

    // Add metadata to JSON
    const patternData = {
      ...json,
      _metadata: {
        source: 'patterns.etchwp.com',
        slug,
        ...metadata,
        collected: new Date().toISOString()
      }
    };

    fs.writeFileSync(filepath, JSON.stringify(patternData, null, 2));
    console.log(`✓ Saved: ${category}/${filename}`);

    return filepath;
  }

  /**
   * Collect a single pattern
   */
  async collectPattern(slug) {
    try {
      const html = await this.fetchPattern(slug);
      const json = this.extractJSON(html);

      if (!json) {
        console.error(`✗ No JSON found for ${slug}`);
        return null;
      }

      const metadata = this.extractMetadata(html, slug);
      const filepath = this.savePattern(slug, json, metadata);

      return { slug, filepath, metadata };
    } catch (error) {
      console.error(`✗ Error collecting ${slug}:`, error.message);
      return null;
    }
  }

  /**
   * Collect all patterns in a category
   */
  async collectCategory(category) {
    const patterns = PATTERNS[category] || [];

    console.log(`\nCollecting ${category} patterns (${patterns.length})...`);

    const results = [];
    for (const slug of patterns) {
      const result = await this.collectPattern(slug);
      if (result) {
        results.push(result);
      }
      // Be nice to the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  /**
   * Collect all patterns
   */
  async collectAll() {
    console.log('Collecting all Etch WP patterns...\n');

    const allResults = {};

    for (const category of CATEGORIES) {
      if (PATTERNS[category]) {
        allResults[category] = await this.collectCategory(category);
      }
    }

    return allResults;
  }

  /**
   * Generate index file
   */
  generateIndex(results) {
    const indexPath = path.join(this.outputDir, 'INDEX.md');

    let content = '# Etch WP Pattern Templates\n\n';
    content += `Collected from https://patterns.etchwp.com/\n`;
    content += `Last updated: ${new Date().toISOString()}\n\n`;

    Object.entries(results).forEach(([category, patterns]) => {
      content += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;

      patterns.forEach(({ slug, metadata }) => {
        content += `- **${metadata.name}** \`${category}/${slug}.json\`\n`;
        if (metadata.description) {
          content += `  ${metadata.description}\n`;
        }
      });

      content += '\n';
    });

    fs.writeFileSync(indexPath, content);
    console.log(`\n✓ Generated index: INDEX.md`);
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v')
  };

  const collector = new PatternCollector(options);

  // Parse arguments
  const categoryIndex = args.indexOf('--category');
  const allIndex = args.indexOf('--all');

  if (categoryIndex !== -1 && args[categoryIndex + 1]) {
    const category = args[categoryIndex + 1];
    collector.collectCategory(category)
      .then(results => {
        console.log(`\n✓ Collected ${results.length} patterns from ${category}`);
      })
      .catch(error => {
        console.error('Error:', error);
        process.exit(1);
      });
  } else {
    // Default: collect all
    collector.collectAll()
      .then(results => {
        collector.generateIndex(results);
        const total = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
        console.log(`\n✓ Collected ${total} patterns total`);
      })
      .catch(error => {
        console.error('Error:', error);
        process.exit(1);
      });
  }
}

module.exports = PatternCollector;
