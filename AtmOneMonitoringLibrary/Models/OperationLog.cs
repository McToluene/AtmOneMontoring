using System;

namespace AtmOneMonitoringLibrary.Models
{
  public partial class OperationLog
  {
    public int Logid { get; set; }
    public string Ip { get; set; }
    public string LogMsg { get; set; }
    public byte[] ImgBytes { get; set; }
    public DateTime? IncidentDate { get; set; }
  }
}
