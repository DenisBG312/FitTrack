using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace StrongerTogether.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeededUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "created_at", "email", "height", "password", "profile_image_url", "role", "username", "weight" },
                values: new object[,]
                {
                    { new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"), new DateTime(2025, 4, 15, 19, 28, 29, 65, DateTimeKind.Utc).AddTicks(7231), "user@gmail.com", 178m, "$2a$11$jekPckEm1eapoHNQZAiuq.ReuQF5NO62CCvOekmTnfoKn7LWdPxtC", "https://www.collabs.io/mag/content/images/2024/03/S23_19e64968-d29f-40b7-9dc8-fb91f3564577_1024x.webp", "User", "JohnFit", 86m },
                    { new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"), new DateTime(2025, 4, 15, 19, 28, 29, 65, DateTimeKind.Utc).AddTicks(7226), "admin@gmail.com", 189m, "$2a$11$/LkXU8A7serq/K/jZycfBOw4CgiB/Tbfimbp1yKlII.V6aLMilDnq", "https://cdn2.iconfinder.com/data/icons/user-23/512/User_Administrator_1.png", "Admin", "Admin", 78m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"));
        }
    }
}
