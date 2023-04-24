using System;
using System.Collections.Generic;

namespace AtmOneMonitoringLibrary.Models
{
    public partial class VwAlert
    {
        public string TerminalId { get; set; }
        public string Title { get; set; }
        public string Ip { get; set; }
        public string MsgCat { get; set; }
        public string Message { get; set; }
        public DateTime? ADate { get; set; }
        public DateTime? IncidentDate { get; set; }
        public DateTime? UDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public int? StatusId { get; set; }
        public string Status { get; set; }
        public bool? Sent { get; set; }
        public string AppId { get; set; }
    }
}
