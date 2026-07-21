import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, Linking, Alert, TextInput,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useWorkers } from '@/context/WorkersContext';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/Avatar';
import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/Badge';
import { EmptyState } from '@/components/EmptyState';
import { Review } from '@/types';

export default function WorkerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { getWorkerById, getReviewsForWorker, addReview, hasUserReviewed } = useWorkers();
  const { user } = useAuth();

  const worker = getWorkerById(id ?? '');
  const reviews = getReviewsForWorker(id ?? '');
  const alreadyReviewed = user ? hasUserReviewed(id ?? '', user.uid) : false;

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom + 20;

  if (!worker) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState icon="person-outline" title="Worker not found" message="This profile may have been removed." />
      </View>
    );
  }

  const handleCall = () => {
    if (!user) { router.push('/auth/login'); return; }
    Linking.openURL(`tel:${worker.phone.replace(/\s/g, '')}`);
  };

  const handleWhatsApp = () => {
    if (!user) { router.push('/auth/login'); return; }
    const num = worker.whatsapp.replace(/[^0-9]/g, '');
    Linking.openURL(`https://wa.me/${num}`);
  };

  const handleSubmitReview = async () => {
    if (!user) { router.push('/auth/login'); return; }
    if (!reviewComment.trim()) { Alert.alert('', 'Please write a review before submitting.'); return; }
    setSubmitting(true);
    const review: Review = {
      id: `rev_${Date.now().toString(36)}`,
      workerId: worker.id,
      userId: user.uid,
      userName: user.name,
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString(),
    };
    await addReview(review);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowReviewForm(false);
    setReviewComment('');
    setReviewRating(5);
    setSubmitting(false);
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Back button */}
      <TouchableOpacity
        style={[styles.backBtn, { top: topPad + 10, backgroundColor: colors.card }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={22} color={colors.foreground} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      >
        {/* ── Profile Header ─────────────────────────────────────────── */}
        <View style={[styles.profileHeader, { paddingTop: topPad + 60, backgroundColor: colors.card }]}>
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

          <View style={styles.badgeRow}>
            <Badge label={worker.availability} variant="success" icon="time-outline" />
            <Badge label={worker.serviceType} variant="primary" icon="navigate-outline" />
            {worker.isVerified && <Badge label="Verified" variant="verified" icon="shield-checkmark-outline" />}
          </View>
        </View>

        {/* ── Contact buttons ─────────────────────────────────────────── */}
        <View style={styles.contactSection}>
          {user ? (
            <>
              <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.primary }]} onPress={handleCall}>
                <Ionicons name="call" size={20} color="#fff" />
                <Text style={styles.contactBtnText}>{worker.phone}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#25D366' }]} onPress={handleWhatsApp}>
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                <Text style={styles.contactBtnText}>{worker.whatsapp}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.lockBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
              onPress={() => router.push('/auth/login')}
            >
              <Ionicons name="lock-closed-outline" size={20} color={colors.mutedForeground} />
              <Text style={[styles.lockText, { color: colors.mutedForeground }]}>
                Sign in to view phone number
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── About ───────────────────────────────────────────────────── */}
        <View style={styles.infoCard}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>About</Text>
          <Text style={[styles.aboutText, { color: colors.mutedForeground }]}>{worker.about}</Text>
        </View>

        {/* ── Details ─────────────────────────────────────────────────── */}
        <View style={styles.infoCard}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Details</Text>
          {[
            { icon: 'briefcase-outline', label: 'Experience', value: `${worker.yearsOfExperience} years` },
            { icon: 'location-outline', label: 'District', value: worker.district },
            { icon: 'map-outline', label: 'Service Areas', value: worker.serviceAreas.join(', ') },
            { icon: 'chatbubble-outline', label: 'Languages', value: worker.languages.join(', ') },
            ...(worker.price ? [{ icon: 'pricetag-outline', label: 'Rate', value: worker.price }] : []),
          ].map(item => (
            <View key={item.label} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name={item.icon as any} size={16} color={colors.primary} />
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
              <Text style={[styles.detailValue, { color: colors.foreground }]}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Reviews ─────────────────────────────────────────────────── */}
        <View style={styles.infoCard}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Reviews ({reviews.length})
            </Text>
            {user && !alreadyReviewed && !showReviewForm && (
              <TouchableOpacity onPress={() => setShowReviewForm(true)}>
                <Text style={[styles.addReviewBtn, { color: colors.primary }]}>Write a review</Text>
              </TouchableOpacity>
            )}
          </View>

          {showReviewForm && (
            <View style={[styles.reviewForm, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={[styles.reviewFormTitle, { color: colors.foreground }]}>Your rating</Text>
              <StarRating
                rating={reviewRating}
                size={28}
                interactive
                onRatingChange={setReviewRating}
              />
              <TextInput
                style={[styles.reviewInput, { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border }]}
                placeholder="Share your experience..."
                placeholderTextColor={colors.mutedForeground}
                value={reviewComment}
                onChangeText={setReviewComment}
                multiline
                numberOfLines={3}
              />
              <View style={styles.reviewFormBtns}>
                <TouchableOpacity style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={() => setShowReviewForm(false)}>
                  <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.6 : 1 }]}
                  onPress={handleSubmitReview}
                  disabled={submitting}
                >
                  <Text style={styles.submitBtnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {reviews.length === 0 ? (
            <Text style={[styles.noReviews, { color: colors.mutedForeground }]}>
              No reviews yet. Be the first to review!
            </Text>
          ) : (
            reviews.map(review => (
              <View key={review.id} style={[styles.reviewItem, { borderTopColor: colors.border }]}>
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewerName, { color: colors.foreground }]}>{review.userName}</Text>
                  <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{timeAgo(review.createdAt)}</Text>
                </View>
                <StarRating rating={review.rating} size={13} />
                <Text style={[styles.reviewComment, { color: colors.mutedForeground }]}>{review.comment}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: {
    position: 'absolute', left: 16, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  profileHeader: {
    alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24, gap: 10,
  },
  nameBlock: { alignItems: 'center', gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  workerName: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  profession: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  contactSection: { padding: 16, gap: 10 },
  contactBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 14, borderRadius: 14,
  },
  contactBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  lockBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 14, borderWidth: 1,
  },
  lockText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  infoCard: { marginHorizontal: 16, marginBottom: 12, gap: 12 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  aboutText: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 11, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLabel: { width: 100, fontSize: 13, fontFamily: 'Inter_400Regular' },
  detailValue: { flex: 1, fontSize: 13, fontFamily: 'Inter_500Medium' },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addReviewBtn: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  reviewForm: { padding: 14, borderRadius: 14, borderWidth: 1, gap: 10 },
  reviewFormTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  reviewInput: {
    borderWidth: 1, borderRadius: 10, padding: 12,
    fontSize: 14, fontFamily: 'Inter_400Regular',
    minHeight: 80, textAlignVertical: 'top',
  },
  reviewFormBtns: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  cancelBtnText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  submitBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  submitBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  noReviews: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', paddingVertical: 20 },
  reviewItem: { paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, gap: 6 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewerName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  reviewDate: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  reviewComment: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
});
