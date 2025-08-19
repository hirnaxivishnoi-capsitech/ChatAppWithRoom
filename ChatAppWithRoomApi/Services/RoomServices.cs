using ChatAppWithRoomApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ChatAppWithRoomApi.Services
{
    public class RoomServices
    {
        private readonly IMongoCollection<Room> _roomCollection;
        public RoomServices(
          IOptions<DatabaseSetting> roomDatabaseSetting)
        {
            var mongoClient = new MongoClient(
                roomDatabaseSetting.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                roomDatabaseSetting.Value.DatabaseName);

            _roomCollection = mongoDatabase.GetCollection<Room>(
                roomDatabaseSetting.Value.RoomCollection);
        }

        public async Task<Room> CreateRoomAsync(Room room)
        {
            await _roomCollection.InsertOneAsync(room);

            return room;
        }

        public async Task<Room> GetRoomById(string id)
        {
            var room = await _roomCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

            if (room == null)
            {
                throw new Exception("The specified room could not be found.");
            }
            return room;
        }

        public async Task<List<Room>> GetAllRoom()
        {
          return await _roomCollection.Find(_ => true).ToListAsync();
        }

        public async Task<List<Room>> GetFilterRoom(string roomName)
        {

            var filter = Builders<Room>.Filter.Regex("Name", new BsonRegularExpression(roomName, "i"));

           // var filter = Builders<Room>.Filter.Eq("Name", roomName);

            var rooms = await _roomCollection.Find(filter).ToListAsync();

            return rooms;
        }

        public async Task<Room> GetIfExistRoomAysnc( string roomName, bool isPrivate)
        {
            return await _roomCollection.Find(x => x.Name == roomName && x.IsPrivate == isPrivate).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(string id, Room updateRoom) =>
          await _roomCollection.ReplaceOneAsync(x => x.Id == id, updateRoom);

        public async Task DeleteAsync(string id) =>
            await _roomCollection.DeleteOneAsync(x => x.Id == id);

        public async Task<Room> AddUserToRoom(string roomId, string userId,string userName)
        {
            var room =await _roomCollection.Find(x => x.Id == roomId).FirstOrDefaultAsync();

            if(room.Members == null)
            {
                room.Members = new List<IDNameModel>();
            }

            if (!room.Members.Any(x => x.Id == userId))
            {
                room.Members.Add(new IDNameModel
                {
                    Id = userId,
                    Name = userName
                });

                var update = Builders<Room>.Update.Set(r => r.Members, room.Members);
                await _roomCollection.UpdateOneAsync(r => r.Id == roomId, update);

            }

            return room;

        }

        public async Task<List<Room>> GetYourRooms(string userId) =>
            await _roomCollection.Find(r => r.Members.Any(m => m.Id == userId)).ToListAsync();

        public async Task<List<Room>> GetYourRooms(string userId, string? roomName = null)
        {
            var filterBuilder = Builders<Room>.Filter;

            var memberFilter = filterBuilder.ElemMatch(r => r.Members, m => m.Id == userId);

            var filter = memberFilter;

            if (!string.IsNullOrEmpty(roomName))
            {
                var regexFilter = filterBuilder.Regex(r => r.Name, new MongoDB.Bson.BsonRegularExpression(roomName, "i"));
                filter = filter & regexFilter;
            }

            return await _roomCollection.Find(filter).ToListAsync();
        }


        public async Task<List<Room>> GetAvaliableRooms(string userId) =>
            await _roomCollection.Find(r => !r.Members.Any(m => m.Id == userId)).ToListAsync();

        public async Task<List<Room>> GetAvaliableRooms(string userId, string? roomName = null)
        {
            var filterBuilder = Builders<Room>.Filter;

            var memberFilter = filterBuilder.Not(filterBuilder.ElemMatch(r => r.Members, m => m.Id == userId));

            var filter = memberFilter;

            if (!string.IsNullOrEmpty(roomName))
            {
                var regexFilter = filterBuilder.Regex(r => r.Name, new MongoDB.Bson.BsonRegularExpression(roomName, "i"));
                filter = filter & regexFilter;
            }

            return await _roomCollection.Find(filter).ToListAsync();
        }

        public async Task RemoveUserFromRoom(string roomId,string userId)
        {
            var room = await _roomCollection.Find(x => x.Id == roomId).FirstOrDefaultAsync();

            if(room == null)
            {
                throw new Exception("The specified room could not be found.");
            }

            if (room.Members == null)
            {
                room.Members = new List<IDNameModel>();
            }

            var user = room.Members.FirstOrDefault(x => x.Id == userId);

            if(user == null)
            {
                throw new Exception("The specified user is not a member of this room.");
            }
            
            room.Members.Remove(user);

            var update = Builders<Room>.Update.Set(r => r.Members, room.Members);
            await _roomCollection.UpdateOneAsync(r => r.Id == roomId, update);

        }

        public async Task SoftDelete(string id)
        {
            var update = Builders<Room>.Update.Set(x => x.isDeleted, true);
            await _roomCollection.UpdateOneAsync(x => x.Id == id, update);
        }
    }
}

