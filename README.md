# Creative Walking

Structured walking practices for creative thinking, delivered through smart
glasses. A web app sets up and frames the walk; a Mentra (AugmentOS) glasses app
runs it live — prompting, timing, and speaking to the walker as they move.

Built for **Even Realities G1** glasses.

Two practices are implemented:

- **Six Hats** — de Bono's six thinking modes (White: facts, Red: feelings,
  Black: caution, Yellow: benefits, Green: creativity, Blue: process), cycled
  across the walk.
- **Inspiration Walks** — walks patterned after the working habits of people
  known for thinking on foot.

Defaults: a 30-minute walk, a new prompt every 30 seconds.

## Layout

```
web/       Next.js 15 app (React 19, Tailwind, p5) — setup UI and walk framing
glasses/   Mentra / AugmentOS cloud app (TypeScript, Express) — the live walk runtime
```

Inside `glasses/`:

```
index.ts                      entry point; builds shared state, starts the TPA server
server/SixHatWalkingApp.ts    extends TpaServer; owns sessions + the API server
server/session-handler.ts     per-session walk state machine
server/api-server.ts          HTTP surface the web app talks to
services/prompt-generator.ts  prompt text per hat / stage (OpenAI)
speaking.ts                   text-to-speech output to the glasses
models/, types/, constants/
```

## How the halves connect

The two run as separate processes and talk over HTTP in both directions:

- `glasses/` runs the TPA server on **port 3000** and an Express API on
  **port 3001** (`APP_CONFIG` in `constants/config.ts`).
- `web/` calls that API at `NEXT_PUBLIC_API_URL` to configure a walk.
- `glasses/` calls back to the web app at `NEXTJS_URL`.

Both processes share one in-memory `ApiServerState` — walk settings and
generated prompts live there, not in a database, so **state resets when the
backend restarts.**

## Running it

**web**

```bash
cd web
cp .env.example .env.local     # then fill it in
npm install
npm run dev                    # http://localhost:3000
```

**glasses**

```bash
cd glasses
cp .env.example .env           # then fill it in
bun install                    # or: npm install
bun run index.ts
```

## Prerequisites

Running this needs more than the two commands above:

- A Mentra / AugmentOS developer account, with the app registered under the
  package name in `constants/config.ts` (`com.medialab.walking`).
- A publicly reachable URL for the glasses app in local development — the cloud
  has to reach your machine, so a tunnel (ngrok or similar) is required. Without
  it the server starts normally and simply never receives a session.
- Even Realities G1 glasses paired to the Mentra app.

## Notes

- `glasses/` began as a clone of
  [AugmentOS-Cloud-Example-App](https://github.com/AugmentOS-Community/AugmentOS-Cloud-Example-App);
  its history is not preserved here.
- `glasses/package.json` still identifies itself as `augmentos-cloud-example-app` —
  a leftover from that template.
- `web/public/assets/fonts/LEDLIGHT.otf` is a bundled display font — check its
  license before making this repository public.
- Last active April 2025.
