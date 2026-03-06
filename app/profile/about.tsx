import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppCard } from '@/components/ui/app-primitives';
import { AppTheme } from '@/constants/app-theme';
import { getAnalyticsSnapshot } from '@/services/analytics';

export default function AboutScreen() {
  const events = getAnalyticsSnapshot();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard style={styles.card}>
          <Text style={styles.title}>VietKorea MVP</Text>
          <Text style={styles.body}>Version 1.0.0</Text>
          <Text style={styles.body}>Focused on university discovery, community support, and profile tools.</Text>
        </AppCard>

        <AppCard style={styles.card}>
          <Text style={styles.title}>Analytics status</Text>
          <Text style={styles.body}>Buffered events in this session: {events.length}</Text>
          <View style={styles.eventList}>
            {events.slice(-6).map((event) => (
              <Text key={`${event.name}-${event.timestamp}`} style={styles.eventRow}>
                {event.name} - {new Date(event.timestamp).toLocaleTimeString()}
              </Text>
            ))}
          </View>
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
  card: {
    marginBottom: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  body: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  eventList: {
    marginTop: 4,
  },
  eventRow: {
    color: AppTheme.colors.accentSoft,
    fontSize: 12,
    marginBottom: 2,
  },
});
