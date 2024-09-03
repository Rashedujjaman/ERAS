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
                var equipments = await (from e in _dbContext.Equipment
                                  join a in _dbContext.Area on e.AreaId equals a.Id
                                  join m in _dbContext.EquipmentModel on e.EquipmentModelId equals m.Id
                                  join v in _dbContext.Vnc on e.VncId equals v.Id
                                  join uc in _dbContext.ApplicationUser on e.UserCreated equals uc.Id into createdBy
                                  from createdUser in createdBy.DefaultIfEmpty()
                                  join um in _dbContext.ApplicationUser on e.UserModified equals um.Id into modifiedBy
                                  from modifiedUser in modifiedBy.DefaultIfEmpty()
                                  where e.IsDeleted == null || e.IsDeleted == false
                                  select new
                                  {
                                      Id = e.Id,
                                      Name = e.Name,
                                      Alias = e.Alias,
                                      IpAddress = v.IpAddress,
                                      HostName = v.HostName,
                                      VncUserName = v.VncUserName,
                                      VncPassword = v.VncPassword,
                                      Zone = a.Name,
                                      Model = m.Name,
                                      UserCreated = createdUser.UserName,
                                      DateCreated = e.DateCreated,
                                      UserModified = modifiedUser.UserName,
                                      DateModified = e.DateModified
                                  }).ToListAsync();

                return Ok(equipments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving equipment data.", error = ex.Message });
            }
        }
    }
}
