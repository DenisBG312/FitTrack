using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace StrongerTogether.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeededPosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("97e38abb-855b-4c13-a91b-69b6307cc81d"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 27, 38, 31, DateTimeKind.Utc).AddTicks(4349));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("d7e2d58b-23dd-477c-a0f3-2f0c08d8cf77"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 27, 38, 31, DateTimeKind.Utc).AddTicks(4351));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("f9410e62-5c2c-418a-ae54-4c2333225a83"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 27, 38, 31, DateTimeKind.Utc).AddTicks(4342));

            migrationBuilder.InsertData(
                table: "posts",
                columns: new[] { "id", "content", "created_at", "image_url", "nutrition_log_id", "title", "user_id", "workout_id" },
                values: new object[,]
                {
                    { new Guid("293472da-f1a8-4436-836c-962e18ca4df1"), "The linked exercise is the best exercise for building muscle in the arms 🔥.", new DateTime(2025, 4, 26, 17, 27, 38, 31, DateTimeKind.Utc).AddTicks(5167), "/seed_uploads/curl-bar-exercise.jpg", null, "The best exercise for arms", new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"), new Guid("15858f90-da40-4356-838e-c9704f48006e") },
                    { new Guid("da24e6a1-e5f8-4e43-b848-06e14730f8ba"), "This is my body after 3 months of hardworking and eating these chicken breasts. Check them out, you will not regret it!", new DateTime(2025, 4, 26, 17, 27, 38, 31, DateTimeKind.Utc).AddTicks(5161), "/seed_uploads/user.jpg", new Guid("f9410e62-5c2c-418a-ae54-4c2333225a83"), "My body ater 3 months", new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"), null }
                });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 17, 27, 38, 31, DateTimeKind.Utc).AddTicks(5760), "$2a$11$MI7xGbM1Nw.g9DVReNCVx.JEBubH4ubSif1fpZxH3aAeAihGWawRm" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 17, 27, 38, 31, DateTimeKind.Utc).AddTicks(5756), "$2a$11$lCqOWhEi9gMyyWEsMC.c5u3Rh.14QtA7Bi3SNxMMi6Kh89Kfk72fK" });

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("15858f90-da40-4356-838e-c9704f48006e"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 27, 38, 269, DateTimeKind.Utc).AddTicks(2256));

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 27, 38, 269, DateTimeKind.Utc).AddTicks(2240));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "posts",
                keyColumn: "id",
                keyValue: new Guid("293472da-f1a8-4436-836c-962e18ca4df1"));

            migrationBuilder.DeleteData(
                table: "posts",
                keyColumn: "id",
                keyValue: new Guid("da24e6a1-e5f8-4e43-b848-06e14730f8ba"));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("97e38abb-855b-4c13-a91b-69b6307cc81d"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 14, 8, 689, DateTimeKind.Utc).AddTicks(831));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("d7e2d58b-23dd-477c-a0f3-2f0c08d8cf77"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 14, 8, 689, DateTimeKind.Utc).AddTicks(836));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("f9410e62-5c2c-418a-ae54-4c2333225a83"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 14, 8, 689, DateTimeKind.Utc).AddTicks(823));

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
    }
}
