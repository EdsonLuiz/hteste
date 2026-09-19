import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rm } from "node:fs/promises";
import { setBaseDir } from "../src/storage.ts";
import { addCity, loadCities, removeCity } from "../src/cities.ts";
import { loadConfig, saveConfig, setDefaultCityIndex, setUnit } from "../src/config.ts";
import type { City } from "../src/types.ts";

const city: City = {
  name: "Ottawa",
  latitude: 45.41117,
  longitude: -75.69812,
  country: "Canada",
  admin1: "Ontario",
};

let dir: string;

beforeEach(() => {
  dir = join(tmpdir(), `weather-cli-test-${crypto.randomUUID()}`);
  setBaseDir(dir);
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe("cities storage", () => {
  test("loads empty list when no file exists", async () => {
    expect(await loadCities()).toEqual([]);
  });

  test("adds a city and persists it", async () => {
    expect(await addCity(city)).toBe(true);
    expect(await loadCities()).toEqual([city]);
  });

  test("rejects duplicate cities", async () => {
    await addCity(city);
    expect(await addCity(city)).toBe(false);
    expect(await loadCities()).toEqual([city]);
  });

  test("removes a city by index", async () => {
    await addCity(city);
    await removeCity(0);
    expect(await loadCities()).toEqual([]);
  });
});

describe("config storage", () => {
  test("returns defaults when no file exists", async () => {
    expect(await loadConfig()).toEqual({ unit: "celsius", defaultCityIndex: null });
  });

  test("saves and reloads config", async () => {
    await saveConfig({ unit: "fahrenheit", defaultCityIndex: 2 });
    expect(await loadConfig()).toEqual({ unit: "fahrenheit", defaultCityIndex: 2 });
  });

  test("setUnit changes only the unit", async () => {
    await setUnit("fahrenheit");
    expect((await loadConfig()).unit).toBe("fahrenheit");
  });

  test("setDefaultCityIndex updates the index", async () => {
    await setDefaultCityIndex(0);
    expect((await loadConfig()).defaultCityIndex).toBe(0);
  });
});