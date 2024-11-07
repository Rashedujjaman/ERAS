using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ERAS.Server.Models;
using Microsoft.AspNetCore.Authorization;


namespace ERAS.Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize (Roles="Admin")]
    [ApiController]
    public class UsersController(UserManager<ApplicationUser> userManager, RoleManager<UserRole> roleManager) : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<UserRole> _roleManager = roleManager;

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
                    Name = user.Name,
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