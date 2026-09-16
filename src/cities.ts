import type { City } from "./types.ts";

const CITIES_PATH = `${Bun.env.HOME ?? "."}/.weather-cli/cities.json`;

async function ensureDir(): Promise<void> {
  const dir = CITIES_PATH.replace(/\/[^/]+$/, "");
  await Bun.$`mkdir -p ${dir}`;
}

export async function loadCities(): Promise<City[]> {
  const file = Bun.file(CITIES_PATH);
  if (await file.exists()) {
    const raw = await file.json();
    return Array.isArray(raw) ? raw : [];
  }
  return [];
}

export async function saveCities(cities: City[]): Promise<void> {
  await ensureDir();
  await Bun.write(CITIES_PATH, JSON.stringify(cities, null, 2));
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