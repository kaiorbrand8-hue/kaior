const COLOR_AR: Record<string, string> = {
  Navy: "كحلي",
  White: "أبيض",
  Black: "أسود",
  Charcoal: "رمادي غامق",
  Beige: "بيج",
  Camel: "جملي",
  Brown: "بني",
  Gold: "ذهبي",
  "Sky Blue": "أزرق سماوي",
};

export function translateColor(color: string, locale: "en" | "ar"): string {
  if (locale === "en") return color;
  return COLOR_AR[color] || color;
}
