#!/bin/bash

# Etch WP Skill - Release Packaging Script
# Creates a distributable zip file of the skill

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Etch WP Skill Packaging Script ===${NC}\n"

# Get version from SKILL.md or use default
VERSION=${1:-"v2.0.0"}
echo -e "${YELLOW}Version:${NC} $VERSION"

# Clean up old builds
echo -e "\n${YELLOW}Cleaning up old builds...${NC}"
rm -rf dist/
rm -f etch-wp-*.zip

# Create package structure
echo -e "${YELLOW}Creating package structure...${NC}"
mkdir -p dist/package/etch-wp

# Copy skill files
echo -e "${YELLOW}Copying skill files...${NC}"
cp SKILL.md dist/package/etch-wp/
cp LICENSE dist/package/etch-wp/
cp README.md dist/package/etch-wp/

# Copy directories
cp -r scripts dist/package/etch-wp/
cp -r references dist/package/etch-wp/
cp -r assets dist/package/etch-wp/

# Ensure scripts are executable
chmod +x dist/package/etch-wp/scripts/*.js
chmod +x dist/package/etch-wp/scripts/*.sh

# Run validations
echo -e "\n${YELLOW}Running validation tests...${NC}"
cd dist/package/etch-wp/references/examples
for file in *.json; do
  if [ -f "$file" ]; then
    echo -e "Validating ${GREEN}$file${NC}..."
    if node ../../scripts/validate-component.js "$file"; then
      echo -e "  ${GREEN}✓${NC} Passed"
    else
      echo -e "  ${RED}✗${NC} Failed"
      exit 1
    fi
  fi
done
cd ../../../../..

# Create installation instructions
echo -e "\n${YELLOW}Creating installation instructions...${NC}"
cat > dist/package/INSTALLATION.md << 'EOF'
# Installation Instructions

## Quick Install

1. Extract this zip file
2. Move the `etch-wp` folder to your Claude Code skills directory:
   - **macOS/Linux**: `~/.claude/skills/`
   - **Windows**: `%USERPROFILE%\.claude\skills\`

## Step-by-Step

### macOS/Linux

```bash
# Navigate to skills directory
cd ~/.claude/skills/

# If you're in the extracted folder, move it here
mv /path/to/extracted/etch-wp ./

# Or extract directly
unzip ~/Downloads/etch-wp-*.zip
```

### Windows

```powershell
# Navigate to skills directory
cd $env:USERPROFILE\.claude\skills\

# Extract the zip here using Windows Explorer or:
Expand-Archive -Path $env:USERPROFILE\Downloads\etch-wp-*.zip -DestinationPath .
```

## Verify Installation

```bash
cd ~/.claude/skills/etch-wp

# Test validation script
node scripts/validate-component.js references/examples/basic-structure.json
```

Expected output: `✅ Component validation passed!`

## Requirements

- **Claude Code CLI** - Required
- **Node.js 16+** - Optional, but recommended for validation script

## Usage

Once installed, simply ask Claude Code to create Etch WP components. The skill will be automatically used.

Example prompts:
- "Create an Etch WP card component with a title and description"
- "Build a hero section for Etch WP with ACSS styling"
- "Generate an Etch WP component with a loop for blog posts"

## Troubleshooting

**Skill not loading:**
- Ensure folder is named exactly `etch-wp`
- Restart Claude Code
- Verify `SKILL.md` exists

**Validation errors:**
- Install Node.js from nodejs.org
- Check file permissions: `chmod +x scripts/validate-component.js`

## Support

- **GitHub**: https://github.com/torstenlinnecke/etch-wp-skill
- **Issues**: https://github.com/torstenlinnecke/etch-wp-skill/issues
- **Etch WP Docs**: https://docs.etchwp.com

## License

CC BY-NC-SA 4.0 - See LICENSE file for details
EOF

# Create README for package
cat > dist/package/README.txt << EOF
Etch WP Agent Skill ${VERSION}
================================

An AI agent skill for generating Etch WP components with ACSS v4 styling.

INSTALLATION
------------
See INSTALLATION.md for detailed instructions.

Quick start:
1. Extract this zip
2. Move etch-wp/ folder to ~/.claude/skills/
3. Restart Claude Code

CONTENTS
--------
etch-wp/
  - SKILL.md (main skill file)
  - LICENSE (CC BY-NC-SA 4.0)
  - README.md (documentation)
  - scripts/ (validation tools)
  - references/ (detailed docs & examples)
  - assets/ (templates)

REQUIREMENTS
------------
- Claude Code CLI
- Node.js 16+ (optional, for validation)

DOCUMENTATION
-------------
- GitHub: https://github.com/torstenlinnecke/etch-wp-skill
- Etch WP: https://docs.etchwp.com
- License: https://creativecommons.org/licenses/by-nc-sa/4.0/

CREATOR
-------
Torsten Linnecke

LICENSE
-------
Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
Not for commercial use or resale.
See LICENSE file for complete terms.
EOF

# Create the zip
echo -e "\n${YELLOW}Creating zip archive...${NC}"
cd dist/package
zip -r ../../etch-wp-${VERSION}.zip etch-wp INSTALLATION.md README.txt -q
cd ../..

# Verify zip contents
echo -e "\n${YELLOW}Verifying zip contents...${NC}"
unzip -l etch-wp-${VERSION}.zip | head -20

# Calculate file size
FILESIZE=$(ls -lh etch-wp-${VERSION}.zip | awk '{print $5}')

# Success message
echo -e "\n${GREEN}=== Package Created Successfully! ===${NC}"
echo -e "File: ${GREEN}etch-wp-${VERSION}.zip${NC}"
echo -e "Size: ${GREEN}${FILESIZE}${NC}"
echo -e "\n${YELLOW}Contents:${NC}"
echo -e "  ✓ etch-wp/ folder with complete skill"
echo -e "  ✓ INSTALLATION.md"
echo -e "  ✓ README.txt"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "  1. Test the installation locally"
echo -e "  2. Create a GitHub release"
echo -e "  3. Upload ${GREEN}etch-wp-${VERSION}.zip${NC} as release asset"
echo -e "\n${GREEN}Done!${NC}\n"
