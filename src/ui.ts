import type { Forecast, Weather } from "./types.ts";
import { isTty, paint } from "./colors.ts";

const LINE = "═".repeat(39);

export interface MenuAction {
  key: string;
  label: string;
  run: () => Promise<void> | void;
}

export function showMenu(actions: MenuAction[]): void {
  console.clear();
  console.log(paint(LINE, "cyan"));
  console.log(paint("          WEATHER CLI", "cyan"));
  console.log(paint(LINE, "cyan"));
  for (const action of actions) {
    console.log(`  ${action.key}. ${action.label}`);
  }
  console.log(paint(LINE, "cyan"));
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
  console.log(paint(LINE, "cyan"));
  console.log(`  ${location}`);
  console.log(`  ${paint(`${temperature.toFixed(1)} ${unitLabel}`, "yellow")}  (${time})`);
  console.log(paint(LINE, "cyan"));
}

export function displayError(message: string): void {
  console.log(paint(`  ⚠ ${message}`, "red"));
}

export function displayForecast(forecast: Forecast): void {
  const { city, unit, days } = forecast;
  const unitLabel = unit === "celsius" ? "°C" : "°F";
  const location = [city.name, city.admin1, city.country].filter(Boolean).join(", ");
  console.log(paint(LINE, "cyan"));
  console.log(`  ${location} — 7-day forecast`);
  for (const day of days) {
    const dayOfMonth = new Date(day.date).getDate();
    const temps = paint(`${day.min.toFixed(0)}°/${day.max.toFixed(0)}${unitLabel}`, "yellow");
    console.log(`  ${dayOfMonth} - ${temps} - ${day.condition}`);
  }
  console.log(paint(LINE, "cyan"));
}

export function displayMessage(message: string): void {
  console.log(paint(`  ${message}`, "green"));
}

export function pressToContinue(): void {
  prompt("  Press Enter to continue...");
}

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export async function withLoading<T>(label: string, task: () => Promise<T>): Promise<T> {
  if (!isTty()) return task();
  let frame = 0;
  const started = performance.now();
  process.stdout.write(`  ${label}... `);
  const timer = setInterval(() => {
    process.stdout.write(`\r  ${label}... ${SPINNER_FRAMES[frame++ % SPINNER_FRAMES.length]} `);
  }, 80);
  try {
    return await task();
  } finally {
    clearInterval(timer);
    const ms = Math.round(performance.now() - started);
    process.stdout.write(`\r  ${label}... done (${ms}ms)\n`);
  }
}