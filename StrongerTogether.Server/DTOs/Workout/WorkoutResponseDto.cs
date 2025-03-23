using StrongerTogether.Server.DTOs.User;

namespace StrongerTogether.Server.DTOs.Workout
{
    public class WorkoutResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public string Difficulty { get; set; }
        public string TargetMuscles { get; set; }
        public string VideoUrl { get; set; }
        public Guid UserId { get; set; }
        public UserResponseDto User { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
