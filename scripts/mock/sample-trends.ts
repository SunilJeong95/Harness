import type { RawItem } from '../providers/types.ts';

// Deterministic mock data used when YOUTUBE_API_KEY is absent or --mock is passed.
// All items use platform: 'youtube' with a sourceCategoryTag that maps to a
// NON-null Category via categorize.ts (mapYouTubeCategory) — i.e. only tags
// '10' (music), '1' (movie), '24'/'23'/'20'/'22' (meme), '26' (food). We
// deliberately never use '25'/'27'/'29' here since those are excluded by
// design and this demo path must satisfy the acceptance criteria (no
// zero-item countries, no excluded categories leaking through).

interface MockSeed {
  title: string;
  tag: '10' | '1' | '24' | '23' | '20' | '22' | '26';
}

function buildItems(code: string, seeds: MockSeed[]): RawItem[] {
  return seeds.map((seed, i) => ({
    title: seed.title,
    platform: 'youtube',
    url: `https://www.youtube.com/watch?v=mock-${code.toLowerCase()}-${i + 1}`,
    thumbnailUrl: `https://i.ytimg.com/vi/mock-${code.toLowerCase()}-${i + 1}/mqdefault.jpg`,
    sourceCategoryTag: seed.tag,
  }));
}

const MOCK_DATA: Record<string, MockSeed[]> = {
  US: [
    { title: 'Top 10 Viral Memes This Week', tag: '24' },
    { title: 'New Chart-Topping Pop Single - Official Video', tag: '10' },
    { title: 'Blockbuster Trailer Reaction', tag: '1' },
    { title: 'Easy 15-Minute Weeknight Pasta', tag: '26' },
    { title: 'Stand-Up Comedy Special Highlights', tag: '23' },
    { title: 'Speedrun World Record Reaction', tag: '20' },
  ],
  CA: [
    { title: 'Poutine Recipe: The Ultimate Comfort Food', tag: '26' },
    { title: 'Indie Band Releases Surprise Album - Music Video', tag: '10' },
    { title: 'Hilarious Hockey Bloopers Compilation', tag: '24' },
    { title: 'New Sci-Fi Movie Trailer Breakdown', tag: '1' },
    { title: 'Vlog: A Day in Toronto', tag: '22' },
  ],
  MX: [
    { title: 'Tacos al Pastor: Receta Casera', tag: '26' },
    { title: 'Nuevo Sencillo de Reggaeton - Video Oficial', tag: '10' },
    { title: 'Memes Virales de la Semana', tag: '24' },
    { title: 'Trailer de la Nueva Pelicula de Accion', tag: '1' },
    { title: 'Reto de Comedia en la Calle', tag: '23' },
  ],
  BR: [
    { title: 'Feijoada Completa: Receita Tradicional', tag: '26' },
    { title: 'Novo Hit de Funk - Clipe Oficial', tag: '10' },
    { title: 'Memes Mais Engracados da Semana', tag: '24' },
    { title: 'Trailer do Novo Filme Nacional', tag: '1' },
    { title: 'Gameplay Engracado - Melhores Momentos', tag: '20' },
  ],
  AR: [
    { title: 'Asado Perfecto: Guia Paso a Paso', tag: '26' },
    { title: 'Nuevo Tema de Rock Nacional - Video Oficial', tag: '10' },
    { title: 'Compilado de Memes Argentinos', tag: '24' },
    { title: 'Trailer Pelicula Independiente', tag: '1' },
    { title: 'Rutina de Comedia Stand-Up', tag: '23' },
  ],
  GB: [
    { title: 'Best Sunday Roast Recipe', tag: '26' },
    { title: 'UK Chart Number One - Official Music Video', tag: '10' },
    { title: 'British Comedy Sketch Compilation', tag: '23' },
    { title: 'New West End Film Trailer', tag: '1' },
    { title: 'Meme Review: This Week in Internet Culture', tag: '24' },
  ],
  DE: [
    { title: 'Schnelles Currywurst Rezept', tag: '26' },
    { title: 'Neuer Song aus den Charts - Offizielles Musikvideo', tag: '10' },
    { title: 'Lustige Meme Zusammenstellung', tag: '24' },
    { title: 'Trailer zum neuen Kinofilm', tag: '1' },
    { title: 'Gaming Highlights der Woche', tag: '20' },
  ],
  FR: [
    { title: 'Recette Facile: Quiche Lorraine', tag: '26' },
    { title: 'Nouveau Clip Officiel - Chanson Pop', tag: '10' },
    { title: 'Compilation des Memes Viraux', tag: '24' },
    { title: 'Bande-annonce du Nouveau Film', tag: '1' },
    { title: 'Sketch Comique de la Semaine', tag: '23' },
  ],
  ZA: [
    { title: 'Best Braai Recipe Ever', tag: '26' },
    { title: 'Amapiano New Hit - Official Video', tag: '10' },
    { title: 'Funniest Local Memes This Week', tag: '24' },
    { title: 'New Local Film Trailer', tag: '1' },
    { title: 'Vlog: Cape Town Adventures', tag: '22' },
  ],
  NG: [
    { title: 'Jollof Rice: The Ultimate Recipe', tag: '26' },
    { title: 'Afrobeats New Single - Official Video', tag: '10' },
    { title: 'Naija Memes Compilation', tag: '24' },
    { title: 'Nollywood New Movie Trailer', tag: '1' },
    { title: 'Comedy Skit of the Week', tag: '23' },
  ],
  KR: [
    { title: '마늘쫑 볶음 레시피', tag: '26' },
    { title: '두바이 쫀득쿠키', tag: '26' },
    { title: '신곡 뮤직비디오 공개', tag: '10' },
    { title: '이번 주 인기 밈 모음', tag: '24' },
    { title: '신작 영화 예고편 리뷰', tag: '1' },
    { title: '게임 하이라이트 모음', tag: '20' },
    { title: '일상 브이로그: 서울 나들이', tag: '22' },
  ],
  JP: [
    { title: '簡単ラーメンレシピ', tag: '26' },
    { title: '新曲ミュージックビデオ公開', tag: '10' },
    { title: '今週のバズった面白動画まとめ', tag: '24' },
    { title: '新作映画予告編', tag: '1' },
    { title: 'ゲーム実況ハイライト', tag: '20' },
  ],
  IN: [
    { title: 'Quick Butter Chicken Recipe', tag: '26' },
    { title: 'New Bollywood Song - Official Music Video', tag: '10' },
    { title: 'Viral Memes of the Week Compilation', tag: '24' },
    { title: 'New Movie Trailer Reaction', tag: '1' },
    { title: 'Comedy Sketch: Everyday Life', tag: '23' },
  ],
  SA: [
    { title: 'Traditional Kabsa Recipe', tag: '26' },
    { title: 'New Arabic Pop Single - Official Video', tag: '10' },
    { title: 'Funniest Clips of the Week', tag: '24' },
    { title: 'New Regional Film Trailer', tag: '1' },
    { title: 'Vlog: Riyadh Nightlife', tag: '22' },
  ],
  AU: [
    { title: 'Best Aussie BBQ Recipe', tag: '26' },
    { title: 'New Chart Hit - Official Music Video', tag: '10' },
    { title: 'Funniest Wildlife Encounters Compilation', tag: '24' },
    { title: 'New Aussie Film Trailer', tag: '1' },
    { title: 'Gaming Highlights Down Under', tag: '20' },
  ],
};

export function getMockTrends(code: string): RawItem[] {
  const seeds = MOCK_DATA[code] ?? [
    { title: `Trending Meme Compilation (${code})`, tag: '24' },
    { title: `Popular Music Video (${code})`, tag: '10' },
    { title: `New Movie Trailer (${code})`, tag: '1' },
    { title: `Quick Recipe of the Week (${code})`, tag: '26' },
  ];
  return buildItems(code, seeds);
}
