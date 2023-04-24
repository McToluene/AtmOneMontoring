namespace AtmOneMonitorMVC.Models
{
  public class AuditFilter
  {
    public string DateFrom { get; set; }
    public string DateTo { get; set; }
    public int UserId { get; set; }
    public int PrivilegeId { get; set; }
  }
}
