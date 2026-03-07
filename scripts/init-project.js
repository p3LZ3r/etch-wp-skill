#!/usr/bin/env node

/**
 * Etch WP Project Initialization Script
 * Creates .etch-project.json, .etch-acss-index.json, .env, and AGENTS.md
 *
 * Usage: node scripts/init-project.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Import our new modules
const { fetchAndIndexACSS, saveIndex } = require('./lib/acss-indexer');
const { generateAgentsMd, saveAgentsMd, createSymlink } = require('./lib/agents-generator');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => {
    rl.question(question, answer => resolve(answer.trim()));
  });
}

function validatePrefix(prefix) {
  return /^[a-z]{2,4}$/.test(prefix);
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function normalizeBaseUrl(url) {
  return String(url || '').replace(/\/+$/, '');
}

function generateACSSUrl(devUrl) {
  const baseUrl = normalizeBaseUrl(devUrl);
  return `${baseUrl}/wp-content/uploads/automatic-css/`;
}

function isYesNo(answer) {
  return answer === 'yes' || answer === 'no';
}

function isExit(answer) {
  return ['exit', 'quit', 'cancel'].includes(answer);
}

/**
 * Create .env file with credentials
 */
function createEnvFile(username, password, devUrl) {
  const envContent = `# Etch WP API Credentials
# Generated on ${new Date().toISOString().split('T')[0]}

ETCH_API_USERNAME=${username}
ETCH_API_PASSWORD=${password}

# Development URL
ETCH_DEV_URL=${devUrl}
`;

  fs.writeFileSync('.env', envContent);
  console.log('🔐 Created: .env (credentials saved securely)');
}

/**
 * Create .env.example if it doesn't exist
 */
function createEnvExample() {
  const examplePath = '.env.example';
  if (fs.existsSync(examplePath)) {
    return;
  }

  const exampleContent = `# Etch WP API Credentials
# Copy this file to .env and fill in your credentials
# .env is gitignored - never commit credentials!

# WordPress Application Password Authentication
ETCH_API_USERNAME=your_username
ETCH_API_PASSWORD=your_application_password

# Optional: Development URL override
# ETCH_DEV_URL=https://your-site.de
`;

  fs.writeFileSync(examplePath, exampleContent);
  console.log('📋 Created: .env.example (template for credentials)');
}

