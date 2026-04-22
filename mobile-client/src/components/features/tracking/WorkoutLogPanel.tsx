/**
 * WorkoutLogPanel — logged sets list (Story 2.5)
 *
 * Append-only list of sets logged during the session.
 * Each row: exercise name | reps×weight | volume contribution | relative time.
 * Header shows total sets count and cumulative volume badge.
 * Empty state: prompt to log the first set.
 */
import { View, Text, ScrollView } from 'react-native';
import type { WorkoutSet } from '@/hooks/use-weightlifting-session';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(ts: number): string {
  const diffSecs = Math.floor((Date.now() - ts) / 1000);
  if (diffSecs < 60) return `${diffSecs}s`;
  return `${Math.floor(diffSecs / 60)}min`;
}

function fmtVolume(vol: number): string {
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}t`;
  return `${vol}kg`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  sets: WorkoutSet[];
  totalVolume: number;
  accentColor: string;
  accentBg: string;
  textColor: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WorkoutLogPanel({
  sets,
  totalVolume,
  accentColor,
  accentBg,
  textColor,
  textMuted,
  cardBg,
  cardBorder,
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
          Séries ({sets.length})
        </Text>

        {totalVolume > 0 && (
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
              Volume
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
              {fmtVolume(totalVolume)}
            </Text>
          </View>
        )}
      </View>

      {/* ── Sets list ──────────────────────────────────────────────────────── */}
      {sets.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingHorizontal: 32,
          }}
        >
          <Text style={{ fontSize: 32 }}>💪</Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: '600',
              fontFamily: 'Inter_600SemiBold',
              color: textColor,
              textAlign: 'center',
            }}
          >
            Prêt à s&apos;entraîner
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
            Sélectionne un exercice, règle reps et poids{'\n'}puis appuie sur «&nbsp;Logger la série&nbsp;»
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24, gap: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {sets.map((s, idx) => {
            const setVolume = s.reps * s.weight;
            return (
              <View
                key={s.id}
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
                {/* Set number */}
                <Text
                  style={{
                    fontSize: 12,
                    color: textMuted,
                    fontFamily: 'Inter_400Regular',
                    width: 20,
                    textAlign: 'right',
                  }}
                >
                  {sets.length - idx}
                </Text>

                {/* Reps × weight chip */}
                <View
                  style={{
                    backgroundColor: accentBg,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    minWidth: 60,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      fontFamily: 'Inter_700Bold',
                      color: accentColor,
                      fontVariant: ['tabular-nums'],
                      letterSpacing: -0.3,
                    }}
                  >
                    {s.reps}×{s.weight % 1 === 0 ? s.weight : s.weight.toFixed(1)}kg
                  </Text>
                </View>

                {/* Exercise name */}
                <Text
                  style={{
                    fontSize: 13,
                    color: textColor,
                    fontFamily: 'Inter_400Regular',
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {s.exerciseName}
                </Text>

                {/* Volume + time */}
                <View style={{ alignItems: 'flex-end', gap: 2 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: accentColor,
                      fontFamily: 'Inter_500Medium',
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    {fmtVolume(setVolume)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: textMuted,
                      fontFamily: 'Inter_400Regular',
                    }}
                  >
                    {relativeTime(s.loggedAt)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
