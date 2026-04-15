# abm-agent-demo

> The self-serve aha moment Prismic's ABM Landing Page Builder doesn't have.

Paste a company URL, get the personalised landing page Prismic's ABM Agent would ship for them plus a quantified growth brief. Live, in your browser, in about a minute.

**Live:** https://ginny-nguyen-abm-demo.vercel.app

Built as the portfolio artefact for Ginny Nguyen's AI Solutions Engineer application at Prismic. Replaces the cover-letter slot their application flow doesn't have.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack dev)
- Tailwind CSS 4 + shadcn/ui (base-nova preset)
- Claude Sonnet 4.6 primary with prompt caching + `web_search_20250305` tool + streaming (`@anthropic-ai/sdk`)
- Gemini 2.5 Flash fallback with Google Search grounding (`@google/generative-ai`)
- Zod 4 for output schema validation (two-artefact LP + growth brief)
- Upstash Redis + `@upstash/ratelimit` for per-IP sliding window
- Deployed on Vercel

## Local dev

```bash
pnpm install
cp .env.local.example .env.local
# fill in the keys
pnpm dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Purpose | Source |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Sonnet 4.6 primary provider | https://console.anthropic.com/settings/keys |
| `GEMINI_API_KEY` | Gemini 2.5 Flash fallback | https://aistudio.google.com/apikey |
| `UPSTASH_REDIS_REST_URL` | Per-IP rate limit store | https://console.upstash.com/ |
| `UPSTASH_REDIS_REST_TOKEN` | " | " |
| `UPSTASH_BYPASS_IPS` | Optional comma-separated IPs exempt from rate limit | - |

All four (plus the optional bypass) must be set in Vercel **Production + Preview + Development**.

## Architecture

```
POST /api/generate  { companyInput, persona }
  -> normaliseCompanyInput           src/lib/normalise.ts
  -> checkRateLimit(ip) 5/hr         src/lib/ratelimit.ts
  -> runPipeline                     src/lib/pipeline.ts
       -> streamAnthropic            src/lib/providers/anthropic.ts
          (Sonnet 4.6 + web_search + prompt cache + stream)
       -> on fail: streamGemini      src/lib/providers/gemini.ts
          (Gemini 2.5 Flash + googleSearch grounding + stream)
       -> extractJson + LPSchema.safeParse
  -> stream text deltas back to client with delimiters:
       ---PROVIDER:anthropic--- / ---PROVIDER:gemini---
       ---RESULT---<json> on success
       ---ERROR---<json> on failure
```

The client (`src/components/generate-form.tsx`) streams and parses the final delimited JSON block, renders via `src/components/lp-preview.tsx` which splits into `LandingPagePreview` + `GrowthBriefPreview` subcomponents.

## Deploy

Push to `main` auto-deploys via Vercel. First deploy requires all 4 env vars to be set before a live generation will succeed. Upstash rate limit falls back to unlimited if the two Upstash vars are missing (useful during initial setup).

## Licence

Personal portfolio artefact. Not licensed for reuse.

Ginny Nguyen, ginny.nguyen.digitalservices@gmail.com
