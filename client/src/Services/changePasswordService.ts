import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../ApiUtility/apiServices";
import { endpoints } from "../ApiUtility/endpoints";

interface IChangePassword {
    email:string,
    oldPassword:string,
    newPassword:string,
    confirmPassword:string
}
export const usechangePassword = () => {

  return useMutation({
    mutationFn : (payload:IChangePassword) => changePassword(endpoints.users.changePassword,payload),
    onSuccess: (data: any) => {
        console.log("Change password",data)
    },
    onError: (error: any) => {
      console.error("Changing Password failed:", error);
    },
  });
};