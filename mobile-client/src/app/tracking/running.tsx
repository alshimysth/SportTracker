/**
 * Running tracking screen — Story 2.2 / 2.3
 *
 * Layout (top → bottom):
 *   1. Compact coral header  — sport label + discard button
 *   2. Metric bar            — Distance | Durée | Allure  (TabularMetricDisplay, UX spec)
 *   3. MapView + Polyline    — live GPS route (expo-location + react-native-maps)
 *   4. GPS status chip       — lock indicator
 *   5. HoldToFinish stub     — Story 2.6 will replace this
 */
import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import { useSportStore } from '@/store/use-sport-store';
import { useRunningTracker } from '@/hooks/use-running-tracker';
import { RunningMetricsDisplay } from '@/components/features/tracking/RunningMetricsDisplay';

// ─── Component ────────────────────────────────────────────────────────────────

export default function RunningScreen() {
  const isDark = useColorScheme() === 'dark';
  const { clearActiveSport } = useSportStore();
  const { metrics, stopTracking } = useRunningTracker();

  // ── Design tokens ───────────────────────────────────────────────────────────
  const accent = colors.brandOrange;          // Running = coral always
  const bg = isDark ? colors.darkBg : '#F8F9FA';
  const cardBg = isDark ? colors.darkSurfaceAlt : '#FFFFFF';
  const cardBorder = isDark ? colors.darkBorder : '#F3F4F6';
  const metricValue = isDark ? colors.darkText : '#1E293B';
  const metricLabel = isDark ? colors.placeholderDark : '#94A3B8';
  const metricDivider = isDark ? colors.darkBorder : '#E5E7EB';

  function handleDiscard() {
    Alert.alert(
      'Abandonner la course ?',
      'Ta progression sera perdue.',
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Abandonner',
          style: 'destructive',
          onPress: () => {
            stopTracking();
            clearActiveSport();
            router.replace('/(tabs)/' as any);
          },
        },
      ],
    );
  }

  // ── Permission denied ───────────────────────────────────────────────────────
  if (metrics.permissionDenied) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: bg, paddingHorizontal: 32, gap: 16 }}>
        <Ionicons name="location-outline" size={48} color={metricLabel} />
        <Text style={{ fontSize: 16, fontWeight: '600', color: metricValue, fontFamily: 'Inter_600SemiBold', textAlign: 'center' }}>
          Localisation requise
        </Text>
        <Text style={{ fontSize: 14, color: metricLabel, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 }}>
          Autorise l&apos;accès à ta position dans les réglages pour enregistrer ton parcours.
        </Text>
        <Pressable
          onPress={() => {
            clearActiveSport();
            router.replace('/(tabs)/' as any);
          }}
          style={{ marginTop: 8, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 14, color: accent, fontFamily: 'Inter_500Medium' }}>
            Retour
          </Text>
        </Pressable>
      </View>
    );
  }

  // ── Initial GPS search ──────────────────────────────────────────────────────
  const lastCoord = metrics.route.length > 0
    ? metrics.route[metrics.route.length - 1]
    : null;

  const mapRegion = lastCoord
    ? {
        latitude: lastCoord.latitude,
        longitude: lastCoord.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>

      {/* ── 1. Compact header ─────────────────────────────────────────────── */}
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
          <Ionicons name="walk-outline" size={22} color="#FFFFFF" />
          <Text
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'Inter_600SemiBold',
              letterSpacing: -0.3,
            }}
          >
            Course à pied
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

      {/* ── 2. Featured metrics panel — TabularMetricDisplay (UX-DR4) ──────── */}
      <RunningMetricsDisplay
        distanceMeters={metrics.distanceMeters}
        durationSeconds={metrics.durationSeconds}
        paceSecsPerKm={metrics.paceSecsPerKm}
        accentColor={accent}
        valueColor={metricValue}
        secondaryValueColor={metricValue}
        labelColor={metricLabel}
        dividerColor={metricDivider}
        cardBg={cardBg}
        cardBorder={cardBorder}
      />

      {/* ── 3. Map + polyline ─────────────────────────────────────────────── */}
      <View style={{ flex: 1 }}>
        {!lastCoord ? (
          // Waiting for first GPS fix
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <ActivityIndicator size="large" color={accent} />
            <Text style={{ fontSize: 14, color: metricLabel, fontFamily: 'Inter_400Regular' }}>
              Recherche du signal GPS...
            </Text>
          </View>
        ) : (
          <MapView
            style={{ flex: 1 }}
            provider={PROVIDER_DEFAULT}
            region={mapRegion}
            userInterfaceStyle={isDark ? 'dark' : 'light'}
            showsUserLocation
            followsUserLocation
            showsCompass={false}
            showsMyLocationButton={false}
          >
            {/* Route polyline */}
            {metrics.route.length > 1 && (
              <Polyline
                coordinates={metrics.route}
                strokeColor={accent}
                strokeWidth={5}
                lineCap="round"
                lineJoin="round"
              />
            )}

            {/* Current position marker */}
            {lastCoord && (
              <Marker coordinate={lastCoord} anchor={{ x: 0.5, y: 0.5 }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: accent,
                    borderWidth: 3,
                    borderColor: '#FFFFFF',
                    shadowColor: '#000',
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 4,
                  }}
                />
              </Marker>
            )}
          </MapView>
        )}
      </View>

      {/* ── 4. GPS status chip ────────────────────────────────────────────── */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: cardBg,
          borderTopWidth: 1,
          borderTopColor: cardBorder,
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: metrics.hasGpsLock ? colors.brandGreen : '#F59E0B',
          }}
        />
        <Text
          style={{
            fontSize: 12,
            color: metrics.hasGpsLock ? colors.brandGreen : '#F59E0B',
            fontFamily: 'Inter_500Medium',
          }}
        >
          {metrics.hasGpsLock
            ? `GPS · ${metrics.route.length} points`
            : 'Recherche GPS...'}
        </Text>
      </View>

      {/* ── 5. Bottom actions ─────────────────────────────────────────────── */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          paddingTop: 12,
          gap: 10,
          backgroundColor: bg,
        }}
      >
        {/* HoldToFinishButton placeholder — Story 2.6 */}
        <View
          style={{
            minHeight: 64,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: accent,
            opacity: 0.45,
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
      </View>
    </View>
  );
}
