#!/usr/bin/env node

/**
 * Build script for embed components
 * This script prepares the embed assets for production
 */

//scripts/build-embed.js

import fs from 'fs';
import path from 'path';

console.log('🏗️  Building embed components...');

// Ensure public/embed directory exists
const embedDir = path.join(process.cwd(), 'public', 'embed');
if (!fs.existsSync(embedDir)) {
  fs.mkdirSync(embedDir, { recursive: true });
  console.log('✅ Created public/embed directory');
}

// Embed loader now derives API host at runtime from script origin
// No need to inline process.env.NEXT_PUBLIC_API_HOST
const loaderPath = path.join(embedDir, 'loader.js');
if (fs.existsSync(loaderPath)) {
  console.log('✅ loader.js found - uses runtime API host detection');
} else {
  console.log('⚠️  loader.js not found');
}

console.log('✅ Embed build completed successfully!'); 