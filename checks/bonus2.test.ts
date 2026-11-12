import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOptions, loadInstructions } from '../src/options.ts';
import { FIXTURE_FORECAST, fetchForecast, getForecastTool } from '../src/tools/get_forecast.ts';

test('BONUS 2: fetchForecast returns the first days of the fixture for the requested city', () => {
  const forecast = fetchForecast({ city: 'Utrecht', days: 2 });
  assert.deepEqual(forecast, [
    { ...FIXTURE_FORECAST[0], city: 'Utrecht' },
    { ...FIXTURE_FORECAST[1], city: 'Utrecht' },
  ]);
});

test('BONUS 2: get_forecast is a tool the agent may call', async () => {
  assert.equal(getForecastTool?.name, 'get_forecast', 'getForecastTool is defined with the name get_forecast');
  const result = await getForecastTool.handler({ city: 'Amsterdam', days: 3 }, {});
  assert.deepEqual(JSON.parse(result.content[0].text), FIXTURE_FORECAST, 'the handler returns the forecast as JSON text');
  assert.ok(buildOptions().allowedTools?.includes('mcp__weather__get_forecast'), "allowedTools has 'mcp__weather__get_forecast'");
  assert.match(loadInstructions(), /get_forecast/, 'instructions.md says when to call get_forecast');
});
