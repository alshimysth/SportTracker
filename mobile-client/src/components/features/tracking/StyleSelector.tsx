/**
 * StyleSelector — Flash / Redpoint / Tentative pill buttons (Story 2.4)
 *
 * Three equally-wide pill buttons. The active style gets the sport accent.
 * Min height 48px (secondary action target — UX-DR10).
 *
 * Flash     — sent on first attempt (no prior beta knowledge)
 * Redpoint  — sent after prior attempts / beta
 * Tentative — did not complete (partial, fall, attempt)
 */
import { View, Text, Pressable } from 'react-native';
import type { ClimbStyle } from '@/hooks/use-climbing-session';

interface StyleOption {
  value: ClimbStyle;
  label: string;
  emoji: string;
}

const STYLES: StyleOption[] = [
  { value: 'flash', label: 'Flash', emoji: '⚡' },
  { value: 'redpoint', label: 'Redpoint', emoji: '🔴' },
  { value: 'tentative', label: 'Tentative', emoji: '🔄' },
];

interface Props {
  selected: ClimbStyle;
  onSelect: (style: ClimbStyle) => void;
  accentColor: string;
  accentBg: string;
  textColor: string;
  inactiveBg: string;
  inactiveBorder: string;
}

export function StyleSelector({
  selected,
  onSelect,
  accentColor,
  accentBg,
  textColor,
  inactiveBg,
  inactiveBorder,
}: Props) {
  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
      <Text
        style={{
          fontSize: 11,
          color: accentColor,
          fontFamily: 'Inter_500Medium',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        Style
      </Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {STYLES.map(({ value, label, emoji }) => {
          const isActive = value === selected;
          return (
            <Pressable
              key={value}
              onPress={() => onSelect(value)}
              style={({ pressed }) => ({
                flex: 1,
                minHeight: 48,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isActive ? accentBg : inactiveBg,
                borderWidth: 1.5,
                borderColor: isActive ? accentColor : inactiveBorder,
                gap: 2,
                opacity: pressed ? 0.8 : 1,
                paddingVertical: 10,
              })}
            >
              <Text style={{ fontSize: 16 }}>{emoji}</Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? '600' : '400',
                  fontFamily: isActive ? 'Inter_600SemiBold' : 'Inter_400Regular',
                  color: isActive ? accentColor : textColor,
                  letterSpacing: -0.2,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
