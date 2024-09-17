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
                var userId = HttpContext.Session.GetInt32("UserId");
                if (userId == null)
                {
                    return Unauthorized(new { message = "Your session is out !!! Login to continue." });
                }
                var equipments = await _dbContext.Equipment
                    .Include(e => e.Area)
                    .Include(e => e.EquipmentModel)
                    .Include(e => e.UserCreated)
                    .Include(e => e.UserModified)
                    .Where(e => e.IsDeleted == null || e.IsDeleted == false)
                    .Select(e => new
                    {
                        e.Id,
                        e.Name,
                        e.Alias,
                        e.IpAddress,
                        e.HostName,
                        e.VncUserName,
                        e.VncPassword,
                        e.Image,
                        e.AreaId,
                        Zone = e.Area.Name,
                        e.EquipmentModelId,
                        Model = e.EquipmentModel.Name,
                        UserCreated = e.UserCreated.UserName,
                        e.DateCreated,
                        UserModified = e.UserModified.UserName,
                        e.DateModified
                    }).ToListAsync();

                return Ok(new { message = "Equipments fetched successfully !!!", equipments });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving equipment data.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostEquipment([FromForm] EquipmentAddEditModel eq)
        {
            try
            {
                if (eq == null)
                {
                    return BadRequest(new { message = "Invalid equipment data." });
                }

                var equipment = new Equipment
                {
                    Name = eq.Name,
                    Alias = eq.Alias,
                    HostName = eq.HostName,
                    IpAddress = eq.IpAddress,
                    VncUserName = eq.VncUserName,
                    VncPassword = eq.VncPassword,
                    EquipmentModelId = eq.EquipmentModelId,
                    AreaId = eq.AreaId,
                    DateCreated = DateTime.UtcNow,
                    Enabled = true,
                    IsDeleted = false,
                    UserCreatedId = HttpContext.Session.GetInt32("UserId")
                };

                if (eq.Image != null)
                {
                    try
                    {
                        using var memoryStream = new MemoryStream();
                        await eq.Image.CopyToAsync(memoryStream);

                        if (memoryStream.Length > 0)
                        {
                            equipment.Image = memoryStream.ToArray();
                        }
                        else
                        {
                            return BadRequest(new { message = "Uploaded image is empty." });
                        }
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, new { message = "An error occurred while processing the image.", error = ex.Message });
                    }
                }


                _dbContext.Equipment.Add(equipment);

                var result = await _dbContext.SaveChangesAsync();
                if (result == 0)
                {
                    return BadRequest(new { message = "An error occurred while adding the equipment." });
                }

                return Ok(new { message = "Equipment added successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the equipment.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEquipment(int id, [FromForm] EquipmentAddEditModel updatedEquipment)
        {
            try
            {
                if (updatedEquipment == null)
                {
                    return BadRequest(new { message = "Invalid equipment data." });
                }

                var existingEquipment = await _dbContext.Equipment.FindAsync(id);
                if (existingEquipment == null)
                {
                    return NotFound(new { message = "Equipment not found." });
                }

                existingEquipment.Name = updatedEquipment.Name;
                existingEquipment.Alias = updatedEquipment.Alias;
                existingEquipment.HostName = updatedEquipment.HostName;
                existingEquipment.IpAddress = updatedEquipment.IpAddress;
                existingEquipment.VncUserName = updatedEquipment.VncUserName;
                existingEquipment.VncPassword = updatedEquipment.VncPassword;
                existingEquipment.EquipmentModelId = updatedEquipment.EquipmentModelId;
                existingEquipment.AreaId = updatedEquipment.AreaId;
                existingEquipment.DateModified = DateTime.UtcNow;
                existingEquipment.UserModifiedId = HttpContext.Session.GetInt32("UserId");

                if (updatedEquipment.Image != null)
                {
                    try
                    {
                        using var memoryStream = new MemoryStream();
                        await updatedEquipment.Image.CopyToAsync(memoryStream);

                        // Optional: Check the file size if necessary
                        if (memoryStream.Length > 0)
                        {
                            existingEquipment.Image = memoryStream.ToArray();
                        }
                        else
                        {
                            return BadRequest(new { message = "Uploaded image is empty." });
                        }
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, new { message = "An error occurred while processing the image.", error = ex.Message });
                    }
                }


                _dbContext.Entry(existingEquipment).State = EntityState.Modified;

                var result = await _dbContext.SaveChangesAsync();
                if (result == 0)
                {
                    return BadRequest(new { message = "An error occurred while updating the equipment." });
                }

                return Ok(new { message = "Equipment updated successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the equipment.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipment(int id)
        {
            try
            {
                var existingEquipment = await _dbContext.Equipment.FindAsync(id);
                if (existingEquipment == null)
                    return NotFound(new { message = "Equipment not found." });

                existingEquipment.IsDeleted = true;
                existingEquipment.DateModified = DateTime.UtcNow;
                existingEquipment.UserModifiedId = HttpContext.Session.GetInt32("UserId");

                _dbContext.Entry(existingEquipment).State = EntityState.Modified;

                var result = await _dbContext.SaveChangesAsync();
                if (result == 0)
                {
                    return BadRequest(new { message = "An error occurred while deleting the equipment." });
                }

                return Ok(new { message = "Equipment deleted successfully !!!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the equipment.", error = ex.Message });
            }
        }
    }

}
