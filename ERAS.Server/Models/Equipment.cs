using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERAS.Server.Models
{
    public class Equipment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Name { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        public string Alias { get; set; }

        [Required]
        [ForeignKey("EquipmentModel")]
        public int EquipmentModelId { get; set; }

        [Required]
        [ForeignKey("Area")]
        public int AreaId { get; set; }

        [Required]
        [ForeignKey("Vnc")]
        public int VncId { get; set; }

        public bool? Enabled { get; set; }

        public bool? IsDeleted { get; set; }

        public DateTimeOffset? DateCreated { get; set; }

        public DateTimeOffset? DateModified { get; set; }

        public int? UserCreated { get; set; }

        public int? UserModified { get; set; }
    }
}