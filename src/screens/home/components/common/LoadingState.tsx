import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS, SPACING } from '../../../../constants/theme';

interface Props {
  inline?: boolean;
}

const LoadingState: React.FC<Props> = ({ inline = false }) => (
  <View style={[styles.container, inline && styles.inline]}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  inline: {
    flex: 0,
    paddingVertical: SPACING.xxl * 2,
    backgroundColor: 'transparent',
  },
});

export default LoadingState;
