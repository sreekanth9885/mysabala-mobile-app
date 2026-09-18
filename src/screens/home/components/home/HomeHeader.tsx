import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../../constants/theme';

interface Props {
  cartCount: number;
  onCartPress: () => void;
}

const HomeHeader: React.FC<Props> = ({ cartCount, onCartPress }) => (
  <View style={styles.container}>
    <View style={styles.textBlock}>
      <Text style={styles.eyebrow}>Welcome back</Text>
      <Text style={styles.title}>Discover Products</Text>
    </View>

    <Pressable
      onPress={onCartPress}
      style={({ pressed }) => [styles.cartButton, pressed && styles.pressed]}
      hitSlop={8}
    >
      <ShoppingBag size={22} color={COLORS.primaryDark} />

      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {cartCount > 99 ? '99+' : cartCount}
          </Text>
        </View>
      )}
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  textBlock: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  title: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default HomeHeader;
