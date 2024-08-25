using System.ComponentModel.DataAnnotations;

namespace ERAS.Server.Models
{
    public class RegistrationViewModel
    {
        public required string UserName { get; set; }       
        public required string Name { get; set; }

        public required string Alias { get; set; }
        public required string Email { get; set; }
        public required int UserRoleId { get; set; }

        [DataType(DataType.Password)]
        public required string Password { get; set; }       
    }
}
        //public required string ImageUrl { get; set; } = "";
        //public required Boolean EmailConfirmed { get; set; } = false;
        //public required Boolean PhoneNumberConfirmed { get; set; } = false;
        //public required Boolean TwoFactorEnabled { get; set; } = false;
        //public required Boolean LockoutEnabled { get; set; } = false;
        //public required int AccessFailedCount { get; set; } = 0;