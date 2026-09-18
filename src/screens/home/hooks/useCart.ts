import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Product } from '../../../types/types';
import { addToCart, removeFromCart } from '../../../store/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const items = useSelector((s: RootState) => s.cart.items);

  const count = items.reduce((total, item) => total + item.quantity, 0);

  const add = useCallback(
    (product: Product) => dispatch(addToCart(product)),
    [dispatch],
  );

  const remove = useCallback(
    (id: number) => dispatch(removeFromCart(id)),
    [dispatch],
  );

  const getQuantity = useCallback(
    (id: number) => items.find(i => i.id === id)?.quantity ?? 0,
    [items],
  );

  return { items, count, add, remove, getQuantity };
};
