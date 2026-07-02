import Globe from 'globe.gl';
import type { GlobeInstance } from 'globe.gl';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { Feature, FeatureCollection, GeometryObject, GeoJsonProperties } from 'geojson';
import { COUNTRIES } from './countries';
import type { DataIndex } from './types';

const HIGHLIGHT_CAP_COLOR = '#22d3ee';
const HIGHLIGHT_ALTITUDE = 0.02;
const MUTED_CAP_COLOR = 'rgba(100, 116, 139, 0.35)';
const MUTED_ALTITUDE = 0.004;
const SIDE_COLOR = 'rgba(30, 41, 59, 0.55)';
const STROKE_COLOR = 'rgba(15, 23, 42, 0.65)';

type CountryFeatureProperties = { name?: string } & GeoJsonProperties;

type CountryFeature = Feature<GeometryObject, CountryFeatureProperties>;

// Reverse lookup: world-atlas numeric polygon id -> our country config (see src/countries.ts).
const numericIdToCountry = new Map(COUNTRIES.map((c) => [c.iso3166Numeric, c]));

export type CountryClickHandler = (code: string) => void;
export type NoDataHandler = (countryName: string) => void;

export interface GlobeHandle {
  destroy(): void;
}

export async function initGlobe(
  container: HTMLElement,
  index: DataIndex,
  onCountryClick: CountryClickHandler,
  onNoData?: NoDataHandler,
): Promise<GlobeHandle> {
  const dataCodes = new Set(index.countries.map((c) => c.code));

  const topoRes = await fetch('/world-110m.json');
  if (!topoRes.ok) {
    throw new Error(`Failed to load world map: ${topoRes.status} ${topoRes.statusText}`);
  }
  const topology = (await topoRes.json()) as Topology;
  const countriesObject = topology.objects.countries as GeometryCollection<CountryFeatureProperties>;
  const geoJson = feature(topology, countriesObject) as FeatureCollection<
    GeometryObject,
    CountryFeatureProperties
  >;
  const features: CountryFeature[] = geoJson.features;

  const unmatched = features.filter((feat) => !resolveCode(feat)).length;
  if (unmatched > 0) {
    // Informational only, per plan Section 4: log rather than crash on unmatched polygons.
    console.warn(`[globe] ${unmatched} polygon(s) have no matching entry in COUNTRIES.`);
  }

  const globe = new Globe(container)
    .backgroundColor('rgba(0,0,0,0)')
    .showAtmosphere(true)
    .atmosphereColor('#60a5fa')
    .atmosphereAltitude(0.18)
    .polygonsData(features)
    .polygonCapColor((obj) => capColor(obj as CountryFeature, dataCodes))
    .polygonSideColor(() => SIDE_COLOR)
    .polygonStrokeColor(() => STROKE_COLOR)
    .polygonAltitude((obj) => altitude(obj as CountryFeature, dataCodes))
    .polygonLabel((obj) => labelHtml(obj as CountryFeature, dataCodes))
    .polygonsTransitionDuration(300)
    .onPolygonClick((obj) => handleClick(obj as CountryFeature, dataCodes, onCountryClick, onNoData));

  globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 });

  resizeToContainer(globe, container);
  const handleResize = () => resizeToContainer(globe, container);
  window.addEventListener('resize', handleResize);

  return {
    destroy(): void {
      window.removeEventListener('resize', handleResize);
    },
  };
}

function resolveCode(feat: CountryFeature): string | undefined {
  const numericId = typeof feat.id === 'string' ? feat.id : String(feat.id ?? '');
  return numericIdToCountry.get(numericId)?.code;
}

function capColor(feat: CountryFeature, dataCodes: Set<string>): string {
  const code = resolveCode(feat);
  return code && dataCodes.has(code) ? HIGHLIGHT_CAP_COLOR : MUTED_CAP_COLOR;
}

function altitude(feat: CountryFeature, dataCodes: Set<string>): number {
  const code = resolveCode(feat);
  return code && dataCodes.has(code) ? HIGHLIGHT_ALTITUDE : MUTED_ALTITUDE;
}

function labelHtml(feat: CountryFeature, dataCodes: Set<string>): string {
  const name = feat.properties?.name ?? 'Unknown';
  const code = resolveCode(feat);
  const hasData = !!code && dataCodes.has(code);
  return `<div class="globe-tooltip"><strong>${name}</strong>${
    hasData ? '' : '<div class="globe-tooltip-muted">No data yet</div>'
  }</div>`;
}

function handleClick(
  feat: CountryFeature,
  dataCodes: Set<string>,
  onCountryClick: CountryClickHandler,
  onNoData?: NoDataHandler,
): void {
  const code = resolveCode(feat);
  if (code && dataCodes.has(code)) {
    onCountryClick(code);
  } else {
    onNoData?.(feat.properties?.name ?? 'this country');
  }
}

function resizeToContainer(globe: GlobeInstance, container: HTMLElement): void {
  globe.width(container.clientWidth);
  globe.height(container.clientHeight);
}
