import { useState, useEffect, useRef, useCallback } from 'react';
import type { WeatherData } from '../types';

const WEATHER_REFRESH_MS = 10 * 60 * 1000;
const STORAGE_KEY = 'clock_weather_cache';

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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WeatherData;
  } catch {
    return null;
  }
}

function saveCache(data: WeatherData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const [geoRes, weatherRes] = await Promise.all([
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ja`
    ),
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weathercode,temperature_2m,relative_humidity_2m`
    ),
  ]);

  const geoJson = await geoRes.json();
  const weatherJson = await weatherRes.json();

  const address = geoJson.address ?? {};
  const locationName =
    address.city ?? address.town ?? address.village ?? address.county ?? '不明';

  const current = weatherJson.current ?? {};
  const weatherText = wmoToJapanese(current.weathercode ?? -1);
  const temperature: number | null = current.temperature_2m ?? null;
  const humidity: number | null = current.relative_humidity_2m ?? null;

  return { locationName, weatherText, temperature, humidity, available: true };
}

const EMPTY: WeatherData = {
  locationName: '',
  weatherText: '',
  temperature: null,
  humidity: null,
  available: false,
};

// navigator.geolocation で位置取得
function getBrowserPosition(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 }
    );
  });
}

// IPアドレスから位置取得（フォールバック）
async function getIpPosition(): Promise<{ lat: number; lon: number } | null> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const json = await res.json();
    if (json.latitude && json.longitude) {
      return { lat: json.latitude, lon: json.longitude };
    }
  } catch {
    // ignore
  }
  return null;
}

async function getPosition(): Promise<{ lat: number; lon: number } | null> {
  // まずブラウザAPIを試す
  const browserPos = await getBrowserPosition();
  if (browserPos) return browserPos;
  // フォールバック: IPベースの位置取得
  return getIpPosition();
}

export function useWeather(enabled: boolean): { data: WeatherData; refresh: () => void } {
  const cached = loadCache();
  const [data, setData] = useState<WeatherData>(cached ?? EMPTY);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    const coords = await getPosition();
    if (!coords) {
      const c = loadCache();
      if (c) setData(c);
      return;
    }
    try {
      const result = await fetchWeather(coords.lat, coords.lon);
      setData(result);
      saveCache(result);
    } catch {
      const c = loadCache();
      if (c) setData(c);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setData(EMPTY);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    load();
    timerRef.current = setInterval(load, WEATHER_REFRESH_MS);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, load]);

  return { data, refresh: load };
}
