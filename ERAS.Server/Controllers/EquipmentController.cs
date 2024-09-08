using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ERAS.Server.Data;
using ERAS.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ERAS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Engineer")]
    public class EquipmentController(ApplicationDbContext dbcontext) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbcontext;

        [HttpGet]
        public async Task<IActionResult> GetEquipments()
        {
            try
            {
                var equipments = await _dbContext.Equipment
                    .Include(e => e.Area)
                    .Include(e => e.EquipmentModel)
                    .Include(e => e.Vnc)
                    .Include(e => e.UserCreated)
                    .Include(e => e.UserModified)
                    .Where(e => e.IsDeleted == null || e.IsDeleted == false)
                    .Select(e => new
                    {
                        e.Id,
                        e.Name,
                        e.Alias,
                        e.Vnc.IpAddress,
                        e.Vnc.HostName,
                        e.Vnc.VncUserName,
                        e.Vnc.VncPassword,
                        Zone = e.Area.Name,
                        Model = e.EquipmentModel.Name,
                        UserCreated = e.UserCreated.UserName,
                        e.DateCreated,
                        UserModified = e.UserModified.UserName,
                        e.DateModified
                    }).ToListAsync();

                return Ok(new {message = "Equipments fetched successfully !!!", equipments });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving equipment data.", error = ex.Message });
            }
        }
    }
}
