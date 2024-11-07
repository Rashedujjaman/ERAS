using System.ComponentModel.DataAnnotations;

namespace ERAS.Server.Models
{
    public class UsersViewModel
    {
        public required int Id { get; set; }
        public required string UserName { get; set; }
        public required string Name { get; set; }
        public string? Alias { get; set; }
        public required string Email { get; set; }
        public string? ImageUrl { get; set; }
        public required string Role { get; set; }
        public int? UserRoleId { get; set; }
        public required bool IsActive { get; set; }
    }
}