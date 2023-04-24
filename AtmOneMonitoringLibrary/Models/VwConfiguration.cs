namespace AtmOneMonitoringLibrary.Models
{
  public partial class VwConfiguration
  {
    public int ConfigId { get; set; }
    public int VendorConfigId { get; set; }
    public string VendorConfigName { get; set; }
    public string AppId { get; set; }
    public int Id { get; set; }
    public string Terminalid { get; set; }
    public string Ip { get; set; }
    public int? VendorId { get; set; }
    public string ImagePath { get; set; }
    public string ImageFilter { get; set; }
    public string AtmlogPath { get; set; }
    public string AtmlogFilter { get; set; }
    public string EventsExclude { get; set; }
    public bool? FwsControl { get; set; }
    public int? WniServiceTimeout { get; set; }
    public string RemotePort { get; set; }
    public double? ImageBrightness { get; set; }
    public double? NightSensitivity { get; set; }
    public bool? ManageCapturing { get; set; }
    public string EjectMode { get; set; }
    public double? EscalationDelayTimeInMin { get; set; }
    public bool? Facedetect { get; set; }
    public bool? SendAlert { get; set; }
    public int? Debuglevel { get; set; }
    public string RemoteIp { get; set; }
    public string EjPath { get; set; }
    public string EjFilter { get; set; }
    public bool? IntelliCamEnabled { get; set; }
    public bool? ExcludeFaceForNight { get; set; }
    public string ValidationMode { get; set; }
    public bool? Configloaded { get; set; }
  }
}
