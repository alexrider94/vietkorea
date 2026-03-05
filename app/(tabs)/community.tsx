import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppCard, AppChip, AppSectionTitle } from '@/components/ui/app-primitives';
import { AppTheme } from '@/constants/app-theme';

const categories = ['All Posts', 'TOPIK', 'Visa', 'University Life'];

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Community</Text>

        <View style={styles.chipsRow}>
          {categories.map((category, index) => (
            <AppChip key={category} label={category} selected={index === 0} />
          ))}
        </View>

        <AppSectionTitle title="Recent Posts" />

        <AppCard style={styles.post}>
          <View style={styles.postHeader}>
            <MaterialIcons name="person" size={18} color={AppTheme.colors.textMuted} />
            <Text style={styles.author}>Minh Hoang</Text>
          </View>
          <Text style={styles.postTitle}>Essential TOPIK level 5 study framework</Text>
          <Text style={styles.postBody}>
            Sprint 1 scope: shell route, category bar and feed card structure aligned to Figma.
          </Text>
        </AppCard>

        <AppCard style={styles.post}>
          <View style={styles.postHeader}>
            <MaterialIcons name="person" size={18} color={AppTheme.colors.textMuted} />
            <Text style={styles.author}>Linh Nguyen</Text>
          </View>
          <Text style={styles.postTitle}>Student visa extension checklist</Text>
          <Text style={styles.postBody}>
            Next sprint will add post detail, comments and composer interactions.
          </Text>
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: AppTheme.spacing.lg,
  },
  post: {
    marginBottom: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
  },
  postHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  author: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  postTitle: {
    color: AppTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  postBody: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
