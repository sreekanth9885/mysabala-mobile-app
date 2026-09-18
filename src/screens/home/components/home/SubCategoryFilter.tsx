import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../../../constants/theme';

interface SubCategory {
  id: number;
  name: string;
}

interface Props {
  subCategories: SubCategory[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

type Chip = { id: number | null; name: string };

const SubCategoryFilter: React.FC<Props> = ({
  subCategories,
  selectedId,
  onSelect,
}) => {
  const data: Chip[] = [{ id: null, name: 'All' }, ...subCategories];

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={data}
        keyExtractor={item => String(item.id ?? 'all-sub')}
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
    paddingTop: SPACING.sm,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    height: 32,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryBorder,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  chipTextActive: {
    color: COLORS.primaryDark,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default SubCategoryFilter;
