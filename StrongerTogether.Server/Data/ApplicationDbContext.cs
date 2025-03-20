using Microsoft.EntityFrameworkCore;
using StrongerTogether.Server.Models;

namespace StrongerTogether.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() { }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
