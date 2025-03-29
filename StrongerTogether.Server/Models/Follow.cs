using System.ComponentModel.DataAnnotations.Schema;

namespace StrongerTogether.Server.Models
{
    [Table("follows")]
    public class Follow
    {
        [Column("follower_id")]
        public Guid FollowerId { get; set; }
        [ForeignKey(nameof(FollowerId))]
        public User Follower { get; set; }
        [Column("followee_id")]
        public Guid FolloweeId { get; set; }
        [ForeignKey(nameof(FolloweeId))]
        public User Followee { get; set; }
        [Column("followed_at")]
        public DateTime FollowedAt { get; set; } = DateTime.UtcNow;
    }
}
