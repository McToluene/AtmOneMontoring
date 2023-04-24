using System;

namespace AtmOneMonitoringLibrary.Dtos
{
  public class OperationLogDTO
  {
    public string TerminalId { get; set; }
    public string Ip { get; set; }
    public string LogMsg { get; set; }
    public string IncidentDate { get; set; }
  }

  public class TerminalLogDTO
  {
    public int LogId { get; set; }
    public string Ip { get; set; }
    public string TerminalID { get; set; }
    public string LogMsg { get; set; }
    public byte[] ImgBytes { get; set; }
    public DateTime? IncidentDate { get; set; }
  }
}
