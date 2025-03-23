using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.DTOs.Workout
{
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
}
