
const BASE_URL = import.meta.env.REACT_APP_BASE_URL || "https://localhost:7004/api";

export const endpoints = {
  auth: {
    login: `${BASE_URL}/Auth/login`,
    register: `${BASE_URL}/Auth/register`,
  },
  users: {
//    other user-related endpoints can be added here
  },
};