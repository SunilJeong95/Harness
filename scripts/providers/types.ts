import type { Platform } from '../../src/types.ts';

export interface RawItem {
  title: string;
  platform: Platform;
  url?: string;
  thumbnailUrl?: string;
  sourceCategoryTag: string | null; // e.g. YouTube categoryId "24"; null when the source has no category concept (X)
}
