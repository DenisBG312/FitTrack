using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StrongerTogether.Server.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [Column("username")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(256)]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(256)]
        [Column("password")]
        public string Password { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [Column("role")]
        public string Role { get; set; } = string.Empty;

        [Required]
        [Column("height")]
        public decimal Height { get; set; }

        [Required]
        [Column("weight")]
        public decimal Weight { get; set; }

        [StringLength(500)]
        [Column("profile_image_url")]
        public string ProfileImageUrl { get; set; } = string.Empty;
    }
}