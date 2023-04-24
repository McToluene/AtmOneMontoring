using System;

namespace AtmOneMonitoringLibrary.Models
{
  public partial class Terminal
  {
    public int Id { get; set; }
    public string Ip { get; set; }
    public string Terminalid { get; set; }
    public string Title { get; set; }
    public int? Vendorid { get; set; }
    public int? BranchId { get; set; }
    public DateTime? OnlineDate { get; set; }
    public DateTime? Createddate { get; set; }
    public DateTime? Updateddate { get; set; }
    public virtual Vendor Vendor { get; set; }
  }
}
