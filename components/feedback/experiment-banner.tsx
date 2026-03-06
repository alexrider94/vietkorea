import { StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function ExperimentBanner({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: AppTheme.colors.cardSoft,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    marginBottom: AppTheme.spacing.md,
    padding: AppTheme.spacing.md,
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  body: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
