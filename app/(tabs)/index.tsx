import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppCard, AppSectionTitle } from '@/components/ui/app-primitives';
import { AppTheme } from '@/constants/app-theme';

const universities = [
  { id: 'snu', name: 'Seoul National University', location: 'Seoul', tag: 'Top Rank' },
  { id: 'yonsei', name: 'Yonsei University', location: 'Seoul', tag: 'Popular' },
  { id: 'ku', name: 'Korea University', location: 'Seoul', tag: 'High Demand' },
];

const quickActions = [
  { id: 'topik', label: 'TOPIK Prep', icon: 'school' },
  { id: 'visa', label: 'Visa Info', icon: 'description' },
  { id: 'housing', label: 'Housing', icon: 'home-work' },
  { id: 'jobs', label: 'Part-time', icon: 'work' },
] as const;

const posts = [
  {
    id: 'p1',
    user: 'Minh Hoang',
    title: 'Tips to pass TOPIK level 3 in 3 months',
    preview: 'Built a weekly plan with grammar, listening and mock tests. Sharing what worked.',
    stats: '34 likes  11 comments',
  },
  {
    id: 'p2',
    user: 'Linh Nguyen',
    title: 'Part-time process in Seoul',
    preview: 'What papers are required, and how long approval took for my student visa.',
    stats: '27 likes  9 comments',
  },
  {
    id: 'p3',
    user: 'Anh Tu',
    title: 'Affordable food around campus',
    preview: 'A map list of budget-friendly restaurants close to subway stations.',
    stats: '45 likes  17 comments',
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandWrap}>
            <View style={styles.logoMark}>
              <MaterialIcons name="public" size={16} color={AppTheme.colors.text} />
            </View>
            <View>
              <Text style={styles.brand}>VietKorea Connect</Text>
              <Text style={styles.brandSub}>Community for study and life in Korea</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <MaterialIcons name="search" size={18} color={AppTheme.colors.text} />
            <MaterialIcons name="notifications-none" size={18} color={AppTheme.colors.text} />
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome back</Text>
          <Text style={styles.heroText}>Find universities, visa information, and local support.</Text>
          <View style={styles.searchInputWrap}>
            <MaterialIcons name="search" size={18} color={AppTheme.colors.textMuted} />
            <TextInput
              placeholder="Search universities or jobs"
              placeholderTextColor={AppTheme.colors.textMuted}
              style={styles.searchInput}
            />
          </View>
        </View>

        <View style={styles.section}>
          <AppSectionTitle title="Top Universities" actionLabel="View all" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
            {universities.map((uni) => (
              <AppCard key={uni.id} style={styles.uniCard}>
                <View style={styles.uniImage}>
                  <MaterialIcons name="account-balance" size={24} color={AppTheme.colors.text} />
                </View>
                <View style={styles.uniBody}>
                  <Text numberOfLines={1} style={styles.uniName}>
                    {uni.name}
                  </Text>
                  <Text style={styles.uniMeta}>{uni.location}</Text>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{uni.tag}</Text>
                  </View>
                </View>
              </AppCard>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <AppSectionTitle title="Quick Links" />
          <View style={styles.quickGrid}>
            {quickActions.map((action) => (
              <Pressable key={action.id} style={styles.quickTile}>
                <View style={styles.quickIconWrap}>
                  <MaterialIcons name={action.icon} size={20} color={AppTheme.colors.text} />
                </View>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppSectionTitle title="Language Community" actionLabel="New post" />
          <View style={styles.postList}>
            {posts.map((post) => (
              <AppCard key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.avatar} />
                  <Text style={styles.postUser}>{post.user}</Text>
                </View>
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postPreview}>{post.preview}</Text>
                <Text style={styles.postStats}>{post.stats}</Text>
              </AppCard>
            ))}
          </View>
        </View>
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
    paddingBottom: AppTheme.spacing.lg,
    paddingHorizontal: AppTheme.spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AppTheme.spacing.md,
    marginTop: AppTheme.spacing.sm,
  },
  brandWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
  },
  logoMark: {
    alignItems: 'center',
    backgroundColor: AppTheme.colors.accent,
    borderRadius: AppTheme.radius.pill,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  brand: {
    color: AppTheme.colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  brandSub: {
    color: AppTheme.colors.textMuted,
    fontSize: 11,
  },
  headerActions: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
  },
  hero: {
    backgroundColor: AppTheme.colors.accent,
    borderRadius: AppTheme.radius.lg,
    marginBottom: AppTheme.spacing.lg,
    padding: AppTheme.spacing.md,
  },
  heroTitle: {
    color: AppTheme.colors.text,
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 6,
  },
  heroText: {
    color: '#ffeaea',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: AppTheme.spacing.md,
  },
  searchInputWrap: {
    alignItems: 'center',
    backgroundColor: '#8d1717',
    borderColor: '#ff7a7a',
    borderRadius: AppTheme.radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: AppTheme.colors.text,
    flex: 1,
    height: 46,
  },
  section: {
    marginBottom: AppTheme.spacing.lg,
  },
  hRow: {
    gap: AppTheme.spacing.sm,
  },
  uniCard: {
    width: 236,
  },
  uniImage: {
    alignItems: 'center',
    backgroundColor: '#5a1a1a',
    height: 122,
    justifyContent: 'center',
  },
  uniBody: {
    padding: AppTheme.spacing.sm,
  },
  uniName: {
    color: AppTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  uniMeta: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    marginBottom: 8,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#5a2029',
    borderRadius: AppTheme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: AppTheme.colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickTile: {
    alignItems: 'center',
    gap: 8,
    width: '23%',
  },
  quickIconWrap: {
    alignItems: 'center',
    backgroundColor: AppTheme.colors.cardSoft,
    borderRadius: AppTheme.radius.pill,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  quickLabel: {
    color: AppTheme.colors.text,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  postList: {
    gap: AppTheme.spacing.sm,
  },
  postCard: {
    padding: AppTheme.spacing.sm,
  },
  postHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: '#7c3030',
    borderRadius: AppTheme.radius.pill,
    height: 28,
    marginRight: 8,
    width: 28,
  },
  postUser: {
    color: AppTheme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  postTitle: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  postPreview: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  postStats: {
    color: AppTheme.colors.accentSoft,
    fontSize: 11,
    fontWeight: '700',
  },
});
