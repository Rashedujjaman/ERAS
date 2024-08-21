using ERAS.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace ERAS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<AuthenticationController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError("Model state is invalid");
                    return BadRequest("Invalid model state");
                }

                _logger.LogInformation("Attempting login for user: {UserName}", model.UserName);

                var user = await _userManager.FindByNameAsync(model.UserName);
                if (user == null)
                {
                    _logger.LogWarning("User not found: {UserName}", model.UserName);
                    return Unauthorized("Incorrect user");
                }

                var hasher = new PasswordHasher<IdentityUser>();
                var hashedPassword = hasher.HashPassword(user, model.PasswordHash);
                user.PasswordHash = hashedPassword;
                //_logger.LogInformation("Hashed Password : {hashedPassword} ", hashedPassword);

                _logger.LogInformation("User found: {UserName}. Verifying password...", model.UserName);

                var result = await _signInManager.CheckPasswordSignInAsync(user, model.PasswordHash, false);
                
                if (!result.Succeeded)
                {
                    _logger.LogWarning("Invalid password for user: {UserName}", model.UserName);
                    return Unauthorized("Incorrect username or password");
                }

                _logger.LogInformation("User {UserName} successfully logged in", model.UserName);
                return Ok("Login successful");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while attempting to log in user: {UserName}", model.UserName);
                return StatusCode(500, "Internal server error");
            }
        }

    }
}