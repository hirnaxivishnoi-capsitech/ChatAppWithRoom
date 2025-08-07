import axios from "axios";
import { endpoints } from "./endpoints";

export const login = async (formData: any) => {
  const res = await axios.post(endpoints.auth.login, formData);
  console.log("Login response:", res);
  return res?.data;
};

export const register = async (formData: any) => {
  const res = await axios.post(endpoints.auth.register, formData);
  return res?.data;
};
