using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ChatAppWithRoomApi.Models
{
    public class IDNameModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }
    }

}
