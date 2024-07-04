import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRrefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('session:refresh-token');
        const response = await api.post(`/consumers/refresh-token`, {
          refresh_token: refreshToken,
        });
        const newAccessToken = response.data.access_token;

        localStorage.setItem('session:access-token', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        onRrefreshed(newAccessToken);

        return api(originalRequest);
      } catch (e) {
        console.error('Refresh token failed:', e);
        localStorage.removeItem('session:access-token');
        localStorage.removeItem('session:refresh-token');
        isRefreshing = false;
        return Promise.reject(e);
      } finally {
        isRefreshing = false; 
      }
    }

    return Promise.reject(error); 
  }
);