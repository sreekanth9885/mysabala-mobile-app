import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import OrderSummaryItem from './OrderSummaryItem';
import { CheckoutCartItem, CheckoutTotals } from '../types/checkoutType';

interface Props {
  items: CheckoutCartItem[];
  totals: CheckoutTotals;
}

export default function OrderSummary({ items, totals }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Order Summary</Text>

      <View style={styles.items}>
        {items.map(item => (
          <OrderSummaryItem key={item.id} item={item} />
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.label}>Subtotal</Text>

        <Text style={styles.value}>₹{totals.subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.label}>Delivery Fee</Text>

        <Text style={[styles.value, totals.deliveryFee === 0 && styles.free]}>
          {totals.deliveryFee === 0
            ? 'FREE'
            : `₹${totals.deliveryFee.toFixed(2)}`}
        </Text>
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.label}>GST</Text>

        <Text style={styles.value}>₹{totals.gst.toFixed(2)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.grandTotalRow}>
        <Text style={styles.grandTotalLabel}>Total</Text>

        <Text style={styles.grandTotal}>₹{totals.grandTotal.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    elevation: 2,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },

  items: {
    marginBottom: 12,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  label: {
    fontSize: 14,
    color: '#6b7280',
  },

  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },

  free: {
    color: '#16a34a',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },

  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  grandTotal: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f97316',
  },
});
