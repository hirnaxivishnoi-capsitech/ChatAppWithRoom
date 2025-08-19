using ChatAppWithRoomApi.Models;
using ChatAppWithRoomApi.Services;
using Microsoft.AspNetCore.SignalR;

namespace ChatAppWithRoomApi.Hubs
{
    public class ChatHub : Hub
    {

        private readonly MessageService _messageService;

        private readonly RoomServices _roomServices;

      //  private readonly UserService _userServices;

        public ChatHub(MessageService messageService,RoomServices roomServices)
        {
            _messageService = messageService;
            _roomServices = roomServices;
          //  _userServices = userServices;
        }

        public async Task SendMessage(string roomId,string roomName,string userId,string userName,string content)
        {
            var message = new Message
            {
                SenderId = new IDNameModel { Id = userId, Name = userName },
                RoomId = new IDNameModel { Id = roomId, Name = roomName },
                Content = content,
                MessageType = MessageType.Text

            };

            await _messageService.CreateMessageAsync(message);

            await Clients.Group(roomId).SendAsync("ReceiveMessage",roomId , userId,userName, message, message.CreatedAt);

        }

        public async Task JoinRoom(string roomId,string roomName , string userId,string userName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            var history = await _messageService.GetMessagesByRoomIdAsync(roomId);

            await Clients.Caller.SendAsync("LoadHistory", history);

            var room = await _roomServices.GetRoomById(roomId);
            if (room != null && !room.Members.Any(m => m.Id == userId))
            {
                // Add user to room DB

                // Create system "joined" message
                var message = new Message
                {
                    SenderId = new IDNameModel { Id = userId, Name = userName },
                    RoomId = new IDNameModel { Id = roomId, Name = roomName },
                    Content = "joined",
                    MessageType = MessageType.System
                };

                await _messageService.CreateMessageAsync(message);

                await Clients.Group(roomId)
                    .SendAsync("ReceiveMessage", roomId, userId, userName, message, message.CreatedAt);
            }


           // await Clients.Group(roomId).SendAsync("UserJoined", user);
        }

        public async Task Typing(string roomId,string user)
        {
            await Clients.Group(roomId).SendAsync("UserTyping",roomId , user);
        }

        public async Task LeaveRoom(string roomId,string roomName , string userId,string userName)
        {

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

            await _roomServices.RemoveUserFromRoom(roomId, userId);

            var message = new Message
            {
                SenderId = new IDNameModel { Id = userId, Name = userName },
                RoomId = new IDNameModel { Id = roomId, Name = roomName },
                Content = "left",
                MessageType = MessageType.System
            };

            await _messageService.CreateMessageAsync(message);


            await Clients.Group(roomId).SendAsync("ReceiveMessage", roomId, userId, userName, message, message.CreatedAt);

           // await Clients.Group(roomId).SendAsync("UserLeft", userId,userName);

        }

       /* public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier; // comes from JWT
            if (!string.IsNullOrEmpty(userId))
            {
                await _userServices.UpdateOnlineStatus(userId, true);
                await Clients.All.SendAsync("UserStatusChanged", userId, true);
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await _userServices.UpdateOnlineStatus(userId, false);
                await Clients.All.SendAsync("UserStatusChanged", userId, false);
            }

            await base.OnDisconnectedAsync(exception);
        }
       */

    }
}


