using ERAS.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ERAS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController(
        UserManager<ApplicationUser> userManager,
        ILogger<AuthenticationController> logger) : ControllerBase   
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly ILogger<AuthenticationController> _logger = logger;

        [HttpPost("register")]
        public async Task<IActionResult> Registration([FromBody] RegistrationViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError("Model state is invalid");
                    return BadRequest(new { message = "Invalid model state" });
                }
                _logger.LogInformation("Attempting registration for user: {UserName}", model.UserName);
                var user = new ApplicationUser
                {
                    UserName = model.UserName,
                    Name = model.Name,
                    Alias = model.Alias,
                    Email = model.Email,
                    UserRoleId = model.UserRoleId,
                    ImageUrl = "",
                    EmailConfirmed = false,
                    PhoneNumberConfirmed = false,
                    TwoFactorEnabled = false,
                    LockoutEnabled = false,
                    AccessFailedCount = 0
                };
                var result = await _userManager.CreateAsync(user, model.Password);
                if(result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");
                    return Ok(new { message = "User Created Successfully"});
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    _logger.LogWarning("Registration failed for user: {UserName}", model.UserName);
                    return BadRequest(new { message = "Registration failed", errors = ModelState });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while attempting to Register user: {UserName}", model.UserName);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

    }
}
