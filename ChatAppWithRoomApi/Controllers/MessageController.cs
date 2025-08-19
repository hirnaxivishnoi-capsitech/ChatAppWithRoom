using ChatAppWithRoomApi.DTO;
using ChatAppWithRoomApi.Hubs;
using ChatAppWithRoomApi.Models;
using ChatAppWithRoomApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ChatAppWithRoomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly MessageService _messageService;

        private readonly ICloudinaryService _cloudinaryService;

        public MessageController(MessageService messageService, ICloudinaryService cloudinaryService)
        {
            _messageService = messageService;
            _cloudinaryService = cloudinaryService;
        }

        [HttpPost("CreateMessage")]

        public async Task<ApiResponse<Message>> CreateMessage([FromBody] Message message)
        {
            var res = new ApiResponse<Message>();

            try
            {
                res.Result = await _messageService.CreateMessageAsync(message);
                res.Message = "Success";
                res.Status = true;

            }
            catch (Exception ex)
            {
                res.Status = false;
                res.Message = ex.Message;
            }

            return res;
        }

        [HttpGet("GetMessagesByRoomId/{roomId}")]
        public async Task<ApiResponse<List<Message>>> GetMessagesByRoomId(string roomId)
        {
            var res = new ApiResponse<List<Message>>();
            try
            {
                res.Result = await _messageService.GetMessagesByRoomIdAsync(roomId);
                res.Message = "Success";
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.Message = ex.Message;
            }
            return res;
        }

        [HttpPost("UploadFile")]

        public async Task<ApiResponse<Message>> UploadFile([FromForm] UploadFile uploadFile,
 [FromServices] IHubContext<ChatHub> hubContext
)
        {
            var res = new ApiResponse<Message>();

            try
            {

                if (uploadFile == null)
                {
                    res.Status = false;
                    res.Message = "No file uploaded";
                    return res;
                }

                var fileUrl = await _cloudinaryService.UploadFileAsync(uploadFile.File);

                var message = new Message
                {
                    SenderId = new IDNameModel { Id = uploadFile.UserId, Name = uploadFile.UserName },
                    RoomId = new IDNameModel { Id = uploadFile.RoomId, Name = uploadFile.RoomName },
                    FileUrl = fileUrl,
                    FileName = uploadFile.File.FileName,
                    MessageType = uploadFile.File.ContentType.StartsWith("image/") ? MessageType.Image : MessageType.File

                };

                res.Result = await _messageService.CreateMessageAsync(message);
                res.Message = "File uploaded successfully!";
                await hubContext.Clients.Group(uploadFile.RoomId)
           .SendAsync("ReceiveMessage", uploadFile.RoomId, uploadFile.UserId, uploadFile.UserName, message, message.CreatedAt);

            }
            catch (Exception ex)
            {
                res.Status = false;
                res.Message = ex.Message;
            }

            return res;
        }
    }
}
