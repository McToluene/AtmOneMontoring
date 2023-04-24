using System.Collections.Generic;

namespace AtmOneMonitoringLibrary.Models
{
  public partial class AppPrivilege
  {
    public AppPrivilege()
    {
      AppAudit = new HashSet<AppAudit>();
      AppRolePrivilege = new HashSet<AppRolePrivilege>();
    }
    public int PrivilegeId { get; set; }
    public string Privilege { get; set; }
    public string Url { get; set; }
    public virtual ICollection<AppAudit> AppAudit { get; set; }
    public virtual ICollection<AppRolePrivilege> AppRolePrivilege { get; set; }
  }
}
