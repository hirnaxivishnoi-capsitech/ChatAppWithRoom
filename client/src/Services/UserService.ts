import { useMutation, useQuery } from "@tanstack/react-query";
import { getById, update } from "../ApiUtility/apiServices";
import { endpoints } from "../ApiUtility/endpoints";
// import { store } from "../store";
// import { updateUserData } from "../store/authSlice";

export const useUpdateUser = (userId: any) => {
  return useMutation({
    mutationFn: (payload: any) => update(endpoints.users.updateUser, userId, payload),
  });
};

export const useGetUser = (userId: any) => {
  return useQuery({
    queryKey: ["useGetUser", userId],
    queryFn: async () => {
      const res = await getById(endpoints.users.getUserById, userId);
      if (!res.result ) {
        return [];
      }    
      var user = {
        name : res?.result?.name,
        email : res?.result?.email
      }

      return user;
    },
    enabled: !!userId,
  });
};