async function initProject() {
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│         Etch WP Project Initialization                      │');
  console.log('│         Creates: .etch-project.json | .etch-acss-index.json │');
  console.log('│                  .env | AGENTS.md | CLAUDE.md               │');
  console.log('└─────────────────────────────────────────────────────────────┘\n');

  // Check if already initialized
  const hasProjectJson = fs.existsSync('.etch-project.json');
  const hasAcssIndex = fs.existsSync('.etch-acss-index.json');
  const hasAgentsMd = fs.existsSync('AGENTS.md');
  const hasEnv = fs.existsSync('.env');

  if (hasProjectJson) {
    console.log('⚠️  Project files already exist:');
    if (hasProjectJson) console.log('   - .etch-project.json');
    if (hasAcssIndex) console.log('   - .etch-acss-index.json');
    if (hasAgentsMd) console.log('   - AGENTS.md');
    if (hasEnv) console.log('   - .env');

    const overwrite = await ask('\nOverwrite existing files? (yes/no): ');
    if (overwrite.toLowerCase() !== 'yes') {
      console.log('Aborted.');
      rl.close();
      return;
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // STANDARDIZED PROJECT QUESTIONNAIRE
  // ─────────────────────────────────────────────────────────────────

  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  STANDARDIZED PROJECT QUESTIONNAIRE                           ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Q1 - Pre-flight Check
  console.log('─'.repeat(65));
  console.log('Q1 - PRE-FLIGHT CHECK (REQUIRED)');
  console.log('─'.repeat(65));
  console.log('Before proceeding, you MUST configure these in your WordPress');
  console.log('dev environment:\n');
  console.log('  ✓ ACSS Dashboard → Brand Colors (primary, secondary, accent)');
  console.log('  ✓ ACSS Dashboard → Typography (fonts, scale)');
  console.log('  ✓ ACSS Dashboard → Button Styles (default, primary, secondary)');
  console.log('  ✓ ACSS Dashboard → Spacing & Container widths');
  console.log('  ✓ Verify automatic.css is generated and accessible\n');

  let acssReady = await ask('Have you completed the ACSS configuration? (yes/no): ');
  while (acssReady.toLowerCase() !== 'yes') {
    console.log('\n❌ Please configure ACSS Dashboard settings first.');
    console.log('   The automatic.css file must contain your fundamental');
    console.log('   variables and utility classes before generating components.\n');
    acssReady = await ask('Have you completed the ACSS configuration? (yes/no): ');
  }
  console.log('✅ ACSS configuration confirmed\n');

  // Q2 - Project Identity
  console.log('─'.repeat(65));
  console.log('Q2 - PROJECT IDENTITY');
  console.log('─'.repeat(65));
  let projectName = await ask('Project name (e.g., "acme-website", "tl-portfolio"): ');
  while (!projectName) {
    projectName = await ask('Project name is required: ');
  }

  // Q3 - Unique Prefix
  console.log('\n─'.repeat(65));
  console.log('Q3 - UNIQUE PREFIX');
  console.log('─'.repeat(65));
  console.log('This 2-4 letter prefix will be used for ALL CSS classes.');
  console.log('Examples: "tl" (Torsten Linnecke), "ac" (Acme Corp), "bdp" (Brand Project)\n');

  let prefix = await ask('Choose a unique 2-4 letter prefix: ');
  while (!validatePrefix(prefix)) {
    console.log('❌ Prefix must be 2-4 lowercase letters (e.g., "tl", "acm")');
    prefix = await ask('Prefix: ');
  }
  console.log(`✅ Prefix "${prefix}" will generate classes like: .${prefix}-hero__title\n`);

  // Q4 - Development URL
  console.log('─'.repeat(65));
  console.log('Q4 - DEVELOPMENT URL');
  console.log('─'.repeat(65));
  console.log('Used to fetch ACSS variables from automatic.css\n');

  let devUrl = await ask('Development site URL (e.g., https://project.torsten-linnecke.de): ');
  while (!devUrl || !validateUrl(devUrl)) {
    if (!devUrl) {
      console.log('❌ Development URL is required for ACSS indexing.');
    } else {
      console.log('❌ Invalid URL format');
    }
    devUrl = await ask('Development site URL: ');
  }

  // Q5 - Visual Style
  console.log('\n─'.repeat(65));
  console.log('Q5 - VISUAL STYLE');
  console.log('─'.repeat(65));
  const aestheticOptions = [
    'modern/minimal',
    'bold/colorful',
    'corporate/professional',
    'playful/creative',
    'elegant/luxury',
    'technical/utilitarian',
    'other'
  ];
  console.log('Options: ' + aestheticOptions.join(', ') + '\n');
  const aesthetic = await ask('Visual aesthetic: ');

  // Q6 - Brand Colors
  console.log('\n─'.repeat(65));
  console.log('Q6 - BRAND COLORS');
  console.log('─'.repeat(65));
  console.log('These should match your ACSS Dashboard configuration\n');
  const primaryColors = await ask('Primary brand colors (comma-separated hex codes): ');

  // Q7 - Typography
  console.log('\n─'.repeat(65));
  console.log('Q7 - TYPOGRAPHY');
  console.log('─'.repeat(65));
  console.log('These should match your ACSS Dashboard configuration\n');
  const typography = await ask('Fonts (e.g., "Inter + Playfair Display"): ');

  // Q8 - Target Audience
  console.log('\n─'.repeat(65));
  console.log('Q8 - TARGET AUDIENCE');
  console.log('─'.repeat(65));
  const targetAudience = await ask('Who is the target audience: ');

  // Q9 - Reference Sites
  console.log('\n─'.repeat(65));
  console.log('Q9 - REFERENCE SITES');
  console.log('─'.repeat(65));
  const referenceSites = await ask('Reference sites (comma-separated URLs): ');

  // Q10 - API Credentials
  console.log('\n─'.repeat(65));
  console.log('Q10 - API CREDENTIALS');
  console.log('─'.repeat(65));
  console.log('WordPress Application Password for API access\n');

  let apiUsername = '';
  let apiPassword = '';

  while (true) {
    apiUsername = await ask('WordPress username: ');
    if (apiUsername) break;
    console.log('❌ Username is required');
  }

  while (true) {
    apiPassword = await ask('Application password: ');
    if (apiPassword) break;
    console.log('❌ Password is required');
  }

  console.log('✅ Credentials captured\n');

  // ─────────────────────────────────────────────────────────────────
  // BUILD PROJECT CONFIG
  // ─────────────────────────────────────────────────────────────────

  const config = {
    name: projectName,
    prefix: prefix,
    created: new Date().toISOString().split('T')[0],
    acssConfigured: true,
    styles: {}
  };

  if (aesthetic) config.styles.aesthetic = aesthetic;
  if (primaryColors) {
    config.styles.primaryColors = primaryColors.split(',').map(c => c.trim()).filter(c => c);
  }
  if (typography) config.styles.typography = typography;
  if (targetAudience) config.styles.targetAudience = targetAudience;
  if (referenceSites) {
    config.styles.referenceSites = referenceSites.split(',').map(s => s.trim()).filter(s => s);
  }

  // Write config file
  fs.writeFileSync('.etch-project.json', JSON.stringify(config, null, 2));
  console.log('💾 Created: .etch-project.json');

  // ─────────────────────────────────────────────────────────────────
  // CREATE .env FILE
  // ─────────────────────────────────────────────────────────────────

  createEnvFile(apiUsername, apiPassword, devUrl);
  createEnvExample();

  // ─────────────────────────────────────────────────────────────────
  // INDEX ACSS
  // ─────────────────────────────────────────────────────────────────

  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  INDEXING ACSS                                                ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  let acssIndex = null;
  const acssUrl = generateACSSUrl(devUrl);
  try {
    acssIndex = await fetchAndIndexACSS(acssUrl);
    saveIndex(acssIndex);

    if (acssIndex.config.warnings.length > 0) {
      console.log('\n⚠️  ACSS Configuration Warnings:');
      acssIndex.config.warnings.forEach(w => console.log(`   - ${w}`));
      console.log('\n💡 Visit your ACSS Dashboard to complete configuration');
    } else {
      console.log('✅ ACSS configuration looks good!');
    }
  } catch (error) {
    console.error(`\n❌ ACSS indexing failed: ${error.message}`);
    console.log('   You can retry later with: node scripts/lib/acss-indexer.js ' + acssUrl);
  }

  // ─────────────────────────────────────────────────────────────────
  // GENERATE AGENTS.md
  // ─────────────────────────────────────────────────────────────────

  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  GENERATING DOCUMENTATION                                     ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const agentsContent = generateAgentsMd(config, acssIndex, { ETCH_DEV_URL: devUrl, ETCH_API_USERNAME: apiUsername });
  saveAgentsMd(agentsContent);
  createSymlink();

  // ─────────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────────

  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  PROJECT INITIALIZATION COMPLETE                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log('📁 Generated Files:');
  console.log('   ✓ .etch-project.json    - Project configuration');
  console.log('   ✓ .etch-acss-index.json - ACSS variables index');
  console.log('   ✓ .env                  - API credentials (gitignored)');
  console.log('   ✓ .env.example          - Credentials template');
  console.log('   ✓ AGENTS.md             - Project documentation');
  console.log('   ✓ CLAUDE.md             - Symlink to AGENTS.md\n');

  console.log('📊 Project Summary:');
  console.log(`   Name:       ${config.name}`);
  console.log(`   Prefix:     ${config.prefix}`);
  console.log(`   Dev URL:    ${devUrl} (stored in .env)`);
  console.log(`   ACSS URL:   ${acssUrl}`);
  console.log(`   API URL:    ${normalizeBaseUrl(devUrl)}/wp-json/etch-api`);
  console.log(`   ACSS Vars:  ${acssIndex ? acssIndex.summary.totalVariables : 'N/A'}`);
  console.log(`   ACSS Utils: ${acssIndex ? acssIndex.summary.totalClasses : 'N/A'}`);
  console.log(`   Aesthetic:  ${config.styles.aesthetic || 'Not specified'}`);
  console.log(`   Typography: ${config.styles.typography || 'Not specified'}\n`);

  console.log('🔐 Credentials:');
  console.log(`   Username:   ${apiUsername}`);
  console.log(`   Password:   ${'*'.repeat(apiPassword.length)}`);
  console.log(`   Stored in:  .env (gitignored)\n`);

  // BEM Naming Guide
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  BEM NAMING CONVENTION                                        ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`Format: .${prefix}-{block}__{element}--{modifier}\n`);
  console.log('Examples:');
  console.log(`  .${prefix}-hero                  (block)`);
  console.log(`  .${prefix}-hero__title           (element)`);
  console.log(`  .${prefix}-hero__cta-wrapper     (element)`);
  console.log(`  .${prefix}-hero--dark            (modifier on block)`);
  console.log(`  .${prefix}-hero--centered        (modifier on block)\n`);

  console.log('Button Usage (ACSS Classes):');
  console.log('  ✅ Use: class="btn--primary"');
  console.log('  ✅ Use: class="btn--secondary btn--large"');
  console.log(`  ❌ Never: class="${prefix}-hero__button" with custom CSS\n`);

  // Next Steps
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  NEXT STEPS                                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  if (acssIndex && acssIndex.config.warnings.length > 0) {
    console.log('⚠️  IMPORTANT: Complete ACSS Configuration');
    console.log('   Your ACSS index has warnings. Before generating components:');
    console.log('   1. Go to WordPress Admin → ACSS Dashboard');
    console.log('   2. Configure missing items listed above');
    console.log('   3. Regenerate automatic.css');
    console.log('   4. Re-run: node scripts/lib/acss-indexer.js ' + config.acssUrl);
    console.log('');
  }

  console.log('1. Verify ACSS is accessible:');
  console.log(`   curl -s "${config.acssUrl}" | head -20\n`);

  console.log('2. Query Etch API for existing components:');
  console.log(`   curl -u ${apiUsername}:<password> "${config.api.baseUrl}/components/list"\n`);

  console.log('3. Start creating components with:');
  console.log(`   - BEM naming: .${prefix}-{block}__{element}--{modifier}`);
  console.log('   - ACSS utility classes for buttons');
  console.log('   - ACSS variables for colors/spacing\n');

  console.log('4. Validate generated JSON:');
  console.log('   node scripts/validate-component.js <filename>.json\n');

  console.log('✨ Project initialization complete!\n');

  rl.close();
}

// Check for --help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Etch WP Project Initialization

Usage:
  node scripts/init-project.js          Interactive project setup
  node scripts/init-project.js --help   Show this help

What Gets Created:
  .etch-project.json         Project configuration
  .etch-acss-index.json      ACSS variables index
  .env                       API credentials (gitignored)
  .env.example               Credentials template
  AGENTS.md                  Project documentation
  CLAUDE.md                  Symlink to AGENTS.md

Standardized Questionnaire:
  Q1. ACSS Configuration Check   Verify dashboard settings
  Q2. Project Name               Unique identifier
  Q3. Unique Prefix              2-4 letter CSS class prefix
  Q4. Development URL            For fetching ACSS variables
  Q5. Visual Style               Aesthetic direction
  Q6. Brand Colors               Primary color palette
  Q7. Typography                 Font families
  Q8. Target Audience            Who the site is for
  Q9. Reference Sites            Inspiration URLs
  Q10. API Credentials           WordPress application password

Pre-Configuration Requirements:
  Before running this script, configure in ACSS Dashboard:
  - Brand colors (primary, secondary, accent)
  - Typography scale and fonts
  - Button styles (default, primary, secondary)
  - Spacing and section spacing preferences
  - Container widths and gutters

BEM Naming:
  Format: {prefix}-{block}__{element}--{modifier}
  Example: tl-hero__cta-wrapper

Button Usage:
  Always use ACSS utility classes:
  - btn, btn--primary, btn--secondary
  - btn--small, btn--large
  Never create custom button styles.
`);
  process.exit(0);
}

initProject().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
