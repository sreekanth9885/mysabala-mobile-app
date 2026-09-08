import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getImageUrl } from '../utils/image';
type Props = {
  item: any;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};
export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const price = Number(item.price);
  const quantity = Number(item.quantity);
  const total = price * quantity;
  const availableStock = Number(item.available_quantity ?? 0);
  const trackInventory = Number(item.track_inventory) === 1;
  const isOutOfStock = trackInventory && availableStock <= 0;
  const quantityExceeded =
    trackInventory && availableStock > 0 && quantity > availableStock;
  const increaseDisabled =
    trackInventory && (isOutOfStock || quantity >= availableStock);
  return (
    <View
      style={[
        styles.container,
        (isOutOfStock || quantityExceeded) && styles.stockProblemContainer,
      ]}
    >
      <Image source={{ uri: getImageUrl(item.image) }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            {item.category_name && (
              <Text style={styles.category} numberOfLines={1}>
                {item.category_name}
              </Text>
            )}
            <Text style={styles.price}> ₹{price.toFixed(2)} </Text>
          </View>
          <TouchableOpacity
            onPress={onRemove}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.remove}> Remove </Text>
          </TouchableOpacity>
        </View>
        {trackInventory && (
          <View style={styles.stockContainer}>
            {isOutOfStock ? (
              <Text style={styles.stockError}>
                ⚠ This product is currently out of stock.
              </Text>
            ) : quantityExceeded ? (
              <Text style={styles.stockError}>
                ⚠ Only {availableStock} available. Your cart has {quantity}.
              </Text>
            ) : (
              <Text
                style={[
                  styles.availableStock,
                  availableStock <= 5 ? styles.lowStock : styles.goodStock,
                ]}
              >
                Available stock: {availableStock}
              </Text>
            )}
          </View>
        )}
        <View style={styles.bottomRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity <= 1 && styles.quantityButtonDisabled,
              ]}
              onPress={onDecrease}
              disabled={quantity <= 1}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  quantity <= 1 && styles.quantityButtonTextDisabled,
                ]}
              ></Text>
            </TouchableOpacity>
            <Text style={styles.quantity}> {quantity} </Text>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                increaseDisabled && styles.quantityButtonDisabled,
              ]}
              onPress={onIncrease}
              disabled={increaseDisabled}
            >
              <Text
                style={[
                  styles.quantityButtonText,
                  increaseDisabled && styles.quantityButtonTextDisabled,
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.total}> ₹{total.toFixed(2)} </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  stockProblemContainer: { borderColor: '#FECACA' },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  content: { flex: 1, marginLeft: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  info: { flex: 1, marginRight: 8 },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  category: { fontSize: 12, color: '#6B7280', marginTop: 3 },
  price: { fontSize: 13, color: '#F97316', fontWeight: '600', marginTop: 5 },
  remove: { fontSize: 12, color: '#EF4444', fontWeight: '500' },
  stockContainer: { marginTop: 8 },
  availableStock: { fontSize: 12, fontWeight: '500' },
  goodStock: { color: '#16A34A' },
  lowStock: { color: '#EA580C' },
  stockError: {
    fontSize: 12,
    fontWeight: '500',
    color: '#DC2626',
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: { backgroundColor: '#F3F4F6' },
  quantityButtonText: { fontSize: 20, color: '#111827', lineHeight: 22 },
  quantityButtonTextDisabled: { color: '#9CA3AF' },
  quantity: {
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 12,
    color: '#111827',
    minWidth: 20,
    textAlign: 'center',
  },
  total: { fontSize: 16, fontWeight: '700', color: '#F97316' },
});
