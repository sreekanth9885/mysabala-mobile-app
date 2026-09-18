import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../../../../constants/theme';

interface Props {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<Props> = ({
  message = 'Unable to load products',
  onRetry,
}) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <AlertCircle size={28} color={COLORS.error} />
    </View>
    <Text style={styles.title}>Something went wrong</Text>
    <Text style={styles.message}>{message}</Text>

    {onRetry && (
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    )}
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
    backgroundColor: COLORS.errorSoft,
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
  button: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ErrorState;
