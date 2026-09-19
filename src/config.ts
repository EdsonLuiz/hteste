import type { Config, Unit } from "./types.ts";
import { loadJson, saveJson } from "./storage.ts";

const CONFIG_FILE = "config.json";

const DEFAULT_CONFIG: Config = {
  unit: "celsius",
  defaultCityIndex: null,
};

export async function loadConfig(): Promise<Config> {
  return { ...DEFAULT_CONFIG, ...(await loadJson<Partial<Config>>(CONFIG_FILE, {})) };
}

export async function saveConfig(config: Config): Promise<void> {
  await saveJson(CONFIG_FILE, config);
}

export async function setUnit(unit: Unit): Promise<void> {
  const config = await loadConfig();
  await saveConfig({ ...config, unit });
}

export async function setDefaultCityIndex(index: number): Promise<void> {
  const config = await loadConfig();
  await saveConfig({ ...config, defaultCityIndex: index });
}