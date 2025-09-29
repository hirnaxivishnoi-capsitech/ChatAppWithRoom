import axios from "axios";
import { store } from "../store";
import { clearUserData, setUserData } from "../store/authSlice";

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
      // store.dispatch(clearUserData());
      // window.location.href = "/login";

      axios
        .post(
          "https://localhost:5001/api/Auth/refreshToken",
          JSON.stringify(store.getState().auth.refreshToken),
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          console.log("refresh Token", res);
          if (res.data.status == false) {
            store.dispatch(clearUserData());
            window.location.href = "/login";
          } else {
            store.dispatch(setUserData(res.data.result));
            error.config.headers.Authorization = `Bearer ${res.data.result.token}`;
          }
        });
    }
  }
);

export default axiosInstance;

export const logout = () => {
  // setTimeout(() => {
  store.dispatch(clearUserData());
  window.location.href = "/";
  // }, 500);
};
