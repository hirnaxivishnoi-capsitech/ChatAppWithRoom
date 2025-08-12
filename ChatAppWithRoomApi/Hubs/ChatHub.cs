using ChatAppWithRoomApi.Models;
using ChatAppWithRoomApi.Services;
using Microsoft.AspNetCore.SignalR;

namespace ChatAppWithRoomApi.Hubs
{
    public class ChatHub : Hub
    {

        private readonly MessageService _messageService;

        private readonly RoomServices _roomServices;

        public ChatHub(MessageService messageService,RoomServices roomServices)
        {
            _messageService = messageService;
            _roomServices = roomServices;
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

        public async Task JoinRoom(string roomId,string user)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);

            var history = await _messageService.GetMessagesByRoomIdAsync(roomId);

            await Clients.Caller.SendAsync("LoadHistory", history);

            await Clients.Group(roomId).SendAsync("UserJoined", user);
        }

        public async Task Typing(string roomId,string user)
        {
            await Clients.Group(roomId).SendAsync("UserTyping", user);
        }

        public async Task LeaveRoom(string roomId,string userId)
        {

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);

            await _roomServices.RemoveUserFromRoom(roomId, userId);

            await Clients.Group(roomId).SendAsync("UserLeft", userId);

        }

    }
}
