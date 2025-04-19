using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StrongerTogether.Server.Data;
using StrongerTogether.Server.DTOs.Post;
using StrongerTogether.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StrongerTogether.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        public PostController(ApplicationDbContext context, IWebHostEnvironment environment, IConfiguration configuration)
        {
            _context = context;
            _environment = environment;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host.Value}";

            var posts = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Workout)
                .Include(p => p.NutritionLog)
                .Include(p => p.Comments)
                .Include(p => p.Likes)
                .Select(p => new
                {
                    p.Id,
                    p.UserId,
                    User = new
                    {
                        p.User.Id,
                        p.User.Username,
                        ProfileImageUrl = p.User.ProfileImageUrl != null
                            ? $"{baseUrl}{p.User.ProfileImageUrl}"
                            : null,
                        p.User.CreatedAt
                    },
                    p.Content,
                    ImageUrl = p.ImageUrl != null ? $"{baseUrl}{p.ImageUrl}" : null,
                    p.WorkoutId,
                    Workout = p.Workout != null ? new
                    {
                        p.Workout.Id,
                        p.Workout.Title,
                        p.Workout.Duration
                    } : null,
                    p.NutritionLogId,
                    NutritionLog = p.NutritionLog != null ? new
                    {
                        p.NutritionLog.Id,
                        p.NutritionLog.FoodName,
                        p.NutritionLog.Calories
                    } : null,
                    p.CreatedAt,
                    Comments = p.Comments.Select(c => new
                    {
                        c.Id,
                        c.Content,
                        c.CreatedAt
                    }),
                    Likes = p.Likes.Select(l => new
                    {
                        l.UserId,
                        l.User.Username,
                        l.LikedAt
                    })
                })
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(posts);
        }

        [HttpGet("{postId}")]
        public async Task<IActionResult> GetPostById(Guid postId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host.Value}";

            var post = await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Workout)
                .Include(p => p.NutritionLog)
                .Include(p => p.Comments)
                .ThenInclude(c => c.User)
                .Include(p => p.Likes).ThenInclude(like => like.User)
                .FirstOrDefaultAsync(p => p.Id == postId);

            if (post == null)
                return NotFound("Post not found.");

            var postDetails = new
            {
                post.Id,
                post.UserId,
                User = new
                {
                    post.User.Id,
                    post.User.Username,
                    ProfileImageUrl = post.User.ProfileImageUrl != null
                        ? $"{baseUrl}{post.User.ProfileImageUrl}"
                        : null,
                    post.User.CreatedAt
                },
                post.Content,
                ImageUrl = post.ImageUrl != null ? $"{baseUrl}{post.ImageUrl}" : null,
                post.WorkoutId,
                Workout = post.Workout != null ? new
                {
                    post.Workout.Id,
                    post.Workout.Title,
                    post.Workout.Duration
                } : null,
                post.NutritionLogId,
                NutritionLog = post.NutritionLog != null ? new
                {
                    post.NutritionLog.Id,
                    post.NutritionLog.FoodName,
                    post.NutritionLog.Calories
                } : null,
                post.CreatedAt,
                Comments = post.Comments.OrderByDescending(c => c.CreatedAt).Select(c => new
                {
                    c.Id,
                    c.Content,
                    c.CreatedAt,
                    User = new
                    {
                        c.User.Id,
                        c.User.Username,
                        ProfileImageUrl = c.User.ProfileImageUrl != null
                            ? $"{baseUrl}{c.User.ProfileImageUrl}"
                            : null
                    }
                }),
                Likes = post.Likes.Select(l => new
                {
                    l.UserId,
                    l.User.Username,
                    l.LikedAt
                })
            };

            return Ok(postDetails);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostDto model)
        {
            var userId = GetUserIdFromJwt();

            if (userId == Guid.Empty)
            {
                return Unauthorized("No JWT token found or invalid token.");
            }

            if (model.WorkoutId.HasValue)
            {
                var workout = await _context.Workouts
                    .FirstOrDefaultAsync(w => w.Id == model.WorkoutId.Value);

                if (workout == null)
                {
                    return BadRequest("Invalid workout selection");
                }
            }

            if (model.NutritionLogId.HasValue)
            {
                var nutritionLog = await _context.NutritionLogs
                    .FirstOrDefaultAsync(n => n.Id == model.NutritionLogId.Value);

                if (nutritionLog == null || nutritionLog.UserId != userId)
                {
                    return BadRequest("Invalid nutrition log selection");
                }
            }

            string imageUrl = null;
            if (model.ImageFile != null)
            {
                var fileExtension = Path.GetExtension(model.ImageFile.FileName);
                var fileName = Guid.NewGuid() + fileExtension;
                var filePath = Path.Combine(_environment.WebRootPath, "uploads", fileName);

                if (!Directory.Exists(Path.GetDirectoryName(filePath)))
                {
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                }

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ImageFile.CopyToAsync(fileStream);
                }

                imageUrl = "/uploads/" + fileName;
            }

            var post = new Post
            {
                UserId = userId,
                Content = model.Content,
                ImageUrl = imageUrl,
                WorkoutId = model.WorkoutId,
                NutritionLogId = model.NutritionLogId
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return Ok(post);
        }

        [HttpPost("{postId}/like")]
        public async Task<IActionResult> ToggleLike(Guid postId)
        {
            var userId = GetUserIdFromJwt();
            if (userId == Guid.Empty)
            {
                return Unauthorized("User not authenticated.");
            }

            var post = await _context.Posts
                .Include(p => p.Likes)
                .ThenInclude(l => l.User)
                .FirstOrDefaultAsync(p => p.Id == postId);

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            var existingLike = post.Likes.FirstOrDefault(l => l.UserId == userId);

            if (existingLike != null)
            {
                post.Likes.Remove(existingLike);
            }
            else
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return BadRequest("User not found.");
                }

                post.Likes.Add(new Like
                {
                    UserId = userId,
                    User = user,
                    LikedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();

            var likes = post.Likes.Select(l => new
            {
                l.UserId,
                l.User.Username,
                l.LikedAt
            }).ToList();

            return Ok(new { likes });
        }

        [HttpDelete("{postId}/like")]
        public async Task<IActionResult> RemoveLike(Guid postId)
        {
            var userId = GetUserIdFromJwt();
            if (userId == Guid.Empty)
            {
                return Unauthorized("User not authenticated.");
            }

            var post = await _context.Posts
                .Include(p => p.Likes)
                .FirstOrDefaultAsync(p => p.Id == postId);

            if (post == null)
            {
                return NotFound("Post not found.");
            }

            var existingLike = post.Likes.FirstOrDefault(l => l.UserId == userId);

            if (existingLike == null)
            {
                return BadRequest("You haven't liked this post.");
            }

            post.Likes.Remove(existingLike);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Like removed successfully." });
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
