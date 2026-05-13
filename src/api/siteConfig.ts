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

export interface EventContent {
  title: string;
  description: string;
  razorpayName: string;
}

export const getEventContent = async (): Promise<EventContent> => {
  const response = await axios.get(`${API_URL}/config/event-content`);
  return response.data;
};

export const updateEventContent = async (content: EventContent, token: string): Promise<EventContent> => {
  const response = await axios.post(`${API_URL}/config/event-content`, content, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export interface AdSlide {
  id: string;
  imageUrl: string;
  navigationUrl: string;
  order: number;
}

export const getAdSlides = async (): Promise<AdSlide[]> => {
  const response = await axios.get(`${API_URL}/config/ad-slides`);
  return response.data;
};

export const addAdSlide = async (
  data: { imageUrl?: string; navigationUrl: string; image?: File },
  token: string
): Promise<AdSlide> => {
  const formData = new FormData();
  if (data.image) formData.append('image', data.image);
  if (data.imageUrl) formData.append('imageUrl', data.imageUrl);
  formData.append('navigationUrl', data.navigationUrl);
  const response = await axios.post(`${API_URL}/config/ad-slides`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteAdSlide = async (id: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/config/ad-slides/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateAdSlide = async (
  id: string,
  data: { navigationUrl: string },
  token: string
): Promise<AdSlide> => {
  const response = await axios.put(`${API_URL}/config/ad-slides/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
