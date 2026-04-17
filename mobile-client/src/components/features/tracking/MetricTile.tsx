import { View, Text } from 'react-native';

interface MetricTileProps {
  value: string;
  label: string;
  valueColor: string;
  labelColor: string;
  /** Show a bottom border separator (default false) */
  separator?: boolean;
  borderColor?: string;
}

/**
 * TabularMetricDisplay atom (UX spec — Design System).
 *
 * Rules:
 * - Value: large, tabular-nums, Inter font — readable in < 0.5s in motion
 * - Label: tiny, muted — never competes with the number
 * - No fixed width — flex-based so it responds to container layout
 */
export function MetricTile({
  value,
  label,
  valueColor,
  labelColor,
  separator = false,
  borderColor,
}: MetricTileProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: separator ? 1 : 0,
        borderRightColor: borderColor ?? 'transparent',
        paddingVertical: 12,
      }}
    >
      <Text
        style={{
          fontSize: 34,
          fontWeight: '600',
          color: valueColor,
          fontFamily: 'Inter_600SemiBold',
          // tabular-nums prevents horizontal jitter when digits change (UX spec)
          fontVariant: ['tabular-nums'],
          letterSpacing: -1,
          lineHeight: 38,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 11,
          color: labelColor,
          fontFamily: 'Inter_400Regular',
          marginTop: 2,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
