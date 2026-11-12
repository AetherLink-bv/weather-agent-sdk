import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { WeatherObservation } from '../decide.ts';

/** Fixed three-day forecast, so the check passes without network or a model. */
export const FIXTURE_FORECAST: WeatherObservation[] = [
  { city: 'Amsterdam', date: '2026-09-21', temperatureC: 14, precipitationProbability: 72 },
  { city: 'Amsterdam', date: '2026-09-22', temperatureC: 19, precipitationProbability: 10 },
  { city: 'Amsterdam', date: '2026-09-23', temperatureC: 9, precipitationProbability: 65 },
];

// BONUS 2: return the first `days` entries of FIXTURE_FORECAST, each with the requested city.
export function fetchForecast(_input: { city: string; days: number }): WeatherObservation[] {
  throw new Error('BONUS 2 is not built yet: fetchForecast returns nothing.');
}

// BONUS 2: define the tool with tool('get_forecast', description, { city, days }, handler).
//   Copy the shape of getWeatherTool in get_weather.ts. days is a whole number from 1 to 3.
//   The handler returns { content: [{ type: 'text', text: JSON.stringify(fetchForecast(args)) }] }.
export const getForecastTool: ReturnType<typeof tool> | undefined = undefined;

void z;
