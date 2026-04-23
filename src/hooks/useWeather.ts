import { useState, useEffect, useRef, useCallback } from 'react';
import type { WeatherData } from '../types';

const WEATHER_REFRESH_MS = 10 * 60 * 1000;
const CACHE_KEY = 'clock_weather_cache';

function wmoToJapanese(code: number): string {
  if (code === 0) return '晴れ';
  if (code <= 2) return '曇り';
  if (code === 3) return '曇り';
  if (code === 45 || code === 48) return '霧';
  if (code >= 51 && code <= 67) return '雨';
  if (code >= 71 && code <= 77) return '雪';
  if (code >= 80 && code <= 82) return '雨';
  if (code === 95) return '雷雨';
  return '不明';
}

function loadCache(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WeatherData;
  } catch {
    return null;
  }
}

function saveCache(data: WeatherData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

const EMPTY: WeatherData = {
  locationName: '',
  weatherText: '',
  temperature: null,
  humidity: null,
  available: false,
};

// 都市名 → 座標（Open-Meteo Geocoding API）
async function geocodeCity(city: string): Promise<{ lat: number; lon: number; name: string } | null> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ja&format=json`
  );
  const json = await res.json();
  const r = json.results?.[0];
  if (!r) return null;
  return { lat: r.latitude, lon: r.longitude, name: r.name };
}

// 座標 → 天気データ
async function fetchWeather(lat: number, lon: number, locationName: string): Promise<WeatherData> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weathercode,temperature_2m,relative_humidity_2m`
  );
  const json = await res.json();
  const current = json.current ?? {};
  return {
    locationName,
    weatherText: wmoToJapanese(current.weathercode ?? -1),
    temperature: current.temperature_2m ?? null,
    humidity: current.relative_humidity_2m ?? null,
    available: true,
  };
}

export function useWeather(city: string): { data: WeatherData; refresh: () => void } {
  const [data, setData] = useState<WeatherData>(loadCache() ?? EMPTY);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    if (!city.trim()) {
      setData(EMPTY);
      return;
    }
    try {
      const geo = await geocodeCity(city.trim());
      if (!geo) return;
      const result = await fetchWeather(geo.lat, geo.lon, geo.name);
      setData(result);
      saveCache(result);
    } catch {
      const c = loadCache();
      if (c) setData(c);
    }
  }, [city]);

  useEffect(() => {
    if (!city.trim()) {
      setData(EMPTY);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    load();
    timerRef.current = setInterval(load, WEATHER_REFRESH_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [city, load]);

  return { data, refresh: load };
}
