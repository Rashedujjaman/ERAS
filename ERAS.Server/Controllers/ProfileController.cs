using ERAS.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace ERAS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController(UserManager<ApplicationUser> userManager) : ControllerBase
    {
        readonly UserManager<ApplicationUser> _userManager = userManager;

        [HttpGet("getProfile/{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            try
            {
                // Verify session user
                var userId = HttpContext.Session.GetInt32("UserId");
                if (userId == null)
                {
                    return Unauthorized(new { message = "Sorry Your Session Is Out. Please Login To Continue", sessionOut = true});
                }

                // Find the user by ID
                var userRole = HttpContext.Session.GetString("UserRole");
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null)
                {
                    return Unauthorized(new { message = "User not found"});
                }

                // Create a profile view model to return
                var profile = new ProfileViewModel
                {
                    UserId = userId.ToString(),
                    UserName = user.UserName,
                    Name = user.Name,
                    Alias = user.Alias,
                    Email = user.Email,
                    ImageUrl = user.Image != null ? $"data:image/jpeg;base64,{Convert.ToBase64String(user.Image)}" : "assets/images/profile.jpg",
                    UserRole = userRole
                };
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error {$}", ex });
            }
        }

        [HttpPut("updateProfile/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] ProfileViewModel model)
        {
            try
            {
                // Verify session user
                var userId = HttpContext.Session.GetInt32("UserId");
                if (userId == null)
                {
                    return Unauthorized(new { message = "Session expired. Please log in again.", sessionOut = true });
                }

                // Find the user by ID
                var user = await _userManager.FindByIdAsync(id.ToString());
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Update user properties
                user.Alias = model.Alias ?? "";
                user.Name = model.Name;
                user.UserName = model.UserName;
                user.Email = model.Email;

                if (model.Image != null)
                {
                    try
                    {
                        using var memoryStream = new MemoryStream();
                        await model.Image.CopyToAsync(memoryStream);

                        user.Image = memoryStream.ToArray();
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, new { message = "An error occurred while processing the image.", error = ex.Message });
                    }
                }

                // Attempt to save changes
                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errorMessages = result.Errors.Select(e => e.Description).ToList();
                    return BadRequest(new { message = "Failed to update profile", errors = errorMessages });
                }

                // Create a profile view model to return
                var profile = new ProfileViewModel
                {
                    UserId = user.Id.ToString(),
                    UserName = user.UserName,
                    Name = user.Name,
                    Alias = user.Alias,
                    Email = user.Email,
                    ImageUrl = user.Image != null ? $"data:image/jpeg;base64,{Convert.ToBase64String(user.Image)}" : "assets/images/profile.jpg",
                    UserRole = HttpContext.Session.GetString("UserRole")
                };

                return Ok(profile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the profile." });
            }
        }
    }
}
