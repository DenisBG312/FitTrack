using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StrongerTogether.Server.Models;

namespace StrongerTogether.Server.Data.Configuration
{
    public class PostConfiguration : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {
            builder.HasData(GeneratePosts());
        }

        private IEnumerable<Post> GeneratePosts()
        {
            List<Post> posts = new List<Post>()
            {
                new Post
                {
                    Id = Guid.Parse("da24e6a1-e5f8-4e43-b848-06e14730f8ba"),
                    UserId = Guid.Parse("20f75c7d-625e-45a8-8b4e-501810e94160"),
                    Title = "My body ater 3 months",
                    NutritionLogId = Guid.Parse("f9410e62-5c2c-418a-ae54-4c2333225a83"),
                    ImageUrl = "/seed_uploads/user.jpg",
                    Content = "This is my body after 3 months of hardworking and eating these chicken breasts. Check them out, you will not regret it!",
                    CreatedAt = DateTime.UtcNow,
                },
                new Post
                {
                    Id = Guid.Parse("293472da-f1a8-4436-836c-962e18ca4df1"),
                    UserId = Guid.Parse("20f75c7d-625e-45a8-8b4e-501810e94160"),
                    Title = "The best exercise for arms",
                    Content = "The linked exercise is the best exercise for building muscle in the arms 🔥.",
                    CreatedAt = DateTime.UtcNow,
                    ImageUrl = "/seed_uploads/curl-bar-exercise.jpg",
                    WorkoutId = Guid.Parse("15858f90-da40-4356-838e-c9704f48006e")
                }
            };

            return posts;
        }
    }
}
