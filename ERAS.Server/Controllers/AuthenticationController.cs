//Authentication Control
using ERAS.Server.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
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
                    return BadRequest(new { message = "Invalid login attempt." });
                }

                //---------------------------------------------------------------------------------*
                ////Uncomment to create first user in the system
                //var newUser = new ApplicationUser
                //{
                //    UserName = "Admin",
                //    Name = "Name",
                //    Alias = "Alias",
                //    Email = "abcd@gmail.com",
                //    UserRoleId = 1,   //1 for Admin
                //    EmailConfirmed = false,
                //    PhoneNumberConfirmed = false,
                //    TwoFactorEnabled = false,
                //    LockoutEnabled = false,
                //    AccessFailedCount = 0,
                //    IsActive = true
                //};
                //var registerResult = await _userManager.CreateAsync(newUser, "Admin1234#");
                //--------------------------------------------------------------------------------*

                var user = await _userManager.FindByNameAsync(model.UserName);

                if (user != null)
                {
                    if (user.IsActive == false)
                    {
                        return Unauthorized(new { message = "Your account is restricted. Please contact the admin panel !!!" });
                    }

                    var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, user.LockoutEnabled);

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
                        return Ok(new { 
                            message = "Login successful", 
                            userRole = roles.FirstOrDefault() ?? "", 
                            userId = user.Id,
                            imageUrl = user.Image != null
                                            ? $"data:image/jpeg;base64,{Convert.ToBase64String(user.Image)}"
                                            : ""
                        });
                    }

                    if (result.IsLockedOut)
                    {
                        return BadRequest(new { message = "User account locked out." });
                    }

                    else
                    {
                        return BadRequest(new { message = "Incorrect Password" });
                    }
                }
                else
                {
                    return Unauthorized(new { message = "User Not Found with this UserName" });
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            HttpContext.Session.Remove("UserId");
            HttpContext.Session.Remove("UserRole");
            return Ok();
        }
    }
}