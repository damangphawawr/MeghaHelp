export interface ServiceCategory {
  id: string;
  name: string;
  icon: string; // Ionicons name
  color: string;
  professions: string[];
}

export const PROFESSIONS: string[] = [
  'House Maid', 'House Cleaner', 'Babysitter', 'Nanny', 'Elderly Caregiver',
  'Personal Driver', 'School Pick-up & Drop-off Driver', 'Tourist Driver', 'Delivery Driver',
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason', 'AC Technician',
  'Appliance Repair', 'Mobile Repair', 'Computer Repair',
  'Cook', 'Laundry Service', 'Ironing Service', 'Gardener', 'Pest Control',
  'Home Tutor', 'Music Teacher', 'Dance Teacher',
  'Photographer', 'Videographer', 'Graphic Designer',
  'Accountant', 'Lawyer', 'Tax Consultant', 'Architect', 'Interior Designer',
  'Wedding Planner', 'Caterer', 'Makeup Artist', 'DJ', 'MC / Host', 'Florist',
  'Massage Therapist', 'Physiotherapist', 'Yoga Instructor', 'Fitness Trainer',
  'Pet Groomer', 'Pet Sitter',
  'Farm Worker', 'General Labour', 'Moving Helper',
  'Other',
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'home-care',
    name: 'Home Care',
    icon: 'home-outline',
    color: '#1B5E3B',
    professions: ['House Maid', 'House Cleaner', 'Babysitter', 'Nanny', 'Elderly Caregiver'],
  },
  {
    id: 'drivers',
    name: 'Drivers',
    icon: 'car-outline',
    color: '#2563EB',
    professions: ['Personal Driver', 'School Pick-up & Drop-off Driver', 'Tourist Driver', 'Delivery Driver'],
  },
  {
    id: 'repairs',
    name: 'Repairs',
    icon: 'construct-outline',
    color: '#D97706',
    professions: ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason', 'AC Technician', 'Appliance Repair', 'Mobile Repair', 'Computer Repair'],
  },
  {
    id: 'household',
    name: 'Household',
    icon: 'restaurant-outline',
    color: '#7C3AED',
    professions: ['Cook', 'Laundry Service', 'Ironing Service', 'Gardener', 'Pest Control'],
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'school-outline',
    color: '#0891B2',
    professions: ['Home Tutor', 'Music Teacher', 'Dance Teacher'],
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: 'camera-outline',
    color: '#DB2777',
    professions: ['Photographer', 'Videographer', 'Graphic Designer'],
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: 'briefcase-outline',
    color: '#374151',
    professions: ['Accountant', 'Lawyer', 'Tax Consultant', 'Architect', 'Interior Designer'],
  },
  {
    id: 'events',
    name: 'Events',
    icon: 'musical-notes-outline',
    color: '#BE185D',
    professions: ['Wedding Planner', 'Caterer', 'Makeup Artist', 'DJ', 'MC / Host', 'Florist'],
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: 'fitness-outline',
    color: '#16A34A',
    professions: ['Massage Therapist', 'Physiotherapist', 'Yoga Instructor', 'Fitness Trainer'],
  },
  {
    id: 'pets',
    name: 'Pets',
    icon: 'paw-outline',
    color: '#EA580C',
    professions: ['Pet Groomer', 'Pet Sitter'],
  },
  {
    id: 'labour',
    name: 'Labour',
    icon: 'hammer-outline',
    color: '#78716C',
    professions: ['Farm Worker', 'General Labour', 'Moving Helper'],
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'ellipsis-horizontal-circle-outline',
    color: '#6B7280',
    professions: ['Other'],
  },
];
