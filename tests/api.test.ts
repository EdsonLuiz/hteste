import { afterEach, beforeEach, describe, expect, test, mock } from "bun:test";
import { getForecast, getWeather, searchCities } from "../src/api.ts";
import type { City } from "../src/types.ts";

const city: City = {
  name: "Ottawa",
  latitude: 45.41117,
  longitude: -75.69812,
  country: "Canada",
};

const originalFetch = globalThis.fetch;
let lastUrl: URL | undefined;

function mockFetch(handler: (url: URL) => Response): void {
  globalThis.fetch = mock(async (input: Parameters<typeof fetch>[0]) => {
    const url = input instanceof URL ? input : new URL(String(input));
    lastUrl = url;
    return handler(url);
  }) as unknown as typeof fetch;
}

function mockOk(data: unknown): void {
  mockFetch(() => new Response(JSON.stringify(data), { status: 200 }));
}

function mockStatus(status: number): void {
  mockFetch(() => new Response(null, { status }));
}

beforeEach(() => {
  globalThis.fetch = originalFetch;
  lastUrl = undefined;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("searchCities", () => {
  test("maps geocoding results to cities", async () => {
    mockOk({
      results: [
        { name: "Ottawa", latitude: 45.41, longitude: -75.7, country: "Canada", admin1: "Ontario" },
        { name: "Ottawa Lake", latitude: 41.3, longitude: -83.8, country: "USA" },
      ],
    });

    const cities = await searchCities("ottawa");
    expect(cities).toEqual([
      { name: "Ottawa", latitude: 45.41, longitude: -75.7, country: "Canada", admin1: "Ontario" },
      { name: "Ottawa Lake", latitude: 41.3, longitude: -83.8, country: "USA", admin1: undefined },
    ]);
  });

  test("returns empty list when no results", async () => {
    mockOk({});
    expect(await searchCities("zzzz")).toEqual([]);
  });

  test("sends expected query parameters", async () => {
    mockOk({});
    await searchCities("ottawa");

    expect(lastUrl?.searchParams.get("name")).toBe("ottawa");
    expect(lastUrl?.searchParams.get("count")).toBe("5");
  });
});

describe("getWeather", () => {
  test("returns current temperature in celsius", async () => {
    mockOk({ current: { temperature_2m: 21.5, time: "2026-09-16T10:00" } });

    const weather = await getWeather(city, "celsius");
    expect(weather).toEqual({
      city,
      temperature: 21.5,
      unit: "celsius",
      time: "2026-09-16T10:00",
    });
  });

  test("requests fahrenheit when unit is fahrenheit", async () => {
    mockOk({ current: { temperature_2m: 70.7, time: "" } });
    await getWeather(city, "fahrenheit");

    expect(lastUrl?.searchParams.get("temperature_unit")).toBe("fahrenheit");
  });

  test("throws when temperature is missing", async () => {
    mockOk({});
    expect(getWeather(city, "celsius")).rejects.toThrow("No temperature data");
  });

  test("throws on non-ok response", async () => {
    mockStatus(500);
    expect(getWeather(city, "celsius")).rejects.toThrow("Request failed: 500");
  });
});

describe("getForecast", () => {
  const daily = {
    time: [
      "2026-09-16",
      "2026-09-17",
      "2026-09-18",
      "2026-09-19",
      "2026-09-20",
      "2026-09-21",
      "2026-09-22",
    ],
    temperature_2m_max: [22, 24, 18, 15, 10, 12, 14],
    temperature_2m_min: [12, 13, 9, 6, 2, 4, 5],
    weather_code: [0, 2, 61, 71, 95, 45, 3],
  };

  test("maps daily forecast with conditions", async () => {
    mockOk({ daily });

    const forecast = await getForecast(city, "celsius");
    expect(forecast.city).toBe(city);
    expect(forecast.unit).toBe("celsius");
    expect(forecast.days).toHaveLength(7);
    expect(forecast.days[0]).toEqual({ date: "2026-09-16", min: 12, max: 22, condition: "Sunny" });
    expect(forecast.days[1]!.condition).toBe("Cloudy");
    expect(forecast.days[2]!.condition).toBe("Rainy");
    expect(forecast.days[3]!.condition).toBe("Snowy");
    expect(forecast.days[4]!.condition).toBe("Rainy");
    expect(forecast.days[5]!.condition).toBe("Foggy");
  });

  test("requests 7 forecast days", async () => {
    mockOk({ daily });
    await getForecast(city, "celsius");

    expect(lastUrl?.searchParams.get("forecast_days")).toBe("7");
  });

  test("throws when daily data is missing", async () => {
    mockOk({});
    expect(getForecast(city, "celsius")).rejects.toThrow("No forecast data");
  });
});