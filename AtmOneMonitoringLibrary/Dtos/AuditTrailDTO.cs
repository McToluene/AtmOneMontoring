

using System;

namespace AtmOneMonitoringLibrary.Dtos
{
  public class AuditTrailDTO
  {
    public long AuditId { get; set; }
    public int? PrivilegeId { get; set; }
    public string Activity { get; set; }
    public int? UserId { get; set; }
    public string Action { get; set; }
    public string SysIp { get; set; }
    public string UserName { get; set; }
    public DateTime? LogDate { get; set; }
  }

  public class AuditTrailDetailDTO : AuditTrailDTO
  {
    public string OldValues { get; set; }
    public string NewValues { get; set; }
    public string SysName { get; set; }
  }
}
