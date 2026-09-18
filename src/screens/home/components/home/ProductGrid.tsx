import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import ProductCard from './ProductCard';
import { Product } from '../../../../types/types';
import { COLORS, SPACING } from '../../../../constants/theme';

interface Props {
  products: Product[];
  getQuantity: (id: number) => number;
  onAdd: (product: Product) => void;
  ListHeader?: React.ReactElement | null;
  ListEmpty?: React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const ProductGrid: React.FC<Props> = ({
  products,
  getQuantity,
  onAdd,
  ListHeader,
  ListEmpty,
  refreshing = false,
  onRefresh,
}) => {
  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      ListHeaderComponent={ListHeader ?? undefined}
      ListEmptyComponent={ListEmpty ?? undefined}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        ) : undefined
      }
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <ProductCard
            product={item}
            quantity={getQuantity(item.id)}
            onAdd={onAdd}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: SPACING.xxl },
  row: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  cell: {
    flex: 1,
    maxWidth: '50%',
    marginBottom: SPACING.md,
  },
});

export default ProductGrid;
