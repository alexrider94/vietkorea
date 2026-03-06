import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton, AppChip } from '@/components/ui/app-primitives';
import { AppTheme } from '@/constants/app-theme';
import { useAppSession } from '@/providers/app-provider';
import { createPost } from '@/services/api';
import { recordError } from '@/services/observability';
import { CommunityPost } from '@/types/domain';

const categories: CommunityPost['category'][] = ['TOPIK', 'Visa', 'University Life', 'Housing', 'Jobs'];

export default function CreatePostScreen() {
  const router = useRouter();
  const { drafts, setDraft, clearDraft } = useAppSession();

  const [category, setCategory] = useState<CommunityPost['category']>('University Life');
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bodyDraftKey = 'create-post:body';
  const body = drafts[bodyDraftKey] ?? '';

  const canSubmit = useMemo(() => title.trim().length > 4 && body.trim().length > 10, [title, body]);

  const publish = async () => {
    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const post = await createPost({
        category,
        title: title.trim(),
        body: body.trim(),
      });

      clearDraft(bodyDraftKey);
      setTitle('');
      router.replace(`/community/${post.id}` as never);
    } catch (publishError) {
      recordError('create_post', publishError);
      setError('Unable to publish post. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create a post</Text>
        <Text style={styles.subtitle}>Draft is saved while you navigate in this session.</Text>

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((item) => (
            <AppChip key={item} label={item} selected={item === category} onPress={() => setCategory(item)} />
          ))}
        </View>

        <Text style={styles.label}>Title</Text>
        <TextInput
          accessibilityLabel="Post title"
          placeholder="Summarize your post"
          placeholderTextColor={AppTheme.colors.textMuted}
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Body</Text>
        <TextInput
          accessibilityLabel="Post body"
          multiline
          placeholder="Share practical details, steps, and outcomes"
          placeholderTextColor={AppTheme.colors.textMuted}
          style={styles.textArea}
          value={body}
          onChangeText={(value) => setDraft(bodyDraftKey, value)}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actions}>
          <View style={styles.actionHalf}>
            <AppButton label="Cancel" variant="secondary" onPress={() => router.back()} />
          </View>
          <View style={styles.actionHalf}>
            <AppButton label={submitting ? 'Publishing...' : 'Publish'} onPress={publish} />
          </View>
        </View>

        {!canSubmit ? (
          <Pressable accessibilityRole="none" style={styles.hintWrap}>
            <Text style={styles.hint}>Need at least 5 characters in title and 10 in body.</Text>
          </Pressable>
        ) : null}
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
    marginBottom: 8,
  },
  subtitle: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    marginBottom: AppTheme.spacing.md,
  },
  label: {
    color: AppTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  input: {
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    color: AppTheme.colors.text,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    color: AppTheme.colors.text,
    minHeight: 140,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  errorText: {
    color: AppTheme.colors.danger,
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: AppTheme.spacing.md,
  },
  actionHalf: {
    flex: 1,
  },
  hintWrap: {
    marginTop: 8,
  },
  hint: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
  },
});
