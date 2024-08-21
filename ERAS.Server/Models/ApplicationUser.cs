using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
namespace ERAS.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public override string Id { get; set; } = Guid.NewGuid().ToString();
        public override string UserName { get; set; } = string.Empty;
        public override string PasswordHash { get; set; } = string.Empty;

        //[Key]
        //public override string Id { get; set; }
        //[Required]
        //public string UserName { get; set; }
        //[Required]
        //[DataType(DataType.Password)]
        //public string PasswordHash { get; set; }
        //[Required]
        //public string Name { get; set; }
        //[Required]
        //public string Alias { get; set; }
        //[Required]
        //public string Email { get; set; }
        //[Required]
        //public int UserRoleId { get; set; }
        //public string ImageUrl { get; set; }
    }
}
