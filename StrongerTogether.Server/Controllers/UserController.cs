using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrongerTogether.Server.Data;
using StrongerTogether.Server.Models;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public UserController(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterRequest model)
        {
            // Check if the email already exists in the database
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                return BadRequest(new { message = "Email already in use." });
            }

            // Initialize imageUrl to null in case there's no image
            string imageUrl = null;

            // Check if the profile image exists
            if (model.ProfileImage != null)
            {
                var fileExtension = Path.GetExtension(model.ProfileImage.FileName);
                var fileName = Guid.NewGuid() + fileExtension;  // Unique file name to avoid collision
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", fileName);  // Save path

                // Create directory if it doesn't exist
                if (!Directory.Exists(Path.GetDirectoryName(filePath)))
                {
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                }

                // Save the file to the server
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ProfileImage.CopyToAsync(fileStream);
                }

                // Save the relative URL of the image
                imageUrl = "/uploads/" + fileName;
            }

            // Create a new User entity and populate fields
            var user = new User
            {
                Email = model.Email,
                Username = model.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(model.Password),  // Hash password for security
                Role = "User",  // Default user role
                Height = model.Height,
                Weight = model.Weight,
                ProfileImageUrl = imageUrl  // Store the image URL or null
            };

            // Add the new user to the database and save changes
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == login.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = GenerateJwtToken(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(5)
            };

            Response.Cookies.Append("jwt", token, cookieOptions);

            return Ok(new { token });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null) return Unauthorized();

            var baseUrl = $"{Request.Scheme}://{Request.Host.Value}"; // Get full base URL

            var user = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Role,
                    u.Height,
                    u.Weight,
                    ProfileImageUrl = u.ProfileImageUrl != null ? $"{baseUrl}{u.ProfileImageUrl}" : null // Convert relative path to full URL
                })
                .FirstOrDefaultAsync(u => u.Id.ToString() == userId);

            if (user == null) return NotFound(new { message = "User not found" });

            return Ok(user);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(5),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            if (Request.Cookies.ContainsKey("jwt"))
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddYears(-1)
                };

                Response.Cookies.Delete("jwt");
                Response.Cookies.Append("jwt", "", cookieOptions);
            }

            return Ok(new { message = "Logged out successfully" });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        [Required]
        [StringLength(256)]
        public string Email { get; set; }
        [Required]
        [StringLength(256)]
        public string Password { get; set; }
        [Required]
        [StringLength(100)]
        public string Username { get; set; }
        [Required]
        public decimal Height { get; set; }
        [Required]
        public decimal Weight { get; set; }
        [Required]
        public IFormFile ProfileImage { get; set; } = null!;
    }
}
