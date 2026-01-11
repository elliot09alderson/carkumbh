import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Student {
  _id: string;
  studentName: string;
  whatsappNumber: string;
  highestQualification: string;
  workingInIT: 'yes' | 'no';
  createdAt: string;
}

export const registerStudent = async (studentData: Omit<Student, '_id' | 'createdAt'>) => {
  const response = await axios.post(`${API_URL}/students/register`, studentData);
  return response.data;
};

export const getAllStudents = async () => {
  const token = localStorage.getItem('adminToken');
  const response = await axios.get(`${API_URL}/students`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getPublicStudents = async () => {
  const response = await axios.get(`${API_URL}/students/public`);
  return response.data;
};
