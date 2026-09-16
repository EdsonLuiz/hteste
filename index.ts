import { getWeather, searchCities } from "./src/api.ts";
import { addCity, loadCities, removeCity } from "./src/cities.ts";
import { loadConfig, saveConfig, setUnit } from "./src/config.ts";
import type { City } from "./src/types.ts";
import { askCityName, askOption, askYesNo, displayError, displayMessage, displayWeather, pressToContinue, showMenu } from "./src/ui.ts";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function showWeatherForCity(city: City | null): Promise<void> {
  if (!city) {
    displayMessage("No city configured. Use option 3 to add a city.");
    return;
  }
  try {
    const config = await loadConfig();
    const weather = await getWeather(city, config.unit);
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
      const weather = await getWeather(city, config.unit);
      displayWeather(weather);
    } catch (error) {
      displayError(`${city.name}: ${errorMessage(error)}`);
    }
  }
}

function formatCity(city: City, index: number): string {
  const location = [city.admin1, city.country].filter(Boolean).join(", ");
  return `  ${index}. ${city.name}${location ? ` (${location})` : ""}`;
}

async function searchAndAddCity(): Promise<void> {
  const query = askCityName();
  if (!query) return;

  try {
    const results = await searchCities(query);
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
    if (chosen.country) {
      console.log(`  ${chosen.name} (${chosen.country})`);
    }
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
  while (true) {
    const config = await loadConfig();
    const cities = await loadCities();
    showMenu(cities.length, config.unit);

    const option = askOption();
    if (option === null) {
      displayMessage("Goodbye!");
      return;
    }
    switch (option) {
      case "1": {
        const city = config.defaultCityIndex !== null ? cities[config.defaultCityIndex] : null;
        await showWeatherForCity(city ?? null);
        break;
      }
      case "2":
        await weatherForAllCities();
        break;
      case "3":
        await searchAndAddCity();
        break;
      case "4":
        await removeCityFlow();
        break;
      case "5":
        await setDefaultCityFlow();
        break;
      case "8":
        await settingsFlow();
        break;
      case "9":
        displayMessage("Goodbye!");
        return;
      default:
        displayError("Invalid option.");
    }

    pressToContinue();
  }
}

await run();