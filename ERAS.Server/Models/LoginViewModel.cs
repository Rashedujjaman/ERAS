//LoginViewModel
using System.ComponentModel.DataAnnotations;

namespace ERAS.Server.Models
{
    public class LoginViewModel
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string PasswordHash { get; set; }
    }
}
