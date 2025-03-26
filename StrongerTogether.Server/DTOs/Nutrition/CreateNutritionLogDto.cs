using System.ComponentModel.DataAnnotations;

namespace StrongerTogether.Server.DTOs.Nutrition
{
    public class CreateNutritionLogDto
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string FoodName { get; set; } = string.Empty;

        [Required]
        public int Calories { get; set; }

        [Required]
        [Range(0, float.MaxValue)]
        public float Protein { get; set; }

        [Required]
        [Range(0, float.MaxValue)]
        public float Carbs { get; set; }

        [Required]
        [Range(0, float.MaxValue)]
        public float Fats { get; set; }

        [Required]
        [StringLength(20)]
        public string MealType { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }
    }
}
