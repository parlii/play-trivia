const assert = require('assert');
const { parseJsonResponse } = require('../dist/parse.js');

const qJson = '{"question":"Q?","options":["A","B","C","D"]}';
const q = parseJsonResponse(qJson);
assert.strictEqual(q.question, 'Q?');
assert.strictEqual(q.options.length, 4);

const aJson = '{"correct":true,"explanation":"ok","correct_answer":"A","confidence":"high"}';
const a = parseJsonResponse(aJson);
assert.strictEqual(a.correct, true);
assert.strictEqual(a.correct_answer, 'A');
console.log('All tests passed');
