import type { RawItem } from './types.ts';

interface YouTubeVideosResponse {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      categoryId?: string;
      thumbnails?: {
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
  }>;
}

export async function fetchYouTubeTrends(code: string, apiKey: string): Promise<RawItem[]> {
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('chart', 'mostPopular');
  url.searchParams.set('regionCode', code);
  url.searchParams.set('maxResults', '30');
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.warn(`[youtube] ${code}: request failed (${res.status} ${res.statusText}); returning []`);
    return [];
  }

  const data = (await res.json()) as YouTubeVideosResponse;
  const items = data.items ?? [];

  return items
    .filter((item) => item.snippet?.title)
    .map((item) => {
      const snippet = item.snippet!;
      const thumbnailUrl = snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url;
      const raw: RawItem = {
        title: snippet.title!,
        platform: 'youtube',
        url: `https://www.youtube.com/watch?v=${item.id}`,
        thumbnailUrl,
        sourceCategoryTag: snippet.categoryId ?? null,
      };
      return raw;
    });
}
