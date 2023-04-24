using System.Collections.Generic;

namespace AtmOneMonitoringLibrary.Models
{
  public partial class Vendor
  {
    public Vendor()
    {
      Terminal = new HashSet<Terminal>();
      VendorConfiguration = new HashSet<VendorConfiguration>();
    }
    public int VendorId { get; set; }
    public string Vendor1 { get; set; }
    public virtual ICollection<Terminal> Terminal { get; set; }
    public virtual ICollection<VendorConfiguration> VendorConfiguration { get; set; }
  }
}
