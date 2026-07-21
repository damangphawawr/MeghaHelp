/**
 * WorkersContext — manages workers and reviews data via AsyncStorage.
 * Seeds mock data on first launch.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { StorageService } from '@/services/storage';
import { MOCK_WORKERS, MOCK_REVIEWS } from '@/services/mockData';
import { Worker, Review, SearchFilters } from '@/types';

interface WorkersContextValue {
  workers: Worker[];
  reviews: Review[];
  isLoading: boolean;
  addWorker: (worker: Worker) => Promise<void>;
  getWorkerById: (id: string) => Worker | undefined;
  getReviewsForWorker: (workerId: string) => Review[];
  addReview: (review: Review) => Promise<void>;
  hasUserReviewed: (workerId: string, userId: string) => boolean;
  refreshWorkers: () => Promise<void>;
  filterWorkers: (filters: SearchFilters) => Worker[];
  getUserWorker: (userId: string) => Worker | undefined;
}

const WorkersContext = createContext<WorkersContextValue>({} as WorkersContextValue);

export function WorkersProvider({ children }: { children: ReactNode }) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const seeded = await StorageService.isSeeded();
      if (!seeded) {
        await StorageService.setWorkers(MOCK_WORKERS);
        await StorageService.setReviews(MOCK_REVIEWS);
        await StorageService.markSeeded();
      }
      const [loadedWorkers, loadedReviews] = await Promise.all([
        StorageService.getWorkers(),
        StorageService.getReviews(),
      ]);
      setWorkers(loadedWorkers);
      setReviews(loadedReviews);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const addWorker = useCallback(async (worker: Worker) => {
    await StorageService.addWorker(worker);
    setWorkers(prev => [worker, ...prev]);
  }, []);

  const addReview = useCallback(async (review: Review) => {
    await StorageService.addReview(review);
    setReviews(prev => {
      const next = [...prev, review];
      // Recalculate worker rating
      const workerReviews = next.filter(r => r.workerId === review.workerId);
      const avg = workerReviews.reduce((s, r) => s + r.rating, 0) / workerReviews.length;
      const rounded = Math.round(avg * 10) / 10;
      StorageService.updateWorker(review.workerId, {
        rating: rounded,
        reviewCount: workerReviews.length,
      });
      setWorkers(pw => pw.map(w =>
        w.id === review.workerId
          ? { ...w, rating: rounded, reviewCount: workerReviews.length }
          : w
      ));
      return next;
    });
  }, []);

  const getWorkerById = useCallback((id: string) =>
    workers.find(w => w.id === id), [workers]);

  const getReviewsForWorker = useCallback((workerId: string) =>
    reviews.filter(r => r.workerId === workerId), [reviews]);

  const hasUserReviewed = useCallback((workerId: string, userId: string) =>
    reviews.some(r => r.workerId === workerId && r.userId === userId), [reviews]);

  const getUserWorker = useCallback((userId: string) =>
    workers.find(w => w.userId === userId), [workers]);

  const filterWorkers = useCallback((filters: SearchFilters): Worker[] => {
    return workers.filter(w => {
      if (!w.isApproved) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const matched =
          w.fullName.toLowerCase().includes(q) ||
          w.profession.toLowerCase().includes(q) ||
          (w.customProfession?.toLowerCase().includes(q) ?? false) ||
          w.district.toLowerCase().includes(q) ||
          w.about.toLowerCase().includes(q) ||
          w.serviceAreas.some(a => a.toLowerCase().includes(q));
        if (!matched) return false;
      }
      if (filters.profession && w.profession !== filters.profession) return false;
      if (filters.district && w.district !== filters.district) return false;
      if (filters.minRating && w.rating < filters.minRating) return false;
      if (filters.availability && w.availability !== filters.availability) return false;
      return true;
    });
  }, [workers]);

  const refreshWorkers = useCallback(() => loadData(), [loadData]);

  return (
    <WorkersContext.Provider value={{
      workers, reviews, isLoading,
      addWorker, getWorkerById, getReviewsForWorker,
      addReview, hasUserReviewed, refreshWorkers,
      filterWorkers, getUserWorker,
    }}>
      {children}
    </WorkersContext.Provider>
  );
}

export function useWorkers() {
  return useContext(WorkersContext);
}
