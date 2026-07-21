import AsyncStorage from '@react-native-async-storage/async-storage';
import { Worker, Review, User } from '@/types';

// Versioned keys to avoid stale data collisions
const KEYS = {
  WORKERS: '@meghahelp/workers_v1',
  REVIEWS: '@meghahelp/reviews_v1',
  USER: '@meghahelp/user_v1',
  SEEDED: '@meghahelp/seeded_v1',
} as const;

export const StorageService = {
  // ─── Workers ─────────────────────────────────────────────────────────────
  async getWorkers(): Promise<Worker[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.WORKERS);
      return data ? (JSON.parse(data) as Worker[]) : [];
    } catch {
      return [];
    }
  },

  async setWorkers(workers: Worker[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.WORKERS, JSON.stringify(workers));
  },

  async addWorker(worker: Worker): Promise<void> {
    const workers = await this.getWorkers();
    workers.unshift(worker);
    await this.setWorkers(workers);
  },

  async updateWorker(id: string, updates: Partial<Worker>): Promise<void> {
    const workers = await this.getWorkers();
    const idx = workers.findIndex(w => w.id === id);
    if (idx !== -1) {
      workers[idx] = { ...workers[idx], ...updates };
      await this.setWorkers(workers);
    }
  },

  // ─── Reviews ─────────────────────────────────────────────────────────────
  async getReviews(): Promise<Review[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.REVIEWS);
      return data ? (JSON.parse(data) as Review[]) : [];
    } catch {
      return [];
    }
  },

  async setReviews(reviews: Review[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
  },

  async addReview(review: Review): Promise<void> {
    const reviews = await this.getReviews();
    reviews.push(review);
    await this.setReviews(reviews);
  },

  // ─── User ─────────────────────────────────────────────────────────────────
  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER);
      return data ? (JSON.parse(data) as User) : null;
    } catch {
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  async clearUser(): Promise<void> {
    await AsyncStorage.removeItem(KEYS.USER);
  },

  // ─── Seed flag ────────────────────────────────────────────────────────────
  async isSeeded(): Promise<boolean> {
    const val = await AsyncStorage.getItem(KEYS.SEEDED);
    return val === 'true';
  },

  async markSeeded(): Promise<void> {
    await AsyncStorage.setItem(KEYS.SEEDED, 'true');
  },
};
