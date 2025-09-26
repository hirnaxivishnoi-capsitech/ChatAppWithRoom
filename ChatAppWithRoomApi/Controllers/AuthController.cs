using ChatAppWithRoomApi.DTO;
using ChatAppWithRoomApi.Models;
using ChatAppWithRoomApi.Services;
using Microsoft.AspNetCore.Mvc;
namespace ChatAppWithRoomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        //readonly - The variable can only be set once (in the constructor).
        public readonly UserService _userService;
        //Stores an AuthService object to use later for creating JWT tokens.
        private readonly AuthService _authService;

        public AuthController(UserService userService, AuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        [HttpPost("login")]

        public async Task<ApiResponse<AuthResponse>> login(Login loginUser)
        {
            var res = new ApiResponse<AuthResponse>();
            try
            {
                var user = await _userService.GetUserByEmailAndPassword(loginUser.Email, loginUser.Password);
                if (user != null)
                {

                    var token = _authService.generateJWTToken(user);
                    var refreshToken = _authService.generateRefreshToken();

                    //user.RefreshToken = refreshToken;
                    // user.RefreshTimeExpiryTime = DateTime.Now.AddDays(12);

                    await _userService.UpdatedRefreshToken(user.Id, refreshToken);

                    //  await _userService.UpdateAsync(user);

                    res.Result = new AuthResponse { Email = user.Email,   Token = token , RefreshToken = refreshToken,Name = user.Name , Id = user.Id };
                    res.Message = "Login  Successful";
                    return res;
                }
                res.Status = false;
                res.Message = "Login Failed";
               
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                res.Status = false;

            }
            return res;
        }

        [HttpPost("register")]

        public async Task<ActionResult<ApiResponse<User>>> Register(Register register)
        {
            var res = new ApiResponse<bool>();

            try
            {
                var userExist = await _userService.GetUserIfExistAysnc(register.Email, register.Name);
                if (userExist != null)
                {

                    res.Message = "User with this name or email already exists.";
                    res.Status = false;
                    return Conflict(res);

                }
               
                register.Password = BCrypt.Net.BCrypt.EnhancedHashPassword(register.Password, 13);
                var user = new User
                {
                    Name = register.Name,
                    Email = register.Email,
                    PasswordHash = register.Password
                };
                await _userService.CreateAsync(user);
                res.Message = "User created Successfully";
                res.Result = true;
                return Ok(res);
            }
            catch (Exception ex)
            {
                res.Message = ex.Message;
                res.Status = false;
                return StatusCode(500, res);
            }
        }

        [HttpPost("refreshToken")]

        public async Task<ApiResponse<AuthResponse>> RefreshToken(string refershToken)
        {
            ApiResponse<AuthResponse> response = new ApiResponse<AuthResponse>();

            try
            { 
                var user = await _userService.GetRefreshToken(refershToken);

                if(user.RefreshTimeExpiryTime > DateTime.UtcNow)
                {
                    response.Message = "Refresh Token Expire";
                    response.Status = false;
                }

                var token = _authService.generateJWTToken(user);
                var generateRefreshToken = _authService.generateRefreshToken();

                await _userService.UpdatedRefreshToken(user.Id, generateRefreshToken);

                response.Result = new AuthResponse { Email = user.Email, Token = token, RefreshToken = generateRefreshToken, Name = user.Name, Id = user.Id };
                response.Message = "Token refreshed successfully";
                response.Status = true;
            }
            catch(Exception ex)
            {
                response.Message = ex.Message;
                response.Status = false;
            }

            return response;

        }

    }
}
