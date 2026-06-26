using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    public class CinemaDbContext : DbContext
    {
        public virtual DbSet<Genre> Genres { get; set; }
        public virtual DbSet<Movie> Movies { get; set; }
        public virtual DbSet<Actor> Actors { get; set; }
        public virtual DbSet<MovieActor> MovieActors { get; set; }

        public CinemaDbContext(DbContextOptions<CinemaDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MovieActor>()
                .HasOne(ma => ma.Movie)
                .WithMany(m => m.MovieActors)
                .HasForeignKey(ma => ma.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MovieActor>()
                .HasOne(ma => ma.Actor)
                .WithMany(a => a.MovieActors)
                .HasForeignKey(ma => ma.ActorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Movie>()
                .HasOne(m => m.Genre)
                .WithMany(g => g.Movies)
                .HasForeignKey(m => m.GenreId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
