import type { CountryData, DataIndex } from './types';

const countryCache = new Map<string, CountryData>();

export async function loadIndex(): Promise<DataIndex> {
  const res = await fetch('/data/index.json');
  if (!res.ok) {
    throw new Error(`Failed to load data index: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as DataIndex;
}

export async function loadCountry(code: string): Promise<CountryData> {
  const cached = countryCache.get(code);
  if (cached) {
    return cached;
  }

  const res = await fetch(`/data/countries/${code}.json`);
  if (!res.ok) {
    throw new Error(`Failed to load country data for ${code}: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as CountryData;
  countryCache.set(code, data);
  return data;
}
