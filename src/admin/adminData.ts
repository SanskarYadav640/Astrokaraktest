
import { MOCK_BOOKINGS } from '../../constants';
import { AdminBlogPost } from './adminTypes';
import { getAdminBlogs } from './blogStore';

export interface Booking {
  id: string;
  name: string;
  email: string;
  service: string;
  date: string;
  status: string;
}

export const listBlogs = (): AdminBlogPost[] => {
  return getAdminBlogs();
};

export const listBookings = (): Booking[] => {
  return MOCK_BOOKINGS;
};
