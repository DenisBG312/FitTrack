using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StrongerTogether.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddedVideoUrlToWorkouts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "video_url",
                table: "workouts",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "video_url",
                table: "workouts");
        }
    }
}
