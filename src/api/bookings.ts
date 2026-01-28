import api from './axios';

export interface BookingData {
  name: string;
  number: string;
  address: string;
  package: string;
  paymentMode: string;
  screenshot?: File | null;
}

export interface Booking {
  _id: string;
  token: string;
  name: string;
  number: string;
  address: string;
  package: string;
  paymentMode: string;
  isPaid: boolean;
  screenshotUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const createBooking = async (bookingData: BookingData): Promise<Booking> => {
  const formData = new FormData();
  formData.append('name', bookingData.name);
  formData.append('number', bookingData.number);
  formData.append('address', bookingData.address);
  formData.append('package', bookingData.package);
  formData.append('paymentMode', bookingData.paymentMode);

  if (bookingData.screenshot) {
    formData.append('screenshot', bookingData.screenshot);
  }

  const { data } = await api.post('/bookings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const getAllBookings = async (): Promise<Booking[]> => {
  const { data } = await api.get('/bookings');
  return data;
};

export const togglePaidStatus = async (id: string): Promise<Booking> => {
  const { data } = await api.patch(`/bookings/${id}/toggle-paid`);
  return data;
};

export const deleteBooking = async (id: string): Promise<void> => {
  await api.delete(`/bookings/${id}`);
};

export const deleteAllBookings = async (): Promise<{ message: string }> => {
  const { data } = await api.delete('/bookings/all');
  return data;
};

export const deleteBookingsByPackage = async (packageType: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/bookings/by-package/${packageType}`);
  return data;
};
