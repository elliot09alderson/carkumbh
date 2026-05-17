import api from './axios';

export interface LoginData {
  email: string;
  password: string;
}

export interface AdminData {
  _id: string;
  email: string;
  token: string;
}

export const loginAdmin = async (loginData: LoginData): Promise<AdminData> => {
  const { data } = await api.post('/auth/login', loginData);

  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('adminToken', data.token);
  }

  return data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
};

export const getAdminProfile = async (): Promise<AdminData> => {
  const { data } = await api.get('/auth/profile');
  return data;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('adminToken');
};
