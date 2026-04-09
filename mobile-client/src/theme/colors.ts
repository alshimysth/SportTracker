/**
 * @file colors.ts
 * @description Single source of truth for SportTracker brand & theme color values.
 *
 * These constants mirror the tokens in `tailwind.config.js` and are intended for
 * use **only** in JS/TS contexts where NativeWind `className` cannot deliver a
 * color value — e.g.:
 *   - `<Ionicons color={colors.primaryCyan} />`
 *   - `<ActivityIndicator color={colors.brandOrange} />`
 *   - `shadowColor` in style objects
 *   - `placeholderTextColor` props
 *
 * For layout/background/text styling, always prefer NativeWind className strings
 * (e.g. `className="bg-darkBg dark:text-darkText"`).
 */

export const colors = {
  // ─── Dark Mode (Midnight Peak) ──────────────────────────────────────────────
  darkBg: '#0B111A',
  darkSurface: '#2A3A54',
  darkSurfaceAlt: '#222E42',
  darkBorder: '#334060',
  darkText: '#F0F6FF',
  darkTextMuted: '#8AABB8',

  // ─── Brand ──────────────────────────────────────────────────────────────────
  brandBlue: '#1C3F60',
  brandOrange: '#FF6B4A',
  brandGreen: '#22C55E',
  primaryCyan: '#38BDF8',

  // ─── Misc utility (not exposed as Tailwind tokens) ──────────────────────────
  /** Hero dark-mode background — slightly lighter than darkBg for depth */
  heroDark: '#0D1E32',
  /** Dark CTA button background */
  ctaDark: '#091828',
  /** Dark placeholder text */
  placeholderDark: '#506070',
} as const;

export type ColorKey = keyof typeof colors;
