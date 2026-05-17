import axios from 'axios';
import { api, clearStoredToken, setStoredToken } from './client';

export interface LoginResponse {
  _id: string;
  email: string;
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  console.log('[login] hitting:', api.defaults.baseURL + '/auth/login');
  try {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    if (data.token) {
      await setStoredToken(data.token);
    }
    return data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.error('[login] axios error code:', e.code);
      console.error('[login] message:', e.message);
      console.error('[login] status:', e.response?.status);
      console.error('[login] response data:', JSON.stringify(e.response?.data));
    } else {
      console.error('[login] unknown error:', e);
    }
    throw e;
  }
}

/** User-facing message for failed login (wrong password vs offline vs server down). */
export function loginErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Can't reach the server. Check your internet connection or set EXPO_PUBLIC_API_URL for local dev.";
    }
    const msg = error.response.data?.message;
    if (typeof msg === 'string' && msg.trim()) return msg;
    if (error.response.status === 401) return 'Invalid email or password.';
  }
  return 'Invalid email or password.';
}

export async function logout(): Promise<void> {
  await clearStoredToken();
}
