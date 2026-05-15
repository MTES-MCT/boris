const { execSync } = require('node:child_process');

if (!process.env.APP) {
  console.log('Skipping migrations outside Scalingo build context.');
  process.exit(0);
}

console.log('Scalingo build detected, running database migrations.');
execSync('npm run migration:migrate', { stdio: 'inherit' });
