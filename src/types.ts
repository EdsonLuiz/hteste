export type Unit = "celsius" | "fahrenheit";

export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface Weather {
  city: City;
  temperature: number;
  unit: Unit;
  time: string;
}

export type Condition = "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Foggy";

export interface DailyForecast {
  date: string;
  min: number;
  max: number;
  condition: Condition;
}

export interface Forecast {
  city: City;
  unit: Unit;
  days: DailyForecast[];
}

export interface Config {
  unit: Unit;
  defaultCityIndex: number | null;
}
