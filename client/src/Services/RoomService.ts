import { useMutation, useQuery } from "@tanstack/react-query";
import {
  create,
  getAll,
  getFilterRoomsByUserIdNRoomName,
  removeRoom,
  uploadRoomImage,
} from "../ApiUtility/apiServices";
import { endpoints } from "../ApiUtility/endpoints";
import { queryClient } from "../main";
import dayjs from "dayjs";

interface JoinRoomPayload {
  roomId: string;
  userId: string;
  userName: string;
  password?: string;
}
interface DeleteRoomPayload {
  roomId: string;
  userId: string;
}
export const useCreateRoom = (userId: any) => {
  return useMutation({
    mutationFn: ({
      Name,
      IsPrivate,
      Password,
      Description,
      UserId,
      UserName,
      RoomImage,
    }: {
      Name: string;
      IsPrivate: boolean;
      Password: string | null;
      Description: string | undefined;
      UserId: string;
      UserName: string;
      RoomImage: File;
    }) =>
      uploadRoomImage(
        endpoints.rooms.createRoom,
        Name,
        IsPrivate,
        Password,
        Description,
        UserId,
        UserName,
        RoomImage
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetYourRooms", userId] });
    },
    onError: (error: any) => {
      console.error("Room creation failed:", error);
    },
  });
};

export const useGetAllRoom = (open: boolean) => {
  return useQuery({
    queryKey: ["useGetAllRooms"],
    queryFn: async () => {
      const res = await getAll(endpoints.rooms.getAllRooms);

      if (!res.result || !Array.isArray(res.result)) {
        return [];
      }
      const transformed = res.result.map((item: any) => ({
        id: item?.id,
        name: item.name || "",
        totalMembers: Array.isArray(item.members) ? item.members.length : 0,
        privacy: item.isPrivate ? "Private" : "Public",
        createdBy: item.createdBy.name || "",
        description: item.description || "",
        membersName: item?.members?.map((members: any) => members?.name),
      }));

      return transformed;
    },
    enabled: !!open,
  });
};

export const useGetYourRoom = (userId: any, room?: string) => {
  return useQuery({
    queryKey: ["useGetYourRooms", userId, room],
    queryFn: async ({ queryKey }) => {
      const [, id, room] = queryKey;
      const res = await getFilterRoomsByUserIdNRoomName(
        endpoints.rooms.getYourRooms,
        id,
        room
      );

      if (!res.result || !Array.isArray(res.result)) {
        return [];
      }
      const transformed = res.result.map((item: any) => ({
        id: item.id,
        name: item.name || "",
        totalMembers: Array.isArray(item.members) ? item.members.length : 0,
        privacy: item.isPrivate ? "Private" : "Public",
        createdBy: item.createdBy.name || "",
        CreatorId: item.createdBy.id || "",
        description: item.description || "",
        membersName: item?.members?.map((members: any) => members?.name),
        isDeleted: item.isDeleted ?? false,
        roomImage: item.roomImage || "",
      }));

      return transformed;
    },
    enabled: !!userId,
  });
};

export const useGetAvaliableRoom = (userId: any, room?: string) => {
  return useQuery({
    queryKey: ["useGetAvaliableRooms", userId, room],
    queryFn: async ({ queryKey }) => {
      const [, id, room] = queryKey;
      const res = await getFilterRoomsByUserIdNRoomName(
        endpoints.rooms.getAvaliableRooms,
        id,
        room
      );

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
        isDeleted: item.isDeleted ?? false,
        roomImage: item.roomImage || "",
      }));

      return transformed;
    },
    enabled: !!userId,
  });
};

export const useJoinRoom = (userId: any) => {
  return useMutation({
    mutationFn: (payload: JoinRoomPayload) => {
      return create(endpoints.rooms.joinRoom, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetYourRooms", userId] });
      queryClient.invalidateQueries({
        queryKey: ["useGetAvaliableRooms", userId],
      });
    },
    onError: (error: any) => {
      console.error("Failed in joining room", error);
      alert("Failed in joining room. Please try again.");
    },
  });
};

export const useDeleteRoom = (userId: string) => {
  return useMutation({
    mutationFn: (payload: DeleteRoomPayload) =>
      removeRoom(endpoints.rooms.deleteRoom, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useGetYourRooms", userId] });
      queryClient.invalidateQueries({
        queryKey: ["useGetAvaliableRooms", userId],
      });
    },
    onError: (error: any) => {
      console.error("Failed in joining room", error);
    },
  });
};
