export function formatDuration(minutes: number): string {
  if (minutes <= 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} ${hours === 1 ? "hr" : "hrs"}${remainingMinutes ? ` ${remainingMinutes} min` : ""}`;
}

export function formatCompactDuration(minutes: number): string {
  if (minutes <= 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${remainingMinutes ? ` ${remainingMinutes}m` : ""}`;
}
