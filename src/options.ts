import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSdkMcpServer, type Options } from '@anthropic-ai/claude-agent-sdk';
import { getWeatherTool } from './tools/get_weather.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const loadInstructions = (path = join(root, 'instructions.md')) =>
  readFileSync(path, 'utf8');

// User settings can make subagents run in the background. The main agent then answers before its
// specialist does. This settings layer switches that off for every run.
const foregroundSubagents = JSON.stringify({
  env: { CLAUDE_CODE_FORK_SUBAGENT: '0', CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: '0' },
});

export function weatherMcpServer() {
  return createSdkMcpServer({
    name: 'weather-agent-sdk',
    version: '0.1.0',
    // BONUS 2: add getForecastTool to this list.
    tools: [getWeatherTool],
  });
}

// Everything the agent may do is in this object. Check your work with npm run check:tool and check:agent.
export function buildOptions(): Options {
  return {
    systemPrompt: loadInstructions(),
    settingSources: ['project', 'user'],
    mcpServers: { weather: weatherMcpServer() },
    strictMcpConfig: true,
    extraArgs: { settings: foregroundSubagents },
    maxTurns: 6,
    // BONUS 3: tools → ['Agent']: the main agent may delegate and has no other built-in tool.
    tools: [],
    // BONUS 2: add 'mcp__weather__get_forecast'. BONUS 3: add 'Agent'.
    allowedTools: ['mcp__weather__get_weather'],
    // BONUS 3: agents → { 'packing-agent': { description, prompt, tools: [] } }.
    //   description: when the main agent must use it. prompt: its system message. tools: [] means it only writes.
  };
}
