using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.DTOs.User
{
    public class EditUserRequest
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; }
        public decimal? Height { get; set; }
        public decimal? Weight { get; set; }
        public IFormFile? ProfileImage { get; set; }
    }
}
