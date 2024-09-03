using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERAS.Server.Models
{
    public class Permission
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("ApplicationUser")]
        public int ApplicationUserId { get; set; }

        [Required]
        [ForeignKey("Equipment")]
        public int EquipmentId { get; set; }
    }
}