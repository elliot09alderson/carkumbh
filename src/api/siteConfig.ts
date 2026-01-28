import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Home Banner
export const getBanner = async () => {
  const response = await axios.get(`${API_URL}/config/banner`);
  return response.data;
};

export const updateBanner = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('banner', file);

  const response = await axios.post(`${API_URL}/config/banner`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Workshop Banner
export const getWorkshopBanner = async () => {
  const response = await axios.get(`${API_URL}/config/workshop-banner`);
  return response.data;
};

export const updateWorkshopBanner = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('banner', file);

  const response = await axios.post(`${API_URL}/config/workshop-banner`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Workshop Content
export interface WorkshopContent {
  title: string;
  subtitle: string;
  prizeAmount: string;
  isFree: boolean;
  whatsappGroupLink: string;
}

export const getWorkshopContent = async (): Promise<WorkshopContent> => {
  const response = await axios.get(`${API_URL}/config/workshop-content`);
  return response.data;
};

export const updateWorkshopContent = async (content: WorkshopContent, token: string): Promise<WorkshopContent> => {
  const response = await axios.post(`${API_URL}/config/workshop-content`, content, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Event Packages
export interface EventPackage {
  id: string;
  name: string;
  price: string;
  duration: string;
  onlineSessions: string;
  liveSessions: string;
  whatsappLink?: string;
}

export const getEventPackages = async (): Promise<EventPackage[]> => {
  const response = await axios.get(`${API_URL}/config/event-packages`);
  return response.data;
};

export const updateEventPackages = async (packages: EventPackage[], token: string): Promise<EventPackage[]> => {
  const response = await axios.post(`${API_URL}/config/event-packages`, { packages }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
