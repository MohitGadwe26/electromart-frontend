import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// REQUEST INTERCEPTOR (Attach Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR (Auto Refresh Token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle BOTH 401 AND 403 as authentication errors
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        console.log("Attempting to refresh token...");
        
        const res = await axios.post(
          "http://localhost:8080/api/auth/refresh-token",
          {
            refreshToken: refreshToken,
          }
        );

        // Save new tokens
        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${res.data.token}`;

        return api(originalRequest);

      } catch (err) {
        console.log("Session expired or invalid refresh token");
        
        // Clear all auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;