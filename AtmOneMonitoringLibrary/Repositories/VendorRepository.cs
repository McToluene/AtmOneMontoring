using System.Collections.Generic;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class VendorRepository : IVendorRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    public VendorRepository(AtmOneMonitorContext atmOneMonitorDashBoardContext)
    {
      dbContext = atmOneMonitorDashBoardContext;
    }
    public Task<Vendor> AddVendor()
    {
      throw new System.NotImplementedException();
    }

    public async Task<List<VendorDTO>> GetVendors() => await dbContext.Vendor.Select(vendor => new VendorDTO() { Vendor = vendor.Vendor1, VendorId = vendor.VendorId }).ToListAsync();
  }
}