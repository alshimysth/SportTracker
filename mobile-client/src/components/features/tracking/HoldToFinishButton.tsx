/**
 * HoldToFinishButton — Story 2.6
 *
 * Press and hold 1.5s to complete a session.
 * - SVG arc ring fills progressively during hold
 * - Haptic feedback at 33% / 66% / 100% (Light → Medium → Heavy)
 * - Resets on early release
 * - Fires onComplete once the ring fills
 *
 * Props:
 *   onComplete    — called when hold completes (1500ms)
 *   accentColor   — ring fill + button background
 *   textColor     — label colour
 */
import { View, Text, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// ─── Ring geometry ────────────────────────────────────────────────────────────

const RING_SIZE    = 88;
const STROKE_WIDTH = 5;
const RADIUS       = (RING_SIZE - STROKE_WIDTH * 2) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const HOLD_MS      = 1500;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ─── Haptic helpers (JS-thread callables) ────────────────────────────────────

function hapticLight()  { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }
function hapticMedium() { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }
function hapticHeavy()  { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); }

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
  accentColor: string;
  textColor: string;
}

export function HoldToFinishButton({ onComplete, accentColor, textColor }: Props) {
  const progress = useSharedValue(0);

  // ── Haptics at 33% / 66% / 100% ────────────────────────────────────────────
  useAnimatedReaction(
    () => Math.floor(progress.value * 3),
    (current, previous) => {
      if (previous === null || current <= (previous ?? 0)) return;
      if (current === 1) runOnJS(hapticLight)();
      if (current === 2) runOnJS(hapticMedium)();
      if (current >= 3) runOnJS(hapticHeavy)();
    },
  );

  // ── SVG ring: strokeDashoffset 0→CIRCUMFERENCE as progress 1→0 ────────────
  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  // ── Inner disc: subtle scale on hold ───────────────────────────────────────
  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.08 }],
    opacity: 0.85 + progress.value * 0.15,
  }));

  // ── Press handlers ─────────────────────────────────────────────────────────

  function handlePressIn() {
    progress.value = withTiming(
      1,
      { duration: HOLD_MS, easing: Easing.linear },
      (finished) => {
        'worklet';
        if (finished) runOnJS(onComplete)();
      },
    );
  }

  function handlePressOut() {
    // If not yet complete, cancel and reset
    if (progress.value < 0.98) {
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 300 });
    }
  }

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      {/* ── Circular hold button ────────────────────────────────────────── */}
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={{ width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center' }}>

          {/* Background ring (unfilled track) */}
          <Svg
            width={RING_SIZE}
            height={RING_SIZE}
            style={{ position: 'absolute' }}
          >
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={accentColor}
              strokeWidth={STROKE_WIDTH}
              strokeOpacity={0.2}
              fill="none"
            />
          </Svg>

          {/* Animated fill ring — starts at 12 o'clock (rotate -90°) */}
          <Svg
            width={RING_SIZE}
            height={RING_SIZE}
            style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
          >
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={accentColor}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedCircleProps}
            />
          </Svg>

          {/* Inner filled circle (the button face) */}
          <Animated.View
            style={[
              {
                width: RING_SIZE - STROKE_WIDTH * 4,
                height: RING_SIZE - STROKE_WIDTH * 4,
                borderRadius: (RING_SIZE - STROKE_WIDTH * 4) / 2,
                backgroundColor: accentColor,
                alignItems: 'center',
                justifyContent: 'center',
              },
              innerStyle,
            ]}
          >
            <Text style={{ fontSize: 22 }}>🏁</Text>
          </Animated.View>
        </View>
      </Pressable>

      {/* ── Label ───────────────────────────────────────────────────────── */}
      <Text
        style={{
          fontSize: 12,
          color: textColor,
          fontFamily: 'Inter_500Medium',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          opacity: 0.6,
        }}
      >
        Maintenir pour terminer
      </Text>
    </View>
  );
}
