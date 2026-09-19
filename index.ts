import { getForecast, getWeather, searchCities } from "./src/api.ts";
import { addCity, loadCities, removeCity } from "./src/cities.ts";
import { loadConfig, saveConfig, setUnit } from "./src/config.ts";
import type { City, Config } from "./src/types.ts";
import {
  askCityName,
  askOption,
  askYesNo,
  displayError,
  displayForecast,
  displayMessage,
  displayWeather,
  pressToContinue,
  showMenu,
  withLoading,
  type MenuAction,
} from "./src/ui.ts";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function defaultCity(cities: City[], config: Config): City | null {
  return config.defaultCityIndex !== null ? (cities[config.defaultCityIndex] ?? null) : null;
}

function cityLabel(city: City): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(", ");
}

function formatCity(city: City, index: number): string {
  const location = [city.admin1, city.country].filter(Boolean).join(", ");
  return `  ${index}. ${city.name}${location ? ` (${location})` : ""}`;
}

async function showWeatherForCity(city: City | null): Promise<void> {
  if (!city) {
    displayMessage("No city configured. Use option 3 to add a city.");
    return;
  }
  try {
    const config = await loadConfig();
    const weather = await withLoading("Fetching weather", () => getWeather(city, config.unit));
    displayWeather(weather);
  } catch (error) {
    displayError(errorMessage(error));
  }
}

async function weatherForAllCities(): Promise<void> {
  const cities = await loadCities();
  if (cities.length === 0) {
    displayMessage("No cities registered. Use option 3 to add a city.");
    return;
  }
  const config = await loadConfig();
  for (const city of cities) {
    try {
      const weather = await withLoading(`Fetching weather for ${city.name}`, () => getWeather(city, config.unit));
      displayWeather(weather);
    } catch (error) {
      displayError(`${city.name}: ${errorMessage(error)}`);
    }
  }
}

async function showForecastForCity(city: City | null): Promise<void> {
  if (!city) {
    displayMessage("No city configured. Use option 3 to add a city.");
    return;
  }
  try {
    const config = await loadConfig();
    const forecast = await withLoading("Fetching 7-day forecast", () => getForecast(city, config.unit));
    displayForecast(forecast);
  } catch (error) {
    displayError(errorMessage(error));
  }
}

async function forecastForAllCities(): Promise<void> {
  const cities = await loadCities();
  if (cities.length === 0) {
    displayMessage("No cities registered. Use option 3 to add a city.");
    return;
  }
  const config = await loadConfig();
  for (const city of cities) {
    try {
      const forecast = await withLoading(`Fetching 7-day forecast for ${city.name}`, () => getForecast(city, config.unit));
      displayForecast(forecast);
    } catch (error) {
      displayError(`${city.name}: ${errorMessage(error)}`);
    }
  }
}

async function searchAndAddCity(): Promise<void> {
  const query = askCityName();
  if (!query) return;

  try {
    const results = await withLoading("Searching cities", () => searchCities(query));
    if (results.length === 0) {
      displayMessage("No city found.");
      return;
    }

    console.log("  Results:");
    results.forEach((city, i) => console.log(formatCity(city, i + 1)));
    const answer = prompt("  Select a city (1-5, 0 to cancel):");
    const selection = parseInt(answer ?? "", 10);

    if (selection < 1 || selection > results.length) {
      displayMessage("Invalid selection.");
      return;
    }

    const chosen = results[selection - 1]!;
    console.log(`  ${cityLabel(chosen)}`);
    if (askYesNo()) {
      if (await addCity(chosen)) {
        displayMessage(`Added "${chosen.name}" to your cities.`);
      } else {
        displayMessage(`"${chosen.name}" is already registered.`);
      }
    }
  } catch (error) {
    displayError(errorMessage(error));
  }
}

async function removeCityFlow(): Promise<void> {
  const cities = await loadCities();
  if (cities.length === 0) {
    displayMessage("No cities registered.");
    return;
  }

  console.log("  Your cities:");
  cities.forEach((city, i) => console.log(formatCity(city, i + 1)));
  const answer = prompt("  Select a city to remove (0 to cancel):");
  const selection = parseInt(answer ?? "", 10);

  if (selection < 1 || selection > cities.length) return;

  const removed = cities[selection - 1]!;
  await removeCity(selection - 1);
  displayMessage(`Removed "${removed.name}".`);
}

async function setDefaultCityFlow(): Promise<void> {
  const cities = await loadCities();
  if (cities.length === 0) {
    displayMessage("No cities registered. Use option 3 to add a city.");
    return;
  }

  console.log("  Your cities:");
  cities.forEach((city, i) => console.log(formatCity(city, i + 1)));
  const answer = prompt("  Select default city (0 to cancel):");
  const selection = parseInt(answer ?? "", 10);

  if (selection < 1 || selection > cities.length) return;

  const config = await loadConfig();
  await saveConfig({ ...config, defaultCityIndex: selection - 1 });
  displayMessage(`Default city set to "${cities[selection - 1]!.name}".`);
}

async function settingsFlow(): Promise<void> {
  const config = await loadConfig();
  const current = config.unit === "celsius" ? "°C" : "°F";
  const newUnit = config.unit === "celsius" ? "fahrenheit" : "celsius";
  const newLabel = newUnit === "celsius" ? "°C" : "°F";

  console.log(`  Current unit: ${current}`);
  console.log(`  Switch to ${newLabel}?`);
  if (askYesNo()) {
    await setUnit(newUnit);
    displayMessage(`Unit changed to ${newLabel}.`);
  }
}

async function run(): Promise<void> {
  let running = true;

  while (running) {
    const config = await loadConfig();
    const cities = await loadCities();
    const city = defaultCity(cities, config);
    const unitLabel = config.unit === "celsius" ? "°C" : "°F";

    const actions: MenuAction[] = [
      { key: "1", label: "Default city weather", run: () => showWeatherForCity(city) },
      { key: "2", label: `Weather for all cities (${cities.length})`, run: weatherForAllCities },
      { key: "3", label: "Search and add city", run: searchAndAddCity },
      { key: "4", label: "Remove city", run: removeCityFlow },
      { key: "5", label: "Set default city", run: setDefaultCityFlow },
      { key: "6", label: "7-day forecast (default)", run: () => showForecastForCity(city) },
      { key: "7", label: "7-day forecast (all cities)", run: forecastForAllCities },
      { key: "8", label: `Settings (${unitLabel})`, run: settingsFlow },
      { key: "9", label: "Exit", run: () => { running = false; } },
    ];

    showMenu(actions);

    const option = askOption();
    if (option === null) {
      running = false;
      continue;
    }

    const action = actions.find((a) => a.key === option);
    if (action === undefined) {
      displayError("Invalid option.");
    } else {
      await action.run();
    }

    if (running) pressToContinue();
  }

  displayMessage("Goodbye!");
}

await run();