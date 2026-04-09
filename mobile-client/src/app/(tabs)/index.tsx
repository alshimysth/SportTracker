import {
  View,
  Text,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/use-auth-store';
import { colors } from '@/theme/colors';

// ─── Static demo data (will be replaced by API in Epic 2/4) ──────────────────
const CALENDAR_DAYS = [
  { d: 'L', n: 15 },
  { d: 'M', n: 16 },
  { d: 'M', n: 17 },
  { d: 'J', n: 18, active: true },
  { d: 'V', n: 19 },
  { d: 'S', n: 20 },
  { d: 'D', n: 21 },
];

const WEEK_STATS = [
  { icon: 'walk-outline' as const, label: 'Course', value: '32.4', unit: 'km', accentColor: colors.brandOrange, accentBg: '#FFF7F5', darkAccentBg: 'rgba(255,107,74,0.08)' },
  { icon: 'trail-sign-outline' as const, label: 'Escalade', value: '14', unit: 'voies', accentColor: colors.brandBlue, accentBg: '#EFF6FF', darkAccentBg: 'rgba(56,189,248,0.08)' },
];

const RECENT_ACTIVITY = [
  {
    icon: 'walk-outline' as const,
    title: 'Morning Run',
    subtitle: "Aujourd\u2019hui, 7h30",
    stat: '5.2 km',
    statSub: '28:45',
    accentColor: colors.brandOrange,
    accentBg: '#FFF7F5',
    darkAccentBg: 'rgba(255,107,74,0.06)',
    statColor: null,
  },
  {
    icon: 'trail-sign-outline' as const,
    title: 'Session Bloc',
    subtitle: 'Hier, 18h00',
    stat: 'V5 Max',
    statSub: '2h 15m',
    accentColor: colors.brandBlue,
    accentBg: '#EFF6FF',
    darkAccentBg: 'rgba(56,189,248,0.06)',
    statColor: colors.brandGreen,
  },
  {
    icon: 'barbell-outline' as const,
    title: 'Push Day',
    subtitle: 'Avant-hier, 19h00',
    stat: '8 730 kg',
    statSub: '1h 05m',
    accentColor: '#9333EA',
    accentBg: '#FAF5FF',
    darkAccentBg: 'rgba(147,51,234,0.06)',
    statColor: null,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const user = useAuthStore((s) => s.user);

  // ─── JS-only colour values (passed to props that don't accept className) ──
  const pageBg = isDark ? colors.darkBg : '#F9FAFB';
  const cardBg = isDark ? colors.darkSurfaceAlt : '#FFFFFF';
  const cardBorder = isDark ? colors.darkBorder : '#F3F4F6';
  const textPrimary = isDark ? colors.darkText : '#111827';
  const textMuted = isDark ? colors.darkTextMuted : '#6B7280';
  const textSubtle = isDark ? colors.placeholderDark : '#9CA3AF';
  const sectionTitle = isDark ? colors.darkText : '#1F2937';
  const heroBg = isDark ? colors.heroDark : colors.brandBlue;
  const heroIconBg = isDark ? 'rgba(56,189,248,0.09)' : 'rgba(255,255,255,0.2)';
  const heroBellBg = isDark ? 'rgba(56,189,248,0.06)' : 'rgba(255,255,255,0.1)';

  return (
    <View style={{ flex: 1, backgroundColor: pageBg }}>
      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <View
        style={{
          backgroundColor: heroBg,
          paddingTop: 56,
          paddingBottom: 28,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          zIndex: 10,
        }}
      >
        {/* Top row: avatar + name + bell */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: heroIconBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="person-outline" size={20} color={isDark ? colors.primaryCyan : '#FFFFFF'} />
            </View>
            <View>
              <Text style={{ fontSize: 12, color: isDark ? colors.placeholderDark : 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular' }}>
                Bonjour,
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '500', color: isDark ? colors.darkText : '#FFFFFF', letterSpacing: -0.3, fontFamily: 'Inter_500Medium' }}>
                {user?.displayName ?? 'Alex Tracker'}
              </Text>
            </View>
          </View>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: heroBellBg,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Notification dot */}
            <View style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brandOrange, zIndex: 1 }} />
            <Ionicons name="notifications-outline" size={20} color={isDark ? colors.primaryCyan : '#FFFFFF'} />
          </View>
        </View>

        {/* Mini calendar */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {CALENDAR_DAYS.map((day, i) => (
            <View
              key={i}
              style={
                day.active
                  ? {
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 20,
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                    }
                  : { flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.5 }
              }
            >
              <Text style={{
                fontSize: 12,
                color: day.active ? colors.brandBlue : (isDark ? colors.darkText : '#FFFFFF'),
                fontFamily: day.active ? 'Inter_500Medium' : 'Inter_400Regular',
              }}>
                {day.d}
              </Text>
              <Text style={{
                fontSize: 14,
                color: day.active ? colors.brandBlue : (isDark ? colors.darkText : '#FFFFFF'),
                fontFamily: day.active ? 'Inter_500Medium' : 'Inter_400Regular',
              }}>
                {day.n}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Scrollable Content ───────────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Week overview */}
        <Text style={{ fontSize: 17, fontWeight: '500', color: sectionTitle, marginBottom: 16, letterSpacing: -0.3, fontFamily: 'Inter_500Medium' }}>
          Aperçu semaine
        </Text>

        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 28 }}>
          {WEEK_STATS.map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: cardBg,
                borderRadius: 20,
                padding: 16,
                borderWidth: 1,
                borderColor: cardBorder,
              }}
            >
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isDark ? stat.darkAccentBg : stat.accentBg,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              }}>
                <Ionicons name={stat.icon} size={16} color={isDark ? colors.darkTextMuted : stat.accentColor} />
              </View>
              <Text style={{ fontSize: 12, color: textMuted, marginBottom: 2, fontFamily: 'Inter_400Regular' }}>
                {stat.label}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: '500', color: textPrimary, letterSpacing: -0.5, fontFamily: 'Inter_500Medium', fontVariant: ['tabular-nums'] }}>
                {stat.value}{' '}
                <Text style={{ fontSize: 12, color: textMuted, fontWeight: '400' }}>{stat.unit}</Text>
              </Text>
            </View>
          ))}
        </View>

        {/* Recent activity */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 17, fontWeight: '500', color: sectionTitle, letterSpacing: -0.3, fontFamily: 'Inter_500Medium' }}>
            Activité récente
          </Text>
          <Pressable hitSlop={8}>
            <Text style={{ fontSize: 12, color: colors.brandOrange, fontWeight: '500', fontFamily: 'Inter_500Medium' }}>
              Voir tout
            </Text>
          </Pressable>
        </View>

        <View style={{ gap: 12 }}>
          {RECENT_ACTIVITY.map((item, idx) => (
            <Pressable
              key={idx}
              style={{
                backgroundColor: cardBg,
                borderRadius: 20,
                padding: 16,
                borderWidth: 1,
                borderColor: cardBorder,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDark ? item.darkAccentBg : item.accentBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ionicons name={item.icon} size={22} color={isDark ? colors.darkTextMuted : item.accentColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: textPrimary, marginBottom: 2, fontFamily: 'Inter_500Medium' }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 12, color: textMuted, fontFamily: 'Inter_400Regular' }}>
                  {item.subtitle}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: item.statColor ? (isDark ? '#4ADE80' : item.statColor) : textPrimary, marginBottom: 2, fontFamily: 'Inter_500Medium', fontVariant: ['tabular-nums'] }}>
                  {item.stat}
                </Text>
                <Text style={{ fontSize: 12, color: textSubtle, fontFamily: 'Inter_400Regular', fontVariant: ['tabular-nums'] }}>
                  {item.statSub}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
