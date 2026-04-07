import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';

const BRAND_BLUE = '#1C3F60';
const BRAND_ORANGE = '#FF6B4A';
const DARK_BG = '#0B111A';
const DARK_SURFACE = '#222E42';
const DARK_SURFACE2 = '#2A3A54';
const DARK_BORDER = '#334060';
const DARK_TEXT = '#F0F6FF';
const DARK_TEXT_MUTED = '#8AABB8';
const DARK_CYAN = '#38BDF8';

type SportKey = 'escalade' | 'course' | 'muscu';
type LevelKey = 'Débutant' | 'Intermédiaire' | 'Avancé';

const SPORTS: { id: SportKey; label: string; icon: keyof typeof Ionicons.glyphMap; accentColor: string; accentBg: string }[] = [
  { id: 'escalade', label: 'Escalade', icon: 'trail-sign-outline', accentColor: BRAND_BLUE, accentBg: '#EFF6FF' },
  { id: 'course', label: 'Course à pied', icon: 'walk-outline', accentColor: BRAND_ORANGE, accentBg: '#FFF7F5' },
  { id: 'muscu', label: 'Musculation', icon: 'barbell-outline', accentColor: '#9333EA', accentBg: '#FAF5FF' },
];

const LEVELS: LevelKey[] = ['Débutant', 'Intermédiaire', 'Avancé'];

export default function LevelSelectionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [levels, setLevels] = useState<Record<SportKey, LevelKey>>({
    escalade: 'Intermédiaire',
    course: 'Débutant',
    muscu: 'Avancé',
  });

  const pageBg = isDark ? DARK_BG : '#FFFFFF';
  const textPrimary = isDark ? DARK_TEXT : '#111827';
  const textMuted = isDark ? DARK_TEXT_MUTED : '#6B7280';
  const progressActive = isDark ? DARK_CYAN : BRAND_BLUE;
  const progressInactive = isDark ? DARK_SURFACE2 : '#E5E7EB';
  const cardBg = isDark ? DARK_SURFACE : '#F9FAFB';
  const ctaTextColor = isDark ? DARK_CYAN : '#FFFFFF';
  const ctaStyle = isDark
    ? {
        backgroundColor: '#091828',
        borderWidth: 1,
        borderColor: 'rgba(56,189,248,0.38)',
        shadowColor: DARK_CYAN,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        elevation: 6,
      }
    : {
        backgroundColor: BRAND_BLUE,
        shadowColor: BRAND_BLUE,
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: pageBg }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar — step 2/3 */}
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 28, marginTop: 8 }}>
          <View style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: progressActive }} />
          <View style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: progressActive }} />
          <View style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: progressInactive }} />
        </View>

        <Text style={{ fontSize: 11, fontWeight: '600', color: BRAND_ORANGE, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'Inter_600SemiBold' }}>
          Étape 2 sur 3
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '600', color: textPrimary, letterSpacing: -0.5, marginBottom: 8, fontFamily: 'Inter_600SemiBold' }}>
          Ton niveau
        </Text>
        <Text style={{ fontSize: 14, color: textMuted, marginBottom: 28, lineHeight: 20, fontFamily: 'Inter_400Regular' }}>
          Pour chaque sport, indique ton niveau actuel.
        </Text>

        {/* Sport level cards */}
        <View style={{ gap: 16, marginBottom: 32 }}>
          {SPORTS.map((sport) => (
            <View
              key={sport.id}
              style={{
                backgroundColor: cardBg,
                borderRadius: 20,
                padding: 16,
              }}
            >
              {/* Sport header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: isDark ? DARK_SURFACE2 : sport.accentBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={sport.icon} size={18} color={isDark ? DARK_TEXT_MUTED : sport.accentColor} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '500', color: textPrimary, fontFamily: 'Inter_500Medium' }}>
                  {sport.label}
                </Text>
              </View>

              {/* Level buttons */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {LEVELS.map((level) => {
                  const isActive = levels[sport.id] === level;
                  return (
                    <Pressable
                      key={level}
                      onPress={() =>
                        setLevels((prev) => ({ ...prev, [sport.id]: level }))
                      }
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 12,
                        alignItems: 'center',
                        backgroundColor: isActive
                          ? isDark ? DARK_CYAN : BRAND_BLUE
                          : isDark ? DARK_SURFACE2 : '#FFFFFF',
                        borderWidth: 1,
                        borderColor: isActive
                          ? isDark ? DARK_CYAN : BRAND_BLUE
                          : isDark ? DARK_BORDER : '#E5E7EB',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '500',
                          color: isActive
                            ? isDark ? '#0B111A' : '#FFFFFF'
                            : isDark ? DARK_TEXT_MUTED : '#6B7280',
                          fontFamily: 'Inter_500Medium',
                        }}
                      >
                        {level}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={() => router.push('/(auth)/onboarding-complete' as any)}
          style={[
            {
              minHeight: 64,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
            },
            ctaStyle,
          ]}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: ctaTextColor, fontFamily: 'Inter_600SemiBold' }}>
            Continuer
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
