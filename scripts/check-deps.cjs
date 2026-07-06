const fs = require('fs');
const path = require('path');

const requiredPackages = ['vite', 'typescript'];
const missing = requiredPackages.filter((pkg) => !fs.existsSync(path.join(__dirname, '..', 'node_modules', pkg)));

if (missing.length > 0) {
  console.error('Missing required dependencies: ' + missing.join(', '));
  console.error('Run "npm install" in the project root and then try again.');
  process.exit(1);
}
