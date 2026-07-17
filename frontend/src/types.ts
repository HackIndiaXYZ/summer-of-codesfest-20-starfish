export type BookingStatus = 'CONFIRMED' | 'WAITLISTED' | 'REJECTED' | 'COMPLETED';

export interface Booking {
  id: string;
  title: string;
  categoryName: string;
  resourceName: string;
  date: string; // formatted date (e.g. "Oct 24, 2023")
  timeRange: string; // formatted time range (e.g. "14:00 - 17:00")
  status: BookingStatus;
  rawDate?: string; // YYYY-MM-DD for sorting/editing
  rawStartTime?: string; // HH:MM
  rawEndTime?: string; // HH:MM
  startDate?: Date;
  endDate?: Date;
}

export interface ResourceCategory {
  id: string;
  name: string;
  iconName: string; // lucide icon name to dynamically load
  resources: {
    id?: number; // Database resource ID
    name: string;
    status: 'Available' | 'In Use' | 'Under Maintenance';
  }[];
}

export interface UserProfile {
  id: number;
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
}
