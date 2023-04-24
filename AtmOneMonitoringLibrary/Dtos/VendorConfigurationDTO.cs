namespace AtmOneMonitoringLibrary.Dtos
{
  public class VendorConfigurationDTO
  {
    public int VendorConfigId { get; set; }
    public string VendorConfigName { get; set; }
    public string AppId { get; set; }
    public string VendorName { get; set; }
    public string ImagePath { get; set; }
    public string ImageFilter { get; set; }
    public string AtmLogPath { get; set; }
    public string AtmLogFilter { get; set; }
    public string EjectMode { get; set; }
  }

  public class VendorConfigurationCreateDTO
  {
    public int VendorConfigId { get; set; }
    public string VendorConfigName { get; set; }
    public string AppId { get; set; }
    public int? VendorId { get; set; }
    public string ImagePath { get; set; }
    public string ImageFilter { get; set; }
    public string AtmLogPath { get; set; }
    public string AtmLogFilter { get; set; }
    public string EjPath { get; set; }
    public string EjFilter { get; set; }
    public string EjectMode { get; set; }
    public string EventsExclude { get; set; }
    public int? WniServiceTimeout { get; set; }
    public string RemotePort { get; set; }
    public string RemoteIp { get; set; }
  }
}
