using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace ChatAppWithRoomApi.Models
{
    public class Room 
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }

        public bool IsPrivate { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string CreatedBy { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public List<IDNameModel> Members { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

   
}
