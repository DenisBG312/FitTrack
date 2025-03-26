using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StrongerTogether.Server.Data;
using StrongerTogether.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using StrongerTogether.Server.DTOs.User;
using StrongerTogether.Server.DTOs.Workout;

namespace StrongerTogether.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkoutController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        public WorkoutController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WorkoutResponseDto>>> GetWorkouts()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host.Value}";

            var workouts = await _context.Workouts
                .Include(w => w.User)
                .Select(w => new WorkoutResponseDto
                {
                    Id = w.Id,
                    Title = w.Title,
                    Description = w.Description,
                    Duration = w.Duration,
                    Difficulty = w.Difficulty,
                    TargetMuscles = w.TargetMuscles,
                    VideoUrl = w.VideoUrl,
                    UserId = w.UserId,
                    User = new UserResponseDto
                    {
                        Id = w.User.Id,
                        Username = w.User.Username,
                        Email = w.User.Email,
                        Role = w.User.Role,
                        Height = w.User.Height,
                        Weight = w.User.Weight,
                        ProfileImageUrl = w.User.ProfileImageUrl != null
                            ? $"{baseUrl}{w.User.ProfileImageUrl}"
                            : null,
                        CreatedAt = w.User.CreatedAt
                    },
                    CreatedAt = w.CreatedAt
                })
                .ToListAsync();

            return Ok(workouts);
        }

        [HttpGet("GetSpecificWorkout/{id}")]
        public async Task<ActionResult<WorkoutResponseDto>> GetWorkout(Guid id)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host.Value}";

            var workout = await _context.Workouts
                .Include(w => w.User)
                .Where(w => w.Id == id)
                .Select(w => new WorkoutResponseDto
                {
                    Id = w.Id,
                    Title = w.Title,
                    Description = w.Description,
                    Duration = w.Duration,
                    Difficulty = w.Difficulty,
                    TargetMuscles = w.TargetMuscles,
                    VideoUrl = w.VideoUrl,
                    UserId = w.UserId,
                    User = new UserResponseDto
                    {
                        Id = w.User.Id,
                        Username = w.User.Username,
                        Email = w.User.Email,
                        Role = w.User.Role,
                        Height = w.User.Height,
                        Weight = w.User.Weight,
                        ProfileImageUrl = w.User.ProfileImageUrl != null
                            ? $"{baseUrl}{w.User.ProfileImageUrl}"
                            : null,
                        CreatedAt = w.User.CreatedAt
                    },
                    CreatedAt = w.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (workout == null)
            {
                return NotFound();
            }

            return workout;
        }

        [HttpPost]
        public async Task<ActionResult<Workout>> CreateWorkout([FromBody] CreateWorkoutDto workoutDto)
        {
            var jwtCookie = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(jwtCookie))
            {
                return Unauthorized("No JWT token found in cookie");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:SecretKey"]);

            try
            {
                tokenHandler.ValidateToken(jwtCookie, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var parsedToken = (JwtSecurityToken)validatedToken;
                var userId = parsedToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;

                var workout = new Workout
                {
                    Title = workoutDto.Title,
                    Description = workoutDto.Description,
                    Duration = workoutDto.Duration,
                    Difficulty = workoutDto.Difficulty,
                    TargetMuscles = workoutDto.TargetMuscles,
                    VideoUrl = workoutDto.VideoUrl,
                    UserId = Guid.Parse(userId),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Workouts.Add(workout);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
            }
            catch (Exception ex)
            {
                return Unauthorized($"Invalid token: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkout(Guid id, [FromBody] UpdateWorkoutDto workoutDto)
        {
            var workout = await _context.Workouts.FindAsync(id);
            if (workout == null)
            {
                return NotFound();
            }

            var jwtCookie = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(jwtCookie))
            {
                return Unauthorized("No JWT token found in cookie.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:SecretKey"]);

            try
            {
                tokenHandler.ValidateToken(jwtCookie, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var parsedToken = (JwtSecurityToken)validatedToken;
                var userId = parsedToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;

                if (!Guid.TryParse(userId, out Guid userGuid) || workout.UserId != userGuid)
                {
                    return Unauthorized("You can only edit your own workouts.");
                }

                if (!IsValidDifficulty(workoutDto.Difficulty))
                {
                    return BadRequest("Invalid difficulty level.");
                }

                if (!string.IsNullOrEmpty(workoutDto.VideoUrl) && !Uri.IsWellFormedUriString(workoutDto.VideoUrl, UriKind.Absolute))
                {
                    return BadRequest("Invalid video URL format.");
                }

                workout.Title = workoutDto.Title;
                workout.Description = workoutDto.Description;
                workout.Duration = workoutDto.Duration;
                workout.Difficulty = workoutDto.Difficulty;
                workout.TargetMuscles = workoutDto.TargetMuscles;
                workout.VideoUrl = workoutDto.VideoUrl;

                _context.Entry(workout).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!WorkoutExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return Unauthorized($"Invalid token: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkout(Guid id)
        {
            var jwtCookie = Request.Cookies["jwt"];
            if (string.IsNullOrEmpty(jwtCookie))
            {
                return Unauthorized("No JWT token found in cookie.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:SecretKey"]);

            try
            {
                tokenHandler.ValidateToken(jwtCookie, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var parsedToken = (JwtSecurityToken)validatedToken;
                var userId = parsedToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;

                var workout = await _context.Workouts.FindAsync(id);
                if (workout == null)
                {
                    return NotFound();
                }

                if (!Guid.TryParse(userId, out Guid userGuid) || workout.UserId != userGuid)
                {
                    return Unauthorized("You can only delete your own workouts.");
                }

                _context.Workouts.Remove(workout);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return Unauthorized($"Invalid token: {ex.Message}");
            }
        }

        private bool IsValidDifficulty(string difficulty)
        {
            var validDifficulties = new[] { "Beginner", "Intermediate", "Advanced" };
            return validDifficulties.Contains(difficulty);
        }

        private bool WorkoutExists(Guid id)
        {
            return _context.Workouts.Any(e => e.Id == id);
        }
    }
}

