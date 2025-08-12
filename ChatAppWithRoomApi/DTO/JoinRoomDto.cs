namespace ChatAppWithRoomApi.DTO
{
    public class JoinRoomDto
    {
        public string RoomId { get; set; }

        public string UserId { get; set; }

        public string? Password { get; set; }

        public string UserName { get; set; } = string.Empty;
    }
}
