using System;

namespace AtmOneMonitoringLibrary.Models
{
  public partial class TerminalConfig
    {
        public int ConfigId { get; set; }
        public int? Id { get; set; }
        public int? VendorConfigId { get; set; }
        public double? ImageBrightness { get; set; }
        public double? NightSensitivity { get; set; }
        public bool? ManageCapturing { get; set; }
        public double? EscalationDelayTimeInMin { get; set; }
        public bool? Facedetect { get; set; }
        public bool? SendAlert { get; set; }
        public int? Debuglevel { get; set; }
        public bool? IntelliCamEnabled { get; set; }
        public bool? ExcludeFaceForNight { get; set; }
        public string ValidationMode { get; set; }
        public bool? Configloaded { get; set; }
        public DateTime? Updateddate { get; set; }

        public virtual VendorConfiguration VendorConfig { get; set; }
    }
}
