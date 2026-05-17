import axios from 'axios';
import { api } from './client';

export interface Booking {
  _id: string;
  token: string;
  name: string;
  number: string;
  address: string;
  package: string;
  paymentMode: string;
  isPaid: boolean;
  scannedAt: string | null;
  scannedBy?: { email?: string } | null;
  createdAt: string;
  updatedAt: string;
}

export type ScanStatusFilter = 'all' | 'pending' | 'scanned';

export async function fetchBookings(params: {
  search?: string;
  status?: ScanStatusFilter;
}): Promise<Booking[]> {
  const { data } = await api.get<Booking[]>('/bookings', {
    params: {
      search: params.search?.trim() || undefined,
      status: params.status === 'all' ? undefined : params.status,
    },
  });
  return data;
}

export interface ScanSuccessResponse {
  message: string;
  booking: Booking;
  duplicate: boolean;
}

export async function scanToken(token: string): Promise<ScanSuccessResponse> {
  const { data } = await api.post<ScanSuccessResponse>('/bookings/scan', { token });
  return data;
}

export type ScanErrorBody = {
  message?: string;
  code?: string;
  booking?: Booking;
  duplicate?: boolean;
};

export function getScanError(error: unknown): ScanErrorBody | null {
  if (!axios.isAxiosError(error)) return null;
  const data = error.response?.data;
  if (data && typeof data === 'object') return data as ScanErrorBody;
  return null;
}
