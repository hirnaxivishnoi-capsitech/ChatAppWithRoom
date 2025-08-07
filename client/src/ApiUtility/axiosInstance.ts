import axios from "axios";
import { store } from "../store";

const axiosInstance = axios.create({
    baseURL:`${import.meta.env.REACT_APP_BASE_URL}`,
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;