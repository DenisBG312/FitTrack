using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.Models
{
    [Table("workouts")]
    public class Workout
    {
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column("description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column("duration")]
        public int Duration { get; set; }

        [Required]
        [StringLength(50)]
        [Column("difficulty")]
        public string Difficulty { get; set; } = string.Empty;

        [Required]
        [Column("target_muscles")]
        public string TargetMuscles { get; set; } = string.Empty;

        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
