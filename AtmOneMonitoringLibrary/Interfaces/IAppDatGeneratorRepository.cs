using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IAppDatGeneratorRepository
  {
    Task<int> GetUsedCount();
    Task<string[]> GetList(int licenseCount);
  }
}
