import { useCallback, useEffect, useState } from 'react';
import {
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsBySubCategoryQuery,
} from '../../../store/api';

export const useProductFilters = (initialCategoryId: number | null = null) => {
  const [categoryId, setCategoryId] = useState<number | null>(
    initialCategoryId,
  );
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);

  /** Sync when caller passes a new initialCategoryId (e.g. from Categories tab) */
  useEffect(() => {
    setCategoryId(initialCategoryId);
    setSubCategoryId(null);
  }, [initialCategoryId]);

  const all = useGetProductsQuery(undefined, {
    skip: categoryId !== null,
  });

  const byCategory = useGetProductsByCategoryQuery(categoryId as number, {
    skip: categoryId === null || subCategoryId !== null,
  });

  const bySubCategory = useGetProductsBySubCategoryQuery(
    subCategoryId as number,
    { skip: subCategoryId === null },
  );

  const active =
    subCategoryId !== null
      ? bySubCategory
      : categoryId !== null
      ? byCategory
      : all;

  const selectCategory = useCallback((id: number | null) => {
    setCategoryId(id);
    setSubCategoryId(null);
  }, []);

  const selectSubCategory = useCallback((id: number | null) => {
    setSubCategoryId(id);
  }, []);

  return {
    products: active.data ?? [],
    isLoading: active.isLoading,
    isFetching: active.isFetching,
    isError: active.isError,
    refetch: active.refetch,
    categoryId,
    subCategoryId,
    selectCategory,
    selectSubCategory,
  };
};
