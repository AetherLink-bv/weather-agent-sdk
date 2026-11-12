import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSdkMcpServer, type Options } from '@anthropic-ai/claude-agent-sdk';
import { getForecastTool } from './tools/get_forecast.ts';
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
    tools: [getWeatherTool, getForecastTool],
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
    tools: ['Agent'],
    allowedTools: ['mcp__weather__get_weather', 'mcp__weather__get_forecast', 'Agent'],
    agents: {
      'packing-agent': {
        description: 'Use this agent to turn a weather forecast into a short packing list. Give it the forecast.',
        prompt: 'You are a packing specialist. You get a weather forecast for one or more days. Return a short packing list in Dutch: one line for each day with the clothing, then one line with what to bring for the whole trip. Use only the forecast you get. Never guess the weather.',
        tools: [],
      },
    },
  };
}
