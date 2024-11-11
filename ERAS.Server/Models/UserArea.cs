using System.ComponentModel.DataAnnotations;

namespace ERAS.Server.Models
{
    public class UserArea
    {
        [Key]
        public int? Id { get; set; }
        public int? UserId { get; set; }
        public int? AreaId { get; set; }

        public ApplicationUser? User { get; set; }
        public Area? Area { get; set; }
    }
}
