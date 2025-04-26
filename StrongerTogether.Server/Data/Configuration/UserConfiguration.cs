using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StrongerTogether.Server.Models;

namespace StrongerTogether.Server.Data.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasData(GenerateUsers());
        }

        private IEnumerable<User> GenerateUsers()
        {
            List<User> users = new List<User>();

            var admin = new User()
            {
                Id = Guid.Parse("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                Email = "admin@gmail.com",
                Height = 189,
                Weight = 78,
                CreatedAt = DateTime.UtcNow,
                Username = "Admin",
                Role = "Admin",
                ProfileImageUrl = "/seed_uploads/admin.png"
            };

            var user = new User()
            {
                Id = Guid.Parse("20f75c7d-625e-45a8-8b4e-501810e94160"),
                Email = "user@gmail.com",
                Height = 178,
                Weight = 86,
                CreatedAt = DateTime.UtcNow,
                Username = "JohnFit",
                Role = "User",
                ProfileImageUrl = "/seed_uploads/user.jpg"
            };

            var secondUser = new User()
            {
                Id = Guid.Parse("b916bbda-1421-4012-bd2a-1775ca0595de"),
                Email = "user2@gmail.com",
                Height = 168,
                Weight = 70,
                CreatedAt = DateTime.UtcNow,
                Username = "JaneFit",
                Role = "User",
                ProfileImageUrl = "/seed_uploads/user-girl.jpg"
            };

            admin.Password = BCrypt.Net.BCrypt.HashPassword("Admin123!");
            user.Password = BCrypt.Net.BCrypt.HashPassword("User123!");
            secondUser.Password = BCrypt.Net.BCrypt.HashPassword("User123!");

            users.Add(admin);
            users.Add(user);
            users.Add(secondUser);

            return users;
        }
    }
}
