import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function AppSectionTitle({ title, actionLabel }: { title: string; actionLabel?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? <Text style={styles.actionLabel}>{actionLabel}</Text> : null}
    </View>
  );
}

export function AppCard({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function AppChip({ label, selected }: { label: string; selected?: boolean }) {
  return (
    <Pressable style={[styles.chip, selected ? styles.chipSelected : null]}>
      <Text style={styles.chipLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AppTheme.spacing.sm,
  },
  sectionTitle: {
    color: AppTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  actionLabel: {
    color: AppTheme.colors.accentSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chip: {
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: AppTheme.colors.accent,
    borderColor: AppTheme.colors.accent,
  },
  chipLabel: {
    color: AppTheme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});
