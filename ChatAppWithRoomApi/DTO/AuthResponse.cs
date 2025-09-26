using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatAppWithRoomApi.DTO
{
    public class AuthResponse
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
