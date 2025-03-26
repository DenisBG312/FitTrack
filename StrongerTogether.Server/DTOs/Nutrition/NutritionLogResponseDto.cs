using StrongerTogether.Server.DTOs.User;

namespace StrongerTogether.Server.DTOs.Nutrition
{
    public class NutritionLogResponseDto
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string FoodName { get; set; } = string.Empty;

        public int Calories { get; set; }

        public float Protein { get; set; }

        public float Carbs { get; set; }

        public float Fats { get; set; }

        public string MealType { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        public UserResponseDto User { get; set; }
    }
}
