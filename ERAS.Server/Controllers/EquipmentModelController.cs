using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ERAS.Server.Models;
using ERAS.Server.Data;

namespace ERAS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class EquipmentModelController(ApplicationDbContext dbContext) : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext = dbContext;

        // GET: api/equipment-model
        [HttpGet]
        public async Task<IActionResult> GetAllEquipmentModels()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
            {
                return Unauthorized(new { message = "Sorry your session is timed out !!!", sessionOut = true });
            }
            var equipmentModels = await (from e in _dbContext.EquipmentModel
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
                                            UserCreated = createdUser.UserName,
                                            DateCreated = e.DateCreated,
                                            UserModified = modifiedUser.UserName,
                                            DateModified = e.DateModified,
                                            IsDeleted = e.IsDeleted

                                         }).ToListAsync();

            return Ok(equipmentModels);
        }

        // POST: api/equipment-model
        [HttpPost]
        public async Task<IActionResult> CreateEquipmentModel([FromBody] EquipmentModel equipmentModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            

            equipmentModel.DateCreated = DateTimeOffset.UtcNow;
            equipmentModel.UserCreated = HttpContext.Session.GetInt32("UserId");
            equipmentModel.IsDeleted = false;

            _dbContext.EquipmentModel.Add(equipmentModel);
            var result = await _dbContext.SaveChangesAsync();
            if(result == 0)
            {
                return BadRequest(new {message = "An error occured while adding the Equipment Model"});
            }
            return Ok(new {message = "Equipment Model added successfully !!!", equipmentModel});
        }

        // PUT: api/equipment-model/{id}
        [HttpPut("{id}")]
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
            existingModel.UserModified = HttpContext.Session.GetInt32("UserId");

            _dbContext.Entry(existingModel).State = EntityState.Modified;
            var result = await _dbContext.SaveChangesAsync();

            if (result == 0)
            { 
                return Ok(new { message = "An error occured while saving the changes to database" }); 
            }
            return Ok(new { message = "Equipment model is edited successfully !!!", existingModel });
        }

        // DELETE: api/equipment-model/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEquipmentModel(int id)
        {
            var existingModel = await _dbContext.EquipmentModel.FindAsync(id);
            if (existingModel == null)
                return NotFound();

            existingModel.IsDeleted = true;
            existingModel.DateModified = DateTimeOffset.UtcNow;
            existingModel.UserModified = HttpContext.Session.GetInt32("UserId");

            _dbContext.Entry(existingModel).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
