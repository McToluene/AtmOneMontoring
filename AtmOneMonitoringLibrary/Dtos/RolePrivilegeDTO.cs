namespace AtmOneMonitoringLibrary.Dtos
{
  public class RolePrivilegeDTO
  {
    public int RolePrivilegeId { get; set; }
    public int PrivilegeId { get; set; }
    public string Privilege { get; set; }
    public int? RoleId { get; set; }
    public string RoleName { get; set; }
    public bool? Add { get; set; }
    public bool? View { get; set; }
    public bool? Edit { get; set; }
    public string Url { get; set; }
    public bool Denied { get; set; }
  }
}
