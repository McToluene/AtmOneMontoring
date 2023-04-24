using System;
using System.Collections.Generic;

namespace AtmOneMonitoringLibrary.Models
{
    public partial class Branch
    {
        public int BranchId { get; set; }
        public string BranchCode { get; set; }
        public string BranchName { get; set; }
        public string Emails { get; set; }
    }
}
