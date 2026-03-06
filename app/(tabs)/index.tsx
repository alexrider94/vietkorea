import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useCallback, useMemo, useState } from 'react';
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
import { ErrorState, LoadingState } from '@/components/ui/screen-state';
import { AppTheme } from '@/constants/app-theme';
import { useAppSession } from '@/providers/app-provider';
import { getPosts, getUniversities, getMe } from '@/services/api';
import { getExperimentVariant } from '@/services/feature-flags';
import { recordError } from '@/services/observability';
import { CommunityPost, UniversitySummary } from '@/types/domain';

const quickActions = [
  { id: 'topik', label: 'TOPIK Prep', icon: 'school', destination: '/community' as const },
  { id: 'visa', label: 'Visa Info', icon: 'description', destination: '/community' as const },
  { id: 'housing', label: 'Housing', icon: 'home-work', destination: '/community' as const },
  { id: 'jobs', label: 'Part-time', icon: 'work', destination: '/community' as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const { setUniversityFilters } = useAppSession();

  const [topUniversities, setTopUniversities] = useState<UniversitySummary[]>([]);
  const [communityPreview, setCommunityPreview] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [heroVariant, setHeroVariant] = useState<'control' | 'variant_a'>('control');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [universityResponse, postResponse, profile] = await Promise.all([
        getUniversities({ query: '', region: 'All', major: 'All' }),
        getPosts('All Posts', 1, 3),
        getMe(),
      ]);

      setTopUniversities(universityResponse.featured);
      setCommunityPreview(postResponse.items);
      setHeroVariant(getExperimentVariant(profile.id));
    } catch (loadError) {
      recordError('home_load', loadError);
      setError('Unable to load home dashboard right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const heroTitle = useMemo(() => {
    if (heroVariant === 'variant_a') {
      return 'Your Korea journey, mapped';
    }
    return 'Welcome back';
  }, [heroVariant]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState label="Loading home..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState title="Home unavailable" body={error} onRetry={loadData} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
          <Text style={styles.heroTitle}>{heroTitle}</Text>
          <Text style={styles.heroText}>
            Search universities, compare options, and ask the community in one flow.
          </Text>
          <View style={styles.searchInputWrap}>
            <MaterialIcons name="search" size={18} color={AppTheme.colors.textMuted} />
            <TextInput
              accessibilityLabel="Search universities"
              placeholder="Search universities or majors"
              placeholderTextColor={AppTheme.colors.textMuted}
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => {
                setUniversityFilters({ query });
                router.push('/university');
              }}
              returnKeyType="search"
            />
          </View>
        </View>

        <View style={styles.section}>
          <AppSectionTitle
            title="Top Universities"
            actionLabel="View all"
            onActionPress={() => {
              router.push('/university');
            }}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hRow}>
            {topUniversities.map((university) => (
              <Pressable
                key={university.id}
                accessibilityRole="button"
                onPress={() => router.push(`/university/${university.id}` as never)}>
                <AppCard style={styles.uniCard}>
                  <Image source={{ uri: university.heroImage }} contentFit="cover" style={styles.uniImage} />
                  <View style={styles.uniBody}>
                    <Text numberOfLines={1} style={styles.uniName}>
                      {university.name}
                    </Text>
                    <Text style={styles.uniMeta}>{university.location}</Text>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>{university.featuredTag}</Text>
                    </View>
                  </View>
                </AppCard>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <AppSectionTitle title="Quick Links" />
          <View style={styles.quickGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                accessibilityRole="button"
                style={styles.quickTile}
                onPress={() => router.push(action.destination)}>
                <View style={styles.quickIconWrap}>
                  <MaterialIcons name={action.icon as never} size={20} color={AppTheme.colors.text} />
                </View>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppSectionTitle
            title="Community Preview"
            actionLabel="See all"
            onActionPress={() => router.push('/community')}
          />
          <View style={styles.postList}>
            {communityPreview.map((post) => (
              <Pressable
                key={post.id}
                accessibilityRole="button"
                onPress={() => router.push(`/community/${post.id}` as never)}>
                <AppCard style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={styles.avatar} />
                    <Text style={styles.postUser}>{post.author}</Text>
                  </View>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postPreview}>{post.body}</Text>
                  <Text style={styles.postStats}>
                    {post.likes} likes  {post.commentsCount} comments
                  </Text>
                </AppCard>
              </Pressable>
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
    minHeight: 44,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: AppTheme.colors.text,
    flex: 1,
    minHeight: 44,
  },
  section: {
    marginBottom: AppTheme.spacing.lg,
  },
  hRow: {
    gap: AppTheme.spacing.sm,
  },
  uniCard: {
    width: 230,
  },
  uniImage: {
    backgroundColor: AppTheme.colors.cardSoft,
    height: 110,
    width: '100%',
  },
  uniBody: {
    padding: AppTheme.spacing.sm,
  },
  uniName: {
    color: AppTheme.colors.text,
    fontSize: 14,
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
    backgroundColor: AppTheme.colors.cardSoft,
    borderRadius: AppTheme.radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: AppTheme.colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm,
  },
  quickTile: {
    alignItems: 'center',
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    minHeight: 72,
    padding: AppTheme.spacing.sm,
    width: '48%',
  },
  quickIconWrap: {
    alignItems: 'center',
    backgroundColor: AppTheme.colors.cardSoft,
    borderRadius: AppTheme.radius.pill,
    height: 30,
    justifyContent: 'center',
    marginBottom: 8,
    width: 30,
  },
  quickLabel: {
    color: AppTheme.colors.text,
    fontSize: 12,
    fontWeight: '700',
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
    gap: 6,
    marginBottom: 8,
  },
  avatar: {
    backgroundColor: AppTheme.colors.cardSoft,
    borderRadius: AppTheme.radius.pill,
    height: 24,
    width: 24,
  },
  postUser: {
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
  postPreview: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  postStats: {
    color: AppTheme.colors.accentSoft,
    fontSize: 12,
    fontWeight: '700',
  },
});
