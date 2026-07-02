import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Category, CountryData, DataIndex } from '../src/types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const COUNTRIES_DIR = path.join(ROOT, 'public', 'data', 'countries');
const INDEX_PATH = path.join(ROOT, 'public', 'data', 'index.json');

const VALID_CATEGORIES: Category[] = ['meme', 'food', 'music', 'movie'];

const errors: string[] = [];

function fail(message: string) {
  errors.push(message);
}

function main() {
  if (!existsSync(INDEX_PATH)) {
    fail(`index.json not found at ${INDEX_PATH}`);
  }
  if (!existsSync(COUNTRIES_DIR)) {
    fail(`countries directory not found at ${COUNTRIES_DIR}`);
  }

  if (errors.length > 0) {
    reportAndExit();
    return;
  }

  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8')) as DataIndex;

  // (d) index.json.countries.length >= 10
  if (!Array.isArray(index.countries) || index.countries.length < 10) {
    fail(`index.json must list >= 10 countries, found ${index.countries?.length ?? 0}`);
  }

  const files = readdirSync(COUNTRIES_DIR).filter((f: string) => f.endsWith('.json'));
  if (files.length === 0) {
    fail(`no country JSON files found in ${COUNTRIES_DIR}`);
  }

  let xItemCount = 0;
  let category25Count = 0;
  let invalidCategoryCount = 0;

  for (const file of files) {
    const filePath = path.join(COUNTRIES_DIR, file);
    const data = JSON.parse(readFileSync(filePath, 'utf-8')) as CountryData;

    for (const item of data.items) {
      // (a) every item's category is one of meme/food/music/movie
      if (!VALID_CATEGORIES.includes(item.category)) {
        invalidCategoryCount += 1;
        fail(`${file}: item "${item.title}" has invalid category "${item.category}"`);
      }

      // (b) no item has sourceCategoryTag === '25'
      if (item.sourceCategoryTag === '25') {
        category25Count += 1;
        fail(`${file}: item "${item.title}" has sourceCategoryTag '25' (News & Politics) and must be excluded`);
      }

      // (c) zero items have platform === 'x' (v1 exclusion)
      if (item.platform === 'x') {
        xItemCount += 1;
        fail(`${file}: item "${item.title}" has platform 'x' but v1 excludes all X items from output`);
      }
    }
  }

  reportAndExit({ xItemCount, category25Count, invalidCategoryCount, countryFileCount: files.length });
}

function reportAndExit(summary?: {
  xItemCount: number;
  category25Count: number;
  invalidCategoryCount: number;
  countryFileCount: number;
}) {
  if (errors.length > 0) {
    console.error('[validate-data] FAILED:');
    for (const e of errors) {
      console.error(`  - ${e}`);
    }
    process.exit(1);
  }

  console.log('[validate-data] PASSED:');
  if (summary) {
    console.log(`  - country files checked: ${summary.countryFileCount}`);
  }
  console.log('  - all item categories in {meme, food, music, movie}');
  console.log("  - no item with sourceCategoryTag === '25'");
  console.log("  - zero items with platform === 'x'");
  console.log('  - index.json lists >= 10 countries');
}

main();
