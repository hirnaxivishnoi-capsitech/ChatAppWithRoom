using ChatAppWithRoomApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ChatAppWithRoomApi.Services
{
    public class UserService 
    {

        private readonly IMongoCollection<User> _userCollection;
        public UserService(
          IOptions<DatabaseSetting> userDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                userDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                userDatabaseSettings.Value.DatabaseName);

            _userCollection = mongoDatabase.GetCollection<User>(
                userDatabaseSettings.Value.UserCollection);
        }

        public async Task<User> CreateAsync(User newUser)
        {
            await _userCollection.InsertOneAsync(newUser);

            return newUser;
        }


        public async Task<User> GetUserById(string id)
        {
            var user = await _userCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

            if (user == null)
            {
                throw new Exception("No User Exist");
            }
            return user;
        }

        public async Task<List<User>> GetAllUser()
        {
            return await _userCollection.Find(_ => true).ToListAsync();
        }

        public async Task<User> GetUserByEmailAndPassword(string email, string password)
        {
            var user =   await _userCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

            if (user is null)
            {
                throw new Exception("No user found");
            }
            var Verify = BCrypt.Net.BCrypt.EnhancedVerify(password, user.PasswordHash);

            if (Verify)
            {

                return user;
            }
            else
            {
                throw new Exception("User name or Password is incorrect ");
            }

        }

        public async Task<User> GetUserIfExistAysnc(string email, string name)
        {
            return await _userCollection.Find(x => x.Email == email  || x.Name == name).FirstOrDefaultAsync();
        }

        public async Task UpdateAsync(string id, User updateUser) =>
          await _userCollection.ReplaceOneAsync(x => x.Id == id, updateUser);

        public async Task DeleteAsync(string id) =>
            await _userCollection.DeleteOneAsync(x => x.Id == id);
    }
}
