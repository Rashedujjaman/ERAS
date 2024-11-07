using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ERAS.Server.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        public required string Name { get; set; }
        public required string Alias { get; set; }
        public required int UserRoleId { get; set; }
        public byte[]? Image { get; set; }
        public bool? IsActive { get; set; }
    }
}