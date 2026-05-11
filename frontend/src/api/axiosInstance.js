import axios from "axios";

let refreshPromise = null;

const purgeData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("whoami");
  window.location.href = "/login";
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    // Automatically update tokens if the response is from /refresh
    if (response.config.url.includes("refresh")) {
      const { access_token, refresh_token } = response.data;
      if (access_token) localStorage.setItem("access_token", access_token);
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (
        originalRequest.url.includes("refresh") ||
        originalRequest.url.includes("login")
      ) {
        purgeData();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          purgeData();
          return Promise.reject(error);
        }

        refreshPromise = api
          .post(`/refresh`, {
            refresh_token: refreshToken,
          })
          .then((res) => {
            const { access_token, refresh_token } = res.data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            refreshPromise = null;
            return access_token;
          })
          .catch((err) => {
            refreshPromise = null;
            purgeData();
            return Promise.reject(err);
          });
      }

      try {
        const token = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
