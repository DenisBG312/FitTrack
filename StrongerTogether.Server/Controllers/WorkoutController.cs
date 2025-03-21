using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StrongerTogether.Server.Data;
using StrongerTogether.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkoutController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public WorkoutController(ApplicationDbContext context)
        {
            _context = context;
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
            if (!IsValidDifficulty(workoutDto.Difficulty))
            {
                return BadRequest("Invalid difficulty level.");
            }

            if (!string.IsNullOrEmpty(workoutDto.VideoUrl) && !Uri.IsWellFormedUriString(workoutDto.VideoUrl, UriKind.Absolute))
            {
                return BadRequest("Invalid video URL format.");
            }

            var userExists = await _context.Users.AnyAsync(u => u.Id == workoutDto.UserId);
            if (!userExists)
            {
                return BadRequest("User does not exist.");
            }

            var workout = new Workout
            {
                Title = workoutDto.Title,
                Description = workoutDto.Description,
                Duration = workoutDto.Duration,
                Difficulty = workoutDto.Difficulty,
                TargetMuscles = workoutDto.TargetMuscles,
                VideoUrl = workoutDto.VideoUrl,
                UserId = workoutDto.UserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkout(Guid id, [FromBody] UpdateWorkoutDto workoutDto)
        {
            var workout = await _context.Workouts.FindAsync(id);
            if (workout == null)
            {
                return NotFound();
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkout(Guid id)
        {
            var workout = await _context.Workouts.FindAsync(id);
            if (workout == null)
            {
                return NotFound();
            }

            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();

            return NoContent();
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

    public class CreateWorkoutDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(1, 600)]
        public int Duration { get; set; }

        [Required]
        public string Difficulty { get; set; } = string.Empty;

        [Required]
        public string TargetMuscles { get; set; } = string.Empty;

        [Url]
        public string VideoUrl { get; set; } = string.Empty;

        [Required]
        public Guid UserId { get; set; }
    }


    public class UpdateWorkoutDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(1, 600)]
        public int Duration { get; set; }

        [Required]
        public string Difficulty { get; set; } = string.Empty;

        [Required]
        public string TargetMuscles { get; set; } = string.Empty;

        [Url]
        public string VideoUrl { get; set; } = string.Empty;
    }

    public class WorkoutResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public string Difficulty { get; set; }
        public string TargetMuscles { get; set; }
        public string VideoUrl { get; set; }
        public Guid UserId { get; set; }
        public UserResponseDto User { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UserResponseDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public string ProfileImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

