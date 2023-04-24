using AtmOneMonitoringLibrary.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IVendorConfigRepository
  {
    Task<int> GetConfigId(int? vendorId);
    Task<bool> Add(VendorConfigurationCreateDTO vendorConfigurationCreate);
    Task<bool> Update(VendorConfigurationCreateDTO vendorConfigurationCreate);
    Task<List<VendorConfigurationDTO>> Get();
    Task<List<VendorConfigurationDTO>> Get(string item, string value);
    Task<List<VendorConfigurationDTO>> Get(int pageNumber, int pageSize);
    Task<int> TotalRecords();
    Task<List<VendorConfigurationDTO>> Get(string item, string value, int pageNumber, int pageSize);
    Task<int> TotalRecords(string item, string value);
    Task<VendorConfigurationCreateDTO> Get(int id);
    Task<bool> Update(VendorConfigurationCreateDTO vendorConfiguration, int userId, bool configloaded);
  }
}
