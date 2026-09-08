import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckoutCartItem } from '../types/checkoutType';
interface Props {
  item: CheckoutCartItem;
}
export default function OrderSummaryItem({ item }: Props) {
  const total = Number(item.price) * Number(item.quantity);
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.quantity}>
          {item.quantity} × ₹{Number(item.price).toFixed(2)}
        </Text>
      </View>
      <Text style={styles.price}>₹{total.toFixed(2)}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  details: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  quantity: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
});
