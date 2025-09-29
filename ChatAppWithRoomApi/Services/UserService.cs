using ChatAppWithRoomApi.DTO;
using ChatAppWithRoomApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Security.Claims;

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
                throw new Exception("We couldn’t find an account with that email address.");
            }
            var Verify = BCrypt.Net.BCrypt.EnhancedVerify(password, user.PasswordHash);

            if (Verify)
            {

                return user;
            }
            else
            {
                throw new Exception("Invalid email or password. Please try again.");
            }

        }

        public async Task<User> GetUserIfExistAysnc(string email, string name)
        {
            return await _userCollection.Find(x => x.Email == email  || x.Name.ToLower() == name.ToLower()).FirstOrDefaultAsync();
        }

        public async Task<User> UpdateUserAsync(string id, UserDto updateUser)
        {
            var update = Builders<User>.Update
                .Set(x => x.Name, updateUser.Name)
                .Set(x => x.Email, updateUser.Email);


            await _userCollection.UpdateOneAsync(x =>  x.Id == id, update);

           var user =  await _userCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

            return user;

        }

        public async Task DeleteAsync(string id) =>
            await _userCollection.DeleteOneAsync(x => x.Id == id);

     
        public async Task UpdateOnlineStatus(string userId, bool isOnline)
        {
            var update = Builders<User>.Update
                .Set(x => x.IsOnline, isOnline)
                .Set(x => x.LastActiveAt, DateTime.UtcNow);

            await _userCollection.UpdateOneAsync(x => x.Id == userId, update);
        }

        public async Task ChangePassword(string userId ,string newPassword)
        {
            var changePass = Builders<User>.Update.Set(x => x.PasswordHash, newPassword);

             await _userCollection.UpdateOneAsync(x => x.Id == userId, changePass);
        }

        public async Task<User> GetRefreshToken(string refershToken)
        {
            var user = await _userCollection.Find(x => x.RefreshToken == refershToken).FirstOrDefaultAsync();

            if(user == null)
            {
                throw new Exception("User not found");
            }

            return user;
        }

        public async Task<User> UpdatedRefreshTokenForLogin(string userId, string newRefreshToken)
        {
            var user = await _userCollection.Find(x => x.Id ==userId).FirstOrDefaultAsync();

            if(user == null)
            {
                throw new Exception("No user found");
            }

           var update = Builders<User>.Update.Set(x => x.RefreshToken, newRefreshToken)
                .Set(x =>x.RefreshTimeExpiryTime,DateTime.UtcNow.AddDays(15));

            var updUser = await _userCollection.UpdateOneAsync(x => x.Id == userId, update);

            return user;

        }

        public async Task<User> UpdatedRefreshToken(string userId, string newRefreshToken)
        {
            var user = await _userCollection.Find(x => x.Id == userId).FirstOrDefaultAsync();

            if (user == null)
            {
                throw new Exception("No user found");
            }

            var update = Builders<User>.Update.Set(x => x.RefreshToken, newRefreshToken);
                // .Set(x => x.RefreshTimeExpiryTime, DateTime.UtcNow.AddMinutes(2));

            var updUser = await _userCollection.UpdateOneAsync(x => x.Id == userId, update);

            return user;

        }

    }
}
