using System.ComponentModel.DataAnnotations;

namespace ERAS.Server.Models
{
    public class EquipmentAddEditModel
    {
        public required string Name { get; set; }
        public string? Alias { get; set; }
        public required string HostName { get; set; }
        public required string IpAddress { get; set; }
        public required string VncUserName { get; set; }
        public required string VncPassword { get; set; }
        public int VncId { get; set; }
        public int AreaId { get; set; }
        public int EquipmentModelId { get; set; }
        public IFormFile? Image { get; set; }
    }
}
