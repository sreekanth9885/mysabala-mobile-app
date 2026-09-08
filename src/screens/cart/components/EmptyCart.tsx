import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
type Props = {
  onBrowse: () => void;
};
export default function EmptyCart({ onBrowse }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🛒</Text>
      <Text style={styles.title}>Your Cart is Empty</Text>
      <Text style={styles.subtitle}>Add some delicious food</Text>
      <TouchableOpacity style={styles.button} onPress={onBrowse}>
        <Text style={styles.buttonText}>Browse Menu</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f9fafb',
  },
  emoji: {
    fontSize: 60,
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
  },
  button: {
    backgroundColor: '#f97316',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
