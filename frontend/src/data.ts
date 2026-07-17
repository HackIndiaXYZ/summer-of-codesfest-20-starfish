import { ResourceCategory, Booking, UserProfile } from './types';

export const defaultUser: UserProfile = {
  id: 1,
  name: 'Administrator',
  role: 'Admin Portal',
  email: 'admin@university.edu',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgPP5MHz3jfPdvV6x53Ieu_4U58fKAXiGBd_0ms0UuD3baEadmrXIrOY9naWuM0EWC-3s9MbymvPFnU94oRC2O_yXqsrtl6JgcAOJQTmC8C8eBMMElMQId-I8JOV7FC6UKNxcMKnxI2lm0hJJQZkB1USaIH6LToYjDT5yiOdPaqfgSEoq1pchoicOlUC-vRFVNue0ClrJMjQQLG_aoZOjxcQos3i6kfCzEMcnwU-a_esjl-i_QEtr-Vm8RyascDxx-WBMgzUYbtqCi'
};

export const initialCategories: ResourceCategory[] = [
  {
    id: 'projectors',
    name: 'Projectors',
    iconName: 'Video',
    resources: [
      { name: 'Epson Pro EX9220 (Available)', status: 'Available' },
      { name: 'Sony VPL-PHZ10 (In Use)', status: 'In Use' },
      { name: 'BenQ TK800M (Available)', status: 'Available' }
    ]
  },
  {
    id: 'football-kit',
    name: 'Football Kit',
    iconName: 'Trophy',
    resources: [
      { name: 'Football Kit (Set A) (Available)', status: 'Available' },
      { name: 'Football Kit (Set B) (In Use)', status: 'In Use' },
      { name: 'Training Cones & Pinnies (Available)', status: 'Available' }
    ]
  },
  {
    id: 'cricket-kit',
    name: 'Cricket Kit',
    iconName: 'Target',
    resources: [
      { name: 'Premium Cricket Kit (Set A) (Available)', status: 'Available' },
      { name: 'Practice Leather Balls (Available)', status: 'Available' },
      { name: 'Cricket Pitch Nets (In Use)', status: 'In Use' }
    ]
  },
  {
    id: 'meeting-rooms',
    name: 'Meeting Rooms',
    iconName: 'DoorOpen',
    resources: [
      { name: 'Meeting Room A (Available)', status: 'Available' },
      { name: 'Meeting Room B (In Use)', status: 'In Use' },
      { name: 'Conference Boardroom C (Available)', status: 'Available' }
    ]
  },
  {
    id: 'auditorium',
    name: 'Auditorium',
    iconName: 'Building2',
    resources: [
      { name: 'Auditorium Main Hall (Available)', status: 'Available' },
      { name: 'Mini Seminar Hall B (Available)', status: 'Available' }
    ]
  },
  {
    id: 'speakers',
    name: 'Speakers',
    iconName: 'Volume2',
    resources: [
      { name: 'JBL Professional Sound Setup (Available)', status: 'Available' },
      { name: 'Bose S1 Pro Portable (Available)', status: 'Available' },
      { name: 'Wireless PA System (In Use)', status: 'In Use' }
    ]
  },
  {
    id: 'computer-labs',
    name: 'Computer Labs',
    iconName: 'Laptop',
    resources: [
      { name: 'Computer Lab 101 - iMacs (Available)', status: 'Available' },
      { name: 'Computer Lab 102 - PCs (In Use)', status: 'In Use' },
      { name: 'Data Science Lab 204 (Available)', status: 'Available' }
    ]
  }
];

export const initialBookings: Booking[] = [
  {
    id: '1',
    title: 'Auditorium Main Hall',
    categoryName: 'Auditorium',
    resourceName: 'Auditorium Main Hall (Available)',
    date: 'Oct 24, 2023',
    timeRange: '14:00 - 17:00',
    status: 'CONFIRMED',
    rawDate: '2023-10-24',
    rawStartTime: '14:00',
    rawEndTime: '17:00'
  },
  {
    id: '2',
    title: 'Meeting Room B',
    categoryName: 'Meeting Rooms',
    resourceName: 'Meeting Room B (In Use)',
    date: 'Oct 25, 2023',
    timeRange: '09:00 - 11:00',
    status: 'WAITLISTED',
    rawDate: '2023-10-25',
    rawStartTime: '09:00',
    rawEndTime: '11:00'
  },
  {
    id: '3',
    title: 'Epson Pro Projector',
    categoryName: 'Projectors',
    resourceName: 'Epson Pro EX9220 (Available)',
    date: 'Oct 22, 2023',
    timeRange: '10:00 - 12:00',
    status: 'REJECTED',
    rawDate: '2023-10-22',
    rawStartTime: '10:00',
    rawEndTime: '12:00'
  },
  {
    id: '4',
    title: 'Football Kit (Set A)',
    categoryName: 'Football Kit',
    resourceName: 'Football Kit (Set A) (Available)',
    date: 'Oct 20, 2023',
    timeRange: '16:00 - 18:00',
    status: 'COMPLETED',
    rawDate: '2023-10-20',
    rawStartTime: '16:00',
    rawEndTime: '18:00'
  }
];
