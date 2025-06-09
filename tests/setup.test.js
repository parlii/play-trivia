const fs = require('fs');
const assert = require('assert');

const readme = fs.readFileSync('README.md', 'utf8');
assert(readme.includes('## Setup'), 'README should contain Setup section');

const envExample = fs.readFileSync('.env.example', 'utf8');
['OPENAI_API_KEY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'].forEach(key => {
  assert(envExample.includes(key), `.env.example should contain ${key}`);
});

console.log('All tests passed.');
