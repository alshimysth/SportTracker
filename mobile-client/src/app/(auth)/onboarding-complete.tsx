import {
  View,
  Text,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';

const SPORTS_SUMMARY = [
  { id: 'escalade', label: 'Escalade', level: 'Intermédiaire', icon: 'trail-sign-outline' as const, accentColor: colors.brandBlue },
  { id: 'course', label: 'Course', level: 'Débutant', icon: 'walk-outline' as const, accentColor: colors.brandOrange },
  { id: 'muscu', label: 'Muscu', level: 'Avancé', icon: 'barbell-outline' as const, accentColor: '#9333EA' },
];

export default function OnboardingCompleteScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // ─── JS-only colour values (passed to props that don't accept className) ──
  const pageBg = isDark ? colors.darkBg : '#FFFFFF';
  const textPrimary = isDark ? colors.darkText : '#111827';
  const textMuted = isDark ? colors.darkTextMuted : '#6B7280';
  const cardBg = isDark ? colors.darkSurfaceAlt : '#F9FAFB';
  const dividerColor = isDark ? colors.darkBorder : '#E5E7EB';
  const ctaTextColor = isDark ? colors.primaryCyan : '#FFFFFF';
  const ctaStyle = isDark
    ? {
        backgroundColor: colors.ctaDark,
        borderWidth: 1,
        borderColor: 'rgba(56,189,248,0.38)',
        shadowColor: colors.primaryCyan,
        shadowOpacity: 0.25,
        shadowRadius: 14,
        elevation: 6,
      }
    : {
        backgroundColor: colors.brandBlue,
        shadowColor: colors.brandBlue,
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: pageBg }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingBottom: 64 }}>

        {/* Illustration */}
        <View style={{ position: 'relative', marginBottom: 32 }}>
          <View style={{
            width: 128,
            height: 128,
            borderRadius: 64,
            backgroundColor: isDark ? 'rgba(56,189,248,0.06)' : 'rgba(28,63,96,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <View style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: isDark ? 'rgba(56,189,248,0.10)' : 'rgba(28,63,96,0.14)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="locate" size={48} color={isDark ? colors.primaryCyan : colors.brandBlue} />
            </View>
          </View>
          {/* Confetti dots */}
          <View style={{ position: 'absolute', top: 8, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.brandOrange }} />
          <View style={{ position: 'absolute', bottom: 12, left: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.brandGreen }} />
          <View style={{ position: 'absolute', top: 20, left: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FACC15' }} />
        </View>

        <Text style={{ fontSize: 22, fontWeight: '600', color: textPrimary, letterSpacing: -0.5, marginBottom: 12, textAlign: 'center', fontFamily: 'Inter_600SemiBold' }}>
          Prêt à commencer !
        </Text>
        <Text style={{ fontSize: 14, color: textMuted, lineHeight: 22, marginBottom: 32, textAlign: 'center', fontFamily: 'Inter_400Regular' }}>
          Ton profil est configuré. Commence à tracker tes entraînements et progresse vers tes objectifs.
        </Text>

        {/* Stats preview card */}
        <View style={{
          width: '100%',
          backgroundColor: cardBg,
          borderRadius: 20,
          padding: 20,
          marginBottom: 32,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
          {SPORTS_SUMMARY.map((sport, idx) => (
            <View key={sport.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Ionicons name={sport.icon} size={24} color={isDark ? colors.darkTextMuted : sport.accentColor} />
                <Text style={{ fontSize: 11, color: textMuted, fontFamily: 'Inter_400Regular' }}>{sport.label}</Text>
                <Text style={{ fontSize: 11, fontWeight: '500', color: isDark ? colors.darkText : '#374151', fontFamily: 'Inter_500Medium' }}>{sport.level}</Text>
              </View>
              {idx < SPORTS_SUMMARY.length - 1 && (
                <View style={{ width: 1, height: 40, backgroundColor: dividerColor, marginHorizontal: 16 }} />
              )}
            </View>
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={() => router.replace('/(tabs)/' as any)}
          style={[
            {
              width: '100%',
              minHeight: 64,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              marginBottom: 16,
            },
            ctaStyle,
          ]}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: ctaTextColor, fontFamily: 'Inter_600SemiBold' }}>
            Commencer 🚀
          </Text>
        </Pressable>

        <Pressable onPress={() => router.replace('/(tabs)/' as any)} hitSlop={8}>
          <Text style={{ fontSize: 14, color: isDark ? colors.placeholderDark : '#9CA3AF', fontFamily: 'Inter_400Regular' }}>
            Configurer plus tard
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
