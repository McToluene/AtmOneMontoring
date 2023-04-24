using System;

namespace AtmOneMonitoringLibrary.Models
{
  public partial class AppAudit
  {
    public long AuditId { get; set; }
    public int? PrivilegeId { get; set; }
    public int? UserId { get; set; }
    public string OldValues { get; set; }
    public string NewValues { get; set; }
    public string Action { get; set; }
    public string SysIp { get; set; }
    public string SysName { get; set; }
    public DateTime? LogDate { get; set; }
    public virtual AppPrivilege Privilege { get; set; }
    public virtual AppUser User { get; set; }
  }
}
