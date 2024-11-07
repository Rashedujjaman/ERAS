using ERAS.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ERAS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController(
        UserManager<ApplicationUser> userManager,
        ILogger<AuthenticationController> logger,
        RoleManager<UserRole> roleManager) : ControllerBase   
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly ILogger<AuthenticationController> _logger = logger;
        private readonly RoleManager<UserRole> _roleManager = roleManager;

        [HttpPost("register")]
        [Authorize(Roles="Admin")]
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
                    EmailConfirmed = false,
                    PhoneNumberConfirmed = false,
                    TwoFactorEnabled = false,
                    LockoutEnabled = false,
                    AccessFailedCount = 0,
                    IsActive = true
                };

                var existingUser = await _userManager.FindByNameAsync(user.UserName);
                if(existingUser != null)
                {
                    _logger.LogError("Sign in failed because User Already Exist in the system");
                    return BadRequest(new { message = $"Username {user.UserName} already taken. Please Try another Username !!!" });
                }


                var result = await _userManager.CreateAsync(user, model.Password);
                if(result.Succeeded)
                {
                    _logger.LogInformation("User created a new account with password.");
                    
                    var role = await _roleManager.FindByIdAsync(model.UserRoleId.ToString());
                    if (role != null)
                    {
                        var roleResult = await _userManager.AddToRoleAsync(user, role.Name);
                        if (!roleResult.Succeeded)
                        {
                            _logger.LogWarning("Failed to assign role to user: {UserName}", model.UserName);
                            return BadRequest(new { message = "Failed to assign role to user" });
                        }
                    }
                    else
                    {
                        _logger.LogError("Role not found for ID: {UserRoleId}", model.UserRoleId);
                        return BadRequest(new { message = "Role not found" });
                    }

                    return Ok(new { message = $"User Created Successfully with UserName : {user.UserName}"});
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
