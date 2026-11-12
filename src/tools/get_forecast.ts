import { tool } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import type { WeatherObservation } from '../decide.ts';

/** Fixed three-day forecast, so the check passes without network or a model. */
export const FIXTURE_FORECAST: WeatherObservation[] = [
  { city: 'Amsterdam', date: '2026-09-21', temperatureC: 14, precipitationProbability: 72 },
  { city: 'Amsterdam', date: '2026-09-22', temperatureC: 19, precipitationProbability: 10 },
  { city: 'Amsterdam', date: '2026-09-23', temperatureC: 9, precipitationProbability: 65 },
];

export function fetchForecast(input: { city: string; days: number }): WeatherObservation[] {
  return FIXTURE_FORECAST.slice(0, input.days).map((day) => ({ ...day, city: input.city }));
}

export const getForecastTool = tool(
  'get_forecast',
  'Fetch the forecast for a city for the next 1 to 3 days (fixture for labs).',
  {
    city: z.string().describe('City name'),
    days: z.number().int().min(1).max(3).describe('Number of days, 1 to 3'),
  },
  async (args) => ({
    content: [{ type: 'text' as const, text: JSON.stringify(fetchForecast(args)) }],
  }),
);
