import { useMutation } from "@tanstack/react-query";
import { login } from "../ApiUtility/authServices";
import { useDispatch } from "react-redux";
import { setUserData } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const dispatch = useDispatch();
 const naviagte = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data: any) => {
      if (data || data?.result) {
        dispatch(setUserData(data?.result));
        naviagte('/ryzo/')
      }
    
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials and try again.");
    },
  });
};
