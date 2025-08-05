namespace ChatAppWithRoomApi.Models
{
    public class DatabaseSetting
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string UserCollection { get; set; } = null!;

        public string RoomCollection { get; set; } = null!;

        public string MessageCollection { get; set; } = null!;
    }
}
