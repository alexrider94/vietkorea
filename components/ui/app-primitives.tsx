import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function AppSectionTitle({
  title,
  actionLabel,
  onActionPress,
}: {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          hitSlop={8}
          onPress={onActionPress}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function AppCard({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function AppChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.chip, selected ? styles.chipSelected : null]}
      onPress={onPress}>
      <Text style={styles.chipLabel}>{label}</Text>
    </Pressable>
  );
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.button, variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary]}
      onPress={onPress}>
      <Text style={styles.buttonLabel}>{label}</Text>
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
  button: {
    borderRadius: AppTheme.radius.pill,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  buttonPrimary: {
    backgroundColor: AppTheme.colors.accent,
  },
  buttonSecondary: {
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderWidth: 1,
  },
  buttonLabel: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
});
