using CinemaAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieActorsController : ControllerBase
    {
        private readonly CinemaDbContext _context;

        public MovieActorsController(CinemaDbContext context)
        {
            _context = context;
        }

        // GET: api/MovieActors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieActor>>> GetMovieActors()
        {
            return await _context.MovieActors.ToListAsync();
        }

        // GET: api/MovieActors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieActor>> GetMovieActor(int id)
        {
            var movieActor = await _context.MovieActors.FindAsync(id);

            if (movieActor == null)
            {
                return NotFound();
            }

            return movieActor;
        }

        // PUT: api/MovieActors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovieActor(int id, MovieActor movieActor)
        {
            if (id != movieActor.Id)
            {
                return BadRequest();
            }

            _context.Entry(movieActor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieActorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/MovieActors
        [HttpPost]
        public async Task<ActionResult<MovieActor>> PostMovieActor(MovieActor movieActor)
        {
            _context.MovieActors.Add(movieActor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMovieActor", new { id = movieActor.Id }, movieActor);
        }

        // DELETE: api/MovieActors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovieActor(int id)
        {
            var movieActor = await _context.MovieActors.FindAsync(id);
            if (movieActor == null)
            {
                return NotFound();
            }

            _context.MovieActors.Remove(movieActor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovieActorExists(int id)
        {
            return _context.MovieActors.Any(e => e.Id == id);
        }
    }
}
