import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

// 🚨 GLOBAL SESSION HANDLER
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      // session expired or not logged in
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
