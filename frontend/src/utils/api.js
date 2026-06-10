import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}`;

export const fetchContent = async (section) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/content/${section}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${section} content:`, error);
    return null;
  }
};

export const fetchServices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/services`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const fetchServiceBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/services/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching service ${slug}:`, error);
    return null;
  }
};
