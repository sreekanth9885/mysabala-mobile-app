import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { BottomTabParamList } from '../navigation/BottomTabs';

import { useGetCategoriesQuery } from '../store/api';
import { COLORS, SPACING } from '../constants/theme';
import { useCart } from './home/hooks/useCart';
import { useProductFilters } from './home/hooks/useProductFilters';
import LoadingState from './home/components/common/LoadingState';
import ErrorState from './home/components/common/ErrorState';
import HomeHeader from './home/components/home/HomeHeader';
import EmptyState from './home/components/common/EmptyState';
import ProductGrid from './home/components/home/ProductGrid';
import CategoryFilter from './home/components/home/CategoryFilter';
import SubCategoryFilter from './home/components/home/SubCategoryFilter';
type HomeRoute = RouteProp<BottomTabParamList, 'Home'>;
const HomeScreen = () => {
  const navigation =
    useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const route = useRoute<HomeRoute>();
  const initialCategoryId = route.params?.categoryId ?? null;
  const { count: cartCount, add, remove, getQuantity } = useCart();

  const {
    products,
    isLoading,
    isFetching,
    isError,
    refetch,
    categoryId,
    subCategoryId,
    selectCategory,
    selectSubCategory,
  } = useProductFilters(initialCategoryId);

  const { data: categories = [] } = useGetCategoriesQuery();

  /** Sub-categories for the currently selected parent category */
  const subCategories = useMemo(() => {
    if (categoryId === null) return [];
    const parent = categories.find(c => c.id === categoryId) as any;
    return parent?.sub_categories ?? [];
  }, [categories, categoryId]);

  const sectionTitle = useMemo(() => {
    if (categoryId === null) return 'All Products';
    return categories.find(c => c.id === categoryId)?.name ?? 'Products';
  }, [categories, categoryId]);

  /** What to show when the product list is empty */
  const listEmpty = isLoading ? (
    <LoadingState inline />
  ) : isError ? (
    <ErrorState onRetry={refetch} />
  ) : (
    <EmptyState
      title="No products here"
      message="Try a different category or sub-category."
    />
  );

  return (
    <View style={styles.container}>
      {/* <HomeHeader
        cartCount={cartCount}
        onCartPress={() => navigation.navigate('Cart')}
      /> */}

      <ProductGrid
        products={products}
        getQuantity={getQuantity}
        onAdd={add}
        refreshing={isFetching && !isLoading}
        onRefresh={refetch}
        ListHeader={
          <View>
            <CategoryFilter
              categories={categories}
              selectedId={categoryId}
              onSelect={selectCategory}
            />

            {subCategories.length > 0 && (
              <SubCategoryFilter
                subCategories={subCategories}
                selectedId={subCategoryId}
                onSelect={selectSubCategory}
              />
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
              {!isLoading && (
                <Text style={styles.sectionCount}>
                  {products.length} {products.length === 1 ? 'item' : 'items'}
                </Text>
              )}
            </View>
          </View>
        }
        ListEmpty={listEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});

export default HomeScreen;
