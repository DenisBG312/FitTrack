using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.DTOs.User
{
    public class LoginRequest
    {
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        [StringLength(100, MinimumLength = 8)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
            ErrorMessage = "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.")]
        public string Password { get; set; } = string.Empty;
    }
}
