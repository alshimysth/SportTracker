import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';

export interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

export interface RunningMetrics {
  /** Elapsed time in seconds */
  durationSeconds: number;
  /** Total distance in meters */
  distanceMeters: number;
  /** Pace in seconds per km (0 = not yet computable) */
  paceSecsPerKm: number;
  /** Ordered GPS coordinates for the polyline */
  route: RouteCoordinate[];
  /** True once the first GPS fix is received */
  hasGpsLock: boolean;
  /** Permission denied by the user */
  permissionDenied: boolean;
}

/** Haversine distance between two GPS coordinates, in meters */
function haversineDistance(a: RouteCoordinate, b: RouteCoordinate): number {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

const INITIAL_METRICS: RunningMetrics = {
  durationSeconds: 0,
  distanceMeters: 0,
  paceSecsPerKm: 0,
  route: [],
  hasGpsLock: false,
  permissionDenied: false,
};

/**
 * Starts GPS tracking immediately on mount, cleans up on unmount.
 * Uses expo-location watchPositionAsync with BestForNavigation accuracy.
 * Calculates distance incrementally with the Haversine formula.
 */
export function useRunningTracker() {
  const [metrics, setMetrics] = useState<RunningMetrics>(INITIAL_METRICS);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const lastPositionRef = useRef<RouteCoordinate | null>(null);
  const totalDistanceRef = useRef<number>(0);

  const stopTracking = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (locationSubRef.current) {
      locationSubRef.current.remove();
      locationSubRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;

      if (status !== 'granted') {
        setMetrics((m) => ({ ...m, permissionDenied: true }));
        return;
      }

      // ── Timer — ticks every second ──────────────────────────────────────
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setMetrics((m) => ({ ...m, durationSeconds: elapsed }));
      }, 1000);

      // ── GPS watch ───────────────────────────────────────────────────────
      locationSubRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,   // min 2s between updates
          distanceInterval: 5,  // min 5m moved between updates
        },
        (location) => {
          if (cancelled) return;
          const { latitude, longitude } = location.coords;
          const point: RouteCoordinate = { latitude, longitude };

          // Incremental distance
          if (lastPositionRef.current) {
            totalDistanceRef.current += haversineDistance(
              lastPositionRef.current,
              point,
            );
          }
          lastPositionRef.current = point;

          setMetrics((m) => {
            const dist = totalDistanceRef.current;
            const pace =
              dist > 0 && m.durationSeconds > 0
                ? m.durationSeconds / (dist / 1000)
                : 0;
            return {
              ...m,
              route: [...m.route, point],
              distanceMeters: dist,
              paceSecsPerKm: pace,
              hasGpsLock: true,
            };
          });
        },
      );
    }

    start();
    return () => {
      cancelled = true;
      stopTracking();
    };
  }, [stopTracking]);

  return { metrics, stopTracking };
}
