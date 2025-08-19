namespace ChatAppWithRoomApi.DTO
{
    public class RoomCreationDto
    {
        public string? Name { get; set; }
        public bool? IsPrivate { get; set; }
        public string? Password { get; set; }
        public string? Description { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public IFormFile? RoomImage { get; set; }
    }
}
