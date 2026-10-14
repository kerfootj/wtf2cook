export function featuredLabelForHour(hour: number): string {
  if (hour >= 5 && hour < 11) return "Breakfast? F*ck yeah.";
  if (hour >= 11 && hour < 16) return "Lunch? Let’s f*cking eat.";
  if (hour >= 16 && hour < 22) return "What the f*ck's for dinner?";
  return "Midnight munchies? Obviously.";
}
