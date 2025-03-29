using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StrongerTogether.Server.Models
{
    [Table("comments")]
    public class Comment
    {
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        [Column("user_id")]
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User User { get; set; }
        [Required]
        [Column("post_id")]
        public Guid PostId { get; set; }
        [ForeignKey(nameof(PostId))]
        public Post Post { get; set; }
        [Required]
        [Column("content")]
        [StringLength(400)]
        public string Content { get; set; } = string.Empty;
        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
