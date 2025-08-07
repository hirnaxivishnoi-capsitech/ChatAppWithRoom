import { useMutation } from "@tanstack/react-query"
import { register } from "../ApiUtility/authServices"

export const useRegister = () => {
    return useMutation({
        mutationFn:register,
        onSuccess: () => {
        window.location.pathname = '/login'; 
        },
        onError: (error: any) => {
            console.error("Register failed:", error);
            alert("Register failed. Please try again.");
        }
    })
}

