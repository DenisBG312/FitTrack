namespace StrongerTogether.Server.DTOs.User
{
    public class UserResponseDto
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public decimal Height { get; set; }
        public decimal Weight { get; set; }
        public string ProfileImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
