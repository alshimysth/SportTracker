/**
 * Tests for use-weightlifting-session — Story 2.5
 *
 * Covers pure utility functions (volume calculation), the exercise catalogue,
 * and default constants. Hook render tests (timer, steppers) are covered by E2E.
 */
import {
  EXERCISES,
  EXERCISE_CATEGORIES,
  totalVolume,
  type WorkoutSet,
  type ExerciseCategory,
} from '@/hooks/use-weightlifting-session';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSet(reps: number, weight: number, exerciseName = 'Test'): WorkoutSet {
  return {
    id: `${Date.now()}-${Math.random()}`,
    exerciseId: 'test',
    exerciseName,
    reps,
    weight,
    loggedAt: Date.now(),
  };
}

// ── EXERCISES catalogue ───────────────────────────────────────────────────────

describe('EXERCISES catalogue', () => {
  it('contains at least one exercise per category', () => {
    for (const cat of EXERCISE_CATEGORIES) {
      expect(EXERCISES.some((e) => e.category === cat)).toBe(true);
    }
  });

  it('every exercise has a non-empty id and name', () => {
    for (const e of EXERCISES) {
      expect(e.id.trim()).not.toBe('');
      expect(e.name.trim()).not.toBe('');
    }
  });

  it('all ids are unique', () => {
    const ids = EXERCISES.map((e) => e.id);
    expect(new Set(ids).size).toBe(EXERCISES.length);
  });

  it('Développé couché is the first exercise (default)', () => {
    expect(EXERCISES[0].name).toBe('Développé couché');
    expect(EXERCISES[0].category).toBe('Push');
  });

  it('contains Push, Pull, Leg, Full Body as categories', () => {
    const cats = new Set<ExerciseCategory>(EXERCISES.map((e) => e.category));
    expect(cats.has('Push')).toBe(true);
    expect(cats.has('Pull')).toBe(true);
    expect(cats.has('Leg')).toBe(true);
    expect(cats.has('Full Body')).toBe(true);
  });
});

describe('EXERCISE_CATEGORIES', () => {
  it('has exactly 4 categories', () => {
    expect(EXERCISE_CATEGORIES).toHaveLength(4);
  });

  it('Push comes before Pull which comes before Leg', () => {
    const push = EXERCISE_CATEGORIES.indexOf('Push');
    const pull = EXERCISE_CATEGORIES.indexOf('Pull');
    const leg  = EXERCISE_CATEGORIES.indexOf('Leg');
    expect(push).toBeLessThan(pull);
    expect(pull).toBeLessThan(leg);
  });
});

// ── totalVolume ───────────────────────────────────────────────────────────────

describe('totalVolume', () => {
  it('returns 0 for empty set list', () => {
    expect(totalVolume([])).toBe(0);
  });

  it('returns reps × weight for a single set', () => {
    expect(totalVolume([makeSet(8, 60)])).toBe(480);
  });

  it('sums volume across all sets', () => {
    const sets = [makeSet(8, 60), makeSet(10, 50), makeSet(5, 100)];
    // 480 + 500 + 500 = 1480
    expect(totalVolume(sets)).toBe(1480);
  });

  it('handles bodyweight sets (weight = 0)', () => {
    expect(totalVolume([makeSet(10, 0)])).toBe(0);
  });

  it('handles fractional weights (2.5kg plates)', () => {
    expect(totalVolume([makeSet(8, 62.5)])).toBeCloseTo(500);
  });

  it('handles high volume correctly', () => {
    // 10 sets × 10 reps × 100kg = 10000kg
    const sets = Array.from({ length: 10 }, () => makeSet(10, 100));
    expect(totalVolume(sets)).toBe(10000);
  });
});
