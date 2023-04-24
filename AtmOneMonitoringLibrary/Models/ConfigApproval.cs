using System;

namespace AtmOneMonitoringLibrary.Models
{
  public partial class ConfigApproval
  {
    public int ConfigApprovalId { get; set; }
    public int? ConfigId { get; set; }
    public int? UpdatedBy { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public int? ApprovedBy { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public bool? Approved { get; set; }
  }
}
