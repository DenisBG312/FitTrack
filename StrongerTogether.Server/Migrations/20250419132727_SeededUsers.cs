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
                    { new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"), new DateTime(2025, 4, 19, 13, 27, 26, 838, DateTimeKind.Utc).AddTicks(1170), "user@gmail.com", 178m, "$2a$11$Uf7k7N7pDbGMJqW3RR9d2.FvCoGUsVNZkalBHDGbQ82OKPwFlJy5u", "/seed_uploads/user.jpg", "User", "JohnFit", 86m },
                    { new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"), new DateTime(2025, 4, 19, 13, 27, 26, 838, DateTimeKind.Utc).AddTicks(1166), "admin@gmail.com", 189m, "$2a$11$Y1eDJUwFvlHbzn7oPiq3e.x.H.bjeJJ2ZiEjetfoYOewoC9xZ3FpG", "/seed_uploads/admin.png", "Admin", "Admin", 78m }
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
