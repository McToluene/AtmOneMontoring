using System.Collections.Generic;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Models;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IVendorRepository
  {
    Task<List<VendorDTO>> GetVendors();
    Task<Vendor> AddVendor();
  }
}