using System;

namespace AtmOneMonitoringLibrary.Models
{
  public partial class Alert
  {
    public int AlertId { get; set; }
    public string Ip { get; set; }
    public string AppId { get; set; }
    public string MsgCat { get; set; }
    public string Message { get; set; }
    public int? StatusId { get; set; }
    public DateTime? ADate { get; set; }
    public DateTime? UDate { get; set; }
    public bool? Sent { get; set; }
    public bool? ReportSent { get; set; }
    public bool? BranchSent { get; set; }
  }
}
