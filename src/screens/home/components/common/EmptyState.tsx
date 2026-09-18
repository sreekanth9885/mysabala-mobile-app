import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PackageOpen } from 'lucide-react-native';
import { COLORS, SPACING } from '../../../../constants/theme';

interface Props {
  title?: string;
  message?: string;
}

const EmptyState: React.FC<Props> = ({
  title = 'No products found',
  message = 'Try a different category or check back later.',
}) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <PackageOpen size={28} color={COLORS.primary} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.xl,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  message: {
    marginTop: SPACING.xs,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default EmptyState;
