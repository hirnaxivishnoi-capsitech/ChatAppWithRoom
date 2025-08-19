import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../ApiUtility/apiServices";
import { endpoints } from "../ApiUtility/endpoints";

export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({
      file,
      roomId,
      roomName,
      userId,
      userName,
    }: {
      file: File;
      roomId: string;
      roomName: string;
      userId: string;
      userName: string;
    }) =>
      uploadFile(
        endpoints.message.uploadFime,
        file,
        roomId,
        roomName,
        userId,
        userName
      ),
    onSuccess: () => {
      console.log("successfully uploaded file");
    },
    onError: () => {
      console.log("Error in uploading file");
    },
  });
};
