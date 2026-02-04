#!/usr/bin/env node

/**
 * Safe Base64 Encoder for Etch WP
 * Encodes JavaScript with automatic typo detection
 *
 * Usage: node encode-safe.js
 * Then paste your JavaScript and press Ctrl+D
 */

const readline = require('readline');

// Known typos that break Etch WP scripts
const TYPO_PATTERNS = [
  { regex: /SCrollTrigger/g, name: 'SCrollTrigger', fix: 'ScrollTrigger' },
  { regex: /vvar\s/g, name: 'vvar', fix: 'var' },
  { regex: /ggsap\./g, name: 'ggsap', fix: 'gsap' },
  { regex: /doccument/g, name: 'doccument', fix: 'document' },
  { regex: /querrySelector/g, name: 'querrySelector', fix: 'querySelector' },
  { regex: /addeventListener/g, name: 'addeventListener', fix: 'addEventListener' },
  { regex: /funtion/g, name: 'funtion', fix: 'function' },
  { regex: /retunr/g, name: 'retunr', fix: 'return' },
  { regex: /functoin/g, name: 'functoin', fix: 'function' },
];

function checkAndFixTypos(code) {
  let fixed = code;
  const found = [];

  TYPO_PATTERNS.forEach(({ regex, name, fix }) => {
    if (regex.test(code)) {
      found.push({ name, fix });
      fixed = fixed.replace(regex, fix);
    }
  });

  return { fixed, found };
}

function validateQuotes(code) {
  const curly = [''', ''', '"', '"'];
  const hasCurly = curly.some(q => code.includes(q));
  return !hasCurly;
}

function validateBraces(code) {
  const counts = {
    '{': (code.match(/\{/g) || []).length,
    '}': (code.match(/\}/g) || []).length,
    '(': (code.match(/\(/g) || []).length,
    ')': (code.match(/\)/g) || []).length,
    '[': (code.match(/\[/g) || []).length,
    ']': (code.match(/\]/g) || []).length,
  };

  return {
    valid: counts['{'] === counts['}'] &&
           counts['('] === counts[')'] &&
           counts['['] === counts[']'],
    counts
  };
}

function main() {
  console.log('📝 Paste your JavaScript code (Ctrl+D when done):\n');

  let code = '';
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', (line) => {
    code += line + '\n';
  });

  rl.on('close', () => {
    console.log('\n🔍 Checking code...\n');

    // Check typos
    const { fixed, found } = checkAndFixTypos(code);
    if (found.length > 0) {
      console.log('⚠️  Typos found and fixed:');
      found.forEach(t => console.log(`   ${t.name} → ${t.fix}`));
      console.log('');
    }

    // Check quotes
    if (!validateQuotes(fixed)) {
      console.log('❌ Error: Curly quotes detected! Replace with straight quotes.');
      process.exit(1);
    }

    // Check braces
    const braces = validateBraces(fixed);
    if (!braces.valid) {
      console.log('❌ Error: Unmatched braces/parentheses:');
      console.log(`   { }: ${braces.counts['{']} / ${braces.counts['}']}`);
      console.log(`   ( ): ${braces.counts['(']} / ${braces.counts[')']}`);
      console.log(`   [ ]: ${braces.counts['[']} / ${braces.counts[']']}`);
      process.exit(1);
    }

    // Check ScrollTrigger plugin registration
    if (fixed.includes('ScrollTrigger') && !fixed.includes('registerPlugin')) {
      console.log('⚠️  Warning: ScrollTrigger used but registerPlugin not found');
    }

    // Encode
    const encoded = Buffer.from(fixed.trim(), 'utf8').toString('base64');

    console.log('✅ Code is valid!\n');
    console.log('Base64 output:');
    console.log('='.repeat(80));
    console.log(encoded);
    console.log('='.repeat(80));
    console.log('');

    // Generate random ID
    const id = Math.random().toString(36).substring(2, 9);
    console.log('JSON snippet:');
    console.log('─'.repeat(80));
    console.log(`"script": {
  "id": "${id}",
  "code": "${encoded}"
}`);
    console.log('─'.repeat(80));
    console.log('');
  });
}

main();
