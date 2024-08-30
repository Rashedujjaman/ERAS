namespace ERAS.Server.Models
{
    public class ResetPasswordModel
    {
        public required int UserId { get; set; }
        public required string NewPassword { get; set; }
    }
}
