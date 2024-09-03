using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERAS.Server.Models
{
    public class Area
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(50)")]
        public required string Name { get; set; }
        [Column(TypeName = "varchar(50)")]
        [Required]
        public string Alias { get; set; }

        public bool? IsDeleted { get; set; }

        public DateTimeOffset? DateCreated { get; set; }
        public DateTimeOffset? DateModified { get; set; }

        public int? UserCreated { get; set; }
        public int? UserModified { get; set; }
    }
}