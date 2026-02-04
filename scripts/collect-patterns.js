#!/usr/bin/env node

/**
 * Etch WP Pattern Collector
 * Fetches pattern JSON from patterns.etchwp.com
 *
 * This script extracts the actual block JSON from the data-json attribute
 * on the copy button, giving you import-ready Etch WP patterns.
 *
 * Usage: node scripts/collect-patterns.js [options]
 * Options:
 *   --category <slug>  Collect specific category (hero, footer, etc.)
 *   --all              Collect all patterns (default)
 *   --output <dir>     Output directory (default: assets/templates/patterns)
 *   --list             Just list available patterns without downloading
 *   --status           Show which patterns need updating (without downloading)
 *   --force            Force re-download all patterns (ignore cache)
 *   --verbose          Show detailed progress
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'patterns.etchwp.com';
const API_PATH = '/wp-json/wp/v2';

class PatternCollector {
  constructor(options = {}) {
    this.outputDir = options.output || path.join(__dirname, '../assets/templates/patterns');
    this.category = options.category || null;
    this.verbose = options.verbose || false;
    this.listOnly = options.listOnly || false;
    this.statusOnly = options.statusOnly || false;
    this.force = options.force || false;
    this.families = new Map();
    this.stats = { new: 0, updated: 0, unchanged: 0, failed: 0 };
  }

  /**
   * Make HTTPS request
   */
  async fetchURL(url) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: API_BASE,
        path: url,
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/html',
          'User-Agent': 'Etch-WP-Pattern-Collector/2.0'
        }
      };

      if (this.verbose) {
        console.log(`Fetching: https://${API_BASE}${url}`);
      }

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      req.end();
    });
  }

  /**
   * Fetch API endpoint
   */
  async fetchAPI(endpoint) {
    const data = await this.fetchURL(`${API_PATH}${endpoint}`);
    try {
      return JSON.parse(data);
    } catch (e) {
      throw new Error(`Failed to parse JSON: ${e.message}`);
    }
  }

  /**
   * Fetch families (categories)
   */
  async fetchFamilies() {
    console.log('Fetching pattern categories...\n');
    const families = await this.fetchAPI('/families');

    families.forEach(family => {
      this.families.set(family.slug, {
        id: family.id,
        name: family.name,
        slug: family.slug,
        count: family.count
      });
    });

    return families;
  }

  /**
   * Fetch patterns in a family
   */
  async fetchPatternsByFamily(familyId, familySlug) {
    const patterns = await this.fetchAPI(`/layouts?families=${familyId}&per_page=100`);

    return patterns.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title?.rendered || p.slug,
      link: p.link,
      modified: p.modified,
      family: familySlug
    }));
  }

  /**
   * Extract JSON from pattern page HTML
   */
  extractBlockJSON(html) {
    // Pattern 1: data-json='{"type":"block"...}' (single quotes, raw JSON)
    const match1 = html.match(/data-json='({"type":"block"[^']+})'/);
    if (match1) {
      try {
        return JSON.parse(match1[1]);
      } catch (e) {
        if (this.verbose) console.error('Failed to parse JSON (pattern 1):', e.message);
      }
    }

    // Pattern 2: data-json="{&quot;type&quot;:&quot;block&quot;...}" (double quotes, HTML-encoded)
    const match2 = html.match(/data-json="({&quot;type&quot;:[^"]+)"/);
    if (match2) {
      try {
        const decoded = match2[1]
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
        return JSON.parse(decoded);
      } catch (e) {
        if (this.verbose) console.error('Failed to parse JSON (pattern 2):', e.message);
      }
    }

    return null;
  }

  /**
   * Check if a pattern needs updating by comparing modified dates
   */
  checkPatternStatus(pattern, filepath) {
    if (!fs.existsSync(filepath)) {
      return { status: 'new', needsUpdate: true };
    }

    if (this.force) {
      return { status: 'force', needsUpdate: true };
    }

    try {
      const existing = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      const localModified = existing._metadata?.modified;

      if (!localModified) {
        return { status: 'unknown', needsUpdate: true };
      }

      // Compare dates - API returns ISO format dates
      const localDate = new Date(localModified);
      const remoteDate = new Date(pattern.modified);

      if (remoteDate > localDate) {
        return {
          status: 'updated',
          needsUpdate: true,
          localModified,
          remoteModified: pattern.modified
        };
      }

      return {
        status: 'current',
        needsUpdate: false,
        localModified,
        remoteModified: pattern.modified
      };
    } catch (e) {
      return { status: 'error', needsUpdate: true };
    }
  }

  /**
   * Fetch and extract block JSON for a single pattern
   */
  async fetchPatternJSON(pattern) {
    try {
      const html = await this.fetchURL(`/layouts/${pattern.slug}/`);
      const json = this.extractBlockJSON(html);

      if (!json) {
        console.error(`  ✗ No block JSON found for ${pattern.slug}`);
        return null;
      }

      // Add metadata
      json._metadata = {
        source: 'patterns.etchwp.com',
        slug: pattern.slug,
        title: pattern.title,
        family: pattern.family,
        link: pattern.link,
        modified: pattern.modified,
        collected: new Date().toISOString()
      };

      return json;
    } catch (error) {
      console.error(`  ✗ Error fetching ${pattern.slug}:`, error.message);
      return null;
    }
  }

  /**
   * Collect a single category
   */
  async collectCategory(categorySlug) {
    const family = this.families.get(categorySlug);
    if (!family) {
      console.error(`Unknown category: ${categorySlug}`);
      return null;
    }

    const patterns = await this.fetchPatternsByFamily(family.id, categorySlug);

    if (this.listOnly) {
      patterns.forEach(p => console.log(`  - ${p.title} (${p.slug})`));
      return patterns;
    }

    // Status-only mode: just show what needs updating
    if (this.statusOnly) {
      return this.checkCategoryStatus(categorySlug, patterns);
    }

    console.log(`\nCollecting "${family.name}" patterns (${patterns.length} found)...`);

    // Ensure output directory exists
    const categoryDir = path.join(this.outputDir, categorySlug);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const results = [];
    for (const pattern of patterns) {
      const filepath = path.join(categoryDir, `${pattern.slug}.json`);
      const status = this.checkPatternStatus(pattern, filepath);

      if (!status.needsUpdate) {
        if (this.verbose) {
          console.log(`  ✓ ${pattern.slug} (current)`);
        }
        this.stats.unchanged++;
        results.push(pattern);
        continue;
      }

      // Fetch and save updated pattern
      const json = await this.fetchPatternJSON(pattern);
      if (json) {
        fs.writeFileSync(filepath, JSON.stringify(json, null, 2));

        if (status.status === 'new') {
          console.log(`  + ${pattern.slug} (new)`);
          this.stats.new++;
        } else if (status.status === 'updated') {
          console.log(`  ↑ ${pattern.slug} (updated)`);
          this.stats.updated++;
        } else {
          console.log(`  ✓ ${pattern.slug}`);
        }
        results.push(pattern);
      } else {
        this.stats.failed++;
      }

      // Be nice to the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  /**
   * Check status of patterns without downloading
   */
  async checkCategoryStatus(categorySlug, patterns) {
    const family = this.families.get(categorySlug);
    console.log(`\n## ${family.name}\n`);

    const categoryDir = path.join(this.outputDir, categorySlug);

    for (const pattern of patterns) {
      const filepath = path.join(categoryDir, `${pattern.slug}.json`);
      const status = this.checkPatternStatus(pattern, filepath);

      const symbol = {
        new: '+',
        updated: '↑',
        current: '✓',
        force: '!',
        unknown: '?',
        error: '✗'
      }[status.status] || '?';

      console.log(`  ${symbol} ${pattern.slug} (${status.status})`);

      if (this.verbose && status.localModified) {
        console.log(`    Local:  ${status.localModified}`);
        console.log(`    Remote: ${status.remoteModified}`);
      }
    }

    return patterns;
  }

  /**
   * Collect all patterns
   */
  async collectAll() {
    console.log('=== Etch WP Pattern Collector ===\n');
    console.log('Fetching block JSON from patterns.etchwp.com...\n');

    await this.fetchFamilies();

    if (this.families.size === 0) {
      console.error('No categories found.');
      return {};
    }

    const allResults = {};
    for (const [slug, family] of this.families) {
      if (family.count > 0) {
        const patterns = await this.collectCategory(slug);
        if (patterns) {
          allResults[slug] = patterns;
        }
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
    content += `Source: https://patterns.etchwp.com/\n`;
    content += `Last updated: ${new Date().toISOString()}\n\n`;
    content += `These patterns contain the full block JSON and can be directly imported into Etch WP.\n\n`;

    Object.entries(results).forEach(([category, patterns]) => {
      if (patterns.length > 0) {
        content += `## ${category.charAt(0).toUpperCase() + category.slice(1)} (${patterns.length})\n\n`;
        patterns.forEach(p => {
          content += `- **[${p.title}](${p.link})** \`${category}/${p.slug}.json\`\n`;
        });
        content += '\n';
      }
    });

    fs.writeFileSync(indexPath, content);
    console.log(`\n✓ Generated index: INDEX.md`);
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    listOnly: args.includes('--list') || args.includes('-l'),
    statusOnly: args.includes('--status') || args.includes('-s'),
    force: args.includes('--force') || args.includes('-f')
  };

  const categoryIndex = args.indexOf('--category');
  const outputIndex = args.indexOf('--output');

  if (outputIndex !== -1 && args[outputIndex + 1]) {
    options.output = args[outputIndex + 1];
  }

  const collector = new PatternCollector(options);

  if (categoryIndex !== -1 && args[categoryIndex + 1]) {
    collector.fetchFamilies().then(() => {
      collector.collectCategory(args[categoryIndex + 1])
        .then(patterns => {
          if (patterns && !options.statusOnly) {
            console.log(`\n✓ Collected ${patterns.length} patterns`);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          process.exit(1);
        });
    });
  } else {
    collector.collectAll()
      .then(results => {
        if (!options.listOnly && !options.statusOnly) {
          collector.generateIndex(results);
          const total = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
          console.log(`\n=== Summary ===`);
          console.log(`New:       ${collector.stats.new}`);
          console.log(`Updated:   ${collector.stats.updated}`);
          console.log(`Unchanged: ${collector.stats.unchanged}`);
          console.log(`Failed:    ${collector.stats.failed}`);
          console.log(`\n✓ Total: ${total} patterns across ${Object.keys(results).length} categories`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        process.exit(1);
      });
  }
}

module.exports = PatternCollector;
