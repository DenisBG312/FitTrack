using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StrongerTogether.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedNutritions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "nutrition_logs",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    food_name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    calories = table.Column<int>(type: "integer", nullable: false),
                    protein = table.Column<float>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: false),
                    carbs = table.Column<float>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: false),
                    fats = table.Column<float>(type: "numeric(6,2)", precision: 6, scale: 2, nullable: false),
                    meal_type = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    date = table.Column<DateTime>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_nutrition_logs", x => x.id);
                    table.ForeignKey(
                        name: "FK_nutrition_logs_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_nutrition_logs_user_id",
                table: "nutrition_logs",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "nutrition_logs");
        }
    }
}
