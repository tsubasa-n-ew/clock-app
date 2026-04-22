export type FontWeight = 'thin' | 'light' | 'regular' | 'medium' | 'bold';
export type ColorMode = 'light' | 'dark';

export interface Settings {
  fontWeight: FontWeight;
  colorMode: ColorMode;
}

export interface WeatherData {
  locationName: string;
  weatherText: string;
  temperature: number | null;
  humidity: number | null;
  available: boolean;
}
