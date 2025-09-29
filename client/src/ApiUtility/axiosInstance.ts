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
    console.log("config",config)
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
  const  originalRequest = error.config;
    if (error.response && error.response.status === 401) {
      axios
        .post(
          "https://localhost:7004/api/Auth/refreshToken",
          JSON.stringify(store.getState().auth.refreshToken),
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          if (res.data.status == false) {
            console.log("refresh Token Expire", res);
           store.dispatch(clearUserData());
           window.location.href = "/login";
          } else {
             console.log("refresh Token generated access token", res);
             store.dispatch(setUserData(res.data.result));
             error.config.headers.Authorization = `Bearer ${res.data.result.token}`;
             return axios(originalRequest);
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
