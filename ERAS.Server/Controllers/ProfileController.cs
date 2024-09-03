using ERAS.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ERAS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController(UserManager<ApplicationUser> userManager) : ControllerBase
    {
        readonly UserManager<ApplicationUser> _userManager = userManager;

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = HttpContext.Session.GetInt32("UserId");
                if (userId == null)
                {
                    return Unauthorized(new { message = "Sorry Your Session Is Out. Please Login To Continue", sessionOut = true});
                }
                var userRole = HttpContext.Session.GetString("UserRole");
                var user = await _userManager.FindByIdAsync(userId.Value.ToString());
                if (user == null)
                {
                    return Unauthorized(new { message = "User not found"});
                }

                var profile = new ProfileViewModel
                {
                    userId = userId.ToString(),
                    userName = user.UserName,
                    name = user.Name,
                    alias = user.Alias,
                    email = user.Email,
                    photoUrl = user.ImageUrl,
                    userRole = userRole
                };
                return Ok(new
                {
                    message = "Profile retrieved successfully",
                    profile = profile
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error {$}", ex });
            }
        }
    }
}
