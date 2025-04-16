﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using StrongerTogether.Server.Data;

#nullable disable

namespace StrongerTogether.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250416131629_SeededWorkouts")]
    partial class SeededWorkouts
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("NutritionLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<int>("Calories")
                        .HasColumnType("integer")
                        .HasColumnName("calories");

                    b.Property<float>("Carbs")
                        .HasPrecision(6, 2)
                        .HasColumnType("decimal(6,2)")
                        .HasColumnName("carbs");

                    b.Property<DateTime>("Date")
                        .HasColumnType("date")
                        .HasColumnName("date");

                    b.Property<float>("Fats")
                        .HasPrecision(6, 2)
                        .HasColumnType("decimal(6,2)")
                        .HasColumnName("fats");

                    b.Property<string>("FoodName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)")
                        .HasColumnName("food_name");

                    b.Property<string>("MealType")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("varchar(20)")
                        .HasColumnName("meal_type");

                    b.Property<float>("Protein")
                        .HasPrecision(6, 2)
                        .HasColumnType("decimal(6,2)")
                        .HasColumnName("protein");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("nutrition_logs");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Comment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(400)
                        .HasColumnType("character varying(400)")
                        .HasColumnName("content");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<Guid>("PostId")
                        .HasColumnType("uuid")
                        .HasColumnName("post_id");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.HasKey("Id");

                    b.HasIndex("PostId");

                    b.HasIndex("UserId");

                    b.ToTable("comments");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Follow", b =>
                {
                    b.Property<Guid>("FollowerId")
                        .HasColumnType("uuid")
                        .HasColumnName("follower_id");

                    b.Property<Guid>("FolloweeId")
                        .HasColumnType("uuid")
                        .HasColumnName("followee_id");

                    b.Property<DateTime>("FollowedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("followed_at");

                    b.HasKey("FollowerId", "FolloweeId");

                    b.HasIndex("FolloweeId");

                    b.ToTable("follows");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Like", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.Property<Guid>("PostId")
                        .HasColumnType("uuid")
                        .HasColumnName("post_id");

                    b.Property<DateTime>("LikedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("liked_at");

                    b.HasKey("UserId", "PostId");

                    b.HasIndex("PostId");

                    b.ToTable("likes");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Post", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(400)
                        .HasColumnType("character varying(400)")
                        .HasColumnName("content");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("ImageUrl")
                        .HasColumnType("text")
                        .HasColumnName("image_url");

                    b.Property<Guid?>("NutritionLogId")
                        .HasColumnType("uuid")
                        .HasColumnName("nutrition_log_id");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.Property<Guid?>("WorkoutId")
                        .HasColumnType("uuid")
                        .HasColumnName("workout_id");

                    b.HasKey("Id");

                    b.HasIndex("NutritionLogId");

                    b.HasIndex("UserId");

                    b.HasIndex("WorkoutId");

                    b.ToTable("posts");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)")
                        .HasColumnName("email");

                    b.Property<decimal>("Height")
                        .HasColumnType("numeric")
                        .HasColumnName("height");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(256)
                        .HasColumnType("character varying(256)")
                        .HasColumnName("password");

                    b.Property<string>("ProfileImageUrl")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("character varying(500)")
                        .HasColumnName("profile_image_url");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("role");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("username");

                    b.Property<decimal>("Weight")
                        .HasColumnType("numeric")
                        .HasColumnName("weight");

                    b.HasKey("Id");

                    b.ToTable("users");

                    b.HasData(
                        new
                        {
                            Id = new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                            CreatedAt = new DateTime(2025, 4, 16, 13, 16, 28, 982, DateTimeKind.Utc).AddTicks(7185),
                            Email = "admin@gmail.com",
                            Height = 189m,
                            Password = "$2a$11$Wvj9vI91BT6/GKfFHHPAGOyz0i2MJEmoaK2ODN1qoGnNjFNz35ddS",
                            ProfileImageUrl = "https://cdn2.iconfinder.com/data/icons/user-23/512/User_Administrator_1.png",
                            Role = "Admin",
                            Username = "Admin",
                            Weight = 78m
                        },
                        new
                        {
                            Id = new Guid("20f75c7d-625e-45a8-8b4e-501810e94160"),
                            CreatedAt = new DateTime(2025, 4, 16, 13, 16, 28, 982, DateTimeKind.Utc).AddTicks(7192),
                            Email = "user@gmail.com",
                            Height = 178m,
                            Password = "$2a$11$Rg5za4gKebAAuBTcH35GiO4.W0s9r9/8VdttsNyL32LVnGnA1LW5a",
                            ProfileImageUrl = "https://www.collabs.io/mag/content/images/2024/03/S23_19e64968-d29f-40b7-9dc8-fb91f3564577_1024x.webp",
                            Role = "User",
                            Username = "JohnFit",
                            Weight = 86m
                        });
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Workout", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasColumnName("id");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<string>("Difficulty")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("difficulty");

                    b.Property<int>("Duration")
                        .HasColumnType("integer")
                        .HasColumnName("duration");

                    b.Property<string>("TargetMuscles")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("target_muscles");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("character varying(100)")
                        .HasColumnName("title");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid")
                        .HasColumnName("user_id");

                    b.Property<string>("VideoUrl")
                        .IsRequired()
                        .HasColumnType("text")
                        .HasColumnName("video_url");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("workouts");

                    b.HasData(
                        new
                        {
                            Id = new Guid("3ee02889-3097-4d1e-82b8-88e54fea642e"),
                            CreatedAt = new DateTime(2025, 4, 16, 13, 16, 29, 255, DateTimeKind.Utc).AddTicks(3664),
                            Description = "Grab the bar shoulder width apart with a supinated grip (palms facing you). With your body hanging and arms fully extended, pull yourself up until your chin is past the bar. Slowly return to starting position. Repeat.",
                            Difficulty = "Intermidiate",
                            Duration = 25,
                            TargetMuscles = "Back",
                            Title = "Chin Ups",
                            UserId = new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                            VideoUrl = "https://media.musclewiki.com/media/uploads/videos/branded/male-bodyweight-chinup-side.mp4#t=0.1"
                        },
                        new
                        {
                            Id = new Guid("15858f90-da40-4356-838e-c9704f48006e"),
                            CreatedAt = new DateTime(2025, 4, 16, 13, 16, 29, 255, DateTimeKind.Utc).AddTicks(3686),
                            Description = "Stand up straight with a dumbbell in each hand at arm's length. Raise one dumbbell and twist your forearm until it is vertical and your palm faces the shoulder. Lower to original position and repeat with opposite arm.",
                            Difficulty = "Beginner",
                            Duration = 25,
                            TargetMuscles = "Arms",
                            Title = "Dumbbell Curl",
                            UserId = new Guid("dc0372c1-6da4-4c61-a84b-8c6af860b77c"),
                            VideoUrl = "https://media.musclewiki.com/media/uploads/videos/branded/male-Dumbbells-dumbbell-curl-front.mp4#t=0.1"
                        });
                });

            modelBuilder.Entity("NutritionLog", b =>
                {
                    b.HasOne("StrongerTogether.Server.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Comment", b =>
                {
                    b.HasOne("StrongerTogether.Server.Models.Post", "Post")
                        .WithMany("Comments")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("StrongerTogether.Server.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Follow", b =>
                {
                    b.HasOne("StrongerTogether.Server.Models.User", "Followee")
                        .WithMany()
                        .HasForeignKey("FolloweeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("StrongerTogether.Server.Models.User", "Follower")
                        .WithMany()
                        .HasForeignKey("FollowerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Followee");

                    b.Navigation("Follower");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Like", b =>
                {
                    b.HasOne("StrongerTogether.Server.Models.Post", "Post")
                        .WithMany("Likes")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("StrongerTogether.Server.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Post", b =>
                {
                    b.HasOne("NutritionLog", "NutritionLog")
                        .WithMany()
                        .HasForeignKey("NutritionLogId");

                    b.HasOne("StrongerTogether.Server.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("StrongerTogether.Server.Models.Workout", "Workout")
                        .WithMany()
                        .HasForeignKey("WorkoutId");

                    b.Navigation("NutritionLog");

                    b.Navigation("User");

                    b.Navigation("Workout");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Workout", b =>
                {
                    b.HasOne("StrongerTogether.Server.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("StrongerTogether.Server.Models.Post", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Likes");
                });
#pragma warning restore 612, 618
        }
    }
}
