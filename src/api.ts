import type { City, Unit, Weather } from "./types.ts";

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

interface ForecastResponse {
  current?: {
    temperature_2m?: number;
    time?: string;
  };
}

export async function searchCities(query: string): Promise<City[]> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", query);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Geocoding request failed: ${response.status}`);

  const data = (await response.json()) as GeoResponse;
  return (data.results ?? []).map((result) => ({
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country,
    admin1: result.admin1,
  }));
}

export async function getWeather(city: City, unit: Unit): Promise<Weather> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", city.latitude.toString());
  url.searchParams.set("longitude", city.longitude.toString());
  url.searchParams.set("current", "temperature_2m");
  url.searchParams.set("temperature_unit", unit === "fahrenheit" ? "fahrenheit" : "celsius");

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Forecast request failed: ${response.status}`);

  const data = (await response.json()) as ForecastResponse;
  const temperature = data.current?.temperature_2m;
  if (temperature === undefined) throw new Error("No temperature data available");

  return {
    city,
    temperature,
    unit,
    time: data.current?.time ?? "",
  };
}