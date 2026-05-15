const { execSync } = require('node:child_process');

if (!process.env.SCALINGO_APPLICATION_ID) {
  console.log('Skipping migrations outside Scalingo build context.');
  process.exit(0);
}

console.log('Scalingo build detected, running database migrations.');
execSync('npm run migration:migrate', { stdio: 'inherit' });
