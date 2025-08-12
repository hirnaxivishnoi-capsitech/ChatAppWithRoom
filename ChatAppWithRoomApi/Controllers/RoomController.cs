using ChatAppWithRoomApi.DTO;
using ChatAppWithRoomApi.Models;
using ChatAppWithRoomApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
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

        public RoomController(RoomServices roomService, UserService userService)
        {
            _roomService = roomService;
            _userService = userService;
        }

        [HttpPost("CreateRoom")]

        public async Task<ActionResult<ApiResponse<Room>>> CreateRoom([FromBody] Room room)
        {
            var res = new ApiResponse<Room>();

          

            try
            {
                var roomExist = await _roomService.GetIfExistRoomAysnc(room.Name, room.IsPrivate);

                if(roomExist != null)
                {
                    res.Status = false;
                    res.Message = "Room already Created";
                    return Conflict(res);
                }

                if (room.CreatedBy == null || string.IsNullOrEmpty(room.CreatedBy.Id))
                {
                    return BadRequest("CreatedBy ID is required.");
                }

                var creator = await _userService.GetUserById(room.CreatedBy.Id);

                if (creator == null)
                {
                    return NotFound("Creator user not found.");
                }

                if(room.IsPrivate)
                {
                    if(String.IsNullOrEmpty(room.Password)){

                        return BadRequest("Password is required");
                    } 
                };

                room.CreatedBy.Id = creator.Id;
                room.CreatedBy.Name = creator.Name;

                var createdRoom = await _roomService.CreateRoomAsync(room);

                res.Result = createdRoom;

                res.Message = "Successfully Created Room";
                return Ok(res);


            }catch(Exception ex)
            {
                res.Message = "An error occurred while creating the room.";
                return StatusCode(500, res);
            }
        }


        [HttpGet("GetAllRooms/{roomName}")]

        public async Task<ActionResult<ApiResponse<List<Room>>>> GetAllRooms(string? roomName)
        {
            var res = new ApiResponse<List<Room>>();

            try
            { 
                    var rooms = await _roomService.GetFilterRoom(roomName);
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
                    res.Message = "Room does not exist";
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
                    res.Message = "Room does not exist";
                    res.Result = null;
                    return res;
                }

                if(roomExist.IsPrivate == true)
                {
                    if (String.IsNullOrEmpty(joinRoom.Password))
                    {
                        res.Status = false;
                        res.Message = "Password is required";
                        res.Result = null;
                        return res;
                    }
                    if (roomExist.Password != joinRoom.Password) 
                    {
                        res.Status = false;
                        res.Message = "Invalid password";
                        res.Result = null;
                        return res;
                        
                    }
                }
               var updatedRoom = await _roomService.AddUserToRoom(joinRoom.RoomId, joinRoom.UserId,joinRoom.UserName);
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
        public async Task<ApiResponse<List<Room>>> GetYourRooms(string userId)
        {
            var res = new ApiResponse<List<Room>>();

            try
            {

                var userRooms = await _roomService.GetYourRooms(userId);

                if(userRooms == null)
                {
                    res.Status = false;
                    res.Message = "No rooms";
                    res.Result = null;
                    return res;
                }

                res.Message = "User Rooms";
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
        public async Task<ApiResponse<List<Room>>> GetAvaliableRooms(string userId)
        {
            var res = new ApiResponse<List<Room>>();

            try
            {

                var userRooms = await _roomService.GetAvaliableRooms(userId);

                if (userRooms == null)
                {
                    res.Status = false;
                    res.Message = "No rooms";
                    res.Result = null;
                    return res;
                }

                res.Message = "User Rooms";
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
                    res.Message = "Only Admin can delete this room";
                    res.Result = false;
                    return res;
                }

                await _roomService.DeleteAsync(deleteRoomDto.roomId);
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
