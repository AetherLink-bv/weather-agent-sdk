import { query } from '@anthropic-ai/claude-agent-sdk';
import { clothingAdvice, decideWeather, type WeatherObservation } from './decide.ts';
import { isMainModule } from './is-main.ts';
import { buildOptions, loadInstructions } from './options.ts';
import { fetchWeather } from './tools/get_weather.ts';

export { loadInstructions };

/** Pure lab path — no model spend. Mirrors day-02 scaffold `fetchWeatherDecision`. */
export async function fetchWeatherDecision(input: {
  city: string;
  date: string;
  baseUrl?: string;
  useFixture?: boolean;
}): Promise<{ weather: WeatherObservation; decision: string; clothing: string }> {
  const weather = await fetchWeather(input);
  return {
    weather,
    decision: decideWeather(weather),
    clothing: clothingAdvice(weather),
  };
}

/** Live run on your Claude Code login. Prints each tool call and the answer. */
export async function runWeatherAgent(prompt: string) {
  let answer = '';
  for await (const message of query({ prompt, options: buildOptions() })) {
    if (message.type === 'assistant') {
      for (const block of message.message.content) {
        if (block.type !== 'tool_use') continue;
        const input = block.input as { subagent_type?: string };
        console.log(`[tool_use] ${block.name === 'Agent' ? `Agent → ${input.subagent_type}` : block.name}`);
      }
    }
    if (message.type === 'result') {
      console.log(`[result] ${message.subtype} · ${message.num_turns} turns · ${message.duration_ms} ms`);
      if (message.subtype !== 'success') throw new Error(`Agent run failed (${message.subtype}). Run claude once and log in.`);
      answer = message.result;
    }
  }
  return answer;
}

if (isMainModule(import.meta.url, process.argv[1])) {
  if (process.argv[2] === '--live') {
    const question = process.argv[3] || 'Wat is het weer in Amsterdam op 2026-09-21? Geef kledingadvies.';
    console.log(await runWeatherAgent(question));
  } else {
    const city = process.argv[2] || 'Amsterdam';
    const date = process.argv[3] || '2026-09-21';
    console.log(JSON.stringify(await fetchWeatherDecision({ city, date, useFixture: true }), null, 2));
    console.log('\n(Tip) npm run live asks the Claude Agent SDK on your Claude Code login.');
  }
}
