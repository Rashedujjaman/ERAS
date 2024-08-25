//Authentication Control
using ERAS.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;


namespace ERAS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ILogger<AuthenticationController> logger) : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
        private readonly ILogger<AuthenticationController> _logger = logger;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError("Model state is invalid");
                    return BadRequest(new { message = "Invalid model state" });
                }

                _logger.LogInformation("Attempting login for user: {UserName}", model.UserName);

                var user = await _userManager.FindByNameAsync(model.UserName);
                if (user == null)
                {
                    _logger.LogWarning("User not found: {UserName}", model.UserName);
                    return Unauthorized(new { message = "Incorrect user" });
                }
                //var hasher = new PasswordHasher<IdentityUser>();
                //var hashedPassword = hasher.HashPassword(user, model.Password);
                //user.PasswordHash = hashedPassword;
                //_logger.LogInformation("Hashed Password : {hashedPassword} ", hashedPassword);
                _logger.LogInformation("User found: {UserName}. Verifying password...", model.UserName);

                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure:true);

                if (result.Succeeded)
                {
                    _logger.LogInformation("User {UserName} successfully logged in", model.UserName);

                    var userRole = await _userManager.GetRolesAsync(user);

                    return Ok(new
                    {
                        message = "Login successful",
                        userRole = userRole.FirstOrDefault()
                    });
                }
                _logger.LogWarning("Invalid password for user: {UserName}", model.UserName);
                return Unauthorized(new { message = "Incorrect username or password" });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while attempting to log in user: {UserName}", model.UserName);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}