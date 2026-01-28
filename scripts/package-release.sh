#!/bin/bash

# Etch WP Skill - Release Packaging Script
# Creates a distributable zip file for direct import into Claude Code/Claude Desktop

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Etch WP Skill Packaging Script ===${NC}\n"

# Get version from SKILL.md
VERSION=$(grep -A 20 "^---" SKILL.md | grep "version:" | head -1 | sed 's/.*version: //' | tr -d '"' | tr -d "'")
if [ -z "$VERSION" ]; then
    VERSION="2.1.0"
fi
echo -e "${YELLOW}Version:${NC} $VERSION"

# Clean up old builds
echo -e "\n${YELLOW}Cleaning up old builds...${NC}"
rm -rf dist/
rm -f etch-wp.zip
rm -f etch-wp-*.zip

# Create temp directory for packaging
echo -e "${YELLOW}Preparing package...${NC}"
mkdir -p dist/temp

# Copy all skill files directly (no subfolder)
echo -e "${YELLOW}Copying skill files...${NC}"
cp SKILL.md dist/temp/
cp LICENSE dist/temp/ 2>/dev/null || echo "No LICENSE file found"
cp README.md dist/temp/ 2>/dev/null || echo "No README.md file found"

# Copy directories
cp -r scripts dist/temp/
cp -r references dist/temp/
cp -r assets dist/temp/ 2>/dev/null || echo "No assets directory found"

# Ensure scripts are executable
chmod +x dist/temp/scripts/*.js 2>/dev/null || true
chmod +x dist/temp/scripts/*.sh 2>/dev/null || true

# Create the zip - directly from temp contents (no subfolder)
echo -e "\n${YELLOW}Creating zip archive...${NC}"
cd dist/temp
zip -r ../../etch-wp.zip . -q
cd ../..

# Verify zip contents
echo -e "\n${YELLOW}Verifying zip contents...${NC}"
unzip -l etch-wp.zip | head -30

# Calculate file size
FILESIZE=$(ls -lh etch-wp.zip | awk '{print $5}')

# Success message
echo -e "\n${GREEN}=== Package Created Successfully! ===${NC}"
echo -e "File: ${GREEN}etch-wp.zip${NC}"
echo -e "Size: ${GREEN}${FILESIZE}${NC}"
echo -e "\n${YELLOW}Structure:${NC}"
echo -e "  ✓ SKILL.md (on root level - ready for import)"
echo -e "  ✓ references/"
echo -e "  ✓ scripts/"
echo -e "  ✓ assets/"
echo -e "\n${YELLOW}Import Instructions:${NC}"
echo -e "  1. Claude Desktop: Settings > Skills > Install from File"
echo -e "  2. Claude Code: Place in ~/.claude/skills/etch-wp/"
echo -e "\n${GREEN}Done!${NC}\n"
