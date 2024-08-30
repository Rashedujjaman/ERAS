using System.ComponentModel.DataAnnotations;

namespace ERAS.Server.Models
{
    public class UsersViewModel
    {
        public required int Id { get; set; }
        public required string UserName { get; set; }
        public required string Name { get; set; }
        public required string Alias { get; set; }
        public required string Email { get; set; }
        public required string PhotoUrl { get; set; }
        public required string Role { get; set; }
        public required bool IsActive { get; set; }
    }
}