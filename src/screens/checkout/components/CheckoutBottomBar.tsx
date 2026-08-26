import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  total: number;
  loading: boolean;
  onPay: () => void;
}

export default function CheckoutBottomBar({ total, loading, onPay }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.label}>Total Amount</Text>

          <Text style={styles.total}>₹{total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabled]}
          onPress={onPay}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 8,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 12,
    color: '#6b7280',
  },

  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  button: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: 'center',
  },

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
