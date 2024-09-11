namespace ERAS.Server.Models
{
    public class EquipmentAddEditModel
    {
        public string Name { get; set; }
        public string? Alias { get; set; }
        public int VncId { get; set; }
        public int AreaId { get; set; }
        public int EquipmentModelId { get; set; }
        public IFormFile? Image { get; set; }
    }
}
