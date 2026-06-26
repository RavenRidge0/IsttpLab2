using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public class Genre
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Назва жанру не може бути порожньою")]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        // JsonIgnore запобігає циклічним посиланням при серіалізації JSON
        [JsonIgnore]
        public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
    }
}
