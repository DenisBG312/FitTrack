using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace StrongerTogether.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeededNutritionLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "nutrition_logs",
                columns: new[] { "id", "calories", "carbs", "date", "fats", "food_name", "meal_type", "protein", "user_id" },
                values: new object[,]
                {
                    { new Guid("97e38abb-855b-4c13-a91b-69b6307cc81d"), 215, 45f, new DateTime(2025, 4, 26, 17, 14, 8, 689, DateTimeKind.Utc).AddTicks(831), 1.5f, "Brown Rice", "Lunch", 5f, new Guid("20f75c7d-625e-45a8-8b4e-501810e94160") },
                    { new Guid("d7e2d58b-23dd-477c-a0f3-2f0c08d8cf77"), 55, 11f, new DateTime(2025, 4, 26, 17, 14, 8, 689, DateTimeKind.Utc).AddTicks(836), 0.6f, "Broccoli", "Lunch", 4f, new Guid("20f75c7d-625e-45a8-8b4e-501810e94160") },
                    { new Guid("f9410e62-5c2c-418a-ae54-4c2333225a83"), 165, 0f, new DateTime(2025, 4, 26, 17, 14, 8, 689, DateTimeKind.Utc).AddTicks(823), 3.6f, "Chicken Breast", "Lunch", 31f, new Guid("20f75c7d-625e-45a8-8b4e-501810e94160") }
                });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 17, 14, 8, 689, DateTimeKind.Utc).AddTicks(1858), "$2a$11$RGfGDTEaVln3g6jzaWkVfeFF4x7A4Jw37xR/fAHcnnEqMrlaV/cE." });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 17, 14, 8, 689, DateTimeKind.Utc).AddTicks(1846), "$2a$11$0QSplRtXFyEOy2wUSF4Cne1wXiI.fsCO1q6cBPtsHpolzDb3awSnW" });

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("15858f90-da40-4356-838e-c9704f48006e"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 14, 8, 925, DateTimeKind.Utc).AddTicks(6842));

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 14, 8, 925, DateTimeKind.Utc).AddTicks(6826));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("97e38abb-855b-4c13-a91b-69b6307cc81d"));

            migrationBuilder.DeleteData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("d7e2d58b-23dd-477c-a0f3-2f0c08d8cf77"));

            migrationBuilder.DeleteData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("f9410e62-5c2c-418a-ae54-4c2333225a83"));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 19, 20, 21, 45, 253, DateTimeKind.Utc).AddTicks(1439), "$2a$11$8YIhyZwiW4g9DnuHxxv3pO1DgWwpDi0q6uyWs5jHY8RKbb2AxVgXy" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 19, 20, 21, 45, 253, DateTimeKind.Utc).AddTicks(1434), "$2a$11$UhNekC6oZA2BWaLwRFkT9.I6NTcOryaBkskIdNALEiGmDKbMVnKDO" });

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("15858f90-da40-4356-838e-c9704f48006e"),
                column: "created_at",
                value: new DateTime(2025, 4, 19, 20, 21, 45, 556, DateTimeKind.Utc).AddTicks(7100));

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"),
                column: "created_at",
                value: new DateTime(2025, 4, 19, 20, 21, 45, 556, DateTimeKind.Utc).AddTicks(7080));
        }
    }
}
