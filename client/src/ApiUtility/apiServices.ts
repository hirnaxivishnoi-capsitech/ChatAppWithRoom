import axiosInstance from "./axiosInstance";

export const create = async (url: string, data: any) => {
   const response =await  axiosInstance.post(url, data);
    return response?.data;
}

export const getAll = async (url: string) => {
   const response = await  axiosInstance.get(url);
    return response?.data;
}

export const getById = async (url: string, id: string | undefined) => {
   const response = await axiosInstance.get(`${url}/${id}`);
    return response?.data;
}


export const update = async (url: string, id: string, data: any) => {
   const response =await  axiosInstance.post(`${url}/${id}`, data);
    return response?.data;
}

export const remove = async (url: string, id: string) => {
   const response =await  axiosInstance.delete(`${url}/${id}`);
    return response?.data;
}

export const removeRoom = async (url: string, payload: any) => {
   const response =await  axiosInstance.post(url,payload);
    return response?.data;
}

export const getFilterRoomsByUserIdNRoomName = async (url: string, id: string | undefined,room:string | undefined) => {
   const response = await axiosInstance.get(`${url}/${id}`,{
    params:room ? {room} : {}
   });
    return response?.data;
}