//ApplicationDbContext
using ERAS.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ERAS.Server.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser, UserRole, int>(options)
    {

        //add DbSet property (table/collection in database) refers to model class of same name for columns
        //MUST sync to database after editing with:
        //tools -> nuget package manager -> console
        //add-migration exampleName
        //Update-Database

        public DbSet<ApplicationUser> ApplicationUser { get; set; }
        public DbSet<UserRole> UserRole { get; set; }
        public DbSet<Area> Area { get; set; }
        public DbSet<EquipmentModel> EquipmentModel { get; set; }
        public DbSet<Equipment> Equipment { get; set; }
        public DbSet<Permission> Permission { get; set; }
        public DbSet<UserArea> UserArea { get; set; }

    }
}