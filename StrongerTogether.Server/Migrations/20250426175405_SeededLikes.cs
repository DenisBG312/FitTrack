using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StrongerTogether.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeededLikes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "likes",
                columns: new[] { "post_id", "user_id", "liked_at" },
                values: new object[] { new Guid("293472da-f1a8-4436-836c-962e18ca4df1"), new Guid("b916bbda-1421-4012-bd2a-1775ca0595de"), new DateTime(2025, 4, 26, 17, 54, 4, 831, DateTimeKind.Utc).AddTicks(3576) });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "likes",
                keyColumns: new[] { "post_id", "user_id" },
                keyValues: new object[] { new Guid("293472da-f1a8-4436-836c-962e18ca4df1"), new Guid("b916bbda-1421-4012-bd2a-1775ca0595de") });

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("97e38abb-855b-4c13-a91b-69b6307cc81d"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 46, 59, 537, DateTimeKind.Utc).AddTicks(6329));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("d7e2d58b-23dd-477c-a0f3-2f0c08d8cf77"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 46, 59, 537, DateTimeKind.Utc).AddTicks(6332));

            migrationBuilder.UpdateData(
                table: "nutrition_logs",
                keyColumn: "id",
                keyValue: new Guid("f9410e62-5c2c-418a-ae54-4c2333225a83"),
                column: "date",
                value: new DateTime(2025, 4, 26, 17, 46, 59, 537, DateTimeKind.Utc).AddTicks(6320));

            migrationBuilder.UpdateData(
                table: "posts",
                keyColumn: "id",
                keyValue: new Guid("293472da-f1a8-4436-836c-962e18ca4df1"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 46, 59, 537, DateTimeKind.Utc).AddTicks(7371));

            migrationBuilder.UpdateData(
                table: "posts",
                keyColumn: "id",
                keyValue: new Guid("da24e6a1-e5f8-4e43-b848-06e14730f8ba"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 46, 59, 537, DateTimeKind.Utc).AddTicks(7365));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 17, 46, 59, 537, DateTimeKind.Utc).AddTicks(8118), "$2a$11$ACYVmXQK.yKLY6jdDhrQyugBFzr.u24n7q9j5vkwCn2o9HFJKnvha" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("b916bbda-1421-4012-bd2a-1775ca0595de"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 17, 46, 59, 537, DateTimeKind.Utc).AddTicks(8132), "$2a$11$5jIusqOBtXICBErZh2wOQe6FA/uFtmBocWHs67foTIvC.OV0mimQ2" });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                columns: new[] { "created_at", "password" },
                values: new object[] { new DateTime(2025, 4, 26, 17, 46, 59, 537, DateTimeKind.Utc).AddTicks(8113), "$2a$11$rdQmPGD4qWmyL5xAjUaU2uik/dle8FOnHGIB2KunQxMT6Uk.0G146" });

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("15858f90-da40-4356-838e-c9704f48006e"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 46, 59, 990, DateTimeKind.Utc).AddTicks(1343));

            migrationBuilder.UpdateData(
                table: "workouts",
                keyColumn: "id",
                keyValue: new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"),
                column: "created_at",
                value: new DateTime(2025, 4, 26, 17, 46, 59, 990, DateTimeKind.Utc).AddTicks(1328));
        }
    }
}
