import { create } from 'zustand';

export type SportType = 'running' | 'climbing' | 'weightlifting';

export interface SportConfig {
  label: string;
  subtitle: string;
  icon: string;
  /** Accent color — Alpine Pure (light) */
  color: string;
  /** Accent color — Midnight Peak (dark) */
  colorDark: string;
  /** Icon background — Alpine Pure */
  bgLight: string;
  /** Icon background — Midnight Peak */
  bgDark: string;
}

/** Single source of truth for sport theme tokens (UX-DR2) */
export const SPORT_CONFIG: Record<SportType, SportConfig> = {
  running: {
    label: 'Course à pied',
    subtitle: 'GPS, distance, allure',
    icon: 'walk-outline',
    color: '#FF6B4A',
    colorDark: '#FF6B4A',
    bgLight: '#FFF7F5',
    bgDark: 'rgba(255,107,74,0.10)',
  },
  climbing: {
    label: 'Escalade',
    subtitle: 'Grades, voies, style',
    icon: 'trail-sign-outline',
    color: '#1C3F60',
    colorDark: '#38BDF8',
    bgLight: '#EFF6FF',
    bgDark: 'rgba(56,189,248,0.10)',
  },
  weightlifting: {
    label: 'Musculation',
    subtitle: 'Exercices, sets, poids',
    icon: 'barbell-outline',
    color: '#9333EA',
    colorDark: '#A855F7',
    bgLight: '#FAF5FF',
    bgDark: 'rgba(147,51,234,0.08)',
  },
};

interface SportStore {
  activeSport: SportType | null;
  setActiveSport: (sport: SportType) => void;
  clearActiveSport: () => void;
}

export const useSportStore = create<SportStore>((set) => ({
  activeSport: null,
  setActiveSport: (sport) => set({ activeSport: sport }),
  clearActiveSport: () => set({ activeSport: null }),
}));
