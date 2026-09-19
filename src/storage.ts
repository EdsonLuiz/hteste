const CONFIG_DIR = `${Bun.env.HOME ?? "."}/.config/weather-cli`;

let baseDir = CONFIG_DIR;

export function setBaseDir(dir: string): void {
  baseDir = dir;
}

export function getBaseDir(): string {
  return baseDir;
}

export async function ensureDir(dir: string = baseDir): Promise<void> {
  await Bun.$`mkdir -p ${dir}`;
}

export async function loadJson<T>(file: string, fallback: T): Promise<T> {
  const path = `${baseDir}/${file}`;
  const handle = Bun.file(path);
  if (!(await handle.exists())) return fallback;
  const raw = await handle.json();
  return raw === undefined || raw === null ? fallback : (raw as T);
}

export async function saveJson(file: string, data: unknown): Promise<void> {
  await ensureDir();
  await Bun.write(`${baseDir}/${file}`, JSON.stringify(data, null, 2));
}