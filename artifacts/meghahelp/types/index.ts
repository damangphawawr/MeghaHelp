// Core type definitions for MeghaHelp

export type Gender = 'Male' | 'Female' | 'Other';
export type ServiceType = 'Home Visit' | 'Customer Visits' | 'Both';
export type Availability = 'Full-time' | 'Part-time' | 'Weekends' | 'Flexible';

export interface Worker {
  id: string;
  fullName: string;
  profilePhoto: string | null;
  profession: string;
  customProfession: string | null;
  about: string;
  yearsOfExperience: number;
  languages: string[];
  gender: Gender | null;
  serviceAreas: string[];
  district: string;
  phone: string;
  whatsapp: string;
  price: string | null;
  availability: Availability;
  serviceType: ServiceType;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  userId: string | null;
}

export interface Review {
  id: string;
  workerId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  photo: string | null;
  phone: string | null;
  district: string | null;
  town: string | null;
}

export interface SearchFilters {
  query: string;
  profession: string | null;
  district: string | null;
  minRating: number | null;
  availability: Availability | null;
}
