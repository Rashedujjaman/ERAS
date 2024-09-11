using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERAS.Server.Models
{
    public class Equipment
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }
        public required string Alias { get; set; }
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
        public byte[]? Image { get; set; }
        public DateTimeOffset? DateCreated { get; set; }
        public DateTimeOffset? DateModified { get; set; }
        public int? UserCreatedId { get; set; }
        public int? UserModifiedId { get; set; }
        [ForeignKey("EquipmentModelId")]
        public virtual EquipmentModel? EquipmentModel { get; set; }
        [ForeignKey("AreaId")]
        public virtual Area? Area{ get; set; }
        [ForeignKey("VncId")]
        public virtual Vnc? Vnc { get; set; }
        [ForeignKey("UserCreatedId")]
        public virtual ApplicationUser? UserCreated { get; set; }
        [ForeignKey("UserModifiedId")]
        public virtual ApplicationUser? UserModified { get; set; }

    }
}