using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ERAS.Server.Models;
using Microsoft.AspNetCore.Authorization;


namespace ERAS.Server.Controllers
{
    [Route("api/[controller]")]
    [Authorize (Roles="Admin")]
    [ApiController]
    public class UsersController(UserManager<ApplicationUser> userManager) : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if(userId == null)
            {
                return Unauthorized(new { message = "Sorry your session is timed out !!!", sessionOut = true });
            }
            var users = _userManager.Users.ToList();
            var userViewModels = new List<UsersViewModel>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var roleName = roles.FirstOrDefault();

                userViewModels.Add(new UsersViewModel
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Name = user.Name,
                    Alias = user.Alias,
                    Email = user.Email,
                    PhotoUrl = user.ImageUrl,
                    Role = roleName,
                    IsActive = user.IsActive ?? true
                });
            }

            return Ok(userViewModels);
        }


        [HttpPut("{id}/toggle")]
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
    }
}