import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // ─── JS-only colour values (Tabs component doesn't accept className) ───────
  const activeColor = isDark ? colors.primaryCyan : colors.brandBlue;
  const inactiveColor = isDark ? colors.darkTextMuted : '#9CA3AF';
  const tabBarBg = isDark ? colors.darkSurfaceAlt : 'rgba(255,255,255,0.9)';
  const tabBarBorder = isDark ? colors.darkBorder : '#F3F4F6';

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
          shadowColor: isDark ? colors.primaryCyan : '#000000',
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
