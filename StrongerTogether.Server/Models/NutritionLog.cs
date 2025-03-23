using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using StrongerTogether.Server.Models;

[Table("nutrition_logs")]
public class NutritionLog
{
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("user_id")]
    public Guid UserId { get; set; }
    [ForeignKey(nameof(UserId))]
    public User User { get; set; } 

    [Required]
    [StringLength(100)]
    [Column("food_name", TypeName = "varchar(100)")]
    public string FoodName { get; set; } = string.Empty;

    [Required]
    [Column("calories")]
    public int Calories { get; set; }

    [Required]
    [Precision(6, 2)]
    [Column("protein", TypeName = "decimal(6,2)")]
    public float Protein { get; set; }

    [Required]
    [Precision(6, 2)]
    [Column("carbs", TypeName = "decimal(6,2)")]
    public float Carbs { get; set; }

    [Required]
    [Precision(6, 2)]
    [Column("fats", TypeName = "decimal(6,2)")]
    public float Fats { get; set; }

    [Required]
    [StringLength(20)]
    [Column("meal_type", TypeName = "varchar(20)")]
    public string MealType { get; set; } = string.Empty;

    [Required]
    [Column("date", TypeName = "date")]
    public DateTime Date { get; set; } 
}