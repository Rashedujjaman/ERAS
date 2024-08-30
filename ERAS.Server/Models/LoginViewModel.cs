//LoginViewModel
using System.ComponentModel.DataAnnotations;

namespace ERAS.Server.Models
{
    public class LoginViewModel
    {
        public required string UserName { get; set; }
        [DataType(DataType.Password)]
        public required string Password { get; set; }
    }
}

