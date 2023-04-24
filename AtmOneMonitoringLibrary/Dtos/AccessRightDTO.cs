namespace AtmOneMonitoringLibrary.Dtos
{
  public class AccessRightDTO
  {
    public int? RoleId { get; set; }
    public int? PrivilegeId { get; set; }
    public string RoleName { get; set; }
    public string PrivilegeName { get; set; }
    public bool? Add { get; set; }
    public bool? Update { get; set; }
    public bool? View { get; set; }
  }
}