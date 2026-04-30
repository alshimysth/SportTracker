/**
 * SetInputRow — reps + weight steppers (Story 2.5)
 *
 * Two side-by-side steppers: Séries (reps) and Poids (kg).
 * Each stepper: 64px [-] button — large tabular-nums value — 64px [+] button.
 * Designed for gym context: gloved hands, 64px touch targets (UX-DR10).
 *
 * Props:
 *   reps / weight    — current values
 *   onAdjustReps     — delta callback (+1 / -1)
 *   onAdjustWeight   — delta callback (+step / -step)
 *   weightStep       — increment step for weight (default 2.5kg)
 *   accentColor      — stepper button background
 *   textColor        — value text colour
 *   textMuted        — label text colour
 *   cardBg           — stepper background
 */
import { View, Text, Pressable } from 'react-native';

interface Props {
  reps: number;
  weight: number;
  onAdjustReps: (delta: number) => void;
  onAdjustWeight: (delta: number) => void;
  weightStep: number;
  accentColor: string;
  textColor: string;
  textMuted: string;
  cardBg: string;
}

function Stepper({
  label,
  value,
  unit,
  onDecrement,
  onIncrement,
  accentColor,
  textColor,
  textMuted,
  cardBg,
}: {
  label: string;
  value: string;
  unit?: string;
  onDecrement: () => void;
  onIncrement: () => void;
  accentColor: string;
  textColor: string;
  textMuted: string;
  cardBg: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: cardBg,
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 8,
        alignItems: 'center',
        gap: 6,
      }}
    >
      {/* Label */}
      <Text
        style={{
          fontSize: 11,
          color: textMuted,
          fontFamily: 'Inter_500Medium',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>

      {/* Stepper row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {/* Decrement */}
        <Pressable
          onPress={onDecrement}
          style={({ pressed }) => ({
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: accentColor,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text
            style={{
              fontSize: 26,
              color: '#FFFFFF',
              fontFamily: 'Inter_400Regular',
              lineHeight: 30,
            }}
          >
            −
          </Text>
        </Pressable>

        {/* Value */}
        <View style={{ minWidth: 56, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: '700',
              fontFamily: 'Inter_700Bold',
              fontVariant: ['tabular-nums'],
              letterSpacing: -1.5,
              color: textColor,
              lineHeight: 40,
            }}
          >
            {value}
          </Text>
          {unit && (
            <Text
              style={{
                fontSize: 11,
                color: textMuted,
                fontFamily: 'Inter_400Regular',
                marginTop: 2,
              }}
            >
              {unit}
            </Text>
          )}
        </View>

        {/* Increment */}
        <Pressable
          onPress={onIncrement}
          style={({ pressed }) => ({
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: accentColor,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text
            style={{
              fontSize: 26,
              color: '#FFFFFF',
              fontFamily: 'Inter_400Regular',
              lineHeight: 30,
            }}
          >
            +
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function SetInputRow({
  reps,
  weight,
  onAdjustReps,
  onAdjustWeight,
  weightStep,
  accentColor,
  textColor,
  textMuted,
  cardBg,
}: Props) {
  const weightDisplay = weight % 1 === 0 ? String(weight) : weight.toFixed(1);

  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 24, paddingVertical: 12 }}>
      <Stepper
        label="Répétitions"
        value={String(reps)}
        onDecrement={() => onAdjustReps(-1)}
        onIncrement={() => onAdjustReps(1)}
        accentColor={accentColor}
        textColor={textColor}
        textMuted={textMuted}
        cardBg={cardBg}
      />
      <Stepper
        label="Poids"
        value={weightDisplay}
        unit="kg"
        onDecrement={() => onAdjustWeight(-weightStep)}
        onIncrement={() => onAdjustWeight(weightStep)}
        accentColor={accentColor}
        textColor={textColor}
        textMuted={textMuted}
        cardBg={cardBg}
      />
    </View>
  );
}
