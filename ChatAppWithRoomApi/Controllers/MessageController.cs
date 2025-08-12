using ChatAppWithRoomApi.DTO;
using ChatAppWithRoomApi.Models;
using ChatAppWithRoomApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatAppWithRoomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly MessageService _messageService;

        public MessageController(MessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpPost("CreateMessage")]

        public async Task<ApiResponse<Message>> CreateMessage([FromBody]Message message)
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

    }
}
