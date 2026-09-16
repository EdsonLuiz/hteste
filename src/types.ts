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

export interface Config {
  unit: Unit;
  defaultCityIndex: number | null;
}
