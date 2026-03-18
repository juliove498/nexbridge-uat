/**
 * Assembles the final dist/ output for Vercel:
 * 1. Copies all landing-site static assets (HTML, CSS, JS, images, etc.)
 * 2. Copies the OTC app build output into dist/otc-uat/
 *
 * Skips: node_modules, .git*, otc-app/, src/, partials/, i18n/, dist/ itself
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

const SKIP = new Set([
  'node_modules',
  '.git',
  '.git-tmp',
  '.vercel',
  '.backup',
  'otc-app',
  'dist',
  'src',
  'partials',
  'i18n',
  'build-i18n.js',
  'build-dist.js',
  'package.json',
  'package-lock.json',
  'extract-partials.js',
  '.gitignore',
  '.env.development',
  '.env.production',
  'COMPLIANCE-GUIDE.md',
]);

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST);

// Copy landing site files
for (const entry of fs.readdirSync(ROOT)) {
  if (SKIP.has(entry) || entry.startsWith('.')) continue;
  // Skip otc-uat output (we copy it separately)
  if (entry === 'otc-uat') continue;
  copyRecursive(path.join(ROOT, entry), path.join(DIST, entry));
}

// Copy OTC app build output
const otcBuild = path.join(ROOT, 'otc-uat');
if (fs.existsSync(otcBuild)) {
  copyRecursive(otcBuild, path.join(DIST, 'otc-uat'));
  console.log('✓ Copied otc-uat/ into dist/');
} else {
  console.log('⚠ otc-uat/ not found, skipping');
}

console.log('✓ dist/ assembled');
