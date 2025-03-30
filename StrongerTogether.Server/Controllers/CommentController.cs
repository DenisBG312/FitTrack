using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StrongerTogether.Server.Data;
using StrongerTogether.Server.DTOs.Comment;
using StrongerTogether.Server.Models;
using System.Security.Claims;

namespace StrongerTogether.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetCommentsForPost(Guid postId)
        {
            var comments = await _context.Comments
                .Where(c => c.PostId == postId)
                .Include(c => c.User)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            return Ok(comments);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CreateCommentDto createCommentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var post = await _context.Posts.FindAsync(createCommentDto.PostId);
            if (post == null)
            {
                return NotFound("Post not found.");
            }

            var user = await _context.Users.FindAsync(Guid.Parse(userId));
            if (user == null)
            {
                return Unauthorized();
            }

            var comment = new Comment
            {
                Id = Guid.NewGuid(),
                Content = createCommentDto.Content,
                CreatedAt = DateTime.UtcNow,
                UserId = Guid.Parse(userId),
                PostId = createCommentDto.PostId
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = comment.Id,
                content = comment.Content,
                createdAt = comment.CreatedAt,
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    profileImageUrl = user.ProfileImageUrl
                }
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(Guid id, [FromBody] UpdateCommentDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound("Comment not found");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null || comment.UserId.ToString() != userId)
                return Forbid();

            comment.Content = updateDto.Content;

            await _context.SaveChangesAsync();
            return Ok(comment);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound("Comment not found");

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var isAdmin = User.IsInRole("Admin");

            if (userId == null || (comment.UserId.ToString() != userId && !isAdmin))
                return Forbid();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
