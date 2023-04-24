using System;
using System.Collections.Generic;

namespace AtmOneMonitoringLibrary.Dtos
{
  public class TerminalConfigurationDTO
  {
    public int? ConfigId { get; set; }
    public int? VendorConfigId { get; set; }
    public string AppId { get; set; }
    public string Ip { get; set; }
    public string Vendor { get; set; }
    public string ImagePath { get; set; }
    public bool? ManageCapturing { get; set; }

  }

  public class TerminalConfigurationCreateDTO
  {
    public int? VendorConfigId { get; set; }
    public int? VendorId { get; set; }
    public double? ImageBrightness { get; set; }
    public double? NightSensitivity { get; set; }
    public bool? ManageCapturing { get; set; }
    public double? EscalationDelayTimeInMin { get; set; }
    public bool? SendAlert { get; set; }
    public int? Debuglevel { get; set; }
    public bool? IntelliCamEnabled { get; set; }
    public string ValidationMode { get; set; }
    public List<TerminalVendor> SelectedTerminals { get; set; }
  }

  public class TerminalConfigApprovalDTO
  {
    public int? ConfigId { get; set; }
    public string Ip { get; set; }
    public string VendorName { get; set; }
    public string TerminalId { get; set; }
    public string EjectMode { get; set; }
    public string ValidationMode { get; set; }
    public bool? IntelliCamEnabled { get; set; }
    public bool? ManageCapturing { get; set; }
    public double? ImageBrightness { get; set; }
    public double? NightSensitivity { get; set; }
    public bool? Approved { get; set; }
  }

  public class ApproveTerminal
  {
    public int ConfigId { get; set; }
    public string VendorName { get; set; }
    public string VendorConfigName { get; set; }
    public double? ImageBrightness { get; set; }
    public double? NightSensitivity { get; set; }
    public bool? ManageCapturing { get; set; }
    public bool? SendAlert { get; set; }
    public string EjectMode { get; set; }
    public bool? IntelliCamEnabled { get; set; }
    public string ValidationMode { get; set; }
    public string Ip { get; set; }
    public double? EscalationDelayTimeInMin { get; set; }
    public string ImagePath { get; set; }
    public string EjPath { get; set; }
    public string UpdatedBy { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public string TerminalId { get; set; }
  }

  public class ApproveDTO
  {
    public int ConfigId { get; set; }
    public string TerminalId { get; set; }
  }
}
