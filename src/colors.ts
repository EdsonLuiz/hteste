export type Color = "cyan" | "yellow" | "green" | "red";

const ANSI: Record<Color, string> = {
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
};

const RESET = "\x1b[0m";

export function paint(text: string, color: Color): string {
  return isTty() ? `${ANSI[color]}${text}${RESET}` : text;
}

export function isTty(): boolean {
  return process.stdout.isTTY === true;
}