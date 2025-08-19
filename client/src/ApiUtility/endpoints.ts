const BASE_URL = import.meta.env.REACT_APP_BASE_URL || "https://localhost:7004/api";

export const endpoints = {
  auth: {
    login: `${BASE_URL}/Auth/login`,
    register: `${BASE_URL}/Auth/register`,
  },
  users: {
    getUserById : `${BASE_URL}/User`,
    updateUser : `${BASE_URL}/User`,
  },
  rooms :{
    createRoom: `${BASE_URL}/Room/CreateRoom`,
    getAllRooms : `${BASE_URL}/Room/GetAllRooms`,
    getYourRooms : `${BASE_URL}/Room/GetYourRooms`,
    getAvaliableRooms : `${BASE_URL}/Room/GetAvaliableRooms`,
    joinRoom: `${BASE_URL}/Room/JoinRoom`,
    deleteRoom:`${BASE_URL}/Room/DeleteRoom`,
  },
  message:{
    createMessage:`${BASE_URL}/Message/CreateMessage`,
    getMessagesByRoomId:`${BASE_URL}/Message/GetMessagesByRoomId`,
    uploadFime:`${BASE_URL}/Message/UploadFile`
  }
};