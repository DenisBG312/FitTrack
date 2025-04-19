using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StrongerTogether.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedTitleToPosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "title",
                table: "posts",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "title",
                table: "posts");

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

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("15858f90-da40-4356-838e-c9704f48006e"),
                column: "created_at",
                value: new DateTime(2025, 4, 19, 13, 32, 35, 864, DateTimeKind.Utc).AddTicks(4163));

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"),
                column: "created_at",
                value: new DateTime(2025, 4, 19, 13, 32, 35, 864, DateTimeKind.Utc).AddTicks(4145));
        }
    }
}
