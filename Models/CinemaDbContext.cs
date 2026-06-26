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
            Database.EnsureCreated();
        }
    }
}
