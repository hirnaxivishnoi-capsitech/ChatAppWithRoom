namespace ChatAppWithRoomApi.DTO
{
    public class UploadFile
    {
            public IFormFile File { get; set; }
            public string RoomId { get; set; }
            public string RoomName { get; set; }
            public string UserId { get; set; }
            public string UserName { get; set; }
        }

}
