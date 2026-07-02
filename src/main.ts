import './style.css';
import { loadIndex, loadCountry } from './data';
import { initGlobe } from './globe';
import { renderPanel, renderEmptyState, clearPanel } from './panel';

const globeContainerEl = document.getElementById('globe-container');
const panelContainerEl = document.getElementById('panel-container');
const loadingEl = document.getElementById('loading-indicator');

if (!globeContainerEl || !panelContainerEl) {
  throw new Error('Required app containers are missing from index.html');
}

const globeContainer: HTMLElement = globeContainerEl;
const panelContainer: HTMLElement = panelContainerEl;

async function handleCountryClick(code: string): Promise<void> {
  try {
    const country = await loadCountry(code);
    renderPanel(panelContainer, country, () => clearPanel(panelContainer));
  } catch (err) {
    console.error(`Failed to load country data for ${code}:`, err);
    renderEmptyState(panelContainer, `Could not load data for ${code}.`);
  }
}

function handleNoData(countryName: string): void {
  renderEmptyState(panelContainer, `No data available for ${countryName}.`);
}

async function bootstrap(): Promise<void> {
  try {
    const index = await loadIndex();
    await initGlobe(globeContainer, index, handleCountryClick, handleNoData);
  } catch (err) {
    console.error('Failed to initialize globe:', err);
    if (loadingEl) {
      loadingEl.textContent = 'Failed to load data. Please refresh.';
    }
    return;
  }

  loadingEl?.remove();
}

void bootstrap();
