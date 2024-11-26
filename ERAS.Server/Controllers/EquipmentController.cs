using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ERAS.Server.Data;
using ERAS.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace ERAS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentController(ApplicationDbContext dbcontext) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbcontext;

        [HttpGet("getAllEquipments")]
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
                    .Where(e => e.IsDeleted == null || e.IsDeleted == false).ToListAsync();

                return Ok(equipments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving equipment data.", error = ex.Message });
            }
        }

        private Equipment? GetEquipmentById(int id)
        {
            var equipment = _dbContext.Equipment
                .Include(e => e.Area)
                .Include(e => e.EquipmentModel)
                .Include(e => e.UserCreated)
                .Include(e => e.UserModified)
                .FirstOrDefault(e => e.Id == id);

            return equipment;
        }

        [Authorize(Roles = "Admin, Engineer")]
        [HttpPost("addEquipment")]
        public async Task<IActionResult> PostEquipment([FromForm] EquipmentAddEditModel model)
        {
            try
            {
                if (model == null)
                {
                    return BadRequest(new { message = "Invalid equipment data." });
                }

                var equipment = new Equipment
                {
                    Name = model.Name,
                    Alias = model.Alias,
                    HostName = model.HostName,
                    IpAddress = model.IpAddress,
                    VncUserName = model.VncUserName,
                    VncPassword = model.VncPassword,
                    EquipmentModelId = model.EquipmentModelId,
                    AreaId = model.AreaId,
                    DateCreated = DateTime.UtcNow,
                    Enabled = true,
                    IsDeleted = false,
                    UserCreatedId = HttpContext.Session.GetInt32("UserId")
                };

                if (model.Image != null)
                {
                    try
                    {
                        using var memoryStream = new MemoryStream();
                        await model.Image.CopyToAsync(memoryStream);

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

                // Retrieve the newly added equipment
                var newEquipment = this.GetEquipmentById(equipment.Id);

                return Ok(new { message = "Equipment added successfully!", equipment = newEquipment});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the equipment.", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Engineer")]
        [HttpPut("updateEquipment/{id}")]
        public async Task<IActionResult> UpdateEquipment(int id, [FromForm] EquipmentAddEditModel updatedEquipment)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                    {
                        Console.WriteLine($"Model Error: {error.ErrorMessage}");
                    }
                    return BadRequest(ModelState);
                }

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

                        // Check the file size
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

                // Retrieve the newly added equipment
                var editedEquipment = this.GetEquipmentById(id);

                return Ok(new { message = "Equipment updated successfully!", equipment = editedEquipment });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the equipment.", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Engineer")]
        [HttpPut("urlToken/{id}")]
        public async Task<IActionResult> UpdateEquipmentUrlToken(int id, [FromBody] Equipment equipment)
        {
            try
            {
                if (equipment == null)
                {
                    return BadRequest(new { message = "Invalid data." });
                }

                var existingEquipment = await _dbContext.Equipment.FindAsync(id);
                if (existingEquipment == null)
                {
                    return NotFound(new { message = "Equipment not found." });
                }

                existingEquipment.UrlToken = equipment.UrlToken;
                existingEquipment.DateModified = DateTime.UtcNow;
                existingEquipment.UserModifiedId = HttpContext.Session.GetInt32("UserId");

                _dbContext.Entry(existingEquipment).State = EntityState.Modified;

                var result = await _dbContext.SaveChangesAsync();
                if (result == 0)
                {
                    return BadRequest(new { message = "An error occurred while updating the equipment." });
                }

                return Ok(new { message = "Equipment url token updated successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the equipment url token", error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin, Engineer")]
        [HttpDelete("deleteEquipment/{id}")]
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
