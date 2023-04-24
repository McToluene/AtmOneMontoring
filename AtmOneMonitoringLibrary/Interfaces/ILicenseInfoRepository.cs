using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface ILicenseInfoRepository
  {
    Task<string> Get();
    Task<bool> Add(string info);
  }
}
