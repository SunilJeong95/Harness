import type { Category, CountryData, Platform, TrendingItem } from './types';

const CATEGORY_LABELS: Record<Category, string> = {
  meme: 'Meme',
  food: 'Food',
  music: 'Music',
  movie: 'Movie',
};

const CATEGORY_CLASS: Record<Category, string> = {
  meme: 'badge-meme',
  food: 'badge-food',
  music: 'badge-music',
  movie: 'badge-movie',
};

const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: 'YouTube',
  x: 'X',
};

const PLATFORM_ICONS: Record<Platform, string> = {
  youtube: '▶',
  x: '𝕏',
};

export type PanelCloseHandler = () => void;

export function renderPanel(container: HTMLElement, country: CountryData, onClose?: PanelCloseHandler): void {
  container.innerHTML = '';
  container.classList.add('panel-open');

  const header = document.createElement('div');
  header.className = 'panel-header';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'panel-title-wrap';

  const title = document.createElement('h2');
  title.className = 'panel-title';
  title.textContent = country.name;

  const subtitle = document.createElement('div');
  subtitle.className = 'panel-subtitle';
  subtitle.textContent = country.continent;

  titleWrap.append(title, subtitle);

  if (country.isMock) {
    const badge = document.createElement('span');
    badge.className = 'panel-mock-badge';
    badge.textContent = '(mock data)';
    titleWrap.appendChild(badge);
  }

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'panel-close';
  closeBtn.setAttribute('aria-label', 'Close panel');
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => {
    clearPanel(container);
    onClose?.();
  });

  header.append(titleWrap, closeBtn);
  container.appendChild(header);

  const list = document.createElement('div');
  list.className = 'panel-list';

  if (country.items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'panel-empty';
    empty.textContent = 'No trending items available for this country yet.';
    list.appendChild(empty);
  } else {
    for (const item of country.items) {
      list.appendChild(renderCard(item));
    }
  }

  container.appendChild(list);
}

export function renderEmptyState(container: HTMLElement, message: string): void {
  container.innerHTML = '';
  container.classList.add('panel-open');

  const empty = document.createElement('div');
  empty.className = 'panel-empty panel-empty-standalone';
  empty.textContent = message;
  container.appendChild(empty);
}

export function clearPanel(container: HTMLElement): void {
  container.innerHTML = '';
  container.classList.remove('panel-open');
}

function renderCard(item: TrendingItem): HTMLElement {
  const card = document.createElement('div');
  card.className = 'trend-card';

  const top = document.createElement('div');
  top.className = 'trend-card-top';

  const rank = document.createElement('span');
  rank.className = 'trend-rank';
  rank.textContent = `#${item.rank}`;

  const platform = document.createElement('span');
  platform.className = `trend-platform trend-platform-${item.platform}`;
  platform.textContent = `${PLATFORM_ICONS[item.platform]} ${PLATFORM_LABELS[item.platform]}`;

  const category = document.createElement('span');
  category.className = `category-badge ${CATEGORY_CLASS[item.category]}`;
  category.textContent = CATEGORY_LABELS[item.category];

  top.append(rank, platform, category);

  const title = document.createElement('div');
  title.className = 'trend-title';

  if (item.url) {
    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = item.title;
    title.appendChild(link);
  } else {
    title.textContent = item.title;
  }

  card.append(top, title);

  if (item.thumbnailUrl) {
    const thumb = document.createElement('img');
    thumb.className = 'trend-thumbnail';
    thumb.src = item.thumbnailUrl;
    thumb.alt = item.title;
    thumb.loading = 'lazy';
    card.appendChild(thumb);
  }

  return card;
}
