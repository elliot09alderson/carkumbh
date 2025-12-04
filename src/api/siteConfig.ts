import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
