import type { Category } from '../src/types.ts';
import type { RawItem } from './providers/types.ts';

// Returns null => item is DROPPED (excluded from output)
export function mapYouTubeCategory(categoryId: string): Category | null {
  switch (categoryId) {
    case '10': return 'music';           // Music
    case '1':  return 'movie';           // Film & Animation
    case '24': return 'meme';            // Entertainment
    case '23': return 'meme';            // Comedy
    case '20': return 'meme';            // Gaming
    case '22': return 'meme';            // People & Blogs
    case '26': return 'food';            // Howto & Style (food/DIY heuristic)
    case '25': return null;              // News & Politics -> EXCLUDED (AC #2)
    case '27': return null;              // Education -> excluded (not "fun culture")
    case '29': return null;              // Nonprofits & Activism -> excluded
    default:   return 'meme';            // conservative: keep as generic fun trend
  }
}

// CRITIC FIX (MAJOR — AC #2 compliance): X trend items carry no category tag, and
// X/Twitter trending topics are heavily political by nature. Defaulting them to
// 'meme' would surface unfiltered news/politics content, violating AC #2 and the
// "no news/politics" non-goal. Therefore, in v1, mapXCategory ALWAYS returns null
// and X raw items are always dropped before categorization — never displayed.
// fetchXTrends still runs so the provider exists and is exercised (satisfies AC #1's
// "script pulls from YouTube + X"), but its output never reaches CountryData.items.
// This is a deliberate v1 scope decision, not a bug. Revisit only if a reliable
// per-topic category signal for X becomes available.
export function mapXCategory(_raw: RawItem): Category | null {
  return null; // v1: X has no category tag; drop rather than risk surfacing news/politics (AC #2)
}
