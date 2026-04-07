import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BRAND_BLUE = '#1C3F60';
const DARK_SURFACE = '#222E42';
const DARK_BORDER = '#334060';
const DARK_TEXT_MUTED = '#8AABB8';
const DARK_CYAN = '#38BDF8';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const activeColor = isDark ? DARK_CYAN : BRAND_BLUE;
  const inactiveColor = isDark ? DARK_TEXT_MUTED : '#9CA3AF';
  const tabBarBg = isDark ? DARK_SURFACE : 'rgba(255,255,255,0.9)';
  const tabBarBorder = isDark ? DARK_BORDER : '#F3F4F6';

  return (
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
          // Glass-morphism shadow (light) / subtle border (dark)
          shadowColor: isDark ? DARK_CYAN : '#000000',
          shadowOpacity: isDark ? 0.04 : 0.06,
          shadowRadius: isDark ? 0 : 16,
          shadowOffset: { width: 0, height: -4 },
          elevation: 8,
        },
      }}
    >
      {/* Track — tab 1 */}
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

      {/* Dashboard / Stats — tab 2 */}
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
  );
}
