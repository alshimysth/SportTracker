/**
 * ExercisePicker — exercise selector (Story 2.5)
 *
 * Two-row UI:
 *   Row 1 — horizontal category tabs (Push / Pull / Leg / Full Body)
 *   Row 2 — horizontal exercise chips filtered by selected category
 *
 * 48px chip height minimum on exercise row (UX-DR10 secondary action).
 *
 * Props:
 *   exercises        — full exercise catalogue
 *   categories       — ordered category list
 *   selected         — currently selected Exercise
 *   onSelect         — callback when user taps an exercise
 *   accentColor      — active chip colour
 *   accentBg         — active chip background
 *   textColor        — inactive chip text
 *   chipBg           — inactive chip background
 *   categoryBg       — inactive category tab background
 */
import { useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, FlatList, ScrollView, type ListRenderItemInfo } from 'react-native';
import type { Exercise, ExerciseCategory } from '@/hooks/use-weightlifting-session';

interface Props {
  exercises: Exercise[];
  categories: ExerciseCategory[];
  selected: Exercise;
  onSelect: (exercise: Exercise) => void;
  accentColor: string;
  accentBg: string;
  textColor: string;
  chipBg: string;
  categoryBg: string;
}

export function ExercisePicker({
  exercises,
  categories,
  selected,
  onSelect,
  accentColor,
  accentBg,
  textColor,
  chipBg,
  categoryBg,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory>(
    selected.category,
  );

  const listRef = useRef<FlatList<Exercise>>(null);

  const filtered = exercises.filter((e) => e.category === activeCategory);

  const handleCategoryChange = useCallback(
    (cat: ExerciseCategory) => {
      setActiveCategory(cat);
      // Auto-select first exercise in the new category
      const first = exercises.find((e) => e.category === cat);
      if (first) onSelect(first);
      // Scroll exercise list to beginning
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    },
    [exercises, onSelect],
  );

  function renderExercise({ item }: ListRenderItemInfo<Exercise>) {
    const isActive = item.id === selected.id;
    return (
      <Pressable
        onPress={() => onSelect(item)}
        style={{
          minHeight: 48,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 14,
          backgroundColor: isActive ? accentBg : chipBg,
          borderWidth: 1.5,
          borderColor: isActive ? accentColor : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: isActive ? '600' : '400',
            fontFamily: isActive ? 'Inter_600SemiBold' : 'Inter_400Regular',
            color: isActive ? accentColor : textColor,
            letterSpacing: -0.2,
          }}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={{ paddingBottom: 4 }}>
      {/* Section label */}
      <Text
        style={{
          fontSize: 11,
          color: accentColor,
          fontFamily: 'Inter_500Medium',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          paddingHorizontal: 24,
          marginBottom: 10,
          marginTop: 12,
        }}
      >
        Exercice
      </Text>

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 8, paddingBottom: 10 }}
      >
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <Pressable
              key={cat}
              onPress={() => handleCategoryChange(cat)}
              style={{
                height: 32,
                paddingHorizontal: 14,
                borderRadius: 16,
                backgroundColor: isActive ? accentColor : categoryBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  fontFamily: 'Inter_600SemiBold',
                  color: isActive ? '#FFFFFF' : textColor,
                  letterSpacing: -0.1,
                }}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Exercise chips */}
      <FlatList
        ref={listRef}
        data={filtered}
        keyExtractor={(e) => e.id}
        renderItem={renderExercise}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      />
    </View>
  );
}
