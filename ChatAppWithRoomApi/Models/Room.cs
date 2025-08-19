using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace ChatAppWithRoomApi.Models
{
    public class Room 
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]

        public string? Id { get; set; }

        public string Name { get; set; }

        public bool IsPrivate { get; set; }

        public string? Password { get; set; }

        public string? Description { get; set; }

       // [BsonRepresentation(BsonType.ObjectId)]
        public IDNameModel? CreatedBy { get; set; }
        public List<IDNameModel>? Members { get; set; } = new List<IDNameModel>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool isDeleted { get; set; } = false;

        public string? RoomImage { get; set; } 
    }

   
}
