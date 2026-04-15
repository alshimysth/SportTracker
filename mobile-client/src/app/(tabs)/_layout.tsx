import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Pressable } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // ─── JS-only colour values (Tabs component doesn't accept className) ────────
  const activeColor = isDark ? colors.primaryCyan : colors.brandBlue;
  const inactiveColor = isDark ? colors.darkTextMuted : '#9CA3AF';
  const tabBarBg = isDark ? colors.darkSurfaceAlt : 'rgba(255,255,255,0.9)';
  const tabBarBorder = isDark ? colors.darkBorder : '#F3F4F6';

  // FAB — light: coral shadow / dark: cyan glow (UX-DR6)
  const fabBg = isDark ? colors.ctaDark : colors.brandOrange;
  const fabBorder = isDark ? 'rgba(56,189,248,0.38)' : 'transparent';
  const fabShadow = isDark ? colors.primaryCyan : colors.brandOrange;
  const fabIconColor = isDark ? colors.primaryCyan : '#FFFFFF';

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderTopColor: tabBarBorder,
            borderTopWidth: 1,
            paddingBottom: 28,
            paddingTop: 16,
            height: 80,
            shadowColor: isDark ? colors.primaryCyan : '#000000',
            shadowOpacity: isDark ? 0.04 : 0.06,
            shadowRadius: isDark ? 0 : 16,
            shadowOffset: { width: 0, height: -4 },
            elevation: 8,
          },
        }}
      >
        {/* Dashboard — tab 1 */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Ionicons name={focused ? 'navigate-circle' : 'navigate-circle-outline'} size={26} color={color} />
                {focused && (
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
                )}
              </View>
            ),
          }}
        />

        {/* Stats — tab 2 */}
        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Ionicons name={focused ? 'bar-chart' : 'bar-chart-outline'} size={24} color={color} />
                {focused && (
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
                )}
              </View>
            ),
          }}
        />

        {/* Profile — tab 3 */}
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={26} color={color} />
                {focused && (
                  <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
                )}
              </View>
            ),
          }}
        />
      </Tabs>

      {/* ── Giant FAB — floats above tab bar (UX-DR6) ───────────────────────── */}
      <Pressable
        onPress={() => router.push('/tracking' as any)}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 24,
          bottom: 100, // tab bar (80) + margin (20)
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: fabBg,
          borderWidth: isDark ? 1 : 0,
          borderColor: fabBorder,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: fabShadow,
          shadowOpacity: isDark ? 0.3 : 0.4,
          shadowRadius: isDark ? 12 : 16,
          shadowOffset: { width: 0, height: isDark ? 0 : 6 },
          elevation: 10,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Ionicons name="add" size={32} color={fabIconColor} />
      </Pressable>
    </View>
  );
}
