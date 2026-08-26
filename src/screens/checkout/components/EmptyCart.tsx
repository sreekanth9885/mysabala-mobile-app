import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  onContinue: () => void;
}

export default function EmptyCart({ onContinue }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🛒</Text>

      <Text style={styles.title}>Your Cart is Empty</Text>

      <Text style={styles.subtitle}>
        Add some products before checking out.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
  },

  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginTop: 24,
  },

  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
