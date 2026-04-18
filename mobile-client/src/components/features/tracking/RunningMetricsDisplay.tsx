/**
 * RunningMetricsDisplay — TabularMetricDisplay featured layout (UX-DR4)
 *
 * Visual hierarchy (top → bottom):
 *   ┌─────────────────────────────────────────────┐
 *   │  PRIMARY: giant distance value + unit badge  │
 *   │  11px label "DISTANCE" below                 │
 *   ├─────────────────────────────────────────────┤
 *   │  SECONDARY ROW:  DURÉE  │  ALLURE /KM       │
 *   └─────────────────────────────────────────────┘
 *
 * All metrics: fontVariant tabular-nums, Inter_600SemiBold, no digit jitter.
 * Accent (coral / cyan) applied to pace + unit badge — draws the eye.
 */
import { View, Text } from 'react-native';

interface Props {
  /** Raw distance in metres */
  distanceMeters: number;
  /** Elapsed seconds */
  durationSeconds: number;
  /** Pace in seconds/km (0 = not yet computable) */
  paceSecsPerKm: number;
  /** Main accent color (coral in light, coral in dark — Running sport color) */
  accentColor: string;
  /** Primary value text color */
  valueColor: string;
  /** Secondary value text color */
  secondaryValueColor: string;
  /** Label text color */
  labelColor: string;
  /** Divider color between primary and secondary sections */
  dividerColor: string;
  /** Card background */
  cardBg: string;
  /** Card outer border */
  cardBorder: string;
}

// ─── Formatting (inline — same logic as lib/format-running.ts) ─────────────

function fmtDistanceValue(m: number): string {
  if (m < 1000) return String(Math.round(m));
  return (m / 1000).toFixed(2);
}

function fmtDistanceUnit(m: number): string {
  return m < 1000 ? 'm' : 'km';
}

function fmtDuration(totalSecs: number): string {
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function fmtPace(secsPerKm: number): string {
  if (secsPerKm <= 0) return "--'--";
  const m = Math.floor(secsPerKm / 60);
  const s = Math.round(secsPerKm % 60);
  return `${m}'${String(s).padStart(2, '0')}"`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function RunningMetricsDisplay({
  distanceMeters,
  durationSeconds,
  paceSecsPerKm,
  accentColor,
  valueColor,
  secondaryValueColor,
  labelColor,
  dividerColor,
  cardBg,
  cardBorder,
}: Props) {
  const distValue = fmtDistanceValue(distanceMeters);
  const distUnit = fmtDistanceUnit(distanceMeters);
  const duration = fmtDuration(durationSeconds);
  const pace = fmtPace(paceSecsPerKm);

  return (
    <View
      style={{
        backgroundColor: cardBg,
        borderBottomWidth: 1,
        borderBottomColor: cardBorder,
      }}
    >
      {/* ── PRIMARY: giant distance ───────────────────────────────────────── */}
      <View
        style={{
          alignItems: 'center',
          paddingTop: 24,
          paddingBottom: 16,
          paddingHorizontal: 24,
        }}
      >
        {/* Value row — number + unit badge bottom-aligned */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
          <Text
            style={{
              fontSize: 72,
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold',
              fontVariant: ['tabular-nums'],
              letterSpacing: -3,
              lineHeight: 76,
              color: valueColor,
            }}
          >
            {distValue}
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold',
              color: accentColor,
              marginBottom: 10,
              letterSpacing: -0.5,
            }}
          >
            {distUnit}
          </Text>
        </View>

        {/* 11px label */}
        <Text
          style={{
            fontSize: 11,
            color: labelColor,
            fontFamily: 'Inter_400Regular',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          Distance
        </Text>
      </View>

      {/* ── Horizontal divider ────────────────────────────────────────────── */}
      <View
        style={{
          height: 1,
          backgroundColor: dividerColor,
          marginHorizontal: 24,
        }}
      />

      {/* ── SECONDARY ROW: duration | pace ───────────────────────────────── */}
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 16,
        }}
      >
        {/* Durée */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            borderRightWidth: 1,
            borderRightColor: dividerColor,
          }}
        >
          <Text
            style={{
              fontSize: 42,
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold',
              fontVariant: ['tabular-nums'],
              letterSpacing: -1.5,
              lineHeight: 46,
              color: secondaryValueColor,
            }}
          >
            {duration}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: labelColor,
              fontFamily: 'Inter_400Regular',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginTop: 4,
            }}
          >
            Durée
          </Text>
        </View>

        {/* Allure */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 42,
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold',
              fontVariant: ['tabular-nums'],
              letterSpacing: -1.5,
              lineHeight: 46,
              color: accentColor,
            }}
          >
            {pace}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: labelColor,
              fontFamily: 'Inter_400Regular',
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginTop: 4,
            }}
          >
            Allure /km
          </Text>
        </View>
      </View>
    </View>
  );
}
