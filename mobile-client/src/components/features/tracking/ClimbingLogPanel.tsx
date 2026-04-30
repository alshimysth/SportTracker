/**
 * ClimbingLogPanel — logged routes list (Story 2.4)
 *
 * Renders the append-only list of routes logged during the session.
 * Each row shows: grade chip | style badge | relative time.
 * Empty state: prompt to log the first route.
 */
import { View, Text, ScrollView } from 'react-native';
import type { ClimbingRoute, ClimbStyle } from '@/hooks/use-climbing-session';

// ─── Style meta ───────────────────────────────────────────────────────────────

const STYLE_META: Record<ClimbStyle, { label: string; emoji: string }> = {
  flash: { label: 'Flash', emoji: '⚡' },
  redpoint: { label: 'Redpoint', emoji: '🔴' },
  tentative: { label: 'Tentative', emoji: '🔄' },
};

// ─── Relative time helper ─────────────────────────────────────────────────────

function relativeTime(ts: number): string {
  const diffSecs = Math.floor((Date.now() - ts) / 1000);
  if (diffSecs < 60) return `${diffSecs}s`;
  return `${Math.floor(diffSecs / 60)}min`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  routes: ClimbingRoute[];
  accentColor: string;
  accentBg: string;
  textColor: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
  maxGrade: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ClimbingLogPanel({
  routes,
  accentColor,
  accentBg,
  textColor,
  textMuted,
  cardBg,
  cardBorder,
  maxGrade,
}: Props) {
  return (
    <View style={{ flex: 1 }}>
      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: cardBorder,
          backgroundColor: cardBg,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            fontFamily: 'Inter_600SemiBold',
            color: textColor,
            letterSpacing: -0.2,
          }}
        >
          Voies ({routes.length})
        </Text>

        {maxGrade !== '' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: accentBg,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: textMuted,
                fontFamily: 'Inter_400Regular',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Max
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                fontFamily: 'Inter_700Bold',
                color: accentColor,
                letterSpacing: -0.3,
              }}
            >
              {maxGrade}
            </Text>
          </View>
        )}
      </View>

      {/* ── Route list ─────────────────────────────────────────────────────── */}
      {routes.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingHorizontal: 32,
          }}
        >
          <Text style={{ fontSize: 32 }}>🧗</Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold',
              color: textColor,
              textAlign: 'center',
            }}
          >
            Prêt à grimper
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: textMuted,
              fontFamily: 'Inter_400Regular',
              textAlign: 'center',
              lineHeight: 18,
            }}
          >
            Sélectionne un grade et un style{'\n'}puis appuie sur « Logger la voie »
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24, gap: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {routes.map((route, idx) => {
            const meta = STYLE_META[route.style];
            return (
              <View
                key={route.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: cardBg,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: cardBorder,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: textMuted,
                    fontFamily: 'Inter_400Regular',
                    width: 20,
                    textAlign: 'right',
                  }}
                >
                  {routes.length - idx}
                </Text>

                <View
                  style={{
                    backgroundColor: accentBg,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    minWidth: 44,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      fontFamily: 'Inter_700Bold',
                      color: accentColor,
                      letterSpacing: -0.3,
                    }}
                  >
                    {route.grade}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 }}>
                  <Text style={{ fontSize: 13 }}>{meta.emoji}</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: textColor,
                      fontFamily: 'Inter_400Regular',
                    }}
                  >
                    {meta.label}
                  </Text>
                </View>

                <Text
                  style={{
                    fontSize: 12,
                    color: textMuted,
                    fontFamily: 'Inter_400Regular',
                  }}
                >
                  {relativeTime(route.loggedAt)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
