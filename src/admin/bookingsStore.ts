import { Booking, BookingStatus } from '../../types';
import { BOOKINGS_KEY } from './storageKeys';

const getStorage = (): Booking[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(BOOKINGS_KEY);
    return item ? JSON.parse(item) : [];
  } catch (e) {
    console.error('Failed to parse bookings', e);
    return [];
  }
};

const setStorage = (data: Booking[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(data));
  }
};

export const listBookings = (): Booking[] => {
  return getStorage().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createBooking = (input: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking => {
  const bookings = getStorage();
  const now = new Date().toISOString();

  const newBooking: Booking = {
    id: `bk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...input,
    status: 'new',
    createdAt: now
  };

  bookings.unshift(newBooking);
  setStorage(bookings);
  return newBooking;
};

export const updateBookingStatus = (id: string, status: BookingStatus): Booking | null => {
  const bookings = getStorage();
  const idx = bookings.findIndex(b => b.id === id);
  
  if (idx !== -1) {
    bookings[idx].status = status;
    setStorage(bookings);
    return bookings[idx];
  }
  return null;
};

export const deleteBooking = (id: string): void => {
  const bookings = getStorage();
  const filtered = bookings.filter(b => b.id !== id);
  setStorage(filtered);
};

export const listBookingsByStatus = (status: BookingStatus): Booking[] => {
  return listBookings().filter(b => b.status === status);
};
