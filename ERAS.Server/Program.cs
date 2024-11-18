using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ERAS.Server.Models;
using ERAS.Server.Data;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Configure the database context with a connection string.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDistributedMemoryCache();

// Session service to track user.
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});


//Cors Configuration
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});




// Configure Identity with custom user and role models, and EF storage.
builder.Services.AddIdentity<ApplicationUser, UserRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager<SignInManager<ApplicationUser>>()
    .AddDefaultTokenProviders();

// Configure Identity options, including password and lockout settings.
builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 2;

    // Lockout settings.
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings.
    options.User.RequireUniqueEmail = true;
});

// Add authentication and authorization services.
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = IdentityConstants.ApplicationScheme;
});
builder.Services.AddAuthorization(options => { });

// Add controllers to the application.
builder.Services.AddControllers();

// Configure Swagger/OpenAPI.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable static files and set up the default file.
app.UseDefaultFiles();
app.UseStaticFiles();

// Enable Swagger in development mode.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSwagger();
app.UseSwaggerUI();

// Enable HTTPS redirection.
app.UseHttpsRedirection();

// Enable authentication and authorization middleware.
app.UseAuthentication();
app.UseAuthorization();

// Session Service
app.UseSession();

// Enable CORS
app.UseCors();

// Map controllers.
app.MapControllers();

// Map fallback for client-side routing.
app.MapFallbackToFile("/index.html");

// Run the application.
app.Run();
