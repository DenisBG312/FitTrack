using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.DTOs.Post
{
    public class CreatePostDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;
        [Required]
        [StringLength(400, MinimumLength = 3)]
        public string Content { get; set; } = string.Empty;
        public IFormFile? ImageFile { get; set; }
        public Guid? WorkoutId { get; set; }
        public Guid? NutritionLogId { get; set; }
    }
}
