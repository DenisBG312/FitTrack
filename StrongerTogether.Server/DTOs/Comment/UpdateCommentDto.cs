using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.DTOs.Comment
{
    public class UpdateCommentDto
    {
        [Required(ErrorMessage = "Comment content is required")]
        [StringLength(400, MinimumLength = 3)]
        public string Content { get; set; } = string.Empty;
    }
}
