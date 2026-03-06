import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppCard, AppChip, AppSectionTitle } from '@/components/ui/app-primitives';
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/screen-state';
import { AppTheme } from '@/constants/app-theme';
import { useAppSession } from '@/providers/app-provider';
import { getMajorOptions, getRegionOptions, getUniversities } from '@/services/api';
import { trackEvent } from '@/services/analytics';
import { recordError } from '@/services/observability';
import { AnalyticsEventName } from '@/types/analytics';
import { MajorFilter, RegionFilter, UniversitySummary } from '@/types/domain';

const PAGE_SIZE = 6;

export default function UniversityScreen() {
  const router = useRouter();
  const { universityFilters, setUniversityFilters, shortlistUniversityIds, toggleShortlistUniversity } =
    useAppSession();

  const [queryInput, setQueryInput] = useState(universityFilters.query);
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [majorModalVisible, setMajorModalVisible] = useState(false);
  const [draftRegion, setDraftRegion] = useState<RegionFilter>(universityFilters.region);
  const [draftMajor, setDraftMajor] = useState<MajorFilter>(universityFilters.major);

  const [items, setItems] = useState<UniversitySummary[]>([]);
  const [featured, setFeatured] = useState<UniversitySummary[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const regionOptions = useMemo(() => getRegionOptions(), []);
  const majorOptions = useMemo(() => getMajorOptions(), []);

  const loadUniversities = useCallback(
    async (nextPage: number, mode: 'replace' | 'append') => {
      if (mode === 'replace') {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      try {
        const response = await getUniversities(universityFilters, nextPage, PAGE_SIZE);

        setFeatured(response.featured);
        setHasNext(response.hasNext);
        setPage(response.page);

        if (mode === 'replace') {
          setItems(response.items);
        } else {
          setItems((current) => [...current, ...response.items]);
        }
      } catch (loadError) {
        recordError('university_load', loadError, {
          mode,
          page: nextPage,
        });
        setError('Unable to load universities. Retry or adjust filters.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [universityFilters],
  );

  useEffect(() => {
    setQueryInput(universityFilters.query);
    loadUniversities(1, 'replace');
  }, [loadUniversities, universityFilters]);

  const applySearch = () => {
    const nextQuery = queryInput.trim();
    setUniversityFilters({ query: nextQuery });
    trackEvent(AnalyticsEventName.UNIVERSITY_SEARCH, {
      query: nextQuery,
    });
  };

  const applyRegion = () => {
    setUniversityFilters({ region: draftRegion });
    setRegionModalVisible(false);
    trackEvent(AnalyticsEventName.UNIVERSITY_FILTER_APPLY, {
      filter: 'region',
      value: draftRegion,
    });
  };

  const applyMajor = () => {
    setUniversityFilters({ major: draftMajor });
    setMajorModalVisible(false);
    trackEvent(AnalyticsEventName.UNIVERSITY_FILTER_APPLY, {
      filter: 'major',
      value: draftMajor,
    });
  };

  const resetFilters = () => {
    const resetRegion: RegionFilter = 'All';
    const resetMajor: MajorFilter = 'All';

    setQueryInput('');
    setDraftRegion(resetRegion);
    setDraftMajor(resetMajor);

    setUniversityFilters({
      query: '',
      region: resetRegion,
      major: resetMajor,
    });

    trackEvent(AnalyticsEventName.UNIVERSITY_FILTER_APPLY, {
      filter: 'all',
      value: 'reset',
    });
  };

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>University Discovery</Text>
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={18} color={AppTheme.colors.textMuted} />
        <TextInput
          accessibilityLabel="University search input"
          placeholder="Search by university, location, or major"
          placeholderTextColor={AppTheme.colors.textMuted}
          style={styles.searchInput}
          value={queryInput}
          onChangeText={setQueryInput}
          onSubmitEditing={applySearch}
          returnKeyType="search"
        />
        <Pressable accessibilityRole="button" style={styles.searchAction} onPress={applySearch}>
          <Text style={styles.searchActionText}>Go</Text>
        </Pressable>
      </View>

      <View style={styles.filters}>
        <AppChip label={universityFilters.region} selected={universityFilters.region !== 'All'} onPress={() => setRegionModalVisible(true)} />
        <AppChip label={universityFilters.major} selected={universityFilters.major !== 'All'} onPress={() => setMajorModalVisible(true)} />
        <AppChip label="Reset" onPress={resetFilters} />
      </View>

      <AppSectionTitle title="Featured" actionLabel="Refresh" onActionPress={() => loadUniversities(1, 'replace')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
        {featured.map((university) => (
          <Pressable
            key={university.id}
            accessibilityRole="button"
            onPress={() => router.push(`/university/${university.id}` as never)}>
            <AppCard style={styles.featuredCard}>
              <Image source={{ uri: university.heroImage }} contentFit="cover" style={styles.featuredImage} />
              <View style={styles.featuredBody}>
                <Text numberOfLines={1} style={styles.featuredName}>
                  {university.name}
                </Text>
                <Text style={styles.featuredMeta}>{university.location}</Text>
              </View>
            </AppCard>
          </Pressable>
        ))}
      </ScrollView>

      <AppSectionTitle title="University List" />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LoadingState label="Loading universities..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState title="University list unavailable" body={error} onRetry={() => loadUniversities(1, 'replace')} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.content}
        data={items}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            title="No universities found"
            body="Try a broader query or clear filters to see more results."
          />
        }
        onEndReachedThreshold={0.35}
        onEndReached={() => {
          if (!loadingMore && hasNext) {
            void loadUniversities(page + 1, 'append');
          }
        }}
        renderItem={({ item }) => {
          const shortlisted = shortlistUniversityIds.includes(item.id);

          return (
            <Pressable
              accessibilityRole="button"
              style={styles.itemWrap}
              onPress={() => router.push(`/university/${item.id}` as never)}>
              <AppCard style={styles.listCard}>
                <Image source={{ uri: item.heroImage }} contentFit="cover" style={styles.listImage} />
                <View style={styles.listBody}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  <Text style={styles.itemMeta}>{item.location}</Text>
                  <Text style={styles.itemMeta}>
                    #{item.ranking}  {item.major}  {item.type}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    style={styles.shortlistButton}
                    onPress={() => toggleShortlistUniversity(item.id)}>
                    <Text style={styles.shortlistText}>
                      {shortlisted ? 'Shortlisted' : 'Add to shortlist'}
                    </Text>
                  </Pressable>
                </View>
              </AppCard>
            </Pressable>
          );
        }}
        ListFooterComponent={loadingMore ? <LoadingState label="Loading more..." /> : <View style={styles.footerSpace} />}
      />

      <FilterModal
        title="Select region"
        visible={regionModalVisible}
        options={regionOptions}
        selected={draftRegion}
        onSelect={(value) => setDraftRegion(value as RegionFilter)}
        onClose={() => setRegionModalVisible(false)}
        onApply={applyRegion}
      />

      <FilterModal
        title="Select major"
        visible={majorModalVisible}
        options={majorOptions}
        selected={draftMajor}
        onSelect={(value) => setDraftMajor(value as MajorFilter)}
        onClose={() => setMajorModalVisible(false)}
        onApply={applyMajor}
      />
    </SafeAreaView>
  );
}

function FilterModal({
  title,
  visible,
  options,
  selected,
  onSelect,
  onClose,
  onApply,
}: {
  title: string;
  visible: boolean;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  onApply: () => void;
}) {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => null}>
          <Text style={styles.modalTitle}>{title}</Text>
          <View style={styles.modalOptions}>
            {options.map((option) => (
              <Pressable
                key={option}
                accessibilityRole="button"
                style={[styles.modalOption, selected === option ? styles.modalOptionSelected : null]}
                onPress={() => onSelect(option)}>
                <Text style={styles.modalOptionLabel}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable accessibilityRole="button" style={styles.modalApplyButton} onPress={onApply}>
            <Text style={styles.modalApplyText}>Apply</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppTheme.colors.background,
    flex: 1,
  },
  content: {
    padding: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.xl,
  },
  title: {
    color: AppTheme.colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: AppTheme.spacing.md,
  },
  searchWrap: {
    alignItems: 'center',
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: AppTheme.spacing.sm,
    minHeight: 44,
    paddingHorizontal: 14,
  },
  searchInput: {
    color: AppTheme.colors.text,
    flex: 1,
    minHeight: 44,
  },
  searchAction: {
    backgroundColor: AppTheme.colors.accent,
    borderRadius: AppTheme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchActionText: {
    color: AppTheme.colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: AppTheme.spacing.md,
  },
  featuredRow: {
    gap: 10,
    marginBottom: AppTheme.spacing.lg,
  },
  featuredCard: {
    width: 220,
  },
  featuredImage: {
    height: 110,
    width: '100%',
  },
  featuredBody: {
    padding: AppTheme.spacing.sm,
  },
  featuredName: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  featuredMeta: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
  },
  itemWrap: {
    marginBottom: AppTheme.spacing.sm,
  },
  listCard: {
    flexDirection: 'row',
    minHeight: 100,
  },
  listImage: {
    width: 106,
  },
  listBody: {
    flex: 1,
    justifyContent: 'center',
    padding: AppTheme.spacing.sm,
  },
  itemTitle: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  itemMeta: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  shortlistButton: {
    alignSelf: 'flex-start',
    backgroundColor: AppTheme.colors.cardSoft,
    borderRadius: AppTheme.radius.pill,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  shortlistText: {
    color: AppTheme.colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  footerSpace: {
    height: 8,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: AppTheme.colors.backgroundRaised,
    borderTopLeftRadius: AppTheme.radius.lg,
    borderTopRightRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.lg,
  },
  modalTitle: {
    color: AppTheme.colors.text,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: AppTheme.spacing.sm,
  },
  modalOptions: {
    gap: 8,
    marginBottom: AppTheme.spacing.md,
  },
  modalOption: {
    backgroundColor: AppTheme.colors.card,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalOptionSelected: {
    backgroundColor: AppTheme.colors.accent,
    borderColor: AppTheme.colors.accent,
  },
  modalOptionLabel: {
    color: AppTheme.colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  modalApplyButton: {
    backgroundColor: AppTheme.colors.accent,
    borderRadius: AppTheme.radius.pill,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  modalApplyText: {
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
});
