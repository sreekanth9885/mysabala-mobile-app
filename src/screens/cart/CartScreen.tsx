import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootState } from '../../store/store';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from '../../store/cartSlice';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { calculateCartTotals } from './utils/pricing';
import EmptyCart from './components/EmptyCart';
import CartItem from './components/CartItem';
import CartSummary from './components/CartSummary';
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export default function CartScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const { subtotal, deliveryFee, gst, grandTotal } =
    calculateCartTotals(cartItems);
  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login', {
        redirect: 'Checkout',
      });
      return;
    }
    navigation.navigate('Checkout');
  };
  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          dispatch(clearCart());
        },
      },
    ]);
  };
  if (cartItems.length === 0) {
    return <EmptyCart onBrowse={() => navigation.navigate('Main')} />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        <Text style={styles.count}>
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {cartItems.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onIncrease={() => dispatch(increaseQuantity(item.id))}
            onDecrease={() => dispatch(decreaseQuantity(item.id))}
            onRemove={() => dispatch(removeFromCart(item.id))}
          />
        ))}
        <CartSummary
          subtotal={subtotal}
          deliveryFee={deliveryFee}
          gst={gst}
          grandTotal={grandTotal}
          onCheckout={handleCheckout}
          onClearCart={handleClearCart}
        />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  count: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 3,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
});
