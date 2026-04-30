/**
 * use-climbing-session — Story 2.4
 *
 * Manages climbing session state:
 *   - 1-second elapsed timer
 *   - Selected grade (V0–V10) and style (Flash / Redpoint / Tentative)
 *   - Route log (append-only list of logged routes)
 *
 * Cleans up the timer on unmount.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClimbStyle = 'flash' | 'redpoint' | 'tentative';

export interface ClimbingRoute {
  id: string;
  grade: string;        // e.g. "V3"
  style: ClimbStyle;
  loggedAt: number;     // Date.now() timestamp
}

export interface ClimbingMetrics {
  durationSeconds: number;
  selectedGrade: string;
  selectedStyle: ClimbStyle;
  routes: ClimbingRoute[];
  /** Computed max grade logged so far, or '' if none */
  maxGrade: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const V_GRADES = [
  'VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
];

const DEFAULT_GRADE = 'V3';
const DEFAULT_STYLE: ClimbStyle = 'redpoint';

// ─── Grade rank helper ────────────────────────────────────────────────────────

function gradeRank(grade: string): number {
  return V_GRADES.indexOf(grade);
}

function computeMaxGrade(routes: ClimbingRoute[]): string {
  if (routes.length === 0) return '';
  return routes.reduce((best, r) =>
    gradeRank(r.grade) > gradeRank(best) ? r.grade : best,
    routes[0].grade,
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useClimbingSession() {
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState(DEFAULT_GRADE);
  const [selectedStyle, setSelectedStyle] = useState<ClimbStyle>(DEFAULT_STYLE);
  const [routes, setRoutes] = useState<ClimbingRoute[]>([]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start 1-second timer on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDurationSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopSession = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const logRoute = useCallback(() => {
    const route: ClimbingRoute = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      grade: selectedGrade,
      style: selectedStyle,
      loggedAt: Date.now(),
    };
    setRoutes((prev) => [route, ...prev]);
  }, [selectedGrade, selectedStyle]);

  const maxGrade = computeMaxGrade(routes);

  const metrics: ClimbingMetrics = {
    durationSeconds,
    selectedGrade,
    selectedStyle,
    routes,
    maxGrade,
  };

  return {
    metrics,
    setSelectedGrade,
    setSelectedStyle,
    logRoute,
    stopSession,
  };
}
