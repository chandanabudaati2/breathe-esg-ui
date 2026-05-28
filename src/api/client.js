import axios from 'axios';

// Local prototype dev target url
const API_BASE_URL = import.meta.env.PROD ? 'https://breathe-esg-server-production.up.railway.app/api' : '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enables session CSRF cookie management
  headers: {
    'Content-Type': 'application/json',
  }
});

// Automatically extract and append Django CSRF token to requests
client.interceptors.request.use((config) => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }

  if (cookieValue) {
    config.headers['X-CSRFToken'] = cookieValue;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default client;
export { API_BASE_URL };
