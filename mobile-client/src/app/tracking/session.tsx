/**
 * Active tracking session screen — Story 2.1 shell
 *
 * Implements the sport color morph (UX-DR2/DR5):
 * the hero header adopts the selected sport's accent color.
 *
 * The AdaptiveSportMorpherPanel (center content) is a stub here —
 * Stories 2.2–2.5 will replace it with the sport-specific panels:
 *   - Running  → GPS map + pace/distance metrics (Story 2.2/2.3)
 *   - Climbing → Grade dial + style selector    (Story 2.4)
 *   - Lifting  → Exercise/sets/reps grid         (Story 2.5)
 *
 * The HoldToFinishButton and Discard flow are Story 2.6/2.7.
 */
import { View, Text, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import { useSportStore, SPORT_CONFIG } from '@/store/use-sport-store';

export default function SessionScreen() {
  const isDark = useColorScheme() === 'dark';
  const { activeSport, clearActiveSport } = useSportStore();

  const sport = activeSport ?? 'running';
  const config = SPORT_CONFIG[sport];

  // Sport color morph — hero takes the sport accent color (UX-DR2)
  const heroAccent = isDark ? config.colorDark : config.color;
  const bg = isDark ? colors.darkBg : '#F8F9FA';
  const cardBg = isDark ? colors.darkSurfaceAlt : '#FFFFFF';
  const cardBorder = isDark ? colors.darkBorder : '#F3F4F6';
  const textMuted = isDark ? colors.darkTextMuted : '#6B7280';

  function handleDiscard() {
    Alert.alert(
      'Annuler la session ?',
      'La session en cours sera perdue.',
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Annuler la session',
          style: 'destructive',
          onPress: () => {
            clearActiveSport();
            router.replace('/(tabs)/' as any);
          },
        },
      ],
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* ── Sport-colored hero — the morph (UX-DR2/DR5) ─────────────────── */}
      <View
        style={{
          backgroundColor: heroAccent,
          paddingTop: 64,
          paddingBottom: 40,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <Ionicons name={config.icon as any} size={38} color="#FFFFFF" />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#FFFFFF',
            fontFamily: 'Inter_700Bold',
            letterSpacing: -0.5,
          }}
        >
          {config.label}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.65)',
            marginTop: 6,
            fontFamily: 'Inter_400Regular',
          }}
        >
          Session en cours
        </Text>
      </View>

      {/* ── AdaptiveSportMorpherPanel — stub (Stories 2.2–2.5) ───────────── */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
          gap: 12,
        }}
      >
        <View
          style={{
            backgroundColor: cardBg,
            borderRadius: 20,
            padding: 32,
            borderWidth: 1,
            borderColor: cardBorder,
            alignItems: 'center',
            gap: 12,
            width: '100%',
          }}
        >
          <Ionicons
            name={config.icon as any}
            size={40}
            color={isDark ? config.colorDark : config.color}
          />
          <Text
            style={{
              fontSize: 15,
              color: textMuted,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            Panneau {config.label}{'\n'}
            <Text style={{ fontSize: 13 }}>À implémenter — Stories 2.2–2.5</Text>
          </Text>
        </View>
      </View>

      {/* ── Bottom actions ───────────────────────────────────────────────── */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 48, paddingTop: 16, gap: 12 }}>
        {/* HoldToFinishButton placeholder — Story 2.6 */}
        <View
          style={{
            minHeight: 64,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: heroAccent,
            opacity: 0.4,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'Inter_600SemiBold',
            }}
          >
            Maintenir pour terminer — Story 2.6
          </Text>
        </View>

        {/* Discard */}
        <Pressable
          onPress={handleDiscard}
          style={{
            minHeight: 48,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: cardBorder,
            backgroundColor: cardBg,
            flexDirection: 'row',
            gap: 8,
          }}
        >
          <Ionicons name="close-outline" size={18} color={textMuted} />
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: isDark ? colors.darkTextMuted : '#374151',
              fontFamily: 'Inter_500Medium',
            }}
          >
            Annuler la session
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
