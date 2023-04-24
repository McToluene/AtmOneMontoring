using System;

namespace AtmOneMonitoringLibrary.Dtos
{
  public class ConfigurationApprovalDTO
  {
    public int ConfigApprovalId { get; set; }
    public int? ConfigId { get; set; }
    public int? UpdatedBy { get; set; }
    public int? ApprovedBy { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public bool? Approved { get; set; }
  }
}
