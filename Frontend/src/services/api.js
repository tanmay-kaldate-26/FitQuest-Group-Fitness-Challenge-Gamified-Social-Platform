import axios from "axios";

// 1. Create the connection
const api = axios.create({
  // Make sure this matches your backend port (8080 or 8081)
  baseURL: "http://localhost:8081/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. The "Automatic Key Taper" (Interceptor)
// Before every request, check if we have a token and attach it.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // This adds "Authorization: Bearer eyJhbGci..." to the header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;