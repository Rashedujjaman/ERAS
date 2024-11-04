//Authentication Control
using ERAS.Server.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


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
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogError("Model state is invalid");
                    return BadRequest(new { message = "Invalid login attempt." });
                }

                var user = await _userManager.FindByNameAsync(model.UserName);

                if (user != null)
                {
                    _logger.LogInformation("User found: {UserName}. Verifying password...", model.UserName);
                    if (user.IsActive == false)
                    {
                        _logger.LogWarning("Account is Disabled by Admin");
                        return Unauthorized(new { message = "Your account is restricted. Please contact the admin panel !!!" });
                    }

                    var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        var roles = await _userManager.GetRolesAsync(user);

                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name, user.UserName),
                            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
                        };

                        foreach (var role in roles)
                        {
                            claims.Add(new Claim(ClaimTypes.Role, role));
                        }

                        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                        var principal = new ClaimsPrincipal(identity);

                        await _signInManager.SignInWithClaimsAsync(user, false, claims);

                        HttpContext.Session.SetString("UserRole", roles.FirstOrDefault());
                        HttpContext.Session.SetInt32("UserId", user.Id);
                        _logger.LogInformation("User {UserName} successfully logged in", model.UserName);
                        return Ok(new { message = "Login successful", userRole = roles.FirstOrDefault() });
                    }

                    if (result.IsLockedOut)
                    {
                        _logger.LogWarning("User account locked out: {UserName}", model.UserName);
                        return BadRequest(new { message = "User account locked out." });
                    }

                    else
                    {
                        _logger.LogWarning("Incorrect Password for user: {UserName}", model.UserName);
                        return BadRequest(new { message = "Incorrect Password" });
                    }
                }
                else
                {
                    _logger.LogWarning("User not found: {UserName}", model.UserName);
                    return Unauthorized(new { message = "User Not Found with this UserName" });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while attempting to log in user: {UserName}", model.UserName);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            HttpContext.Session.Remove("UserId");
            HttpContext.Session.Remove("UserRole");
            return Ok(new { message = "Logout successful" });
        }
    }
}