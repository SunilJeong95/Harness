export type Category = 'meme' | 'food' | 'music' | 'movie';
export type Platform = 'youtube' | 'x';

export interface TrendingItem {
  title: string;
  platform: Platform;
  category: Category;
  rank: number; // 1-based within its (country, platform) list
  url?: string; // watch/tweet link when available
  thumbnailUrl?: string; // YouTube thumbnail when available
  sourceCategoryTag: string; // raw platform tag, for traceability (e.g. "Music", "24")
}

export interface CountryData {
  code: string; // ISO 3166-1 alpha-2, e.g. "US"
  name: string;
  continent: string;
  fetchedAt: string; // ISO timestamp of the fetch run
  isMock: boolean; // true if produced from fallback mock data
  items: TrendingItem[];
}

export interface CountryIndexEntry {
  code: string;
  name: string;
  continent: string;
  itemCount: number;
  isMock: boolean;
}

export interface DataIndex {
  generatedAt: string;
  countries: CountryIndexEntry[];
}
