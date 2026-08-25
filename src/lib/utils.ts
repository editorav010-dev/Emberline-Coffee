export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Most recent Tuesday before today. */
export function roastDay(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = (day - 2 + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

export function roastDayLabel(): string {
  return roastDay().toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function etaLabel(): string {
  const start = roastDay();
  start.setDate(start.getDate() + 2);
  const end = roastDay();
  end.setDate(end.getDate() + 5);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

export function makeOrderRef(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `EMB-${s}`;
}
