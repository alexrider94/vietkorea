import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppCard, AppButton } from '@/components/ui/app-primitives';
import { ErrorState, LoadingState } from '@/components/ui/screen-state';
import { AppTheme } from '@/constants/app-theme';
import { useAppSession } from '@/providers/app-provider';
import { getPostById, submitComment } from '@/services/api';
import { trackEvent } from '@/services/analytics';
import { recordError } from '@/services/observability';
import { AnalyticsEventName } from '@/types/analytics';
import { Comment, CommunityPost } from '@/types/domain';

export default function PostDetailScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const { drafts, setDraft, clearDraft } = useAppSession();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const draftKey = useMemo(() => `comment:${postId}`, [postId]);
  const draftComment = drafts[draftKey] ?? '';

  const loadDetail = useCallback(async () => {
    if (!postId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getPostById(postId);
      setPost(response.post);
      setComments(response.comments);

      trackEvent(AnalyticsEventName.POST_OPEN, {
        postId,
      });
    } catch (loadError) {
      recordError('post_detail_load', loadError, { postId });
      setError('Unable to load post details.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const handleSubmit = async () => {
    const trimmed = draftComment.trim();
    if (!trimmed || !postId) {
      return;
    }

    setSubmitting(true);

    try {
      await submitComment(postId, trimmed);
      clearDraft(draftKey);
      trackEvent(AnalyticsEventName.COMMENT_SUBMIT, {
        postId,
      });
      await loadDetail();
    } catch (submitError) {
      recordError('comment_submit', submitError, {
        postId,
      });
      setError('Comment submit failed. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState label="Loading post..." />
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState title="Post unavailable" body={error ?? 'Post not found.'} onRetry={loadDetail} />
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88}
      style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={comments}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <AppCard style={styles.postCard}>
            {post.mediaUrl ? <Image source={{ uri: post.mediaUrl }} contentFit="cover" style={styles.postMedia} /> : null}
            <View style={styles.postBody}>
              <Text style={styles.postCategory}>{post.category}</Text>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postText}>{post.body}</Text>
              <View style={styles.metricsRow}>
                <Text style={styles.metricText}>{post.likes} likes</Text>
                <Text style={styles.metricText}>{post.commentsCount} comments</Text>
              </View>
            </View>
          </AppCard>
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No comments yet</Text>
            <Text style={styles.emptyBody}>Start the conversation with the first reply.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <AppCard style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <MaterialIcons name="person" size={16} color={AppTheme.colors.textMuted} />
              <Text style={styles.commentAuthor}>{item.author}</Text>
            </View>
            <Text style={styles.commentBody}>{item.body}</Text>
            <Text style={styles.commentDate}>{new Date(item.createdAt).toLocaleString()}</Text>
          </AppCard>
        )}
      />

      <View style={styles.inputBar}>
        <TextInput
          accessibilityLabel="Comment input"
          multiline
          placeholder="Write a comment"
          placeholderTextColor={AppTheme.colors.textMuted}
          style={styles.input}
          value={draftComment}
          onChangeText={(value) => setDraft(draftKey, value)}
        />
        <View style={styles.submitButtonWrap}>
          <AppButton label={submitting ? 'Sending...' : 'Send'} onPress={handleSubmit} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppTheme.colors.background,
    flex: 1,
  },
  content: {
    padding: AppTheme.spacing.md,
    paddingBottom: 120,
  },
  postCard: {
    marginBottom: AppTheme.spacing.md,
  },
  postMedia: {
    height: 180,
    width: '100%',
  },
  postBody: {
    padding: AppTheme.spacing.md,
  },
  postCategory: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  postTitle: {
    color: AppTheme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  postText: {
    color: AppTheme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricText: {
    color: AppTheme.colors.accentSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyWrap: {
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
    padding: AppTheme.spacing.md,
  },
  emptyTitle: {
    color: AppTheme.colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyBody: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
  },
  commentCard: {
    marginBottom: AppTheme.spacing.sm,
    padding: AppTheme.spacing.sm,
  },
  commentHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  commentAuthor: {
    color: AppTheme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  commentBody: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  commentDate: {
    color: AppTheme.colors.textMuted,
    fontSize: 11,
  },
  inputBar: {
    backgroundColor: AppTheme.colors.backgroundRaised,
    borderTopColor: AppTheme.colors.border,
    borderTopWidth: 1,
    gap: 8,
    padding: AppTheme.spacing.sm,
  },
  input: {
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    color: AppTheme.colors.text,
    maxHeight: 120,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  submitButtonWrap: {
    alignSelf: 'flex-end',
    minWidth: 110,
  },
});
