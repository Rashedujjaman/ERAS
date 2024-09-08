using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ERAS.Server.Models
{
    public class Area
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Alias { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTimeOffset? DateCreated { get; set; }
        public DateTimeOffset? DateModified { get; set; }
        public int? UserCreatedId { get; set; }
        public int? UserModifiedId { get; set; }

        [ForeignKey("UserCreatedId")]
        public virtual ApplicationUser? UserCreated { get; set; }
        [ForeignKey("UserModifiedId")]
        public virtual ApplicationUser? UserModified { get; set; }
    }
}