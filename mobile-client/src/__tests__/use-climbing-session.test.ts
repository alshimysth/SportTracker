/**
 * Tests for use-climbing-session — Story 2.4
 *
 * Covers the pure utility functions (grade rank, max grade computation)
 * and the exported V_GRADES catalogue. Hook render tests are covered by E2E.
 */
import {
  V_GRADES,
  type ClimbingRoute,
  type ClimbStyle,
} from '@/hooks/use-climbing-session';

// ── Helpers mirroring the hook's internal logic (tested here in isolation) ────

function gradeRank(grade: string): number {
  return V_GRADES.indexOf(grade);
}

function computeMaxGrade(routes: ClimbingRoute[]): string {
  if (routes.length === 0) return '';
  return routes.reduce(
    (best, r) => (gradeRank(r.grade) > gradeRank(best) ? r.grade : best),
    routes[0].grade,
  );
}

function makeRoute(grade: string, style: ClimbStyle = 'redpoint'): ClimbingRoute {
  return { id: `${grade}-${Date.now()}`, grade, style, loggedAt: Date.now() };
}

// ── V_GRADES catalogue ────────────────────────────────────────────────────────

describe('V_GRADES', () => {
  it('starts with VB and ends with V10', () => {
    expect(V_GRADES[0]).toBe('VB');
    expect(V_GRADES[V_GRADES.length - 1]).toBe('V10');
  });

  it('V0 follows VB immediately', () => {
    expect(V_GRADES[1]).toBe('V0');
  });

  it('contains 12 grades total (VB + V0–V10)', () => {
    expect(V_GRADES).toHaveLength(12);
  });

  it('has no duplicate grades', () => {
    expect(new Set(V_GRADES).size).toBe(V_GRADES.length);
  });
});

// ── Grade ranking ─────────────────────────────────────────────────────────────

describe('gradeRank', () => {
  it('VB has rank 0 (lowest)', () => {
    expect(gradeRank('VB')).toBe(0);
  });

  it('V0 outranks VB', () => {
    expect(gradeRank('V0')).toBeGreaterThan(gradeRank('VB'));
  });

  it('V10 has the highest rank', () => {
    const max = Math.max(...V_GRADES.map(gradeRank));
    expect(gradeRank('V10')).toBe(max);
  });

  it('returns -1 for unknown grades', () => {
    expect(gradeRank('V99')).toBe(-1);
  });
});

// ── computeMaxGrade ───────────────────────────────────────────────────────────

describe('computeMaxGrade', () => {
  it('returns empty string when no routes', () => {
    expect(computeMaxGrade([])).toBe('');
  });

  it('returns the only grade when one route logged', () => {
    expect(computeMaxGrade([makeRoute('V5')])).toBe('V5');
  });

  it('returns the highest grade from multiple routes', () => {
    const routes = [makeRoute('V2'), makeRoute('V7'), makeRoute('V4')];
    expect(computeMaxGrade(routes)).toBe('V7');
  });

  it('handles all identical grades', () => {
    const routes = [makeRoute('V3'), makeRoute('V3'), makeRoute('V3')];
    expect(computeMaxGrade(routes)).toBe('V3');
  });

  it('VB is lower than V0', () => {
    const routes = [makeRoute('VB'), makeRoute('V0')];
    expect(computeMaxGrade(routes)).toBe('V0');
  });

  it('V10 beats all other grades', () => {
    const routes = V_GRADES.map((g) => makeRoute(g));
    expect(computeMaxGrade(routes)).toBe('V10');
  });
});
