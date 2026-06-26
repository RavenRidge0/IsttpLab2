using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models
{
    public class Actor
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Ім'я актора не може бути порожнім")]
        public string Name { get; set; } = string.Empty;

        public string? Bio { get; set; }

        public virtual ICollection<MovieActor> MovieActors { get; set; } = new List<MovieActor>();
    }
}
