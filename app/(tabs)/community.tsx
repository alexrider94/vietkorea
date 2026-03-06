import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ExperimentBanner } from '@/components/feedback/experiment-banner';
import { AppCard, AppChip } from '@/components/ui/app-primitives';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/screen-state';
import { AppTheme } from '@/constants/app-theme';
import { useAppSession } from '@/providers/app-provider';
import { getPosts } from '@/services/api';
import { isFeatureEnabled } from '@/services/feature-flags';
import { recordError } from '@/services/observability';
import { CommunityPost } from '@/types/domain';

const categories: CommunityPost['category'][] = ['All Posts', 'TOPIK', 'Visa', 'University Life', 'Housing', 'Jobs'];
const PAGE_SIZE = 5;

export default function CommunityScreen() {
  const router = useRouter();
  const { savedPostIds, toggleSavedPost } = useAppSession();

  const [category, setCategory] = useState<CommunityPost['category']>('All Posts');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(
    async (nextPage: number, mode: 'replace' | 'append') => {
      if (mode === 'replace') {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      try {
        const response = await getPosts(category, nextPage, PAGE_SIZE);
        setPage(response.page);
        setHasNext(response.hasNext);

        if (mode === 'replace') {
          setPosts(response.items);
        } else {
          setPosts((current) => [...current, ...response.items]);
        }
      } catch (loadError) {
        recordError('community_load', loadError, {
          category,
          mode,
        });
        setError('Unable to load community posts right now.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [category],
  );

  useEffect(() => {
    void loadPosts(1, 'replace');
  }, [loadPosts]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState label="Loading community..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState title="Community unavailable" body={error} onRetry={() => loadPosts(1, 'replace')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Community</Text>

        {isFeatureEnabled('growthCommunityPrompts') ? (
          <ExperimentBanner
            title="Weekly prompt"
            body="Share one practical tip that helped your first semester in Korea."
          />
        ) : null}

        <FlatList
          contentContainerStyle={styles.listContent}
          data={posts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.headerBlock}>
              <FlatList
                data={categories}
                horizontal
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsRow}
                renderItem={({ item }) => (
                  <AppChip
                    label={item}
                    selected={category === item}
                    onPress={() => {
                      setCategory(item);
                    }}
                  />
                )}
              />
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              title="No posts in this category"
              body="Switch categories or create the first post."
            />
          }
          onEndReachedThreshold={0.3}
          onEndReached={() => {
            if (hasNext && !loadingMore) {
              void loadPosts(page + 1, 'append');
            }
          }}
          renderItem={({ item }) => {
            const saved = savedPostIds.includes(item.id);

            return (
              <Pressable
                accessibilityRole="button"
                style={styles.postWrap}
                onPress={() => router.push(`/community/${item.id}` as never)}>
                <AppCard style={styles.postCard}>
                  {item.mediaUrl ? (
                    <Image source={{ uri: item.mediaUrl }} contentFit="cover" style={styles.postMedia} />
                  ) : null}

                  <View style={styles.postBody}>
                    <View style={styles.postMetaRow}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                      <Pressable
                        accessibilityRole="button"
                        hitSlop={8}
                        onPress={() => toggleSavedPost(item.id)}>
                        <MaterialIcons
                          name={saved ? 'bookmark' : 'bookmark-border'}
                          size={18}
                          color={AppTheme.colors.textMuted}
                        />
                      </Pressable>
                    </View>

                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text style={styles.postPreview}>{item.body}</Text>

                    <View style={styles.metricsRow}>
                      <Text style={styles.metricText}>{item.likes} likes</Text>
                      <Text style={styles.metricText}>{item.commentsCount} comments</Text>
                    </View>
                  </View>
                </AppCard>
              </Pressable>
            );
          }}
          ListFooterComponent={loadingMore ? <LoadingState label="Loading more posts..." /> : <View style={styles.footerGap} />}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        style={styles.createButton}
        onPress={() => router.push('/community/create')}>
        <MaterialIcons name="add" size={18} color={AppTheme.colors.text} />
        <Text style={styles.createButtonText}>New post</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppTheme.colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: AppTheme.spacing.md,
    paddingTop: AppTheme.spacing.md,
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: AppTheme.spacing.md,
  },
  headerBlock: {
    marginBottom: AppTheme.spacing.sm,
  },
  chipsRow: {
    gap: 8,
    paddingBottom: 6,
  },
  listContent: {
    paddingBottom: 90,
  },
  postWrap: {
    marginBottom: AppTheme.spacing.sm,
  },
  postCard: {
    overflow: 'hidden',
  },
  postMedia: {
    backgroundColor: AppTheme.colors.cardSoft,
    height: 140,
    width: '100%',
  },
  postBody: {
    padding: AppTheme.spacing.sm,
  },
  postMetaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryText: {
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
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metricText: {
    color: AppTheme.colors.accentSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  footerGap: {
    height: 8,
  },
  createButton: {
    alignItems: 'center',
    backgroundColor: AppTheme.colors.accent,
    borderRadius: AppTheme.radius.pill,
    bottom: 24,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 11,
    position: 'absolute',
    right: 16,
  },
  createButtonText: {
    color: AppTheme.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
});
