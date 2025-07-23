#!/usr/bin/env node

/**
 * Build script for embed components
 * This script prepares the embed assets for production
 */

const fs = require('fs');
const path = require('path');

console.log('🏗️  Building embed components...');

// Ensure public/embed directory exists
const embedDir = path.join(process.cwd(), 'public', 'embed');
if (!fs.existsSync(embedDir)) {
  fs.mkdirSync(embedDir, { recursive: true });
  console.log('✅ Created public/embed directory');
}

// Copy embed loader if it doesn't exist
const loaderPath = path.join(embedDir, 'loader.js');
if (!fs.existsSync(loaderPath)) {
  // Create a simple embed loader
  const loaderContent = `
// Embed Loader Script
(function() {
  console.log('InflateMate embed loader initialized');
  
  // Add any embed initialization logic here
  window.InflateMate = window.InflateMate || {};
  window.InflateMate.version = '1.0.0';
})();
`;
  
  fs.writeFileSync(loaderPath, loaderContent.trim());
  console.log('✅ Created embed loader.js');
}

console.log('✅ Embed build completed successfully!'); 