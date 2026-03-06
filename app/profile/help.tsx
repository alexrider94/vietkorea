import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { AppCard } from '@/components/ui/app-primitives';
import { AppTheme } from '@/constants/app-theme';

const faqs = [
  {
    q: 'How do I compare universities?',
    a: 'Use the shortlist button in university cards and detail pages, then compare tuition, region, and scholarships.',
  },
  {
    q: 'How are community drafts saved?',
    a: 'Drafts are preserved while the app session is alive, so route changes do not drop your text.',
  },
  {
    q: 'How do I report incorrect info?',
    a: 'Open a community post with details and tag it with the relevant category for moderator follow-up.',
  },
];

export default function HelpCenterScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        {faqs.map((faq) => (
          <AppCard key={faq.q} style={styles.faqCard}>
            <Text style={styles.question}>{faq.q}</Text>
            <Text style={styles.answer}>{faq.a}</Text>
          </AppCard>
        ))}
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
  faqCard: {
    marginBottom: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
  },
  question: {
    color: AppTheme.colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  answer: {
    color: AppTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
