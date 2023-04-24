namespace AtmOneMonitoringLibrary.Models
{
  public partial class AppRolePrivilege
  {
    public int RolePrivilegeId { get; set; }
    public int? PrivilegeId { get; set; }
    public int? RoleId { get; set; }
    public bool? Add { get; set; }
    public bool? Update { get; set; }
    public bool? View { get; set; }
    public virtual AppPrivilege Privilege { get; set; }
    public virtual AppRole Role { get; set; }
  }
}
