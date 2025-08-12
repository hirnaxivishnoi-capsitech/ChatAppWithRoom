import { useMutation, useQuery } from "@tanstack/react-query";
import { create, getById } from "../ApiUtility/apiServices";
import { endpoints } from "../ApiUtility/endpoints";
import dayjs from "dayjs";
// import { queryClient } from "../main";


export const useCreateMessage = () => {
  return useMutation({
    mutationFn: (payload: any) => create(endpoints.message.createMessage, payload),
    onSuccess: () => {
      alert("Success");
    },
    onError: (error: any) => {
      console.error("Message creation failed:", error);
      alert("Message creation failed. Please try again.");
    },
  });
};

export const useGetMessagesByRoomId = (roomId: any) => {
  return useQuery({
    queryKey: ["useGetMessagesByRoomId"],
    queryFn: async () => {
      const res = await getById(endpoints.message.getMessagesByRoomId, roomId);
      if (!res.result || !Array.isArray(res.result)) {
        return [];
      }
        const transformed = res.result.map((item: any) => ({
            id:item.id,
          senderId: item.senderId?.id || "",
          senderName:item?.senderId?.name || "",
          roomId:item?.roomId?.id || "",
          roomName:item?.roomId?.name || "",
          content:item?.content || "No Message",
          createdAt: dayjs(item.createdAt).format("DD MMM YYYY, HH:mm") || "",
        }));

        return transformed;
    },
    enabled: true,
  });
};
