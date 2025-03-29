using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.DTOs.Comment
{
    public class CreateCommentDto
    {
        [Required]
        public Guid PostId { get; set; }

        [Required]
        [StringLength(400, ErrorMessage = "Comment cannot exceed 400 characters.")]
        public string Content { get; set; } = string.Empty;
    }
}
