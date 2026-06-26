using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public class Movie
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Назва фільму не може бути порожньою")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int GenreId { get; set; }
        public virtual Genre? Genre { get; set; }

        // JsonIgnore запобігає циклічним посиланням при серіалізації JSON
        [JsonIgnore]
        public virtual ICollection<MovieActor> MovieActors { get; set; } = new List<MovieActor>();
    }
}
