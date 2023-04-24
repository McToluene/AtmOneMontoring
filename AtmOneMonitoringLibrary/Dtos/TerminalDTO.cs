using System;

namespace AtmOneMonitoringLibrary.Dtos
{
  public class TerminalDTO
  {
    public int? Id { get; set; }
    public string Ip { get; set; }
    public string TerminalId { get; set; }
    public string Title { get; set; }
    public int? VendorId { get; set; }
    public int? BranchId { get; set; }
  }

  public class TerminalForResponsDTO
  {
    public string Ip { get; set; }
    public string TerminalId { get; set; }
    public string Title { get; set; }
    public string Vendor { get; set; }
    public int? VendorId { get; set; }
    public DateTime? OnlineDate { get; set; }
  }

  public class OnlineTerminalDTO
  {
    public string Ip { get; set; }
    public string TerminalId { get; set; }
    public string Vendor { get; set; }
    public DateTime? OnlineDate { get; set; }
  }

  public class TerminalVendor
  {
    public string Ip { get; set; }
    public string TerminalId { get; set; }
  }
}
