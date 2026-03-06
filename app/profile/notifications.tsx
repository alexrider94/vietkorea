import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';

import { AppCard } from '@/components/ui/app-primitives';
import { ErrorState, LoadingState } from '@/components/ui/screen-state';
import { AppTheme } from '@/constants/app-theme';
import { getNotifications } from '@/services/api';
import { recordError } from '@/services/observability';
import { NotificationItem } from '@/types/domain';

export default function NotificationsScreen() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setItems(await getNotifications());
    } catch (loadError) {
      recordError('notifications_load', loadError);
      setError('Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadNotifications();
    }, [loadNotifications]),
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState label="Loading notifications..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState title="Notifications unavailable" body={error} onRetry={loadNotifications} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppCard style={styles.notificationCard}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
            <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
          </AppCard>
        )}
      />
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
  notificationCard: {
    marginBottom: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  body: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  time: {
    color: AppTheme.colors.accentSoft,
    fontSize: 11,
    fontWeight: '700',
  },
});
