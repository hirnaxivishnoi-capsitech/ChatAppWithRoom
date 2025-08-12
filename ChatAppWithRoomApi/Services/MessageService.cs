using ChatAppWithRoomApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ChatAppWithRoomApi.Services
{
    public class MessageService
    {
        private readonly IMongoCollection<Message> _messageCollection;

        public MessageService(IOptions<DatabaseSetting> messageDatabaseSetting)
        {
            var mongoClient = new MongoClient(messageDatabaseSetting.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(messageDatabaseSetting.Value.DatabaseName);

            _messageCollection = mongoDatabase.GetCollection<Message>(messageDatabaseSetting.Value.MessageCollection);

        }

        public async Task<Message> CreateMessageAsync(Message message)
        {
            try
            {
            await _messageCollection.InsertOneAsync(message);

            }catch (Exception ex)
            {
                throw new Exception("Error ,while sending message",ex);
            }

            return message;
        }

        public async Task<List<Message>> GetMessagesByRoomIdAsync(string roomId)
        {
           var message =  await _messageCollection.Find(x => x.RoomId.Id == roomId).SortBy(m => m.CreatedAt).ToListAsync();

            return message;

        }

        public async Task<bool> DeleteMessageAsync(string messageId)
        {
            var update = Builders<Message>.Update.Set(m => m.IsDeleted, true);
            var result = await _messageCollection.UpdateOneAsync(m => m.Id == messageId, update);
            return result.ModifiedCount > 0;
        }

      

    }
}
