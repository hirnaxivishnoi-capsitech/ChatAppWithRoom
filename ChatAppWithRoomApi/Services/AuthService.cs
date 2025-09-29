using ChatAppWithRoomApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ChatAppWithRoomApi.Services
{
    public class AuthService
    {
        public readonly IConfiguration _configuration;
        public readonly UserService _userService;

        public AuthService(IConfiguration configuration, UserService userService)
        {
            _configuration = configuration;
            _userService = userService;
        }

        public string generateJWTToken(User user)
        {
            //SymmetricSecurityKey - creates a new security object 
            //Encoding.UTF8.GetBytes - convert a text key (stored in _configuration) to byte
            //Takes a secret key from the program.cs  and turns it into a secure key object.
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));

            //Create credentials that will be used to sign the jwt
            //Combines the security key with the HMAC-SHA256 algorithm to create signing credentials.
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //Creates a list of “claims” (pieces of info) about the user to include in the JWT.
            var claims = new[] {
                //Adds a “subject” claim to identify the user.
                //Example : This token is for Alice
                //The server uses this to know who the token represents.
            new Claim(JwtRegisteredClaimNames.Sub,user.Id.ToString()),
            //Adds a unique ID for the token
            //Helps track or prevent reuse of tokens (e.g., to ensure a token isn’t used twice).
            new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
            //Adds the user’s name as a claim
            new Claim(ClaimTypes.Name,user.Name),
             new Claim(ClaimTypes.Email,user.Email),
            //Roles help the server decide what the user is allowed to do Example user's role is admin or user
            new Claim(ClaimTypes.Role,user.Role ?? "user"),
            };

            // create a jwt with all the details
            // Builds the JWT with:
            // Who made it(issuer).
            // Who it’s for (audience).
            //User info(claims).
            //Expiration time(expires).
            //Signature method(signingCredentials).
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToInt32(_configuration["JWT:ExpireTime"])),
                signingCredentials: credentials
                );

            //new JwtSecurityTokenHandler(): Creates a tool to handle JWTs.
            //WriteToken - convert the token into string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string generateRefreshToken()
        {
            var randomBytes = new byte[32];

            var rng = RandomNumberGenerator.Create();

            rng.GetBytes(randomBytes);

            return Convert.ToBase64String(randomBytes);
        }
    }
}
