using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StrongerTogether.Server.Data.Configuration
{
    public class NutritionLogConfiguration : IEntityTypeConfiguration<NutritionLog>
    {
        public void Configure(EntityTypeBuilder<NutritionLog> builder)
        {
            builder.HasData(GenerateNutritionLogs());
        }

        private IEnumerable<NutritionLog> GenerateNutritionLogs()
        {
            List<NutritionLog> nutritionLogs = new List<NutritionLog>()
            {
                new NutritionLog()
                {
                    Id = Guid.Parse("f9410e62-5c2c-418a-ae54-4c2333225a83"),
                    UserId = Guid.Parse("20f75c7d-625e-45a8-8b4e-501810e94160"),
                    FoodName = "Chicken Breast",
                    Calories = 165,
                    Protein = 31.0f,
                    Carbs = 0.0f,
                    Fats = 3.6f,
                    MealType = "Lunch",
                    Date = DateTime.UtcNow,
                },
                new NutritionLog()
                {
                    Id = Guid.Parse("97e38abb-855b-4c13-a91b-69b6307cc81d"),
                    UserId = Guid.Parse("20f75c7d-625e-45a8-8b4e-501810e94160"),
                    FoodName = "Brown Rice",
                    Calories = 215,
                    Protein = 5.0f,
                    Carbs = 45.0f,
                    Fats = 1.5f,
                    MealType = "Lunch",
                    Date = DateTime.UtcNow,
                },
                new NutritionLog()
                {
                    Id = Guid.Parse("d7e2d58b-23dd-477c-a0f3-2f0c08d8cf77"),
                    UserId = Guid.Parse("20f75c7d-625e-45a8-8b4e-501810e94160"),
                    FoodName = "Broccoli",
                    Calories = 55,
                    Protein = 4.0f,
                    Carbs = 11.0f,
                    Fats = 0.6f,
                    MealType = "Lunch",
                    Date = DateTime.UtcNow,
                }
            };

            return nutritionLogs;
        }
    }
}
