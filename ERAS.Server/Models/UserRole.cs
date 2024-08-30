using Microsoft.AspNetCore.Identity;

namespace ERAS.Server.Models
{
    public class UserRole : IdentityRole<int>
    {
        public UserRole() { }
        public UserRole(string roleName) : base(roleName)
        {

        }
    }
}
