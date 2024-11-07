using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ERAS.Server.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string? Name { get; set; }
        public string? Alias { get; set; }
        public int? UserRoleId { get; set; }
        public byte[]? Image { get; set; }
        public bool? IsActive { get; set; }
    }
}