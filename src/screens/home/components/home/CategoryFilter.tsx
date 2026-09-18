import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Category } from '../../../../types/types';
import { COLORS, RADIUS, SPACING } from '../../../../constants/theme';

interface Props {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

type Chip = { id: number | null; name: string };

const CategoryFilter: React.FC<Props> = ({
  categories,
  selectedId,
  onSelect,
}) => {
  const data: Chip[] = [{ id: null, name: 'All' }, ...categories];

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={data}
        keyExtractor={item => String(item.id ?? 'all')}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isActive = selectedId === item.id;
          return (
            <Pressable
              onPress={() => onSelect(item.id)}
              style={({ pressed }) => [
                styles.chip,
                isActive && styles.chipActive,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingTop: SPACING.md,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    height: 38,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.75,
  },
});

export default CategoryFilter;
