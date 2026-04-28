/**
 * Weightlifting tracking screen — Story 2.5
 *
 * Layout (top → bottom):
 *   1. Compact purple header  — sport label + discard button
 *   2. Session timer          — elapsed HH:MM:SS (tabular-nums)
 *   3. ExercisePicker         — category tabs + exercise chips
 *   4. SetInputRow            — reps [−/+] and weight [−/+] steppers
 *   5. "Logger la série" CTA  — 64px primary button (UX-DR10)
 *   6. Rest timer card        — 90s auto-countdown, dismissible (conditional)
 *   7. WorkoutLogPanel        — append-only set list + total volume
 *   8. HoldToFinishButton     — 1.5s hold, SVG ring, haptics (UX-DR3)
 */
import { View, Text, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import { SPORT_CONFIG } from '@/store/use-sport-store';
import {
  useWeightliftingSession,
  EXERCISES,
  EXERCISE_CATEGORIES,
} from '@/hooks/use-weightlifting-session';
import { ExercisePicker } from '@/components/features/tracking/ExercisePicker';
import { SetInputRow } from '@/components/features/tracking/SetInputRow';
import { WorkoutLogPanel } from '@/components/features/tracking/WorkoutLogPanel';
import { HoldToFinishButton } from '@/components/features/tracking/HoldToFinishButton';

// ─── Timer formatter ──────────────────────────────────────────────────────────

function fmtDuration(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function WeightliftingScreen() {
  const isDark = useColorScheme() === 'dark';
  const {
    metrics,
    setSelectedExercise,
    adjustReps,
    adjustWeight,
    weightStep,
    logSet,
    dismissRest,
    stopSession,
  } = useWeightliftingSession();

  // ── Design tokens (Musculation: purple) ───────────────────────────────────
  const sportCfg  = SPORT_CONFIG.weightlifting;
  const accent    = isDark ? sportCfg.colorDark  : sportCfg.color;
  const accentBg  = isDark ? sportCfg.bgDark     : sportCfg.bgLight;
  const bg        = isDark ? colors.darkBg        : '#F8F9FA';
  const cardBg    = isDark ? colors.darkSurfaceAlt : '#FFFFFF';
  const cardBg2   = isDark ? colors.darkSurface    : '#F8F9FA';
  const cardBorder= isDark ? colors.darkBorder     : '#F3F4F6';
  const textPrimary = isDark ? colors.darkText     : '#1E293B';
  const textMuted   = isDark ? colors.placeholderDark : '#94A3B8';
  const chipBg    = isDark ? colors.darkSurface    : '#F1F5F9';

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleDiscard() {
    Alert.alert(
      'Abandonner la séance ?',
      'Tes séries non sauvegardées seront perdues.',
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Abandonner',
          style: 'destructive',
          onPress: () => {
            stopSession();
            router.replace('/(tabs)/' as any);
          },
        },
      ],
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>

      {/* ── 1. Compact header ───────────────────────────────────────────────── */}
      <View
        style={{
          backgroundColor: accent,
          paddingTop: 56,
          paddingBottom: 16,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="barbell-outline" size={22} color="#FFFFFF" />
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'Inter_600SemiBold',
              letterSpacing: -0.3,
            }}
          >
            Musculation
          </Text>
        </View>
        <Pressable
          onPress={handleDiscard}
          hitSlop={12}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* ── 2. Session timer (tabular-nums) ─────────────────────────────────── */}
      <View
        style={{
          backgroundColor: cardBg,
          borderBottomWidth: 1,
          borderBottomColor: cardBorder,
          alignItems: 'center',
          paddingVertical: 16,
        }}
      >
        <Text
          style={{
            fontSize: 48,
            fontWeight: '600',
            fontFamily: 'Inter_600SemiBold',
            fontVariant: ['tabular-nums'],
            letterSpacing: -2,
            lineHeight: 52,
            color: textPrimary,
          }}
        >
          {fmtDuration(metrics.durationSeconds)}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: textMuted,
            fontFamily: 'Inter_400Regular',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          Durée de séance
        </Text>
      </View>

      {/* ── Scrollable input area ────────────────────────────────────────────── */}
      <View style={{ backgroundColor: cardBg }}>

        {/* ── 3. Exercise picker ─────────────────────────────────────────────── */}
        <ExercisePicker
          exercises={EXERCISES}
          categories={EXERCISE_CATEGORIES}
          selected={metrics.selectedExercise}
          onSelect={setSelectedExercise}
          accentColor={accent}
          accentBg={accentBg}
          textColor={textPrimary}
          chipBg={chipBg}
          categoryBg={chipBg}
        />

        {/* ── 4. Reps + weight steppers ─────────────────────────────────────── */}
        <SetInputRow
          reps={metrics.currentReps}
          weight={metrics.currentWeight}
          onAdjustReps={adjustReps}
          onAdjustWeight={adjustWeight}
          weightStep={weightStep}
          accentColor={accent}
          textColor={textPrimary}
          textMuted={textMuted}
          cardBg={cardBg2}
        />

        {/* ── 5. Log set CTA — 64px (UX-DR10) ──────────────────────────────── */}
        <View style={{ paddingHorizontal: 24, paddingTop: 4, paddingBottom: 16 }}>
          <Pressable
            onPress={logSet}
            style={({ pressed }) => ({
              minHeight: 64,
              borderRadius: 20,
              backgroundColor: accent,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#FFFFFF',
                fontFamily: 'Inter_600SemiBold',
                letterSpacing: -0.3,
              }}
            >
              Logger la série ({metrics.currentReps}×{
                metrics.currentWeight % 1 === 0
                  ? metrics.currentWeight
                  : metrics.currentWeight.toFixed(1)
              }kg)
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ── 6. Rest timer card (conditional) ────────────────────────────────── */}
      {metrics.restSecondsLeft !== null && (
        <View
          style={{
            marginHorizontal: 24,
            marginTop: 8,
            borderRadius: 16,
            backgroundColor: accentBg,
            borderWidth: 1.5,
            borderColor: accent,
            paddingVertical: 12,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="timer-outline" size={20} color={accent} />
            <View>
              <Text
                style={{
                  fontSize: 11,
                  color: textMuted,
                  fontFamily: 'Inter_400Regular',
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                }}
              >
                Repos
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  fontFamily: 'Inter_700Bold',
                  fontVariant: ['tabular-nums'],
                  letterSpacing: -1,
                  color: accent,
                  lineHeight: 32,
                }}
              >
                {fmtDuration(metrics.restSecondsLeft)}
              </Text>
            </View>
          </View>

          <Pressable
            onPress={dismissRest}
            hitSlop={12}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: accent,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: '#FFFFFF',
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              Passer
            </Text>
          </Pressable>
        </View>
      )}

      {/* ── 7. Workout log panel ────────────────────────────────────────────── */}
      <WorkoutLogPanel
        sets={metrics.sets}
        totalVolume={metrics.totalVolume}
        accentColor={accent}
        accentBg={accentBg}
        textColor={textPrimary}
        textMuted={textMuted}
        cardBg={cardBg}
        cardBorder={cardBorder}
      />

      {/* ── 8. HoldToFinish ─────────────────────────────────────────────────── */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          paddingTop: 12,
          backgroundColor: bg,
          alignItems: 'center',
        }}
      >
        <HoldToFinishButton
          onComplete={() => {
            stopSession();
            router.replace('/(tabs)/' as any);
          }}
          accentColor={accent}
          textColor={textMuted}
        />
      </View>
    </View>
  );
}
