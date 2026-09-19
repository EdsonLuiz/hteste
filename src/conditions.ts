import type { Condition } from "./types.ts";

export function conditionFromWeatherCode(code: number): Condition {
  if (code === 0) return "Sunny";
  if (code === 1 || code === 2 || code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 67) return "Rainy";
  if (code >= 71 && code <= 86) return "Snowy";
  if (code >= 95 && code <= 99) return "Rainy";
  return "Cloudy";
}