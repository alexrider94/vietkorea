import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppCard, AppChip, AppSectionTitle } from '@/components/ui/app-primitives';
import { AppTheme } from '@/constants/app-theme';

export default function UniversityScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>University</Text>

        <View style={styles.filters}>
          <AppChip label="All" selected />
          <AppChip label="Region" />
          <AppChip label="Major" />
        </View>

        <AppSectionTitle title="Featured" />
        <AppCard style={styles.featured}>
          <View style={styles.banner}>
            <MaterialIcons name="location-city" size={28} color={AppTheme.colors.text} />
          </View>
          <View style={styles.featuredBody}>
            <Text style={styles.featuredTitle}>Seoul National University</Text>
            <Text style={styles.featuredMeta}>Seoul</Text>
          </View>
        </AppCard>

        <AppSectionTitle title="University List" />
        <AppCard style={styles.listItem}>
          <Text style={styles.itemTitle}>Korea University</Text>
          <Text style={styles.itemMeta}>Seoul - Private - Programs overview</Text>
        </AppCard>
        <AppCard style={styles.listItem}>
          <Text style={styles.itemTitle}>KAIST</Text>
          <Text style={styles.itemMeta}>Daejeon - Public - Engineering focus</Text>
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
  title: {
    color: AppTheme.colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: AppTheme.spacing.md,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: AppTheme.spacing.lg,
  },
  featured: {
    marginBottom: AppTheme.spacing.lg,
  },
  banner: {
    alignItems: 'center',
    backgroundColor: '#522024',
    height: 120,
    justifyContent: 'center',
  },
  featuredBody: {
    padding: AppTheme.spacing.md,
  },
  featuredTitle: {
    color: AppTheme.colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  featuredMeta: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
  },
  listItem: {
    marginBottom: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
  },
  itemTitle: {
    color: AppTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  itemMeta: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
  },
});
