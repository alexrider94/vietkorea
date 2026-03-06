import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppButton } from '@/components/ui/app-primitives';
import { AppTheme } from '@/constants/app-theme';
import { getMe, patchMe } from '@/services/api';
import { trackEvent } from '@/services/analytics';
import { recordError } from '@/services/observability';
import { AnalyticsEventName } from '@/types/analytics';
import { UserProfile } from '@/types/domain';

export default function EditProfileScreen() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const me = await getMe();
        setProfile(me);
        setName(me.name);
        setCity(me.city);
        setBio(me.bio);
      } catch (loadError) {
        recordError('profile_edit_load', loadError);
        setError('Unable to load profile.');
      }
    }

    void init();
  }, []);

  const save = async () => {
    if (!profile) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await patchMe({
        name: name.trim(),
        city: city.trim(),
        bio: bio.trim(),
      });

      trackEvent(AnalyticsEventName.PROFILE_EDIT_SAVE, {
        profileId: profile.id,
      });

      router.back();
    } catch (saveError) {
      recordError('profile_edit_save', saveError);
      setError('Unable to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Edit profile</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          accessibilityLabel="Profile name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={AppTheme.colors.textMuted}
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          accessibilityLabel="Profile city"
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Current city"
          placeholderTextColor={AppTheme.colors.textMuted}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          accessibilityLabel="Profile bio"
          style={styles.textArea}
          value={bio}
          onChangeText={setBio}
          multiline
          placeholder="Short intro"
          placeholderTextColor={AppTheme.colors.textMuted}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <View style={styles.actionHalf}>
            <AppButton label="Cancel" variant="secondary" onPress={() => router.back()} />
          </View>
          <View style={styles.actionHalf}>
            <AppButton label={saving ? 'Saving...' : 'Save'} onPress={save} />
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
    padding: AppTheme.spacing.md,
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: AppTheme.spacing.md,
  },
  label: {
    color: AppTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    color: AppTheme.colors.text,
    marginBottom: AppTheme.spacing.sm,
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
    marginBottom: AppTheme.spacing.sm,
    minHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: AppTheme.spacing.sm,
  },
  actionHalf: {
    flex: 1,
  },
  error: {
    color: AppTheme.colors.danger,
    fontSize: 12,
  },
});
