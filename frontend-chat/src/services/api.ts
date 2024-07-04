import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRrefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('session:refresh-token');
          
          const { data } = await api.post(`/consumers/refresh-token`, {
            refresh_token: refreshToken
          });

          localStorage.setItem('session:access-token', data.access_token);

          isRefreshing = false;
          onRrefreshed(data.access_token);
        } catch (e) {
          localStorage.removeItem('session:access-token');
          localStorage.removeItem('session:refresh-token');
          isRefreshing = false;
          return Promise.reject(e);
        }
      }

      const retryOriginalRequest = new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          console.log('Retrying original request with new access token:', token);
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });

      return retryOriginalRequest;
    }

    return Promise.reject(error);
  }
);
