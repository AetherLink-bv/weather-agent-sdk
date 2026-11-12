import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOptions, loadInstructions } from '../src/options.ts';

test('BONUS 3: the main agent delegates to a packing specialist that has no tools', () => {
  const options = buildOptions();
  const specialist = options.agents?.['packing-agent'];
  assert.ok(specialist, "options.agents has 'packing-agent'");
  assert.ok(specialist.description.length >= 20, 'the description says when to use the specialist');
  assert.ok(specialist.prompt.length >= 80, 'the prompt is the system message of the specialist');
  assert.deepEqual(specialist.tools, [], 'packing-agent has no tools: it only writes');
  assert.deepEqual(options.tools, ['Agent'], "tools is ['Agent']: the main agent may delegate");
  assert.ok(options.allowedTools?.includes('Agent'), "allowedTools has 'Agent'");
  assert.match(loadInstructions(), /packing-agent/, 'instructions.md says when to ask packing-agent');
});
