import type { Locale } from "./dictionary";

export function localizeField<T extends Record<string, unknown>>(
  entity: T,
  field: string,
  locale: Locale
): string {
  const base = String(entity[field] ?? "");
  if (locale === "en") return base;
  const arField = `${field}Ar`;
  const arValue = entity[arField];
  return typeof arValue === "string" && arValue.trim() ? arValue : base;
}
