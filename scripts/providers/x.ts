import type { RawItem } from './types.ts';

let loggedMissingBearer = false;

// PAID-TIER CONSTRAINT: X API v2 trends require a paid access tier (Basic/Pro);
// the free tier does not expose per-location trends reliably. This provider
// degrades gracefully: missing bearer token, or a 401/403/429 response, both
// result in an empty array being returned rather than throwing — YouTube data
// alone still satisfies all acceptance criteria.
export async function fetchXTrends(woeid: number, bearer: string): Promise<RawItem[]> {
  if (!bearer) {
    if (!loggedMissingBearer) {
      console.log('[x] X_BEARER_TOKEN not set; skipping X trends (YouTube-only mode)');
      loggedMissingBearer = true;
    }
    return [];
  }

  const url = `https://api.twitter.com/2/trends/by/woeid/${woeid}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${bearer}` },
    });
  } catch (err) {
    console.warn(`[x] woeid ${woeid}: network error (${(err as Error).message}); returning []`);
    return [];
  }

  if (res.status === 401 || res.status === 403 || res.status === 429) {
    console.warn(`[x] woeid ${woeid}: request denied (${res.status}); likely requires paid tier. Returning [].`);
    return [];
  }

  if (!res.ok) {
    console.warn(`[x] woeid ${woeid}: request failed (${res.status} ${res.statusText}); returning []`);
    return [];
  }

  const data = (await res.json()) as unknown;
  const trends = extractTrends(data);

  return trends.map((title) => {
    const raw: RawItem = {
      title,
      platform: 'x',
      sourceCategoryTag: null, // X has no category concept
    };
    return raw;
  });
}

function extractTrends(data: unknown): string[] {
  if (!Array.isArray(data)) return [];
  const first = data[0] as { trends?: Array<{ trend_name?: string; name?: string }> } | undefined;
  const trends = first?.trends ?? [];
  return trends
    .map((t) => t.trend_name ?? t.name)
    .filter((name): name is string => Boolean(name));
}
