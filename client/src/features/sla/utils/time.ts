/**
 * Convert minutes to a human-readable format
 * Examples:
 * - 60 → "60 min (1h)"
 * - 120 → "120 min (2h)"
 * - 90 → "90 min (1.5h)"
 * - 1440 → "1440 min (1d)"
 * - 30 → "30 min"
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = minutes / 60;
  
  if (minutes < 1440) {
    // Less than a day
    if (Number.isInteger(hours)) {
      return `${minutes} min (${hours}h)`;
    }
    return `${minutes} min (${hours.toFixed(1)}h)`;
  }

  const days = minutes / 1440;
  if (Number.isInteger(days)) {
    return `${minutes} min (${days}d)`;
  }
  return `${minutes} min (${days.toFixed(1)}d)`;
}
