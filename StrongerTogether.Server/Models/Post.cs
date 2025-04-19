using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StrongerTogether.Server.Models
{
    [Table("posts")]
    public class Post
    {
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User User { get; set; }
        [Required]
        [Column("title")]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;
        [Required]
        [Column("content")]
        [StringLength(400)]
        public string Content { get; set; } = string.Empty;
        [Column("image_url")]
        public string? ImageUrl { get; set; }

        [Column("workout_id")]
        public Guid? WorkoutId { get; set; }
        [ForeignKey(nameof(WorkoutId))]
        public Workout? Workout { get; set; }
        [Column("nutrition_log_id")]
        public Guid? NutritionLogId { get; set; }
        [ForeignKey(nameof(NutritionLogId))]
        public NutritionLog? NutritionLog { get; set; }
        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
        public ICollection<Like> Likes { get; set; } = new HashSet<Like>();
    }
}
