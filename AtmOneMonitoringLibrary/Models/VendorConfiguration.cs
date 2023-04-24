using System;
using System.Collections.Generic;

namespace AtmOneMonitoringLibrary.Models
{
    public partial class VendorConfiguration
    {
        public VendorConfiguration()
        {
            TerminalConfig = new HashSet<TerminalConfig>();
        }

        public int VendorConfigId { get; set; }
        public string VendorConfigName { get; set; }
        public string AppId { get; set; }
        public int? VendorId { get; set; }
        public string ImagePath { get; set; }
        public string ImageFilter { get; set; }
        public string AtmlogPath { get; set; }
        public string AtmlogFilter { get; set; }
        public string EjPath { get; set; }
        public string EjFilter { get; set; }
        public string EjectMode { get; set; }
        public string EventsExclude { get; set; }
        public bool? FwsControl { get; set; }
        public int? WniServiceTimeout { get; set; }
        public string RemotePort { get; set; }
        public string RemoteIp { get; set; }

        public virtual Vendor Vendor { get; set; }
        public virtual ICollection<TerminalConfig> TerminalConfig { get; set; }
    }
}
