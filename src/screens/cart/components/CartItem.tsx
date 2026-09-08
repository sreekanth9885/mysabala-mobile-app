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
  const total = Number(item.price) * Number(item.quantity);
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: getImageUrl(item.image),
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            {item.category_name && (
              <Text style={styles.category}>{item.category_name}</Text>
            )}
            <Text style={styles.price}>₹{Number(item.price).toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            onPress={onRemove}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <Text style={styles.remove}>Remove</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onDecrease}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onIncrease}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>₹{total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  category: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 3,
  },
  price: {
    fontSize: 13,
    color: '#374151',
    marginTop: 5,
  },
  remove: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#111827',
    lineHeight: 22,
  },
  quantity: {
    fontSize: 15,
    fontWeight: '600',
    marginHorizontal: 12,
    color: '#111827',
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f97316',
  },
});
