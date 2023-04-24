
namespace AtmOneMonitoringLibrary.Dtos
{
  public class IssueDTO
  {
    public string TerminalID { get; set; }
    public string Ip { get; set; }
    public string Title { get; set; }
    public string IncidentDate { get; set; }
    public string UpdatedDate { get; set; }
    public string Status { get; set; }
    public string MsgCat { get; set; }
  }
}