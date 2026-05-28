import axios from 'axios';

// Local prototype dev target url
const API_BASE_URL = import.meta.env.PROD ? 'https://breathe-esg-server-production.up.railway.app/api' : '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Automatically attach stored auth token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper functions for token management
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export default client;
export { API_BASE_URL };
