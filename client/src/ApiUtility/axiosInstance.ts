import axios from "axios";
import { store } from "../store";
import { clearUserData } from "../store/authSlice";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.REACT_APP_BASE_URL}`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(clearUserData());
      window.location.href = "/login";
    }
  }
);

export default axiosInstance;

export const logout = () => {
    setTimeout(() => {
      store.dispatch(clearUserData());
    window.location.href = "/login";
  }, 500);
};
