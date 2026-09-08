import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
type Props = {
  subtotal: number;
  deliveryFee: number;
  gst: number;
  grandTotal: number;
  onCheckout: () => void;
  onClearCart: () => void;
};
export default function CartSummary({
  subtotal,
  deliveryFee,
  gst,
  grandTotal,
  onCheckout,
  onClearCart,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Delivery Fee</Text>
        <Text style={[styles.value, deliveryFee === 0 && styles.free]}>
          {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>GST (5%)</Text>
        <Text style={styles.value}>₹{gst.toFixed(2)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearButton} onPress={onClearCart}>
        <Text style={styles.clearText}>Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  free: {
    color: '#16a34a',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f97316',
  },
  checkoutButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  clearText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
  },
});
