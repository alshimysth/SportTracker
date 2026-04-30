/**
 * use-weightlifting-session — Story 2.5
 *
 * Manages weightlifting session state:
 *   - 1-second elapsed timer
 *   - Selected exercise (from curated list, organised by category)
 *   - Current reps and weight (kg) with step adjusters
 *   - Set log (append-only)
 *   - Rest timer — 90s auto-countdown after each logged set
 *
 * Cleans up both timers on unmount.
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExerciseCategory = 'Push' | 'Pull' | 'Leg' | 'Full Body';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  reps: number;
  weight: number;
  loggedAt: number;
}

export interface WorkoutMetrics {
  durationSeconds: number;
  selectedExercise: Exercise;
  currentReps: number;
  currentWeight: number;
  sets: WorkoutSet[];
  totalVolume: number;
  restSecondsLeft: number | null;
}

// ─── Exercise catalogue ───────────────────────────────────────────────────────

export const EXERCISES: Exercise[] = [
  // Push
  { id: 'bench-press',    name: 'Développé couché',   category: 'Push' },
  { id: 'ohp',            name: 'Développé épaule',   category: 'Push' },
  { id: 'incline-press',  name: 'Développé incliné',  category: 'Push' },
  { id: 'dips',           name: 'Dips',               category: 'Push' },
  { id: 'push-up',        name: 'Pompes',             category: 'Push' },
  // Pull
  { id: 'pull-up',        name: 'Tractions',          category: 'Pull' },
  { id: 'deadlift',       name: 'Soulevé de terre',   category: 'Pull' },
  { id: 'row',            name: 'Tirage horizontal',  category: 'Pull' },
  { id: 'lat-pulldown',   name: 'Tirage vertical',    category: 'Pull' },
  { id: 'curl',           name: 'Curl biceps',        category: 'Pull' },
  // Leg
  { id: 'squat',          name: 'Squat',              category: 'Leg' },
  { id: 'rdl',            name: 'Soulevé jambes tendues', category: 'Leg' },
  { id: 'leg-press',      name: 'Presse à cuisses',   category: 'Leg' },
  { id: 'lunge',          name: 'Fentes',             category: 'Leg' },
  { id: 'calf-raise',     name: 'Mollets',            category: 'Leg' },
  // Full Body
  { id: 'clean',          name: 'Épaulé-jeté',        category: 'Full Body' },
  { id: 'thruster',       name: 'Thruster',           category: 'Full Body' },
  { id: 'burpee',         name: 'Burpees',            category: 'Full Body' },
];

export const EXERCISE_CATEGORIES: ExerciseCategory[] = ['Push', 'Pull', 'Leg', 'Full Body'];

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_EXERCISE = EXERCISES[0];
const DEFAULT_REPS     = 8;
const DEFAULT_WEIGHT   = 60;
const WEIGHT_STEP      = 2.5;
const REST_DURATION    = 90;

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function totalVolume(sets: WorkoutSet[]): number {
  return sets.reduce((acc, s) => acc + s.reps * s.weight, 0);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWeightliftingSession() {
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(DEFAULT_EXERCISE);
  const [currentReps, setCurrentReps]     = useState(DEFAULT_REPS);
  const [currentWeight, setCurrentWeight] = useState(DEFAULT_WEIGHT);
  const [sets, setSets]                   = useState<WorkoutSet[]>([]);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const restRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  // Session timer
  useEffect(() => {
    timerRef.current = setInterval(() => setDurationSeconds((s) => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const stopSession = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (restRef.current)  { clearInterval(restRef.current);  restRef.current  = null; }
  }, []);

  // ── Rest timer ─────────────────────────────────────────────────────────────

  const startRest = useCallback(() => {
    if (restRef.current) clearInterval(restRef.current);
    setRestSecondsLeft(REST_DURATION);
    restRef.current = setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(restRef.current!);
          restRef.current = null;
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const dismissRest = useCallback(() => {
    if (restRef.current) { clearInterval(restRef.current); restRef.current = null; }
    setRestSecondsLeft(null);
  }, []);

  // ── Set logging ────────────────────────────────────────────────────────────

  const logSet = useCallback(() => {
    const entry: WorkoutSet = {
      id:           `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      exerciseId:   selectedExercise.id,
      exerciseName: selectedExercise.name,
      reps:         currentReps,
      weight:       currentWeight,
      loggedAt:     Date.now(),
    };
    setSets((prev) => [entry, ...prev]);
    startRest();
  }, [selectedExercise, currentReps, currentWeight, startRest]);

  // ── Steppers ───────────────────────────────────────────────────────────────

  const adjustReps   = useCallback((d: number) => setCurrentReps((r) => Math.max(1, r + d)), []);
  const adjustWeight = useCallback((d: number) =>
    setCurrentWeight((w) => Math.max(0, parseFloat((w + d).toFixed(1)))), []);

  // ── Derived state ──────────────────────────────────────────────────────────

  const metrics: WorkoutMetrics = {
    durationSeconds,
    selectedExercise,
    currentReps,
    currentWeight,
    sets,
    totalVolume: totalVolume(sets),
    restSecondsLeft,
  };

  return {
    metrics,
    setSelectedExercise,
    adjustReps,
    adjustWeight,
    weightStep: WEIGHT_STEP,
    logSet,
    dismissRest,
    stopSession,
  };
}
