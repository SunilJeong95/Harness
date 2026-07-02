# Global Meme & Trend Globe

An interactive 3D globe showing what's trending right now (memes, viral food, music, movies) in 15 countries across 6 continents, sourced from YouTube Trending and X (Twitter) Trending, with news/politics filtered out. Fully static — no backend, no database.

Click a highlighted country to see its current trending items.

## How it works

- A build-time script (`scripts/fetch-trends.ts`) pulls trending data once and writes it to static JSON files under `public/data/`.
- The site (Vite + vanilla TypeScript + [globe.gl](https://github.com/vasturiano/globe.gl)) reads those static files at runtime — there is no server, API, or database involved after the build.
- Data does **not** auto-refresh. To update it, re-run the fetch script and redeploy.

## Data sources & the "mock vs live" modes

| Mode | Command | What it does |
|---|---|---|
| **Mock (default)** | `npm run fetch:mock` | Uses deterministic sample data in `scripts/mock/sample-trends.ts`. No API keys needed. This is what `npm run build` uses by default, so the site always builds — including in this environment, which has no API keys configured. |
| **Live** | `npm run fetch` (or `npm run build:live`) | Calls the real YouTube Data API v3 and X API v2. Requires API keys (see below). |

Countries fetched in mock mode are flagged with `isMock: true` in their data and shown with a "(mock data)" badge in the UI.

### The X (Twitter) API constraint

X API v2's per-location trends endpoint requires a **paid access tier** (Basic/Pro) — the free tier does not reliably expose it. Because of this:

- `scripts/providers/x.ts` degrades gracefully: a missing `X_BEARER_TOKEN`, or a 401/403/429 response, logs a warning and returns an empty list — it never throws or breaks the build.
- Even when a token *is* configured, **X items are never shown**, on purpose: X trending topics are heavily political and carry no per-item category tag, so there is no reliable way to filter out news/politics from them the way we do for YouTube (via `videoCategoryId`). Surfacing them would risk violating the "no news/politics" requirement. `scripts/categorize.ts`'s `mapXCategory` always returns `null`, dropping every X item after fetch. The provider is still wired up and called (so the fetch pipeline genuinely queries both platforms), it's just that X's output never reaches the site.
- **YouTube alone fully satisfies every feature of this project** (10-20 countries, category-tag filtering, static JSON, interactive globe).

### Category filtering

Every YouTube trending video carries an official `categoryId` (e.g. Music, Comedy, Entertainment, News & Politics). `scripts/categorize.ts` maps these to the app's four display categories — `meme`, `food`, `music`, `movie` — and **hard-excludes** News & Politics, Education, and Nonprofits & Activism categories. No AI/ML classification or manual curation is used; the platform's own tags are the only filter.

## Local development

Requires Node 24 (see `.node-version`).

```bash
npm install
npm run dev      # runs predev (prepare:map) automatically, then starts Vite
```

This uses whatever is already in `public/data/` (mock data, committed for convenience is NOT the default — run one of the fetch commands below first if `public/data/` is empty).

To (re)generate data:

```bash
npm run fetch:mock   # no keys needed, deterministic sample data
# — or, with real API keys —
cp .env.example .env
# edit .env: fill in YOUTUBE_API_KEY (required for live data) and X_BEARER_TOKEN (optional, paid tier)
npm run fetch
```

### Getting API keys (for live mode)

- **YouTube Data API v3 key**: [Google Cloud Console](https://console.cloud.google.com/) → enable "YouTube Data API v3" → create an API key.
- **X API bearer token**: requires a paid X API tier (Basic or higher) that includes the `trends/by/woeid` endpoint. Free-tier tokens will not work reliably (see above — this is expected and handled gracefully either way).

Keys are read only by the Node fetch script (`scripts/`) via `dotenv`; they are never bundled into the client-side JavaScript.

## Build & preview

```bash
npm run build     # prepare:map + fetch:mock + vite build -> dist/ (default: mock data, always succeeds)
npm run build:live  # prepare:map + fetch (live APIs) + vite build -> dist/
npm run preview  # serves dist/ locally
```

`npm run fetch` / `npm run fetch:mock` automatically run `scripts/validate-data.ts` afterward (via npm's `post*` hooks), which asserts: every item's category is one of the four allowed values, no News & Politics item slipped through, zero X items are present, and at least 10 countries have data. The build fails loudly if any of these regress.

## Deploying to Cloudflare Pages

- **Framework preset:** None / Vite
- **Build command:** `npm run build` (mock data) or `npm run build:live` (live data — requires setting `YOUTUBE_API_KEY` and optionally `X_BEARER_TOKEN` as environment variables in the Pages dashboard; never commit real keys to the repo)
- **Build output directory:** `dist`
- **Node version:** pinned via `.node-version` (24)

Or deploy directly via Wrangler:

```bash
npm run build
npx wrangler pages deploy dist
```

## Scope (v1)

**In scope:** YouTube Trending + X Trending (best-effort, see above) across 15 countries (North/South America, Europe, Africa, Asia, Oceania), category-tag-based filtering, static site, Cloudflare Pages deployment.

**Explicitly out of scope for v1:**
- TikTok / Instagram (neither has a public official trending API)
- Any backend server or database
- Real-time or scheduled auto-refresh (data updates only via re-running the fetch script + redeploying)
- Custom ML/AI classification or human content curation
- News/politics content of any kind
