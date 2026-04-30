import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import { useSportStore, SPORT_CONFIG, type SportType } from '@/store/use-sport-store';

const SPORTS: SportType[] = ['running', 'climbing', 'weightlifting'];

export default function SportSelectScreen() {
  const isDark = useColorScheme() === 'dark';
  const setActiveSport = useSportStore((s) => s.setActiveSport);

  const bg = isDark ? colors.darkBg : '#F8F9FA';
  const textPrimary = isDark ? colors.darkText : '#1E293B';
  const textMuted = isDark ? colors.darkTextMuted : '#64748B';
  const cardBg = isDark ? colors.darkSurfaceAlt : '#FFFFFF';
  const cardBorder = isDark ? colors.darkBorder : '#F3F4F6';
  const closeBg = isDark ? colors.darkSurface : '#F3F4F6';
  const closeIcon = isDark ? colors.darkTextMuted : '#6B7280';

  function handleSelectSport(sport: SportType) {
    setActiveSport(sport);
    // Route to the sport-specific tracking screen
    // Running has its own screen (Story 2.2); others still use the generic session stub
    if (sport === 'running') {
      router.push('/tracking/running' as any);
    } else if (sport === 'climbing') {
      router.push('/tracking/climbing' as any);
    } else {
      router.push('/tracking/session' as any);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: textPrimary,
            fontFamily: 'Inter_700Bold',
            letterSpacing: -0.5,
          }}
        >
          Démarrer une session
        </Text>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: closeBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="close" size={20} color={closeIcon} />
        </Pressable>
      </View>

      <Text
        style={{
          fontSize: 14,
          color: textMuted,
          paddingHorizontal: 24,
          marginTop: 4,
          marginBottom: 32,
          fontFamily: 'Inter_400Regular',
        }}
      >
        Choisis ton sport pour adapter l&apos;interface
      </Text>

      {/* ── Sport cards — 64px icon target (UX-DR10) ──────────────────────── */}
      <View style={{ flex: 1, paddingHorizontal: 24, gap: 16 }}>
        {SPORTS.map((sport) => {
          const config = SPORT_CONFIG[sport];
          const accentColor = isDark ? config.colorDark : config.color;
          const accentBg = isDark ? config.bgDark : config.bgLight;

          return (
            <Pressable
              key={sport}
              onPress={() => handleSelectSport(sport)}
              style={({ pressed }) => ({
                backgroundColor: cardBg,
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: pressed ? accentColor : cardBorder,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                minHeight: 96,
                opacity: pressed ? 0.88 : 1,
              })}
            >
              {/* Sport icon — 64×64px touch area (UX-DR10) */}
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: accentBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name={config.icon as any} size={30} color={accentColor} />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: isDark ? colors.darkText : '#111827',
                    fontFamily: 'Inter_600SemiBold',
                    letterSpacing: -0.3,
                  }}
                >
                  {config.label}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: textMuted,
                    marginTop: 3,
                    fontFamily: 'Inter_400Regular',
                  }}
                >
                  {config.subtitle}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={isDark ? colors.placeholderDark : '#D1D5DB'}
              />
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
