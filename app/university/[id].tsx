import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppCard, AppButton, AppSectionTitle } from '@/components/ui/app-primitives';
import { ErrorState, LoadingState } from '@/components/ui/screen-state';
import { AppTheme } from '@/constants/app-theme';
import { useAppSession } from '@/providers/app-provider';
import { getUniversityById } from '@/services/api';
import { trackEvent } from '@/services/analytics';
import { isFeatureEnabled } from '@/services/feature-flags';
import { recordError } from '@/services/observability';
import { AnalyticsEventName } from '@/types/analytics';
import { UniversityDetail } from '@/types/domain';

export default function UniversityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { shortlistUniversityIds, toggleShortlistUniversity } = useAppSession();

  const [detail, setDetail] = useState<UniversityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    if (!id) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getUniversityById(id);
      setDetail(response);

      trackEvent(AnalyticsEventName.UNIVERSITY_DETAIL_OPEN, {
        universityId: id,
      });
    } catch (loadError) {
      recordError('university_detail_load', loadError, { id });
      setError('Unable to open university detail.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState label="Loading university detail..." />
      </SafeAreaView>
    );
  }

  if (error || !detail) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState title="University detail unavailable" body={error ?? 'University not found.'} onRetry={loadDetail} />
      </SafeAreaView>
    );
  }

  const shortlisted = shortlistUniversityIds.includes(detail.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: detail.heroImage }} contentFit="cover" style={styles.heroImage} />

        <View style={styles.heroBody}>
          <Text style={styles.title}>{detail.name}</Text>
          <Text style={styles.meta}>{detail.location}</Text>
          <Text style={styles.meta}>
            #{detail.ranking} {detail.type} {detail.major}
          </Text>
          <Text style={styles.summary}>{detail.summary}</Text>

          <View style={styles.statsRow}>
            <AppCard style={styles.statCard}>
              <Text style={styles.statTitle}>Tuition</Text>
              <Text style={styles.statValue}>{detail.tuitionRange}</Text>
            </AppCard>
            <AppCard style={styles.statCard}>
              <Text style={styles.statTitle}>Region</Text>
              <Text style={styles.statValue}>{detail.region}</Text>
            </AppCard>
          </View>

          <AppSectionTitle title="Programs" />
          <View style={styles.blockWrap}>
            {detail.programs.map((program) => (
              <Text key={program} style={styles.bulletItem}>
                - {program}
              </Text>
            ))}
          </View>

          <AppSectionTitle title="Scholarships" />
          <View style={styles.blockWrap}>
            {detail.scholarships.map((scholarship) => (
              <Text key={scholarship} style={styles.bulletItem}>
                - {scholarship}
              </Text>
            ))}
          </View>

          <AppSectionTitle title="Location" />
          <AppCard style={styles.mapCard}>
            <MaterialIcons name="place" size={20} color={AppTheme.colors.accentSoft} />
            <Text style={styles.mapText}>{detail.mapLabel}</Text>
          </AppCard>

          <View style={styles.actionRow}>
            <View style={styles.actionHalf}>
              <AppButton label="Open community Q&A" onPress={() => router.push('/community')} />
            </View>
            <View style={styles.actionHalf}>
              <AppButton
                label={shortlisted ? 'Remove shortlist' : 'Add shortlist'}
                variant="secondary"
                onPress={() => toggleShortlistUniversity(detail.id)}
              />
            </View>
          </View>

          {isFeatureEnabled('growthUniversityComparison') ? (
            <AppCard style={styles.comparisonCard}>
              <Text style={styles.comparisonTitle}>Comparison shortlist</Text>
              <Text style={styles.comparisonBody}>
                Build a shortlist of 2-3 schools and compare tuition, location, and scholarship fit.
              </Text>
              <Text style={styles.comparisonBody}>Shortlisted now: {shortlistUniversityIds.length}</Text>
            </AppCard>
          ) : null}
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
    paddingBottom: AppTheme.spacing.xl,
  },
  heroImage: {
    height: 220,
    width: '100%',
  },
  heroBody: {
    padding: AppTheme.spacing.md,
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  meta: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    marginBottom: 4,
  },
  summary: {
    color: AppTheme.colors.text,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: AppTheme.spacing.md,
    marginTop: 8,
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
  statTitle: {
    color: AppTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  statValue: {
    color: AppTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  blockWrap: {
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    marginBottom: AppTheme.spacing.md,
    padding: AppTheme.spacing.sm,
  },
  bulletItem: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  mapCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: AppTheme.spacing.lg,
    padding: AppTheme.spacing.sm,
  },
  mapText: {
    color: AppTheme.colors.textMuted,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: AppTheme.spacing.md,
  },
  actionHalf: {
    flex: 1,
  },
  comparisonCard: {
    padding: AppTheme.spacing.md,
  },
  comparisonTitle: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  comparisonBody: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});
