using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StrongerTogether.Server.Models;

namespace StrongerTogether.Server.Data.Configuration
{
    public class CommentConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.HasData(GenerateComments());
        }

        private IEnumerable<Comment> GenerateComments()
        {
            List<Comment> comments = new List<Comment>()
            {
                new Comment()
                {
                    Id = Guid.Parse("0d20ac4c-047e-4ed4-acf8-f19bb8fbcc30"),
                    PostId = Guid.Parse("293472da-f1a8-4436-836c-962e18ca4df1"),
                    UserId = Guid.Parse("b916bbda-1421-4012-bd2a-1775ca0595de"),
                    Content = "Great post, John! I really liked it 🙌.",
                    CreatedAt = DateTime.UtcNow,
                }
            };

            return comments;
        }
    }
}
