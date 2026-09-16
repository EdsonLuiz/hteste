import type { Unit, Weather } from "./types.ts";

const LINE = "═".repeat(39);
const WIDTH = 39;

export function showMenu(cityCount: number, unit: Unit): void {
  const unitLabel = unit === "celsius" ? "°C" : "°F";
  console.clear();
  console.log(LINE);
  console.log("          WEATHER CLI");
  console.log(LINE);
  console.log(`  1. Default city weather`);
  console.log(`  2. Weather for all cities (${cityCount})`);
  console.log(`  3. Search and add city`);
  console.log(`  4. Remove city`);
  console.log(`  5. Set default city`);
  console.log(`  8. Settings (${unitLabel})`);
  console.log(`  9. Exit`);
  console.log(LINE);
}

export function askOption(): string | null {
  const answer = prompt("  Select an option:");
  return answer?.trim() ?? null;
}

export function askCityName(): string {
  const answer = prompt("  Enter city name:");
  return answer?.trim() ?? "";
}

export function askYesNo(): boolean {
  const answer = prompt("  Confirm? (y/n):");
  return answer?.trim().toLowerCase() === "y";
}

export function displayWeather(weather: Weather): void {
  const { city, temperature, unit, time } = weather;
  const unitLabel = unit === "celsius" ? "°C" : "°F";
  const location = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
  console.log(LINE);
  console.log(`  ${location}`);
  console.log(`  ${temperature.toFixed(1)} ${unitLabel}  (${time})`);
  console.log(LINE);
}

export function displayError(message: string): void {
  console.log(`  ⚠ ${message}`);
}

export function displayMessage(message: string): void {
  console.log(`  ${message}`);
}

export function pressToContinue(): void {
  prompt("  Press Enter to continue...");
}