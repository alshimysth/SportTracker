/**
 * Climbing tracking screen — Story 2.4 / 2.6
 *
 * Layout (top → bottom):
 *   1. Compact blue/cyan header  — sport label + discard button
 *   2. Session timer             — elapsed HH:MM:SS (tabular-nums)
 *   3. GradeDial                 — horizontal V-Scale selector (VB–V10)
 *   4. StyleSelector             — Flash / Redpoint / Tentative
 *   5. "Logger la voie" CTA      — 64px primary button (UX-DR10)
 *   6. ClimbingLogPanel          — append-only route list + max grade
 *   7. HoldToFinishButton        — 1.5s hold, SVG ring, haptics (UX-DR3)
 */
import { View, Text, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import { useSportStore } from '@/store/use-sport-store';
import { useClimbingSession, V_GRADES } from '@/hooks/use-climbing-session';
import { GradeDial } from '@/components/features/tracking/GradeDial';
import { StyleSelector } from '@/components/features/tracking/StyleSelector';
import { ClimbingLogPanel } from '@/components/features/tracking/ClimbingLogPanel';
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

export default function ClimbingScreen() {
  const isDark = useColorScheme() === 'dark';
  const { clearActiveSport } = useSportStore();
  const {
    metrics,
    setSelectedGrade,
    setSelectedStyle,
    logRoute,
    stopSession,
  } = useClimbingSession();

  // ── Design tokens ─────────────────────────────────────────────────────────
  const accent = isDark ? colors.primaryCyan : colors.brandBlue;
  const accentBg = isDark ? 'rgba(56,189,248,0.12)' : '#EFF6FF';
  const bg = isDark ? colors.darkBg : '#F8F9FA';
  const cardBg = isDark ? colors.darkSurfaceAlt : '#FFFFFF';
  const cardBorder = isDark ? colors.darkBorder : '#F3F4F6';
  const textPrimary = isDark ? colors.darkText : '#1E293B';
  const textMuted = isDark ? colors.placeholderDark : '#94A3B8';
  const chipBg = isDark ? colors.darkSurface : '#F1F5F9';
  const inactiveBorder = isDark ? colors.darkBorder : '#E5E7EB';

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleDiscard() {
    Alert.alert(
      'Abandonner la session ?',
      'Tes voies non sauvegardées seront perdues.',
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Abandonner',
          style: 'destructive',
          onPress: () => {
            stopSession();
            clearActiveSport();
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
          <Ionicons name="trail-sign-outline" size={22} color="#FFFFFF" />
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'Inter_600SemiBold',
              letterSpacing: -0.3,
            }}
          >
            Escalade
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
          Durée de session
        </Text>
      </View>

      {/* ── Scrollable input area (grade dial + style + CTA) ────────────────── */}
      <View style={{ backgroundColor: cardBg }}>

        {/* ── 3. Grade dial ──────────────────────────────────────────────────── */}
        <GradeDial
          grades={V_GRADES}
          selected={metrics.selectedGrade}
          onSelect={setSelectedGrade}
          accentColor={accent}
          textColor={textPrimary}
          chipBg={chipBg}
          chipBgActive={accent}
        />

        {/* ── 4. Style selector ──────────────────────────────────────────────── */}
        <StyleSelector
          selected={metrics.selectedStyle}
          onSelect={setSelectedStyle}
          accentColor={accent}
          accentBg={accentBg}
          textColor={textPrimary}
          inactiveBg={chipBg}
          inactiveBorder={inactiveBorder}
        />

        {/* ── 5. Log route CTA — 64px (UX-DR10) ─────────────────────────────── */}
        <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 }}>
          <Pressable
            onPress={logRoute}
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
              Logger la voie ({metrics.selectedGrade})
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ── 6. Route log panel ──────────────────────────────────────────────── */}
      <ClimbingLogPanel
        routes={metrics.routes}
        accentColor={accent}
        accentBg={accentBg}
        textColor={textPrimary}
        textMuted={textMuted}
        cardBg={cardBg}
        cardBorder={cardBorder}
        maxGrade={metrics.maxGrade}
      />

      {/* ── 7. HoldToFinishButton (UX-DR3) ──────────────────────────────────── */}
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
            clearActiveSport();
            router.replace('/(tabs)/' as any);
          }}
          accentColor={accent}
          textColor={textMuted}
        />
      </View>
    </View>
  );
}
