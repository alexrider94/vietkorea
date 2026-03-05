import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppCard, AppSectionTitle } from '@/components/ui/app-primitives';
import { AppTheme } from '@/constants/app-theme';

const stats = [
  { label: 'Posts', value: '109' },
  { label: 'Comments', value: '456' },
  { label: 'Saved', value: '24' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={28} color={AppTheme.colors.text} />
          </View>
          <Text style={styles.name}>Nguyen Van A</Text>
          <Text style={styles.meta}>Verified student - Seoul</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <AppCard key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </AppCard>
          ))}
        </View>

        <AppSectionTitle title="Settings" />
        <AppCard style={styles.menuItem}>
          <Text style={styles.menuTitle}>Edit profile</Text>
          <Text style={styles.menuMeta}>Name, bio, and profile photo</Text>
        </AppCard>
        <AppCard style={styles.menuItem}>
          <Text style={styles.menuTitle}>My activity</Text>
          <Text style={styles.menuMeta}>Posts, comments, and saved items</Text>
        </AppCard>
        <AppCard style={styles.menuItem}>
          <Text style={styles.menuTitle}>App settings</Text>
          <Text style={styles.menuMeta}>Language, theme, and notifications</Text>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppTheme.colors.background,
    flex: 1,
  },
  content: {
    padding: AppTheme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: AppTheme.spacing.lg,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: AppTheme.colors.cardSoft,
    borderRadius: AppTheme.radius.pill,
    height: 84,
    justifyContent: 'center',
    marginBottom: 10,
    width: 84,
  },
  name: {
    color: AppTheme.colors.text,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  meta: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: AppTheme.spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: AppTheme.spacing.sm,
  },
  statValue: {
    color: AppTheme.colors.text,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  statLabel: {
    color: AppTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
  },
  menuItem: {
    marginBottom: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
  },
  menuTitle: {
    color: AppTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  menuMeta: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
  },
});
