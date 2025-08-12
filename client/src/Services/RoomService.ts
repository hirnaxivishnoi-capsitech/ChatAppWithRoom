import { useMutation, useQuery } from "@tanstack/react-query";
import { create, getAll, getById, getFilterRoomsByUserIdNRoomName, removeRoom } from "../ApiUtility/apiServices";
import { endpoints } from "../ApiUtility/endpoints";
import { queryClient } from "../main";
import dayjs from "dayjs";
interface JoinRoomPayload {
  roomId: string;
  userId: string;
  userName: string;
  password?: string;
}
interface DeleteRoomPayload{
  roomId:string,
  userId:string
}
export const useCreateRoom = (userId: any) => {
  return useMutation({
    mutationFn: (data: any) => create(endpoints.rooms.createRoom, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetYourRooms", userId] });
      alert("Success");
    },
    onError: (error: any) => {
      console.error("Room creation failed:", error);
      alert("Room creation failed. Please try again.");
    },
  });
};

export const useGetAllRoom = (roomName:string|undefined) => {
  return useQuery({
    queryKey: ["useGetAllRooms",roomName],
    queryFn: async () => {
      const res = await getById(endpoints.rooms.getAllRooms , roomName);

      if (!res.result || !Array.isArray(res.result)) {
        return [];
      }
      const transformed = res.result.map((item: any) => ({
        id:item?.id,
        name: item.name || "",
        totalMembers: Array.isArray(item.members) ? item.members.length : 0,
        privacy: item.isPrivate ? "Private" : "Public",
        createdBy: item.createdBy.name || "",
        description: item.description || "",
        membersName: item?.members?.map((members: any) => members?.name),
      }));

      return transformed;
    },
    enabled: !!roomName ,
    // enabled : true,
  });
};



export const useGetYourRoom = (userId: any) => {
  return useQuery({
    queryKey: ["useGetYourRooms", userId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const res = await getById(endpoints.rooms.getYourRooms, id);

      if (!res.result || !Array.isArray(res.result)) {
        return [];
      }
      const transformed = res.result.map((item: any) => ({
        id:item.id,
        name: item.name || "",
        totalMembers: Array.isArray(item.members) ? item.members.length : 0,
        privacy: item.isPrivate ? "Private" : "Public",
        createdBy: item.createdBy.name || "",
        CreatorId:item.createdBy.id || "",
        description: item.description || "",
        membersName: item?.members?.map((members: any) => members?.name),
      }));

      return transformed;
    },
    enabled: !!userId,
  });
};

export const useGetAvaliableRoom = (userId: any) => {
  return useQuery({
    queryKey: ["useGetAvaliableRooms", userId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const res = await getById(endpoints.rooms.getAvaliableRooms, id);

      if (!res.result || !Array.isArray(res.result)) {
        return [];
      }
      const transformed = res.result.map((item: any) => ({
        id: item.id || "",
        name: item.name || "",
        totalMembers: Array.isArray(item.members) ? item.members.length : 0,
        privacy: item.isPrivate ? "Private" : "Public",
        createdBy: item.createdBy.name || "",
        description: item.description || "",
        createdAt: dayjs(item?.createdAt).format("DD MMM YYYY, HH:mm"),
        membersName: item?.members?.map((members: any) => members?.name),
      }));

      return transformed;
    },
    enabled: !!userId,
  });
};

export const useJoinRoom = (userId: any) => {
  return useMutation({
    mutationFn: (payload: JoinRoomPayload) =>
      create(endpoints.rooms.joinRoom, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetYourRooms", userId] });
      queryClient.invalidateQueries({
        queryKey: ["useGetAvaliableRooms", userId],
      });
      alert("Successfully Joined the room");
    },
    onError: (error: any) => {
      console.error("Failed in joining room", error);
      alert("Failed in joining room. Please try again.");
    },
  });
};

export const useDeleteRoom = (userId:string) => {
  return useMutation({
    mutationFn: (payload: DeleteRoomPayload) => removeRoom(endpoints.rooms.deleteRoom, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetYourRooms", userId] });
      queryClient.invalidateQueries({
        queryKey: ["useGetAvaliableRooms", userId],
      });
      alert("Successfully deleted the room");
    },
     onError: (error: any) => {
      console.error("Failed in joining room", error);
      alert("Failed in deleting room. Please try again.");
    },
  });
};
