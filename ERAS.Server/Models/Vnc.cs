using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERAS.Server.Models
{
    public class Vnc
    {
        [Key]
        public int Id { get; set; }

        public required int EquipmentId { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string HostName { get; set; }
        [Required]
        public string IpAddress { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string VncUserName { get; set; }

        [Required]
        [Column(TypeName = "nchar(100)")]
        public string VncPassword { get; set; }

        public bool? Enabled { get; set; }

        public DateTimeOffset? DateCreated { get; set; }

        public DateTimeOffset? DateModified { get; set; }

        [Column(TypeName = "varchar(50)")]
        public int? UserCreated { get; set; }

        [Column(TypeName = "varchar(50)")]
        public int? UserModified { get; set; }
    }
}