using ChatAppWithRoomApi.DTO;
using ChatAppWithRoomApi.Models;
using ChatAppWithRoomApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChatAppWithRoomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase

    {

        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }


        [HttpGet("{userId}")]

        public async Task<ApiResponse<User>> GetUserById(string userId)
        {

            var res = new ApiResponse<User>();

            try
            {

            var user = await _userService.GetUserById(userId);

                res.Result = user;
                res.Message = user.Name;

            }catch(Exception ex)
            {
                res.Message = ex.Message;
                res.Status = false;
                 
            }

            return res;
        }

        [HttpPost("{userId}")]

        public async Task<ApiResponse<UserDto>> UpdateUser(string userId ,[FromBody] UserDto update )
        
        {

            var res = new ApiResponse<UserDto>();

            try {

                var user = await _userService.UpdateUserAsync(userId,update);

                if(user != null)
                {
                    var updateUser = new UserDto{
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                    };

                    res.Result = updateUser;
                    res.Message = "User Updated successfully";
                    return res;
                }

                res.Status=false;
                res.Message = "Failed to updated";

            
            }catch(Exception ex)
            {
                res.Message = ex.Message;
                res.Status = false;
            }

            return res;
        }

        [HttpPost("ChangePassword")]

        public async Task<ApiResponse<bool>> ChangePassword(ChangePassword changePassword)
        {
            var res = new ApiResponse<bool>();

            try {
            
              //  var userId = HttpContent
              var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
              
                if(userId == null)
                {
                    res.Result=false;
                    res.Message = "User is required";
                }

                var userInfo = await _userService.GetUserById(userId);

               var verfiy = BCrypt.Net.BCrypt.EnhancedVerify(changePassword.OldPassword,userInfo.PasswordHash);

                if (verfiy)
                {
                 var HashNewPassword =  BCrypt.Net.BCrypt.EnhancedHashPassword(changePassword.NewPassword, 13);

                    await _userService.ChangePassword(userId, HashNewPassword);
                    res.Result = true;
                    res.Message = "Password changed successfully";

                }



            } catch(Exception ex) { 
            res.Message = ex.Message;
            res.Status = false;
            }
            return res;
        }
    
    }
}
