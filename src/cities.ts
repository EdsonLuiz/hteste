import type { City } from "./types.ts";
import { loadJson, saveJson } from "./storage.ts";

const CITIES_FILE = "cities.json";

export async function loadCities(): Promise<City[]> {
  return loadJson<City[]>(CITIES_FILE, []);
}

export async function saveCities(cities: City[]): Promise<void> {
  await saveJson(CITIES_FILE, cities);
}

export async function addCity(city: City): Promise<boolean> {
  const cities = await loadCities();
  const exists = cities.some((c) => c.name === city.name);
  if (exists) return false;
  cities.push(city);
  await saveCities(cities);
  return true;
}

export async function removeCity(index: number): Promise<void> {
  const cities = await loadCities();
  cities.splice(index, 1);
  await saveCities(cities);
}