import type { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

export const create = async (url: string, data: any) => {
  const response = await axiosInstance.post(url, data);
  return response?.data;
};

export const getAll = async (url: string) => {
  const response = await axiosInstance.get(url);
  return response?.data;
};

export const getById = async (url: string, id: string | undefined) => {
  const response = await axiosInstance.get(`${url}/${id}`);
  return response?.data;
};

export const update = async (url: string, id: string, data: any) => {
  const response = await axiosInstance.post(`${url}/${id}`, data);
  return response?.data;
};

export const remove = async (url: string, id: string) => {
  const response = await axiosInstance.delete(`${url}/${id}`);
  return response?.data;
};

export const removeRoom = async (url: string, payload: any) => {
  const response = await axiosInstance.post(url, payload);
  return response?.data;
};

export const getFilterRoomsByUserIdNRoomName = async (
  url: string,
  id: string | undefined,
  room: string | undefined
) => {
  const response = await axiosInstance.get(`${url}/${id}`, {
    params: room ? { room } : {},
  });
  return response?.data;
};

export const uploadFile = async <T>(
  url: string,
  file: File,
  roomId: string,
  roomName: string,
  userId: string,
  userName: string
): Promise<T> => {
  const formData = new FormData();
  formData.append("File",file);
  formData.append("RoomId",roomId);
  formData.append("RoomName",roomName);
  formData.append("UserId",userId);
  formData.append("UserName",userName)

  const response: AxiosResponse<T> = await axiosInstance.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;
};

export const uploadRoomImage = async<T>(
  url: string,
  Name:string,
  IsPrivate: boolean,
  Password: string | null,
  Description : string | undefined,
  UserId : string,
  UserName : string,
  RoomImage: File
) : Promise<T> =>{
  const formData = new FormData();
  formData.append("Name", Name);
  formData.append("IsPrivate", String(IsPrivate));
  formData.append("Password", Password || "");
  formData.append("Description", Description || "");
  formData.append("UserId", UserId);
  formData.append("UserName", UserName);
  formData.append("RoomImage", RoomImage);

  const response: AxiosResponse<T> = await axiosInstance.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response?.data;

}