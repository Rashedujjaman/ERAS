using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ERAS.Server.Models;
using Microsoft.AspNetCore.Authorization;
using ERAS.Server.Data;
using Microsoft.EntityFrameworkCore;


namespace ERAS.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController(
        UserManager<ApplicationUser> userManager, 
        RoleManager<UserRole> roleManager, 
        ApplicationDbContext dbContext) : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<UserRole> _roleManager = roleManager;
        private readonly ApplicationDbContext _dbContext = dbContext;

        [Authorize (Roles="Admin")]
        [HttpGet("getAllUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if(userId == null)
            {
                return Unauthorized(new { message = "Sorry your session is timed out !!!", sessionOut = true });
            }
            var users = _userManager.Users.ToList();
            var userViewModel = new List<UsersViewModel>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var roleName = roles.FirstOrDefault();

                userViewModel.Add(new UsersViewModel
                {
                    Id = user.Id,
                    UserName = user.UserName ?? "",
                    Name = user.Name ?? "",
                    Alias = user.Alias ?? "",
                    Email = user.Email ?? "",
                    ImageUrl = user.Image != null ? $"data:image/jpeg;base64,{Convert.ToBase64String(user.Image)}" : "assets/images/profile.jpg",
                    UserRoleId = user.UserRoleId,
                    Role = roleName ?? "",
                    IsActive = user.IsActive ?? true
                });
            }

            return Ok(userViewModel);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("getAllUserArea")]
        public async Task<IActionResult> GetAllUserArea()
        {
            try
            {
                var userArea = await _dbContext.UserArea
                    .Include(e => e.Area)
                    .Include(e => e.User)
                    .Select(e => new
                    {
                        e.Id,
                        e.AreaId,
                        e.UserId,
                        User = e.User.UserName,
                        Area = e.Area.Name
                    })
                    .ToListAsync();
                return Ok(userArea);
            } catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("getExistingAreasByUser/{userId}")]
        public async Task<IActionResult> GetExistingAreasByUser(int userId)
        {
            try
            {
                // Fetch all areas assigned to the selected user
                var assignedAreas = await _dbContext.UserArea
                    .Where(ua => ua.UserId == userId)
                    .Select(ua => ua.AreaId)
                    .ToListAsync();

                // Fetch all areas that are not assigned to the selected user
                var availableAreas = await _dbContext.Area
                    .Where(a => assignedAreas.Contains(a.Id))
                    .ToListAsync();

                return Ok(availableAreas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("assignArea")]
        public async Task<IActionResult> AssignArea([FromBody] AssignAreaRequest model)
        {
            try
            {
                // Delete existing UserArea entries for the selected user
                var existingUserAreas = _dbContext.UserArea.Where(ua => ua.UserId == model.UserId);
                _dbContext.UserArea.RemoveRange(existingUserAreas);

                // Create new UserArea entries for each selected area
                var newUserAreas = model.Areas.Select(areaId => new UserArea
                {
                    UserId = model.UserId,
                    AreaId = areaId
                });

                await _dbContext.UserArea.AddRangeAsync(newUserAreas);
                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteUserArea/{userAreaId}")]
        public async Task<IActionResult> DeleteUserArea(int userAreaId)
        {
            try
            {
                var userArea = await _dbContext.UserArea.FindAsync(userAreaId);
                if (userArea == null)
                {
                    return NotFound(new { message = "User area not found." });
                }

                _dbContext.UserArea.Remove(userArea);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "User area deleted successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPut("accountStatus/{id}")]
        public async Task<IActionResult> ToggleUserStatus(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            user.IsActive = !(user.IsActive ?? null);

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                if (user.IsActive==true)
                {
                    return Ok(new { message = "Account Unlocked for user: " });
                }
                else
                {
                    return Ok(new { message = "Account Locked for user : " });
                }
            }

            return BadRequest(new { message = "Failed to update user status.", errors = result.Errors });
        }


        [HttpPost("resetPassword/{id}")]
        public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetPasswordModel model)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new { message = "Password reset successful." });
            }
            return BadRequest(new { message = "Failed to reset password.", errors = result.Errors });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateUserRole/{id}")]
        public async Task<IActionResult> EditUserRole(int id, [FromBody] EditRoleModel model)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            var currentRoles = await _userManager.GetRolesAsync(user);

            // Remove all existing roles
            var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeResult.Succeeded)
            {
                return BadRequest(new { message = "Failed to remove existing roles." });
            }

            user.UserRoleId = model.UserRoleId;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                var role = await _roleManager.FindByIdAsync(user.UserRoleId.ToString());
                if(role != null)
                {
                    var roleResult = await _userManager.AddToRoleAsync(user, role.Name);
                    if(!roleResult.Succeeded)
                    {
                        return BadRequest(new { message = "Failed to update user role" });
                    }
                }
                return Ok(new { message = "User role updated successfully." });
            }

            return BadRequest(new { message = "Failed to update user role" });

        }
    }
}