using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatAppWithRoomApi.Models
{
    public class Message : IEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public IDNameModel SenderId { get; set; }

        public IDNameModel RoomId { get; set; }

        public string Content { get; set; }

        public MessageType MessageType { get; set; } = MessageType.Text;

        [BsonIgnoreIfNull]
        public string? FileUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsDeleted { get; set; } = false;
    }

}

public enum MessageType
{
    Undefined,
    Text,
    Image,
    File
}