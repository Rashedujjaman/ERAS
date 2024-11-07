namespace ERAS.Server.Models
{
    public class ProfileViewModel
    {
        public string? UserId { get; set; }
        public required string UserName{ get; set; }
        public required string Name { get; set; }
        public string? Alias { get; set; }
        public string? Email { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? Image { get; set; }
        public string? UserRole { get; set; }
    }
}
