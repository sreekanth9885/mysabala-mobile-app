import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../../../../types/types';
import {
  COLORS,
  IMAGE_BASE_URL,
  RADIUS,
  SPACING,
} from '../../../../constants/theme';

interface Props {
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, quantity, onAdd }) => {
  const imageUrl = product.image
    ? `${IMAGE_BASE_URL}${product.image}`
    : undefined;
  const inCart = quantity > 0;

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}

        {inCart && (
          <View style={styles.cartPill}>
            <Text style={styles.cartPillText}>{quantity} in cart</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <Text style={styles.category} numberOfLines={1}>
          {product.category_name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{Number(product.price).toFixed(2)}</Text>
          {product.unit && <Text style={styles.unit}>/ {product.unit}</Text>}
        </View>

        <Pressable
          onPress={() => onAdd(product)}
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
        >
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  imageWrap: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  cartPill: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
  },
  cartPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  body: {
    padding: SPACING.md,
  },
  name: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    color: COLORS.text,
    minHeight: 38,
  },
  category: {
    marginTop: 3,
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: SPACING.sm,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  unit: {
    marginLeft: 4,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  addBtn: {
    height: 38,
    marginTop: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});

export default memo(ProductCard);
