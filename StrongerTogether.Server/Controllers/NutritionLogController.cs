using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using StrongerTogether.Server.Data;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using StrongerTogether.Server.DTOs.Nutrition;
using StrongerTogether.Server.DTOs.User;

namespace StrongerTogether.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NutritionLogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public NutritionLogController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NutritionLogResponseDto>>> GetNutritionLogs()
        {
            var userId = GetUserIdFromJwt();
            if (userId == Guid.Empty)
            {
                return Unauthorized("No JWT token found or invalid token.");
            }

            var nutritionLogs = await _context.NutritionLogs
                .Where(n => n.UserId == userId)
                .Include(n => n.User)
                .Select(n => new NutritionLogResponseDto
                {
                    Id = n.Id,
                    FoodName = n.FoodName,
                    Calories = n.Calories,
                    Protein = n.Protein,
                    Carbs = n.Carbs,
                    Fats = n.Fats,
                    MealType = n.MealType,
                    Date = n.Date,
                    UserId = n.UserId,
                    User = new UserResponseDto
                    {
                        Id = n.User.Id,
                        Username = n.User.Username,
                        Email = n.User.Email,
                        Role = n.User.Role,
                        Height = n.User.Height,
                        Weight = n.User.Weight,
                        ProfileImageUrl = n.User.ProfileImageUrl,
                        CreatedAt = n.User.CreatedAt
                    }
                })
                .ToListAsync();

            return Ok(nutritionLogs);
        }

        [HttpGet("GetSpecificNutritionLog/{id}")]
        public async Task<ActionResult<NutritionLog>> GetNutritionLog(Guid id)
        {
            var userId = GetUserIdFromJwt();
            if (userId == Guid.Empty)
            {
                return Unauthorized("No valid JWT token found.");
            }

            var log = await _context.NutritionLogs.FindAsync(id);
            if (log == null || log.UserId != userId)
            {
                return NotFound("Log not found or you do not have access to it.");
            }

            return Ok(log);
        }

        [HttpPost]
        public async Task<ActionResult<NutritionLog>> CreateNutrition([FromBody] CreateNutritionLogDto nutritionDto)
        {
            var userId = GetUserIdFromJwt();
            if (userId == Guid.Empty)
            {
                return Unauthorized("No JWT token found or invalid token.");
            }

            var nutritionLog = new NutritionLog
            {
                FoodName = nutritionDto.FoodName,
                Calories = nutritionDto.Calories,
                Protein = nutritionDto.Protein,
                Carbs = nutritionDto.Carbs,
                Fats = nutritionDto.Fats,
                MealType = nutritionDto.MealType,
                Date = nutritionDto.Date,
                UserId = userId
            };

            _context.NutritionLogs.Add(nutritionLog);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNutritionLog), new { id = nutritionLog.Id }, nutritionLog);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNutritionLog(Guid id, [FromBody] NutritionLog updatedLog)
        {
            var userId = GetUserIdFromJwt();
            if (userId == Guid.Empty)
            {
                return Unauthorized("No valid JWT token found.");
            }

            var log = await _context.NutritionLogs.FindAsync(id);
            if (log == null || log.UserId != userId)
            {
                return NotFound("Log not found or you do not have access to it.");
            }

            log.FoodName = updatedLog.FoodName;
            log.Calories = updatedLog.Calories;
            log.Protein = updatedLog.Protein;
            log.Carbs = updatedLog.Carbs;
            log.Fats = updatedLog.Fats;
            log.MealType = updatedLog.MealType;
            log.Date = updatedLog.Date;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNutritionLog(Guid id)
        {
            var userId = GetUserIdFromJwt();
            if (userId == Guid.Empty)
            {
                return Unauthorized("No valid JWT token found.");
            }

            var log = await _context.NutritionLogs.FindAsync(id);
            if (log == null || log.UserId != userId)
            {
                return NotFound("Log not found or you do not have access to it.");
            }

            _context.NutritionLogs.Remove(log);
            await _context.SaveChangesAsync();
            return NoContent();
        }



        private Guid GetUserIdFromJwt()
        {
            var jwtCookie = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(jwtCookie))
            {
                return Guid.Empty;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:SecretKey"]);

            try
            {
                var principal = tokenHandler.ValidateToken(jwtCookie, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
                return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : Guid.Empty;
            }
            catch (Exception)
            {
                return Guid.Empty;
            }
        }
    }
}
