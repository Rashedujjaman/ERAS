using Microsoft.AspNetCore.Identity;

namespace ERAS.Server.Models
{
    public class UserRole : IdentityRole
    {
        public UserRole() { }
        public UserRole(string roleName) : base(roleName)
        {

        }
    }
}
