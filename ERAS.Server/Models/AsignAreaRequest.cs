namespace ERAS.Server.Models
{
    public class AssignAreaRequest
    {
        public int UserId { get; set; }
        public List<int> Areas { get; set; }
    }

}
