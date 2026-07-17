import { Booking, ResourceCategory, BookingStatus } from './types';

const API_BASE = 'http://localhost:8000';

const mapTypeToCategoryName = (type: string): string => {
  const map: Record<string, string> = {
    'Projector': 'Projectors',
    'Hall': 'Auditorium',
    'Football Kit': 'Football Kit',
    'Cricket Kit': 'Cricket Kit',
    'Meeting Rooms': 'Meeting Rooms',
    'Computer Labs': 'Computer Labs',
    'Speakers': 'Speakers',
    'Auditorium': 'Auditorium'
  };
  return map[type] || type;
};

export function parseBackendDateTime(dtStr: string): Date {
  const parts = dtStr.split(', ');
  if (parts.length < 2) return new Date();
  
  const datePart = parts[0]; // "Jul 16"
  const timePart = parts[1]; // "10:24 PM"
  
  const dateSubParts = datePart.split(' ');
  if (dateSubParts.length < 2) return new Date();
  const monthStr = dateSubParts[0];
  const dayStr = dateSubParts[1];
  
  const months: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };
  
  const month = months[monthStr] !== undefined ? months[monthStr] : new Date().getMonth();
  const day = parseInt(dayStr, 10) || new Date().getDate();
  
  const timeMatch = timePart.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hours = 0;
  let minutes = 0;
  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
  }
  
  const year = new Date().getFullYear();
  return new Date(Date.UTC(year, month, day, hours, minutes));
}

export async function fetchResources(userBookings: Booking[] = []): Promise<ResourceCategory[]> {
  const res = await fetch(`${API_BASE}/api/resources/`);
  if (!res.ok) throw new Error('Failed to fetch resources');
  const dbResources: { id: number; name: string; resource_type: string }[] = await res.json();

  const categoryTemplates = [
    { id: 'projectors', name: 'Projectors', iconName: 'Video', types: ['Projector'] },
    { id: 'football-kit', name: 'Football Kit', iconName: 'Trophy', types: ['Football Kit'] },
    { id: 'cricket-kit', name: 'Cricket Kit', iconName: 'Target', types: ['Cricket Kit'] },
    { id: 'meeting-rooms', name: 'Meeting Rooms', iconName: 'DoorOpen', types: ['Meeting Rooms'] },
    { id: 'auditorium', name: 'Auditorium', iconName: 'Building2', types: ['Auditorium', 'Hall'] },
    { id: 'speakers', name: 'Speakers', iconName: 'Volume2', types: ['Speakers'] },
    { id: 'computer-labs', name: 'Computer Labs', iconName: 'Laptop', types: ['Computer Labs'] }
  ];

  const now = new Date();

  return categoryTemplates.map(template => {
    const resourcesForCategory = dbResources
      .filter(r => template.types.includes(r.resource_type))
      .map(r => {
        let status: 'Available' | 'In Use' | 'Under Maintenance' = 'Available';
        
        // Check if user has an active booking right now for this resource
        const hasActiveBooking = userBookings.some(b => {
          if (b.resourceName !== r.name || b.categoryName !== template.name || b.status !== 'CONFIRMED') return false;
          if (b.startDate && b.endDate) {
            return now >= b.startDate && now <= b.endDate;
          }
          return false;
        });

        if (hasActiveBooking) {
          status = 'In Use';
        }

        return {
          id: r.id,
          name: r.name,
          status
        };
      });

    return {
      id: template.id,
      name: template.name,
      iconName: template.iconName,
      resources: resourcesForCategory
    };
  });
}

export async function fetchUserBookings(userId: number): Promise<Booking[]> {
  const res = await fetch(`${API_BASE}/api/bookings/user/${userId}/`);
  if (!res.ok) throw new Error('Failed to fetch user bookings');
  const data = await res.json();
  return data.map((b: any) => {
    const start = parseBackendDateTime(b.start_time);
    const end = parseBackendDateTime(b.end_time);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateStr = start.toLocaleDateString('en-US', options);

    const padZero = (n: number) => n.toString().padStart(2, '0');
    const startHourStr = padZero(start.getHours());
    const startMinStr = padZero(start.getMinutes());
    const endHourStr = padZero(end.getHours());
    const endMinStr = padZero(end.getMinutes());

    return {
      id: String(b.id),
      title: b.resource_name,
      categoryName: mapTypeToCategoryName(b.resource_type),
      resourceName: b.resource_name,
      date: dateStr,
      timeRange: `${startHourStr}:${startMinStr} - ${endHourStr}:${endMinStr}`,
      status: b.status as BookingStatus,
      rawDate: `${start.getFullYear()}-${padZero(start.getMonth() + 1)}-${padZero(start.getDate())}`,
      rawStartTime: `${startHourStr}:${startMinStr}`,
      rawEndTime: `${endHourStr}:${endMinStr}`,
      startDate: start,
      endDate: end
    };
  });
}

export async function createBooking(
  userId: number,
  resourceId: number,
  startTime: string,
  endTime: string,
  action: 'book' | 'waitlist' = 'book'
) {
  const res = await fetch(`${API_BASE}/api/book/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      resource_id: resourceId,
      start_time: startTime,
      end_time: endTime,
      action
    })
  });
  
  if (res.status === 409) {
    const errData = await res.json();
    return { success: false, conflict: errData };
  }
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to create booking');
  }
  
  const data = await res.json();
  return { success: true, message: data.message };
}

export async function cancelBooking(bookingId: string | number) {
  const res = await fetch(`${API_BASE}/api/bookings/${bookingId}/`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to cancel booking');
  }
  return await res.json();
}
