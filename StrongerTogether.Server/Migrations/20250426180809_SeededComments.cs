using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StrongerTogether.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeededComments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "comments",
                columns: new[] { "id", "content", "created_at", "post_id", "user_id" },
                values: new object[] { new Guid("0d20ac4c-047e-4ed4-acf8-f19bb8fbcc30"), "Great post, John! I really liked it 🙌.", new DateTime(2025, 4, 26, 18, 8, 9, 122, DateTimeKind.Utc).AddTicks(7838), new Guid("293472da-f1a8-4436-836c-962e18ca4df1"), new Guid("b916bbda-1421-4012-bd2a-1775ca0595de") });

            migrationBuilder.UpdateData(
                table: "likes",
                keyColumns: new[] { "post_id", "user_id" },
                keyValues: new object[] { new Guid("293472da-f1a8-4436-836c-962e18ca4df1"), new Guid("b916bbda-1421-4012-bd2a-1775ca0595de") },
                column: "liked_at",
                value: new DateTime(2025, 4, 26, 18, 8, 9, 122, DateTimeKind.Utc).AddTicks(9195));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("97e38abb-855b-4c13-a91b-69b6307cc81d"),
                column: "date",
                value: new DateTime(2025, 4, 26, 18, 8, 9, 123, DateTimeKind.Utc).AddTicks(134));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("d7e2d58b-23dd-477c-a0f3-2f0c08d8cf77"),
                column: "date",
                value: new DateTime(2025, 4, 26, 18, 8, 9, 123, DateTimeKind.Utc).AddTicks(139));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("f9410e62-5c2c-418a-ae54-4c2333225a83"),
                column: "date",
                value: new DateTime(2025, 4, 26, 18, 8, 9, 123, DateTimeKind.Utc).AddTicks(128));

            migrationBuilder.UpdateData(
                table: "posts",
                keyColumn: "id",
                keyValue: new Guid("293472da-f1a8-4436-836c-962e18ca4df1"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 18, 8, 9, 123, DateTimeKind.Utc).AddTicks(901));

            migrationBuilder.UpdateData(
                table: "posts",
                keyColumn: "id",
                keyValue: new Guid("da24e6a1-e5f8-4e43-b848-06e14730f8ba"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 18, 8, 9, 123, DateTimeKind.Utc).AddTicks(881));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 18, 8, 9, 123, DateTimeKind.Utc).AddTicks(1570), "$2a$11$iQh9JM27/g7a3d76PVoe3O78ZAzyiBYhahZpzTiRpguR13LvW2oeu" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("b916bbda-1421-4012-bd2a-1775ca0595de"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 18, 8, 9, 123, DateTimeKind.Utc).AddTicks(1574), "$2a$11$P3vC61maEI8NmQJ41wUfUeCPRoByaPK698S/oyP2AluhybAWkQwTG" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 18, 8, 9, 123, DateTimeKind.Utc).AddTicks(1564), "$2a$11$GPGSYCMgDv/MOy5pYzKDSuGEGZCywEYs53aU1xxqJQO5M6.3rkpDC" });

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("15858f90-da40-4356-838e-c9704f48006e"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 18, 8, 9, 598, DateTimeKind.Utc).AddTicks(4146));

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 18, 8, 9, 598, DateTimeKind.Utc).AddTicks(4128));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "comments",
                keyColumn: "id",
                keyValue: new Guid("0d20ac4c-047e-4ed4-acf8-f19bb8fbcc30"));

            migrationBuilder.UpdateData(
                table: "likes",
                keyColumns: new[] { "post_id", "user_id" },
                keyValues: new object[] { new Guid("293472da-f1a8-4436-836c-962e18ca4df1"), new Guid("b916bbda-1421-4012-bd2a-1775ca0595de") },
                column: "liked_at",
                value: new DateTime(2025, 4, 26, 17, 54, 4, 831, DateTimeKind.Utc).AddTicks(3576));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("97e38abb-855b-4c13-a91b-69b6307cc81d"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 54, 4, 831, DateTimeKind.Utc).AddTicks(4741));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("d7e2d58b-23dd-477c-a0f3-2f0c08d8cf77"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 54, 4, 831, DateTimeKind.Utc).AddTicks(4745));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("f9410e62-5c2c-418a-ae54-4c2333225a83"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 54, 4, 831, DateTimeKind.Utc).AddTicks(4734));

            migrationBuilder.UpdateData(
                table: "posts",
                keyColumn: "id",
                keyValue: new Guid("293472da-f1a8-4436-836c-962e18ca4df1"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 54, 4, 831, DateTimeKind.Utc).AddTicks(5644));

            migrationBuilder.UpdateData(
                table: "posts",
                keyColumn: "id",
                keyValue: new Guid("da24e6a1-e5f8-4e43-b848-06e14730f8ba"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 54, 4, 831, DateTimeKind.Utc).AddTicks(5634));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 17, 54, 4, 831, DateTimeKind.Utc).AddTicks(6332), "$2a$11$KbB6TP7rElFbvxpoEm8e7.u1cOYkiX/vbKWK9HPOFt3z7TIxHkrae" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("b916bbda-1421-4012-bd2a-1775ca0595de"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 17, 54, 4, 831, DateTimeKind.Utc).AddTicks(6348), "$2a$11$Wic2fvhln9dpNnAg4.tynu4khiVN51PGwUYhHraUi3a4dJl3TuKk." });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 17, 54, 4, 831, DateTimeKind.Utc).AddTicks(6327), "$2a$11$QfqY48Pru/2OXhQ6gbxt7./dtLHOkFVypaGpXPCsOZ0r5szwsLO.G" });

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("15858f90-da40-4356-838e-c9704f48006e"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 54, 5, 287, DateTimeKind.Utc).AddTicks(4082));

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 54, 5, 287, DateTimeKind.Utc).AddTicks(4063));
        }
    }
}
