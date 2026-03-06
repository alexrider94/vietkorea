import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.primary}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.primary}>{title}</Text>
      <Text style={styles.secondary}>{body}</Text>
    </View>
  );
}

export function ErrorState({
  title,
  body,
  onRetry,
}: {
  title: string;
  body: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.primary}>{title}</Text>
      <Text style={styles.secondary}>{body}</Text>
      <Pressable accessibilityRole="button" style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryText}>Retry</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.lg,
  },
  primary: {
    color: AppTheme.colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  secondary: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  retryText: {
    color: AppTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
});
