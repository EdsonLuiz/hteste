import type { City, Forecast, Unit, Weather } from "./types.ts";
import { conditionFromWeatherCode } from "./conditions.ts";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

interface GeoResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

interface GeoResponse {
  results?: GeoResult[];
}

interface CurrentResponse {
  temperature_2m?: number;
  time?: string;
}

interface DailyResponse {
  time?: string[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  weather_code?: number[];
}

interface ForecastResponse {
  current?: CurrentResponse;
  daily?: DailyResponse;
}

async function fetchJson(url: URL): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return (await response.json()) as unknown;
}

export async function searchCities(query: string): Promise<City[]> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", query);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const data = (await fetchJson(url)) as GeoResponse;
  return (data.results ?? []).map((result) => ({
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1,
  }));
}

function buildForecastUrl(city: City, unit: Unit): URL {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", city.latitude.toString());
  url.searchParams.set("longitude", city.longitude.toString());
  url.searchParams.set("temperature_unit", unit === "fahrenheit" ? "fahrenheit" : "celsius");
  return url;
}

export async function getWeather(city: City, unit: Unit): Promise<Weather> {
  const url = buildForecastUrl(city, unit);
  url.searchParams.set("current", "temperature_2m");

  const data = (await fetchJson(url)) as ForecastResponse;
  const temperature = data.current?.temperature_2m;
  if (temperature === undefined) throw new Error("No temperature data available");

  return {
    city,
    temperature,
    unit,
    time: data.current?.time ?? "",
  };
}

export async function getForecast(city: City, unit: Unit): Promise<Forecast> {
  const url = buildForecastUrl(city, unit);
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  const data = (await fetchJson(url)) as ForecastResponse;
  const { time, temperature_2m_max, temperature_2m_min, weather_code } = data.daily ?? {};
  if (!time || !temperature_2m_max || !temperature_2m_min || !weather_code) {
    throw new Error("No forecast data available");
  }

  const days = time.map((date, i) => ({
    date,
    min: temperature_2m_min[i] ?? 0,
    max: temperature_2m_max[i] ?? 0,
    condition: conditionFromWeatherCode(weather_code[i] ?? 0),
  }));

  return { city, unit, days };
}