const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '..', 'AGENTS.md'), 'utf8');
if (!content.includes('## API Endpoints')) {
  console.error('AGENTS.md missing API Endpoints section');
  process.exit(1);
}
console.log('Docs test passed');
