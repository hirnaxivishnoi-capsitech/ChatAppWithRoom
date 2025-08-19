using ChatAppWithRoomApi.DTO;
using ChatAppWithRoomApi.Models;
using ChatAppWithRoomApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Security.Cryptography.X509Certificates;

namespace ChatAppWithRoomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
   // [Authorize(AuthenticationSchemes = "Bearer")]
    public class RoomController : ControllerBase
    {
        private readonly RoomServices _roomService;

        private readonly UserService _userService;

        private readonly ICloudinaryService _cloudinaryService;

        public RoomController(RoomServices roomService, UserService userService, ICloudinaryService cloudinaryService)
        {
            _roomService = roomService;
            _userService = userService;
            _cloudinaryService = cloudinaryService;
        }


        [HttpPost("CreateRoom")]
        public async Task<ActionResult<ApiResponse<Room>>> CreateRoom([FromForm] RoomCreationDto room)
        {
            var res = new ApiResponse<Room>();

            try
            {
                var roomExist = await _roomService.GetIfExistRoomAysnc(room.Name, (bool)room.IsPrivate);
                if (roomExist != null)
                {
                    res.Status = false;
                    res.Message = "Room already exists";
                    return res;
                }

                if (string.IsNullOrEmpty(room.UserId))
                    return BadRequest("The creator's user ID is required.");

                var creator = await _userService.GetUserById(room.UserId);
                if (creator == null)
                    return NotFound("The specified creator could not be found");

                string hashedPassword = null;
                if ((bool)room.IsPrivate)
                {
                    if (string.IsNullOrEmpty(room.Password))
                        return BadRequest("A password is required to create a private room.");

                    hashedPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(room.Password, 13);
                }

                string imageUrl = null;
                if (room.RoomImage != null)
                {
                    imageUrl = await _cloudinaryService.UploadFileAsync(room.RoomImage);
                }

                var createRoom = new Room
                {
                    Name = room.Name,
                    IsPrivate = (bool)room.IsPrivate,
                    Password = hashedPassword,
                    Description = room.Description,
                    CreatedBy = new IDNameModel { Id = creator.Id, Name = creator.Name },
                    Members = new List<IDNameModel> { new IDNameModel { Id = creator.Id, Name = creator.Name } },
                    RoomImage= imageUrl
                };

                var createdRoom = await _roomService.CreateRoomAsync(createRoom);

                res.Status = true;
                res.Result = createdRoom;
                res.Message = "Room has been created successfully";
                return res;
            }
            catch (Exception ex)
            {
                res.Status = false;
                res.Message = $"An error occurred while creating the room. {ex.Message}";
                return res;
            }
        }


        [HttpGet("GetAllRooms")]

        public async Task<ActionResult<ApiResponse<List<Room>>>> GetAllRooms()
        {
            var res = new ApiResponse<List<Room>>();

            try
            { 
                    var rooms = await _roomService.GetAllRoom();
                    res.Result = rooms;
                    res.Status = true;
                    res.Message = "List of rooms";
                    return Ok(res);

            }
            catch (Exception ex)
            {
                res.Status = false;
                res.Message = "An error occurred while getting all the room.";
                return StatusCode(500, res);

            }
            
        }

        [HttpGet("GetRoomById")]

        public async Task<ActionResult<ApiResponse<Room>>> GetRoomById(string id)
        {
            var res = new ApiResponse<Room>();

            try
            {
               var roomExist = await _roomService.GetRoomById(id);

                if(roomExist == null)
                {
                    res.Status = false;
                    res.Message = "The specified room could not be found.";
                    res.Result = null;
                    return res;
                }

                res.Result = roomExist;
                res.Message = "Success";
                return Ok(res);


            }catch(Exception ex)
            {
                res.Status = false;
                res.Message= ex.Message;
                return StatusCode(500,res);
            }

        }


        [HttpPost("JoinRoom")]

        public async Task<ActionResult<ApiResponse<Room>>> JoinRoom([FromBody] JoinRoomDto joinRoom)
        {

            var res = new ApiResponse<Room>();

            try
            {
                var roomExist = await _roomService.GetRoomById(joinRoom.RoomId);

                if (roomExist == null)
                {
                    res.Status = false;
                    res.Message = "The specified room could not be found.";
                    res.Result = null;
                    return res;
                }

                if(roomExist.IsPrivate == true)
                {
                    if (String.IsNullOrEmpty(joinRoom.Password))
                    {
                        res.Status = false;
                        res.Message = "A password is required to join this private room";
                        res.Result = null;
                        return res;
                    }
                   
                    var Verify = BCrypt.Net.BCrypt.EnhancedVerify(joinRoom.Password, roomExist.Password);

                    if (!Verify)
                    {

                        res.Status = false;
                        res.Message = "The password provided is incorrect.";
                        res.Result = null;
                        return res;
                       
                    }
                   
                }

                var updatedRoom = await _roomService.AddUserToRoom(joinRoom.RoomId, joinRoom.UserId, joinRoom.UserName);
                res.Result = updatedRoom;
                res.Message = "Joined room Successfully";

                return Ok(res);

            }catch(Exception ex)
            {
                res.Status = false;
                res.Message = ex.Message;
                res.Result = null;
            }

            return Ok();
        }

        [HttpGet("GetYourRooms/{userId}")]
        public async Task<ApiResponse<List<Room>>> GetYourRooms(string userId, [FromQuery]string? room)
        {
            var res = new ApiResponse<List<Room>>();

            try
            {

                var userRooms = await _roomService.GetYourRooms(userId,room);

                if(userRooms == null)
                {
                    res.Status = false;
                    res.Message = "No rooms found";
                    res.Result = null;
                    return res;
                }

                res.Message = "Available rooms retrieved successfully";
                res.Result = userRooms;
                return res;


            }catch(Exception ex)
            {
                res.Status = false;
                res.Message = ex.Message;
                res.Result = null;
                return res;
            }

        }


        [HttpGet("GetAvaliableRooms/{userId}")]
        public async Task<ApiResponse<List<Room>>> GetAvaliableRooms(string userId,[FromQuery] string? room)
        {
            var res = new ApiResponse<List<Room>>();

            try
            {

                var userRooms = await _roomService.GetAvaliableRooms(userId,room);

                if (userRooms == null)
                {
                    res.Status = false;
                    res.Message = "No rooms found";
                    res.Result = null;
                    return res;
                }

                res.Message = "Available rooms retrieved successfully";
                res.Result = userRooms;
                return res;


            }
            catch (Exception ex)
            {
                res.Status = false;
                res.Message = ex.Message;
                res.Result = null;
                return res;
            }

        }

        [HttpPost("DeleteRoom")]

        public async Task<ApiResponse<bool>> DeleteRoom([FromBody] DeleteRoomDto deleteRoomDto)
        {
            var res = new ApiResponse<bool>();

            try {
            
                var room = await _roomService.GetRoomById(deleteRoomDto.roomId);


                if (room.CreatedBy.Id != deleteRoomDto.userId)
                {
                    res.Status = false;
                    res.Message = "Only the room creator is allowed to delete this room.";
                    res.Result = false;
                    return res;
                }

                await _roomService.SoftDelete(deleteRoomDto.roomId);
                res.Message = "Room deleted successfully.";
                res.Result= true;
                

            }
            
            catch(Exception ex)
            
            {
                res.Status = false;
                res.Message = ex.Message;
                res.Result = false;
            }

            return res;

        }
    
    }
}
