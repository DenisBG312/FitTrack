using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace StrongerTogether.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeededWorkouts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 19, 13, 32, 35, 604, DateTimeKind.Utc).AddTicks(6424), "$2a$11$8GCMfgbOSqSVRqYAs3Mb0eG6vd/Be5iGxOlpOyENy2MYrCBFBe/CO" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 19, 13, 32, 35, 604, DateTimeKind.Utc).AddTicks(6421), "$2a$11$A1XLfVJOcIS0upcEd/5NyucdFh/TeTuf6Tjmf.lX2RAHJbjVMz1QC" });

            migrationBuilder.InsertData(
                table: "workouts",
                columns: new[] { "id", "created_at", "description", "difficulty", "duration", "target_muscles", "title", "user_id", "video_url" },
                values: new object[,]
                {
                    { new Guid("15858f90-da40-4356-838e-c9704f48006e"), new DateTime(2025, 4, 19, 13, 32, 35, 864, DateTimeKind.Utc).AddTicks(4163), "Stand up straight with a dumbbell in each hand at arm's length. Raise one dumbbell and twist your forearm until it is vertical and your palm faces the shoulder. Lower to original position and repeat with opposite arm.", "Beginner", 25, "Arms", "Dumbbell Curl", new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"), "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-curl-front.mp4#t=0.1" },
                    { new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"), new DateTime(2025, 4, 19, 13, 32, 35, 864, DateTimeKind.Utc).AddTicks(4145), "Grab the bar shoulder width apart with a supinated grip (palms facing you). With your body hanging and arms fully extended, pull yourself up until your chin is past the bar. Slowly return to starting position. Repeat.", "Intermediate", 25, "Back", "Chin Ups", new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"), "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-chinup-side.mp4#t=0.1" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("15858f90-da40-4356-838e-c9704f48006e"));

            migrationBuilder.DeleteData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 19, 13, 27, 26, 838, DateTimeKind.Utc).AddTicks(1170), "$2a$11$Uf7k7N7pDbGMJqW3RR9d2.FvCoGUsVNZkalBHDGbQ82OKPwFlJy5u" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 19, 13, 27, 26, 838, DateTimeKind.Utc).AddTicks(1166), "$2a$11$Y1eDJUwFvlHbzn7oPiq3e.x.H.bjeJJ2ZiEjetfoYOewoC9xZ3FpG" });
        }
    }
}
