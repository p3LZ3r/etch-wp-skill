#!/usr/bin/env node

/**
 * Etch WP Project Initialization Script
 * Creates .etch-project.json and sets up CLAUDE.md symlink
 *
 * Usage: node init-project.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
  // Must be 2-4 lowercase letters
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
  return String(url || '').replace(/\/$/, '');
}

function generateACSSUrl(devUrl) {
  // Convert https://domain.com to https://domain.com/wp-content/uploads/automatic-css/automatic.css
  const baseUrl = normalizeBaseUrl(devUrl);
  return `${baseUrl}/wp-content/uploads/automatic-css/automatic.css`;
}

function isYesNo(answer) {
  return answer === 'yes' || answer === 'no';
}

function isExit(answer) {
  return ['exit', 'quit', 'cancel'].includes(answer);
}

async function initProject() {
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  console.log('│         Etch WP Project Initialization                      │');
  console.log('└─────────────────────────────────────────────────────────────┘\n');

  // Check if already initialized
  if (fs.existsSync('.etch-project.json')) {
    console.log('⚠️  .etch-project.json already exists!');
    const overwrite = await ask('Overwrite? (yes/no): ');
    if (overwrite.toLowerCase() !== 'yes') {
      console.log('Aborted.');
      rl.close();
      return;
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // STANDARDIZED PROJECT QUESTIONNAIRE
  // ─────────────────────────────────────────────────────────────────

  console.log('╔═══════════════════════════════════════════════════════════════╗');
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
  console.log('Used to fetch actual ACSS variables from automatic.css\n');

  let devUrl = await ask('Development site URL (e.g., https://project.torsten-linnecke.de): ');
  while (devUrl && !validateUrl(devUrl)) {
    console.log('❌ Invalid URL format');
    devUrl = await ask('Dev URL (or leave empty): ');
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

  // Q10 - API Setup
  console.log('\n─'.repeat(65));
  console.log('Q10 - TARGET SITE API ACCESS');
  console.log('─'.repeat(65));
  console.log('This is REQUIRED. Setup cannot continue without target-site API access info.');
  console.log('API checks avoid rebuilding components/patterns/styles that already exist.\n');

  let continueAnswer = await ask('Press Enter or type "yes" to continue with required API setup (or exit/quit/cancel to abort): ');
  while (true) {
    if (isExit(continueAnswer.toLowerCase())) {
      console.log('Aborted. API access info is required for project setup.');
      rl.close();
      return;
    }
    if (continueAnswer === '' || continueAnswer.toLowerCase() === 'yes') {
      break;
    }
    console.log('Invalid input. Please press Enter, type "yes", or use exit/quit/cancel.');
    continueAnswer = await ask('Press Enter to continue (or exit/quit/cancel to abort): ');
  }
  const useEtchApi = true;

  let authMethod = '';
  let credentialsReady = false;
  let apiUsername = '';

  while (!devUrl) {
    console.log('❌ Development URL is required for API checks.');
    devUrl = await ask('Development site URL (e.g., https://example.com): ');
    while (devUrl && !validateUrl(devUrl)) {
      console.log('❌ Invalid URL format');
      devUrl = await ask('Development site URL: ');
    }
  }

  authMethod = await ask('Auth method (application-password/wp-admin-browser): ');
  while (!['application-password', 'wp-admin-browser'].includes(authMethod)) {
    if (isExit(authMethod.toLowerCase())) {
      console.log('Aborted. API access info is required for project setup.');
      rl.close();
      return;
    }
    authMethod = await ask('Choose "application-password" or "wp-admin-browser" (or exit/quit/cancel to abort): ');
  }

  let readyAnswer = await ask('Do you already have required credentials/access? (yes/no): ');
  while (!isYesNo(readyAnswer.toLowerCase())) {
    if (isExit(readyAnswer.toLowerCase())) {
      console.log('Aborted. API credentials/access are required for project setup.');
      rl.close();
      return;
    }
    readyAnswer = await ask('Please answer "yes" or "no" (or exit/quit/cancel to abort): ');
  }
  credentialsReady = readyAnswer.toLowerCase() === 'yes';

  while (!credentialsReady) {
    if (authMethod === 'application-password') {
      console.log('\nℹ️  To create credentials:');
      console.log('   1. Log into /wp-admin');
      console.log('   2. Go to Users → Profile');
      console.log('   3. Create an Application Password');
      console.log('   4. Use username:application-password for HTTPS Basic Auth\n');
    } else {
      console.log('\nℹ️  Ask site admin for wp-admin access and valid session/nonce permissions.\n');
    }
    readyAnswer = await ask('Are credentials/access ready now? (yes/no): ');
    while (!isYesNo(readyAnswer.toLowerCase())) {
      if (isExit(readyAnswer.toLowerCase())) {
        console.log('Aborted. API credentials/access are required for project setup.');
        rl.close();
        return;
      }
      readyAnswer = await ask('Please answer "yes" or "no" (or exit/quit/cancel to abort): ');
    }
    credentialsReady = readyAnswer.toLowerCase() === 'yes';
  }

  if (authMethod === 'application-password') {
    while (true) {
      apiUsername = await ask('WordPress username for API calls (or exit/quit/cancel to abort): ');
      if (isExit(apiUsername.toLowerCase())) {
        console.log('Aborted. API access info is required for project setup.');
        rl.close();
        return;
      }
      if (apiUsername) {
        break;
      }
      console.log('Username is required.');
    }
  } else {
    console.log('\n✅ Browser-based auth access confirmed.\n');
  }

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

  if (devUrl) {
    config.devUrl = devUrl;
    config.acssUrl = generateACSSUrl(devUrl);
  }

  if (aesthetic) config.styles.aesthetic = aesthetic;
  if (primaryColors) {
    config.styles.primaryColors = primaryColors.split(',').map(c => c.trim()).filter(c => c);
  }
  if (typography) config.styles.typography = typography;
  if (targetAudience) config.styles.targetAudience = targetAudience;
  if (referenceSites) {
    config.styles.referenceSites = referenceSites.split(',').map(s => s.trim()).filter(s => s);
  }

  config.api = {
    required: useEtchApi,
    baseUrl: useEtchApi ? `${normalizeBaseUrl(devUrl)}/wp-json/etch-api` : null,
    authMethod: authMethod || null,
    credentialsReady
  };
  if (apiUsername) config.api.username = apiUsername;

  // Write config file
  fs.writeFileSync('.etch-project.json', JSON.stringify(config, null, 2));

  // ─────────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────────

  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  PROJECT CONFIGURATION CREATED                                ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log(`📄 Created .etch-project.json\n`);
  console.log('Configuration Summary:');
  console.log(`  Name:       ${config.name}`);
  console.log(`  Prefix:     ${config.prefix}`);
  if (config.devUrl) {
    console.log(`  Dev URL:    ${config.devUrl}`);
    console.log(`  ACSS URL:   ${config.acssUrl}`);
  }
  if (config.api.required) {
    console.log(`  API URL:    ${config.api.baseUrl}`);
    console.log(`  API Auth:   ${config.api.authMethod}`);
    console.log(`  API Ready:  ${config.api.credentialsReady ? 'Yes' : 'No'}`);
  }
  console.log(`  Aesthetic:  ${config.styles.aesthetic || 'Not specified'}`);
  console.log(`  Typography: ${config.styles.typography || 'Not specified'}`);
  console.log();

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

  // Documentation Setup
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  DOCUMENTATION SETUP                                          ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const hasClaudeMd = fs.existsSync('CLAUDE.md');
  const hasAgentMd = fs.existsSync('AGENTS.md');

  if (hasAgentMd) {
    if (hasClaudeMd) {
      const stats = fs.lstatSync('CLAUDE.md');
      if (stats.isSymbolicLink()) {
        console.log('✅ CLAUDE.md is already symlinked to AGENTS.md\n');
      } else {
        console.log('⚠️  CLAUDE.md exists but is not a symlink');
        const makeSymlink = await ask('Replace with symlink to AGENTS.md? (yes/no): ');
        if (makeSymlink.toLowerCase() === 'yes') {
          fs.unlinkSync('CLAUDE.md');
          fs.symlinkSync('AGENTS.md', 'CLAUDE.md');
          console.log('✅ Created CLAUDE.md -> AGENTS.md symlink\n');
        }
      }
    } else {
      fs.symlinkSync('AGENTS.md', 'CLAUDE.md');
      console.log('✅ Created CLAUDE.md -> AGENTS.md symlink\n');
    }
  } else {
    console.log('⚠️  No AGENTS.md found');
    console.log('   Create AGENTS.md with project-specific instructions, then run:');
    console.log('   ln -s AGENTS.md CLAUDE.md\n');
  }

  // Next Steps
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║  NEXT STEPS                                                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  console.log('1. If not done above, create the symlink:');
  console.log('   ln -s AGENTS.md CLAUDE.md\n');

  if (config.acssUrl) {
    console.log('2. Verify ACSS is accessible:');
    console.log(`   curl -s "${config.acssUrl}" | head -50\n`);
  }

  console.log('3. Query Context7 for ACSS utility classes:');
  console.log('   Library: /websites/automaticcss');
  console.log('   Query: "List all button utility classes"\n');

  console.log('4. Start creating components with:');
  console.log(`   - BEM naming: .${prefix}-{block}__{element}--{modifier}`);
  console.log('   - ACSS utility classes for buttons');
  console.log('   - ACSS variables for colors/spacing\n');

  console.log('✨ Project initialization complete!\n');

  rl.close();
}

// Check for --help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Etch WP Project Initialization

Usage:
  node init-project.js          Interactive project setup
  node init-project.js --help   Show this help

Standardized Questionnaire:
  Q1. ACSS Configuration Check   Verify dashboard settings are complete
  Q2. Project Name               Unique identifier for the project
  Q3. Unique Prefix              2-4 letter CSS class prefix
  Q4. Development URL            For fetching ACSS variables
  Q5. Visual Style               Aesthetic direction
  Q6. Brand Colors               Primary color palette
  Q7. Typography                 Font families
  Q8. Target Audience            Who the site is for
  Q9. Reference Sites            Inspiration URLs
  Q10. Target Site API Access    REQUIRED endpoint auth readiness for /wp-json/etch-api

What Gets Created:
  .etch-project.json             Project configuration
  CLAUDE.md -> AGENTS.md          Symlink (if AGENTS.md exists)

Pre-Configuration Requirements:
  Before running this script, you MUST configure in ACSS Dashboard:
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
