using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERAS.Server.Models
{
    public class Equipment
    {
        [Key]
        public int Id { get; set; }

        public string? Name { get; set; }
        public string? Alias { get; set; }
  
        public string? HostName { get; set; }

        public string? IpAddress { get; set; }

        public string? VncUserName { get; set; }

        public string? VncPassword { get; set; }
        [ForeignKey("EquipmentModel")]
        public int? EquipmentModelId { get; set; }
        [ForeignKey("Area")]
        public int? AreaId { get; set; }
        public bool? Enabled { get; set; }
        public bool? IsDeleted { get; set; }
        public byte[]? Image { get; set; }
        public DateTimeOffset? DateCreated { get; set; }
        public DateTimeOffset? DateModified { get; set; }
        public int? UserCreatedId { get; set; }
        public int? UserModifiedId { get; set; }
        public string? UrlToken { get; set; }

        [ForeignKey("EquipmentModelId")]
        public virtual EquipmentModel? EquipmentModel { get; set; }

        [ForeignKey("AreaId")]
        public virtual Area? Area{ get; set; }

        [ForeignKey("UserCreatedId")]
        public virtual ApplicationUser? UserCreated { get; set; }
        [ForeignKey("UserModifiedId")]
        public virtual ApplicationUser? UserModified { get; set; }

    }
}