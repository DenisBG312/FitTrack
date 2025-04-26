using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StrongerTogether.Server.Models;

namespace StrongerTogether.Server.Data.Configuration
{
    public class LikeConfiguration : IEntityTypeConfiguration<Like>
    {
        public void Configure(EntityTypeBuilder<Like> builder)
        {
            builder.HasData(GenerateLikes());
        }

        private IEnumerable<Like> GenerateLikes()
        {
            List<Like> likes = new List<Like>()
            {
                new Like()
                {
                    PostId = Guid.Parse("293472da-f1a8-4436-836c-962e18ca4df1"),
                    UserId = Guid.Parse("b916bbda-1421-4012-bd2a-1775ca0595de"),
                    LikedAt = DateTime.UtcNow,
                }
            };

            return likes;
        }
    }
}
