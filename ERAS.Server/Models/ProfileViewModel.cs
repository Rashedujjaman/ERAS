namespace ERAS.Server.Models
{
    public class ProfileViewModel
    {
        public required string userId { get; set; }
        public required string userName{ get; set; }
        public required string name { get; set; }
        public required string alias { get; set; }
        public required string email { get; set; }
        public required string photoUrl { get; set; }
        public required string userRole { get; set; }
    }
}
