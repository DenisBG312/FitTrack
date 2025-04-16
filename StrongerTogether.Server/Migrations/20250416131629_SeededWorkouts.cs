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
                values: new object[] { new DateTime(2025, 4, 16, 13, 16, 28, 982, DateTimeKind.Utc).AddTicks(7192), "$2a$11$Rg5za4gKebAAuBTcH35GiO4.W0s9r9/8VdttsNyL32LVnGnA1LW5a" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 16, 13, 16, 28, 982, DateTimeKind.Utc).AddTicks(7185), "$2a$11$Wvj9vI91BT6/GKfFHHPAGOyz0i2MJEmoaK2ODN1qoGnNjFNz35ddS" });

            migrationBuilder.InsertData(
                table: "workouts",
                columns: new[] { "id", "created_at", "description", "difficulty", "duration", "target_muscles", "title", "user_id", "video_url" },
                values: new object[,]
                {
                    { new Guid("15858f90-da40-4356-838e-c9704f48006e"), new DateTime(2025, 4, 16, 13, 16, 29, 255, DateTimeKind.Utc).AddTicks(3686), "Stand up straight with a dumbbell in each hand at arm's length. Raise one dumbbell and twist your forearm until it is vertical and your palm faces the shoulder. Lower to original position and repeat with opposite arm.", "Beginner", 25, "Arms", "Dumbbell Curl", new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"), "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-curl-front.mp4#t=0.1" },
                    { new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"), new DateTime(2025, 4, 16, 13, 16, 29, 255, DateTimeKind.Utc).AddTicks(3664), "Grab the bar shoulder width apart with a supinated grip (palms facing you). With your body hanging and arms fully extended, pull yourself up until your chin is past the bar. Slowly return to starting position. Repeat.", "Intermidiate", 25, "Back", "Chin Ups", new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"), "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-chinup-side.mp4#t=0.1" }
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
                values: new object[] { new DateTime(2025, 4, 15, 19, 28, 29, 65, DateTimeKind.Utc).AddTicks(7231), "$2a$11$jekPckEm1eapoHNQZAiuq.ReuQF5NO62CCvOekmTnfoKn7LWdPxtC" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 15, 19, 28, 29, 65, DateTimeKind.Utc).AddTicks(7226), "$2a$11$/LkXU8A7serq/K/jZycfBOw4CgiB/Tbfimbp1yKlII.V6aLMilDnq" });
        }
    }
}
