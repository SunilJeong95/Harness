export interface CountryConfig {
  code: string; // ISO alpha-2 (YouTube regionCode)
  name: string;
  continent: string;
  iso3166Numeric: string; // world-atlas polygon id
  xWoeid: number | null; // X/Twitter trends WOEID (null = skip X)
}

export const COUNTRIES: CountryConfig[] = [
  { code: 'US', name: 'United States', continent: 'North America', iso3166Numeric: '840', xWoeid: 23424977 },
  { code: 'CA', name: 'Canada',        continent: 'North America', iso3166Numeric: '124', xWoeid: 23424775 },
  { code: 'MX', name: 'Mexico',        continent: 'North America', iso3166Numeric: '484', xWoeid: 23424900 },
  { code: 'BR', name: 'Brazil',        continent: 'South America', iso3166Numeric: '076', xWoeid: 23424768 },
  { code: 'AR', name: 'Argentina',     continent: 'South America', iso3166Numeric: '032', xWoeid: 23424747 },
  { code: 'GB', name: 'United Kingdom',continent: 'Europe',        iso3166Numeric: '826', xWoeid: 23424975 },
  { code: 'DE', name: 'Germany',       continent: 'Europe',        iso3166Numeric: '276', xWoeid: 23424829 },
  { code: 'FR', name: 'France',        continent: 'Europe',        iso3166Numeric: '250', xWoeid: 23424819 },
  { code: 'ZA', name: 'South Africa',  continent: 'Africa',        iso3166Numeric: '710', xWoeid: 23424942 },
  { code: 'NG', name: 'Nigeria',       continent: 'Africa',        iso3166Numeric: '566', xWoeid: 23424908 },
  { code: 'KR', name: 'South Korea',   continent: 'Asia',          iso3166Numeric: '410', xWoeid: 23424868 },
  { code: 'JP', name: 'Japan',         continent: 'Asia',          iso3166Numeric: '392', xWoeid: 23424856 },
  { code: 'IN', name: 'India',         continent: 'Asia',          iso3166Numeric: '356', xWoeid: 23424848 },
  { code: 'SA', name: 'Saudi Arabia',  continent: 'Asia',          iso3166Numeric: '682', xWoeid: 23424938 },
  { code: 'AU', name: 'Australia',     continent: 'Oceania',       iso3166Numeric: '036', xWoeid: 23424748 },
];
