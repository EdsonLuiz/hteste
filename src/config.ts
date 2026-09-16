import type { Config, Unit } from "./types.ts";

const CONFIG_PATH = `${Bun.env.HOME ?? "."}/.weather-cli/config.json`;

const DEFAULT_CONFIG: Config = {
  unit: "celsius",
  defaultCityIndex: null,
};

async function ensureConfigDir(): Promise<void> {
  const dir = CONFIG_PATH.replace(/\/[^/]+$/, "");
  await Bun.$`mkdir -p ${dir}`;
}

export async function loadConfig(): Promise<Config> {
  const file = Bun.file(CONFIG_PATH);
  if (await file.exists()) {
    const raw = await file.json();
    return { ...DEFAULT_CONFIG, ...raw };
  }
  return { ...DEFAULT_CONFIG };
}

export async function saveConfig(config: Config): Promise<void> {
  await ensureConfigDir();
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}

export async function setUnit(unit: Unit): Promise<void> {
  const config = await loadConfig();
  await saveConfig({ ...config, unit });
}

export async function setDefaultCityIndex(index: number): Promise<void> {
  const config = await loadConfig();
  await saveConfig({ ...config, defaultCityIndex: index });
}