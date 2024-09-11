using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ERAS.Server.Models;
using ERAS.Server.Data;
using Microsoft.AspNetCore.Authorization;

namespace ERAS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Engineer")]
    public class VncController(ApplicationDbContext dbContext) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbContext;

        [HttpGet]
        public async Task<IActionResult> GetVncs()
        {
            try
            {
                var vncs = await _dbContext.Vnc
                    .Include(v => v.UserCreated)
                    .Include(v => v.UserModified)
                    .Where(v => v.Enabled == null || v.Enabled == true)
                    .Select(v => new
                    {
                        v.Id,
                        v.EquipmentId,
                        v.HostName,
                        v.IpAddress,
                        v.VncUserName,
                        v.VncPassword,
                        v.Enabled,
                        UserCreated = v.UserCreated.UserName,
                        v.DateCreated,
                        UserModified = v.UserModified.UserName,
                        v.DateModified
                    }).ToListAsync();

                return Ok(new { message = "VNC records fetched successfully!", vncs });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving VNC records.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVnc(int id)
        {
            try
            {
                var vnc = await _dbContext.Vnc
                    .Include(v => v.UserCreated)
                    .Include(v => v.UserModified)
                    .FirstOrDefaultAsync(v => v.Id == id && (v.Enabled == null || v.Enabled == true));

                if (vnc == null)
                    return NotFound(new { message = "VNC record not found." });

                return Ok(new { message = "VNC record fetched successfully!", vnc });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the VNC record.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostVnc([FromBody] Vnc vnc)
        {
            try
            {
                if (vnc == null)
                    return BadRequest(new { message = "Invalid VNC data." });

                vnc.DateCreated = DateTime.UtcNow;
                vnc.UserCreatedId = HttpContext.Session.GetInt32("UserId");
                _dbContext.Vnc.Add(vnc);

                var result = await _dbContext.SaveChangesAsync();
                if (result == 0)
                    return BadRequest(new { message = "An error occurred while adding the VNC record." });

                return Ok(new { message = "VNC record added successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the VNC record.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutVnc(int id, [FromBody] Vnc updatedVnc)
        {
            try
            {
                if (updatedVnc == null || id != updatedVnc.Id)
                    return BadRequest(new { message = "Invalid VNC data." });

                var existingVnc = await _dbContext.Vnc.FindAsync(id);
                if (existingVnc == null)
                    return NotFound(new { message = "VNC record not found." });

                existingVnc.HostName = updatedVnc.HostName;
                existingVnc.IpAddress = updatedVnc.IpAddress;
                existingVnc.VncUserName = updatedVnc.VncUserName;
                existingVnc.VncPassword = updatedVnc.VncPassword;
                existingVnc.Enabled = updatedVnc.Enabled;
                existingVnc.DateModified = DateTime.UtcNow;
                existingVnc.UserModifiedId = HttpContext.Session.GetInt32("UserId");

                _dbContext.Entry(existingVnc).State = EntityState.Modified;

                var result = await _dbContext.SaveChangesAsync();
                if (result == 0)
                    return BadRequest(new { message = "An error occurred while updating the VNC record." });

                return Ok(new { message = "VNC record updated successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the VNC record.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVnc(int id)
        {
            try
            {
                var existingVnc = await _dbContext.Vnc.FindAsync(id);
                if (existingVnc == null)
                    return NotFound(new { message = "VNC record not found." });

                existingVnc.Enabled = false;
                existingVnc.DateModified = DateTime.UtcNow;
                existingVnc.UserModifiedId = HttpContext.Session.GetInt32("UserId");

                _dbContext.Entry(existingVnc).State = EntityState.Modified;

                var result = await _dbContext.SaveChangesAsync();
                if (result == 0)
                    return BadRequest(new { message = "An error occurred while deleting the VNC record." });

                return Ok(new { message = "VNC record deleted successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the VNC record.", error = ex.Message });
            }
        }
    }
}
