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

type Sport = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  accentBg: string;
};

const SPORTS: Sport[] = [
  { id: 'escalade', label: 'Escalade', icon: 'trail-sign-outline', accentColor: BRAND_BLUE, accentBg: '#EFF6FF' },
  { id: 'course', label: 'Course à pied', icon: 'walk-outline', accentColor: BRAND_ORANGE, accentBg: '#FFF7F5' },
  { id: 'muscu', label: 'Musculation', icon: 'barbell-outline', accentColor: '#9333EA', accentBg: '#FAF5FF' },
  { id: 'ski', label: 'Ski', icon: 'snow-outline', accentColor: '#0EA5E9', accentBg: '#F0F9FF' },
  { id: 'velo', label: 'Vélo', icon: 'bicycle-outline', accentColor: '#16A34A', accentBg: '#F0FDF4' },
  { id: 'natation', label: 'Natation', icon: 'water-outline', accentColor: '#3B82F6', accentBg: '#EFF6FF' },
  { id: 'yoga', label: 'Yoga', icon: 'flower-outline', accentColor: '#F43F5E', accentBg: '#FFF1F2' },
  { id: 'foot', label: 'Football', icon: 'football-outline', accentColor: '#65A30D', accentBg: '#F7FEE7' },
];

const DEFAULT_SELECTED = new Set(['escalade', 'course', 'muscu']);

export default function SportSelectionScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [selected, setSelected] = useState<Set<string>>(new Set(DEFAULT_SELECTED));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const pageBg = isDark ? DARK_BG : '#FFFFFF';
  const textPrimary = isDark ? DARK_TEXT : '#111827';
  const textMuted = isDark ? DARK_TEXT_MUTED : '#6B7280';
  const progressInactive = isDark ? DARK_SURFACE2 : '#E5E7EB';
  const cardBorder = isDark ? DARK_BORDER : '#E5E7EB';
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
        {/* Progress bar — step 1/3 */}
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 28, marginTop: 8 }}>
          <View style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: isDark ? DARK_CYAN : BRAND_BLUE }} />
          <View style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: progressInactive }} />
          <View style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: progressInactive }} />
        </View>

        <Text style={{ fontSize: 11, fontWeight: '600', color: BRAND_ORANGE, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontFamily: 'Inter_600SemiBold' }}>
          Étape 1 sur 3
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '600', color: textPrimary, letterSpacing: -0.5, marginBottom: 8, fontFamily: 'Inter_600SemiBold' }}>
          Tes sports
        </Text>
        <Text style={{ fontSize: 14, color: textMuted, marginBottom: 28, lineHeight: 20, fontFamily: 'Inter_400Regular' }}>
          Sélectionne les sports que tu pratiques. Tu pourras en ajouter d&apos;autres plus tard.
        </Text>

        {/* Sport grid 2-col */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          {SPORTS.map((sport) => {
            const isSelected = selected.has(sport.id);
            const accentBg = isDark ? 'rgba(56,189,248,0.06)' : sport.accentBg;
            return (
              <Pressable
                key={sport.id}
                onPress={() => toggle(sport.id)}
                style={{
                  width: '47%',
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: isSelected ? (isDark ? 'rgba(56,189,248,0.45)' : BRAND_BLUE) : cardBorder,
                  backgroundColor: isSelected
                    ? isDark ? 'rgba(56,189,248,0.06)' : 'rgba(28,63,96,0.04)'
                    : isDark ? DARK_SURFACE : '#F9FAFB',
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: accentBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Ionicons
                    name={sport.icon}
                    size={22}
                    color={isDark ? DARK_TEXT_MUTED : sport.accentColor}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', color: isDark ? DARK_TEXT : '#1F2937', fontFamily: 'Inter_500Medium', flex: 1 }}>
                    {sport.label}
                  </Text>
                  {isSelected && (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: isDark ? DARK_CYAN : BRAND_BLUE,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="checkmark" size={12} color={isDark ? '#0B111A' : '#FFFFFF'} />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* CTA */}
        <Pressable
          onPress={() => router.push('/(auth)/level-selection' as any)}
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
            Continuer ({selected.size} sélectionné{selected.size > 1 ? 's' : ''})
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
