/**
 * GradeDial — horizontal grade selector (Story 2.4)
 *
 * Renders a snapping horizontal FlatList of grade chips (VB–V10).
 * The centred item is the selected grade — highlighted with the sport accent.
 * 64×64px touch targets on each chip (UX-DR10).
 *
 * Props:
 *   grades       — ordered array of grade strings
 *   selected     — currently selected grade
 *   onSelect     — callback when user taps a grade
 *   accentColor  — active chip background / text (climbing blue/cyan)
 *   textColor    — inactive chip text
 *   chipBg       — inactive chip background
 */
import { useRef, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  Pressable,
  type ListRenderItemInfo,
  type ViewToken,
} from 'react-native';

interface Props {
  grades: string[];
  selected: string;
  onSelect: (grade: string) => void;
  accentColor: string;
  textColor: string;
  chipBg: string;
  chipBgActive: string;
}

const CHIP_SIZE = 64;
const CHIP_GAP = 12;
const ITEM_WIDTH = CHIP_SIZE + CHIP_GAP;

export function GradeDial({
  grades,
  selected,
  onSelect,
  accentColor,
  textColor,
  chipBg,
  chipBgActive,
}: Props) {
  const listRef = useRef<FlatList<string>>(null);

  const scrollToGrade = useCallback(
    (grade: string) => {
      const idx = grades.indexOf(grade);
      if (idx !== -1) {
        listRef.current?.scrollToIndex({ index: idx, animated: true, viewPosition: 0.5 });
      }
    },
    [grades],
  );

  const handleSelect = useCallback(
    (grade: string) => {
      onSelect(grade);
      scrollToGrade(grade);
    },
    [onSelect, scrollToGrade],
  );

  // Snap to nearest grade when scroll settles
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const centre = viewableItems[Math.floor(viewableItems.length / 2)];
        if (centre?.item && centre.item !== selected) {
          onSelect(centre.item as string);
        }
      }
    },
    [selected, onSelect],
  );

  const viewabilityConfig = { itemVisiblePercentThreshold: 60 };

  function renderItem({ item }: ListRenderItemInfo<string>) {
    const isActive = item === selected;
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        style={{
          width: CHIP_SIZE,
          height: CHIP_SIZE,
          borderRadius: CHIP_SIZE / 2,
          backgroundColor: isActive ? chipBgActive : chipBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: CHIP_GAP,
          // Subtle scale hint handled via opacity
        }}
      >
        <Text
          style={{
            fontSize: isActive ? 18 : 15,
            fontWeight: isActive ? '700' : '500',
            fontFamily: isActive ? 'Inter_700Bold' : 'Inter_500Medium',
            color: isActive ? '#FFFFFF' : textColor,
            letterSpacing: -0.3,
          }}
        >
          {item}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={{ paddingVertical: 12 }}>
      {/* Label */}
      <Text
        style={{
          fontSize: 11,
          color: accentColor,
          fontFamily: 'Inter_500Medium',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          paddingHorizontal: 24,
          marginBottom: 12,
        }}
      >
        Grade
      </Text>

      <FlatList
        ref={listRef}
        data={grades}
        keyExtractor={(g) => g}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 24 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={grades.indexOf(selected)}
        getItemLayout={(_data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />

      {/* Selected grade large display */}
      <Text
        style={{
          fontSize: 48,
          fontWeight: '700',
          fontFamily: 'Inter_700Bold',
          color: accentColor,
          textAlign: 'center',
          letterSpacing: -2,
          marginTop: 8,
        }}
      >
        {selected}
      </Text>
    </View>
  );
}
