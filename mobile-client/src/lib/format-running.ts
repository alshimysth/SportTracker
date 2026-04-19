/**
 * Formatting helpers for running metrics.
 * Shared between the live tracking screen and the session summary card.
 */

/** Returns display value + unit separately so they can be styled differently */
export function formatDistance(meters: number): { value: string; unit: string } {
  if (meters < 1000) return { value: String(Math.round(meters)), unit: 'm' };
  return { value: (meters / 1000).toFixed(2), unit: 'km' };
}

/** 512 s → "08:32" */
export function formatDuration(totalSecs: number): string {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** 330 s/km → "5'30"" — returns "--'--" until pace is computable */
export function formatPace(secsPerKm: number): string {
  if (secsPerKm <= 0) return "--'--";
  const m = Math.floor(secsPerKm / 60);
  const s = Math.round(secsPerKm % 60);
  return `${m}'${String(s).padStart(2, '0')}"`;
}
