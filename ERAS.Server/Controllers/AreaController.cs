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

        [HttpGet]
        public async Task<IActionResult> GetAreas()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized(new { message = "Sorry your session is timed out !!!", sessionOut = true });
            }
            try
            {
                var areas = await (from a in _dbContext.Area
                                   join uc in _dbContext.ApplicationUser on a.UserCreated equals uc.Id into createdBy
                                   from createdUser in createdBy.DefaultIfEmpty()
                                   join um in _dbContext.ApplicationUser on a.UserModified equals um.Id into modifiedBy
                                   from modifiedUser in modifiedBy.DefaultIfEmpty()
                                   where a.IsDeleted == null || a.IsDeleted == false
                                   select new
                                   {
                                       Id = a.Id,
                                       Name = a.Name,
                                       Alias = a.Alias,
                                       UserCreated = createdUser.UserName,
                                       DateCreated = a.DateCreated,
                                       UserModified = modifiedUser.UserName,
                                       DateModified = a.DateModified
                                   }).ToListAsync();
                return Ok(areas);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }


        [HttpPost]
        public async Task<IActionResult> CreateArea([FromBody] Area area)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            area.DateCreated = DateTimeOffset.UtcNow;
            area.UserCreated = HttpContext.Session.GetInt32("UserId");
            area.IsDeleted = false;

            _dbContext.Area.Add(area);
            var result = await _dbContext.SaveChangesAsync();
            if (result == 0)
            {
                return BadRequest(new { message = "An error occured while adding the Area" });
            }
            return Ok(new { message = "Area added successfully !!!", area });
        }
    }
}
