using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.DTOs.User
{
    public class RegisterRequest
    {
        [Required]
        [StringLength(256)]
        public string Email { get; set; }
        [Required]
        [StringLength(256)]
        public string Password { get; set; }
        [Required]
        [StringLength(100)]
        public string Username { get; set; }
        [Required]
        public decimal Height { get; set; }
        [Required]
        public decimal Weight { get; set; }
        [Required]
        public IFormFile ProfileImage { get; set; } = null!;
    }
}
