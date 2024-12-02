using Microsoft.AspNetCore.Mvc;
using ERAS.Server.Data;
using ERAS.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;


namespace ERAS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AreaController(ApplicationDbContext dbContext) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbContext;

        [HttpGet("getAllArea")]
        public async Task<IActionResult> GetAreas()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized(new { message = "Sorry your session is timed out !!!", sessionOut = true });
            }
            try
            {
                var areas = await _dbContext.Area
                    .Include(a => a.UserCreated)
                    .Include(a => a.UserModified)
                    .Where(a => a.IsDeleted == null || a.IsDeleted == false)
                    .Select(
                    a => new
                    {
                        a.Id,
                        a.Name,
                        a.Alias,
                        a.DateCreated,
                        a.DateModified,
                        UserCreated = a.UserCreated.UserName,
                        UserModified = a.UserModified.UserName,
                    }
                    )
                    .ToListAsync();
                return Ok(new { message = "Areas are loaded", areas });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }


        [HttpPost("addArea")]
        public async Task<IActionResult> CreateArea([FromBody] Area area)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            area.DateCreated = DateTimeOffset.UtcNow;
            area.UserCreatedId = HttpContext.Session.GetInt32("UserId");
            area.IsDeleted = false;

            _dbContext.Area.Add(area);
            var result = await _dbContext.SaveChangesAsync();
            if (result == 0)
            {
                return BadRequest(new { message = "An error occured while adding the Area" });
            }
            return Ok(new { message = "Area added successfully !!!", area });
        }

        [HttpPut("editArea/{id}")]
        public async Task<IActionResult> UpdateArea(int id, [FromBody] Area area)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingArea = await _dbContext.Area.FindAsync(id);
            if (existingArea == null)
                return NotFound();

            existingArea.DateModified = DateTimeOffset.UtcNow;
            existingArea.UserModifiedId = HttpContext.Session.GetInt32("UserId");
            existingArea.Name = area.Name;
            existingArea.Alias = area.Alias;

            _dbContext.Entry(existingArea).State = EntityState.Modified;
            var result = await _dbContext.SaveChangesAsync();
            if (result == 0)
            {
                return BadRequest(new { message = "An error occured while updating Area" });
            }
            return Ok(new { message = "Area updated successfully !!!", area });
        }


        [HttpDelete("deleteArea/{id}")]
        public async Task<IActionResult> DeleteArea(int id)
        {
            var existingArea = await _dbContext.Area.FindAsync(id);
            if (existingArea == null)
                return NotFound();

            existingArea.IsDeleted = true;
            existingArea.DateModified = DateTimeOffset.UtcNow;
            existingArea.UserModifiedId = HttpContext.Session.GetInt32("UserId");

            _dbContext.Entry(existingArea).State = EntityState.Modified;
            var result = await _dbContext.SaveChangesAsync();
            if (result == 0)
            {
                return BadRequest(new { message = "An error occured while deleting Area" });
            }
            return Ok(new { message = "Area deleted successfully !!!" });
        }
    }
}
