/**
 * ReviewForm — inline review submission form.
 * Extracted from worker/[id].tsx where it was ~40 lines of inline JSX.
 * Manages its own rating + comment state; calls back on success/cancel.
 */
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { useWorkers } from '@/context/WorkersContext';
import { StarRating } from '@/components/StarRating';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Review } from '@/types';

interface ReviewFormProps {
  workerId: string;
  userId: string;
  userName: string;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

export function ReviewForm({
  workerId, userId, userName,
  onSubmitSuccess, onCancel,
}: ReviewFormProps) {
  const colors = useColors();
  const { addReview } = useWorkers();
  const [rating, setRating]       = useState(5);
  const [comment, setComment]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('', 'Please write something before submitting.');
      return;
    }
    setSubmitting(true);
    const review: Review = {
      id:        `rev_${Date.now().toString(36)}`,
      workerId, userId, userName,
      rating,
      comment:   comment.trim(),
      createdAt: new Date().toISOString(),
    };
    await addReview(review);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitting(false);
    onSubmitSuccess();
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.muted, borderColor: colors.border }]}
      accessible={false}
    >
      <StarRating
        rating={rating}
        size={28}
        interactive
        onRatingChange={setRating}
      />
      <FormInput
        label="Your review"
        placeholder="Share your experience with this worker…"
        value={comment}
        onChangeText={setComment}
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
      />
      <View style={styles.actions}>
        <Button variant="outline" size="sm" onPress={onCancel} style={styles.flex}>
          Cancel
        </Button>
        <Button
          variant="primary" size="sm"
          loading={submitting}
          onPress={handleSubmit}
          style={styles.flex}
        >
          Submit
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 8,
  },
  actions: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
});
