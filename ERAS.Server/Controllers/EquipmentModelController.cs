﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ERAS.Server.Models;
using ERAS.Server.Data;

namespace ERAS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin, Engineer")]
    public class EquipmentModelController(ApplicationDbContext dbContext) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbContext;

        // GET: api/EquipmentModel
        [HttpGet("GetEquipmentModels")]
        public async Task<IActionResult> GetAllEquipmentModels()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized(new { message = "Sorry your session is timed out !!!", sessionOut = true });
            }
            try
            {
                var equipmentModels = await _dbContext.EquipmentModel
                    .Include(e => e.UserCreated)
                    .Include(e => e.UserModified)
                    .Where(e => e.IsDeleted == null || e.IsDeleted == false)
                    .Select(e => new
                    {
                        e.Id,
                        e.Name,
                        e.Alias,
                        e.DateModified,
                        e.DateCreated,
                        e.IsDeleted,
                        UserCreated = e.UserCreated.UserName,
                        UserModified = e.UserModified.UserName,
                    }).ToListAsync();

                return Ok(equipmentModels);
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occured while fetching Equipment Models. {ex}");
            }
        }

        // POST: api/EquipmentModel
        [Authorize(Roles = "Admin")]
        [HttpPost("AddEquipmentModel")]
        public async Task<IActionResult> CreateEquipmentModel([FromBody] EquipmentModel equipmentModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            equipmentModel.DateCreated = DateTimeOffset.UtcNow;
            equipmentModel.UserCreatedId = HttpContext.Session.GetInt32("UserId");
            equipmentModel.IsDeleted = false;

            _dbContext.EquipmentModel.Add(equipmentModel);
            var result = await _dbContext.SaveChangesAsync();
            if(result == 0)
            {
                return BadRequest(new {message = "An error occured while adding the Equipment Model"});
            }
            return Ok(equipmentModel);
        }

        // PUT: api/EquipmentModel/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateEquipmentModel/{id}")]
        public async Task<IActionResult> UpdateEquipmentModel(int id, [FromBody] EquipmentModel equipmentModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingModel = await _dbContext.EquipmentModel.FindAsync(id);
            if (existingModel == null)
                return NotFound();

            existingModel.Name = equipmentModel.Name;
            existingModel.Alias = equipmentModel.Alias;
            existingModel.DateModified = DateTimeOffset.UtcNow;
            existingModel.UserModifiedId = HttpContext.Session.GetInt32("UserId");

            _dbContext.Entry(existingModel).State = EntityState.Modified;
            var result = await _dbContext.SaveChangesAsync();

            if (result == 0)
            { 
                return BadRequest("An error occured while saving the changes to database"); 
            }
            return Ok(existingModel);
        }

        // DELETE: api/EquipmentModel/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteEquipmentModel/{id}")]
        public async Task<IActionResult> DeleteEquipmentModel(int id)
        {
            var existingModel = await _dbContext.EquipmentModel.FindAsync(id);
            if (existingModel == null)
                return NotFound();

            existingModel.IsDeleted = true;
            existingModel.DateModified = DateTimeOffset.UtcNow;
            existingModel.UserModifiedId = HttpContext.Session.GetInt32("UserId");

            _dbContext.Entry(existingModel).State = EntityState.Modified;
            var result = await _dbContext.SaveChangesAsync();
            if(result == 0)
            {
                return BadRequest(new { message = "An error occured while deleting the Equipment Model" });
            }

            return Ok( new { message = "Equipment model deleted successfully !!!"});
        }
    }
}
