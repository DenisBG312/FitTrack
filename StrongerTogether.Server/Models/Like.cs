using System.ComponentModel.DataAnnotations.Schema;

namespace StrongerTogether.Server.Models
{
    [Table("likes")]
    public class Like
    {
        [Column("user_id")]
        public Guid UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User User { get; set; }
        [Column("post_id")]
        public Guid PostId { get; set; }
        [ForeignKey(nameof(PostId))]
        public Post Post { get; set; }
        [Column("liked_at")]
        public DateTime LikedAt { get; set; } = DateTime.UtcNow;
    }
}
