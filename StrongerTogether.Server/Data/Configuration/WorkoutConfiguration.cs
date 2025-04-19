using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StrongerTogether.Server.Models;

namespace StrongerTogether.Server.Data.Configuration
{
    public class WorkoutConfiguration : IEntityTypeConfiguration<Workout>
    {
        public void Configure(EntityTypeBuilder<Workout> builder)
        {
            builder.HasData(GenerateWorkouts());
        }

        private IEnumerable<Workout> GenerateWorkouts()
        {

            var workouts = new List<Workout>()
            {
                new Workout()
                {
                    Id = Guid.Parse("3ee02889-3097-4d1e-82b8-88e54fea642e"),
                    UserId = Guid.Parse("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                    Title = "Chin Ups",
                    CreatedAt = DateTime.UtcNow,
                    Description = "Grab the bar shoulder width apart with a supinated grip (palms facing you). With your body hanging and arms fully extended, pull yourself up until your chin is past the bar. Slowly return to starting position. Repeat.",
                    Difficulty = "Intermediate",
                    Duration = 25,
                    TargetMuscles = "Back",
                    VideoUrl = "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-chinup-side.mp4#t=0.1"
                },

                new Workout()
                {
                    Id = Guid.Parse("15858f90-da40-4356-838e-c9704f48006e"),
                    UserId = Guid.Parse("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                    Title = "Dumbbell Curl",
                    CreatedAt = DateTime.UtcNow,
                    Description = "Stand up straight with a dumbbell in each hand at arm's length. Raise one dumbbell and twist your forearm until it is vertical and your palm faces the shoulder. Lower to original position and repeat with opposite arm.",
                    Difficulty = "Beginner",
                    Duration = 25,
                    TargetMuscles = "Arms",
                    VideoUrl = "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-curl-front.mp4#t=0.1"
                }
            };

            return workouts;
        }
    }
}
