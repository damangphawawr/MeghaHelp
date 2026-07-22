/**
 * Worker Detail Screen
 * Refactored: was 300 lines mixing contact logic, review form,
 * and time formatting inline. Now ~190 lines using dedicated components.
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useWorkers } from '@/context/WorkersContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/Avatar';
import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/Badge';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/Button';
import { ContactButtons } from '@/components/worker/ContactButtons';
import { ReviewCard } from '@/components/worker/ReviewCard';
import { ReviewForm } from '@/components/worker/ReviewForm';
import { shadow } from '@/utils/shadow';
import type { Worker } from '@/types';

// ── Local sub-components ─────────────────────────────────────────────────────

function WorkerHeader({ worker, topPad }: { worker: Worker; topPad: number }) {
  const colors = useColors();
  return (
    <View style={[styles.header, { paddingTop: topPad + 60, backgroundColor: colors.card }]}>
      <Avatar name={worker.fullName} photo={worker.profilePhoto} size={88} />
      <View style={styles.nameBlock}>
        <View style={styles.nameRow}>
          <Text style={[styles.workerName, { color: colors.foreground }]}>{worker.fullName}</Text>
          {worker.isVerified && (
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
          )}
        </View>
        <Text style={[styles.profession, { color: colors.primary }]}>
          {worker.customProfession ?? worker.profession}
        </Text>
        <StarRating rating={worker.rating} reviewCount={worker.reviewCount} size={15} />
      </View>
      <View style={styles.badges}>
        <Badge label={worker.availability} variant="success" icon="time-outline" />
        <Badge label={worker.serviceType} variant="primary" icon="navigate-outline" />
        {worker.isVerified && <Badge label="Verified" variant="verified" icon="shield-checkmark-outline" />}
      </View>
    </View>
  );
}

function SectionBlock({
  title, children, headerRight,
}: {
  title: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
        {headerRight}
      </View>
      {children}
    </View>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={16} color={colors.primary} />
      <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function WorkerDetailScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const colors   = useColors();
  const insets   = useSafeAreaInsets();
  const router   = useRouter();
  const { getWorkerById, getReviewsForWorker, hasUserReviewed } = useWorkers();
  const { user } = useAuth();

  const worker  = getWorkerById(id ?? '');
  const reviews = getReviewsForWorker(id ?? '');
  const alreadyReviewed = user ? hasUserReviewed(id ?? '', user.uid) : false;
  const [showReviewForm, setShowReviewForm] = useState(false);

  const topPad    = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  if (!worker) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="person-outline"
          title="Worker not found"
          message="This profile may have been removed."
        />
      </View>
    );
  }

  const details = [
    { icon: 'briefcase-outline',  label: 'Experience',    value: `${worker.yearsOfExperience} years` },
    { icon: 'location-outline',   label: 'District',      value: worker.district },
    { icon: 'map-outline',        label: 'Service Areas', value: worker.serviceAreas.join(', ') || '—' },
    { icon: 'chatbubble-outline', label: 'Languages',     value: worker.languages.join(', ') },
    ...(worker.price ? [{ icon: 'pricetag-outline', label: 'Rate', value: worker.price }] : []),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Floating back button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: topPad + 10, backgroundColor: colors.card, ...shadow('lg') }]}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      >
        <WorkerHeader worker={worker} topPad={topPad} />

        <ContactButtons
          phone={worker.phone}
          whatsapp={worker.whatsapp}
          isLoggedIn={!!user}
        />

        <SectionBlock title="About">
          <Text style={[styles.about, { color: colors.mutedForeground }]}>{worker.about}</Text>
        </SectionBlock>

        <SectionBlock title="Details">
          {details.map(d => <DetailRow key={d.label} {...d} />)}
        </SectionBlock>

        <SectionBlock
          title={`Reviews (${reviews.length})`}
          headerRight={
            user && !alreadyReviewed && !showReviewForm ? (
              <Button
                variant="ghost" size="sm"
                onPress={() => setShowReviewForm(true)}
                accessibilityLabel="Write a review for this worker"
              >
                Write a review
              </Button>
            ) : undefined
          }
        >
          {showReviewForm && user && (
            <ReviewForm
              workerId={worker.id}
              userId={user.uid}
              userName={user.name}
              onSubmitSuccess={() => setShowReviewForm(false)}
              onCancel={() => setShowReviewForm(false)}
            />
          )}
          {reviews.length === 0 ? (
            <Text style={[styles.noReviews, { color: colors.mutedForeground }]}>
              No reviews yet. Be the first to review!
            </Text>
          ) : (
            reviews.map(r => <ReviewCard key={r.id} review={r} />)
          )}
        </SectionBlock>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  backBtn: {
    position: 'absolute', left: 16, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  header:     { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24, gap: 10 },
  nameBlock:  { alignItems: 'center', gap: 6 },
  nameRow:    { flexDirection: 'row', alignItems: 'center', gap: 6 },
  workerName: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  profession: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  badges:     { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  section:    { marginHorizontal: 16, marginBottom: 16, gap: 10 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLabel: { width: 100, fontSize: 13, fontFamily: 'Inter_400Regular' },
  detailValue: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  about:      { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  noReviews:  { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', paddingVertical: 20 },
});
