import 'dotenv/config';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { COUNTRIES } from '../src/countries.ts';
import type { CountryData, CountryIndexEntry, DataIndex, TrendingItem } from '../src/types.ts';
import { mapXCategory, mapYouTubeCategory } from './categorize.ts';
import { getMockTrends } from './mock/sample-trends.ts';
import { fetchXTrends } from './providers/x.ts';
import { fetchYouTubeTrends } from './providers/youtube.ts';
import type { RawItem } from './providers/types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const COUNTRIES_DIR = path.join(ROOT, 'public', 'data', 'countries');
const INDEX_PATH = path.join(ROOT, 'public', 'data', 'index.json');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY ?? '';
const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN ?? '';
const useMock = !YOUTUBE_API_KEY || process.argv.includes('--mock');

interface FetchSummary {
  code: string;
  name: string;
  itemCount: number;
  isMock: boolean;
}

function toTrendingItems(rawItems: RawItem[]): TrendingItem[] {
  const youtubeSurvivors: TrendingItem[] = [];
  const xSurvivors: TrendingItem[] = [];

  for (const raw of rawItems) {
    if (raw.platform === 'youtube') {
      const category = raw.sourceCategoryTag ? mapYouTubeCategory(raw.sourceCategoryTag) : null;
      if (category === null) continue;
      youtubeSurvivors.push({
        title: raw.title,
        platform: 'youtube',
        category,
        rank: 0, // assigned below
        url: raw.url,
        thumbnailUrl: raw.thumbnailUrl,
        sourceCategoryTag: raw.sourceCategoryTag ?? '',
      });
    } else if (raw.platform === 'x') {
      // v1: mapXCategory always returns null (see categorize.ts) — X items are
      // never surfaced. This loop still runs so the provider is exercised.
      const category = mapXCategory(raw);
      if (category === null) continue;
      xSurvivors.push({
        title: raw.title,
        platform: 'x',
        category,
        rank: 0,
        url: raw.url,
        thumbnailUrl: raw.thumbnailUrl,
        sourceCategoryTag: raw.sourceCategoryTag ?? '',
      });
    }
  }

  // Assign 1-based rank per platform among surviving items.
  youtubeSurvivors.forEach((item, i) => {
    item.rank = i + 1;
  });
  xSurvivors.forEach((item, i) => {
    item.rank = i + 1;
  });

  return [...youtubeSurvivors, ...xSurvivors];
}

async function gatherRawItems(code: string, xWoeid: number | null): Promise<RawItem[]> {
  if (useMock) {
    return getMockTrends(code);
  }

  const youtubeItems = await fetchYouTubeTrends(code, YOUTUBE_API_KEY).catch((err) => {
    console.warn(`[fetch] ${code}: YouTube fetch failed (${(err as Error).message}); using []`);
    return [] as RawItem[];
  });

  let xItems: RawItem[] = [];
  if (xWoeid !== null) {
    xItems = await fetchXTrends(xWoeid, X_BEARER_TOKEN).catch((err) => {
      console.warn(`[fetch] ${code}: X fetch failed (${(err as Error).message}); using []`);
      return [] as RawItem[];
    });
  }

  return [...youtubeItems, ...xItems];
}

async function main() {
  mkdirSync(COUNTRIES_DIR, { recursive: true });

  console.log(`[fetch-trends] mode: ${useMock ? 'MOCK' : 'LIVE'}`);

  const summaries: FetchSummary[] = [];
  const indexEntries: CountryIndexEntry[] = [];

  for (const country of COUNTRIES) {
    const rawItems = await gatherRawItems(country.code, country.xWoeid);
    const items = toTrendingItems(rawItems);
    const fetchedAt = new Date().toISOString();

    const countryData: CountryData = {
      code: country.code,
      name: country.name,
      continent: country.continent,
      fetchedAt,
      isMock: useMock,
      items,
    };

    writeFileSync(
      path.join(COUNTRIES_DIR, `${country.code}.json`),
      JSON.stringify(countryData, null, 2),
      'utf-8',
    );

    summaries.push({ code: country.code, name: country.name, itemCount: items.length, isMock: useMock });

    if (items.length > 0) {
      indexEntries.push({
        code: country.code,
        name: country.name,
        continent: country.continent,
        itemCount: items.length,
        isMock: useMock,
      });
    }
  }

  const dataIndex: DataIndex = {
    generatedAt: new Date().toISOString(),
    countries: indexEntries,
  };
  writeFileSync(INDEX_PATH, JSON.stringify(dataIndex, null, 2), 'utf-8');

  console.log('\n[fetch-trends] Summary:');
  console.log('code | name                 | items | mock');
  console.log('-----|----------------------|-------|-----');
  for (const s of summaries) {
    console.log(
      `${s.code.padEnd(4)} | ${s.name.padEnd(20)} | ${String(s.itemCount).padStart(5)} | ${s.isMock ? 'yes' : 'no'}`,
    );
  }
  console.log(`\n[fetch-trends] Wrote ${summaries.length} country files + index.json (${indexEntries.length} with data).`);
}

main().catch((err) => {
  console.error('[fetch-trends] Fatal error:', err);
  process.exit(1);
});
