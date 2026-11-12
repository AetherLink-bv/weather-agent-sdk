# Bonus · Extend the weather agent yourself

For participants who finish Workshop 4 early. You extend a small Claude Agent
SDK agent with one tool and one specialist. The loop is the same as today:

1. **Paste the prompt** into Claude Code.
2. **The check goes green.** A check is red before you start. That is correct.
3. **One real run.** It uses your Claude Code login. You need no API key.
4. **Claude Code explains why.** Then you stop.

Everything the agent may do is in one file: [`src/options.ts`](src/options.ts).

| You know this from Workshop 4 | Here |
| --- | --- |
| `CLAUDE.md` as the system message | `instructions.md` |
| A read-only MCP server | `get_weather`, a tool inside the app |
| A specialist in `options.agents` | `packing-agent`, which you add |
| `npm run check:1` | `npm run check:tool` and `npm run check:agent` |

## Start

```sh
git clone https://github.com/AetherLink-bv/weather-agent-sdk.git
cd weather-agent-sdk
npm install
claude --setting-sources project,user --strict-mcp-config --no-chrome
```

## BONUS 1 · Read the agent and run it · 5 minutes

```text
Read src/options.ts, src/tools/get_weather.ts and instructions.md. Change no file. Show one table: each option in buildOptions, what it does, and the Workshop 4 step where I used the same option. Run npm test and npm run live and show the trace. Stop.
```

**Check:** `npm test` passes, and the trace shows `mcp__weather__get_weather`.

**Why:** this agent has the same parts as the support app. One difference: the
tool lives inside the app (`createSdkMcpServer`), so there is no separate
server to start.

## BONUS 2 · Add a tool · 10 minutes

```text
Read the BONUS 2 TODOs in src/tools/get_forecast.ts and src/options.ts. Build fetchForecast and getForecastTool, add the tool to the MCP server and to allowedTools, and add one line to instructions.md that says when to call get_forecast. Copy the shape of get_weather.ts. Change no other file. Run npm run check:tool until it passes. Run npm run live -- "Wat is het weer de komende drie dagen in Utrecht?" once and show the trace. Then explain in four lines: how the agent knows that the tool exists, how it knows when to call it, and what the schema protects against. Stop.
```

**Check:** `npm run check:tool` passes, and the trace shows one
`mcp__weather__get_forecast` call.

**Why:** a tool has three parts. The description tells the agent when to call
it. The schema limits the input. The handler is normal code that you can test
without a model.

## BONUS 3 · Add a specialist · 10 minutes

```text
Read the BONUS 3 TODOs in src/options.ts. Add packing-agent to options.agents with a description, a prompt and tools: []. It turns a forecast into a short packing list in Dutch and never guesses the weather. Set tools to ['Agent'], add 'Agent' to allowedTools, and add one line to instructions.md that says when to ask packing-agent. Change no other file. Run npm run check:agent until it passes. Run npm run live -- "Ik ga drie dagen naar Utrecht. Wat pak ik in?" once and show the trace. Then explain in four lines: why the specialist has no tools, what it can see of the conversation, and what the main agent does with its answer. Stop.
```

**Check:** `npm run check:agent` passes, and the trace shows
`mcp__weather__get_forecast` before `Agent → packing-agent`.

**Why:** the specialist starts with an empty context. It sees only what the
main agent gives it. It has no tools, so it cannot look up or change anything.

## Your own idea

Choose one. Write the check first, then paste a prompt of your own.

- A `get_air_quality` tool with a fixture, and an instruction for when to use it.
- A `route-agent` that advises the bike or the train from the forecast.
- A JSON answer with `outputFormat`, as in Workshop 4 Step 1.

Keep the same rules: fixture data, read-only tools, one real run, and you
review the result.
