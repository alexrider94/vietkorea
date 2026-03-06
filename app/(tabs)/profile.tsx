import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppCard, AppSectionTitle } from '@/components/ui/app-primitives';
import { ErrorState, LoadingState } from '@/components/ui/screen-state';
import { AppTheme } from '@/constants/app-theme';
import { useAppSession } from '@/providers/app-provider';
import { getMe } from '@/services/api';
import { recordError } from '@/services/observability';
import { UserProfile } from '@/types/domain';

export default function ProfileScreen() {
  const router = useRouter();
  const { savedPostIds } = useAppSession();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMe();
      setProfile(response);
    } catch (loadError) {
      recordError('profile_load', loadError);
      setError('Unable to load profile right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

  const stats = useMemo(() => {
    if (!profile) {
      return [];
    }

    return [
      { label: 'Posts', value: String(profile.stats.posts) },
      { label: 'Comments', value: String(profile.stats.comments) },
      { label: 'Saved', value: String(savedPostIds.length || profile.stats.saved) },
    ];
  }, [profile, savedPostIds.length]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState label="Loading profile..." />
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState title="Profile unavailable" body={error ?? 'No profile data found.'} onRetry={loadProfile} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={28} color={AppTheme.colors.text} />
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.meta}>{profile.verified ? 'Verified student' : 'Member'} - {profile.city}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <AppCard key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </AppCard>
          ))}
        </View>

        <AppSectionTitle title="Account" />
        <MenuItem title="Edit profile" subtitle="Name, city, bio, and language" onPress={() => router.push('/profile/edit')} />

        <AppSectionTitle title="Activity" />
        <MenuItem
          title="Notifications"
          subtitle="Recent updates and reminders"
          onPress={() => router.push('/profile/notifications')}
        />

        <AppSectionTitle title="Support" />
        <MenuItem title="Help center" subtitle="Common questions and resources" onPress={() => router.push('/profile/help')} />
        <MenuItem title="About app" subtitle="Version, analytics, and roadmap notes" onPress={() => router.push('/profile/about')} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.menuWrap}>
      <AppCard style={styles.menuItem}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuMeta}>{subtitle}</Text>
      </AppCard>
    </Pressable>
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
    marginBottom: 4,
  },
  meta: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  bio: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
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
  menuWrap: {
    marginBottom: AppTheme.spacing.sm,
  },
  menuItem: {
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
