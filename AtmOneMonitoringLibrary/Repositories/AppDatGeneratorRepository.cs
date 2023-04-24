using AtmOneMonitoringLibrary.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class AppDatGeneratorRepository : IAppDatGeneratorRepository
  {
    private readonly ITerminalRepository terminalRepository;
    public AppDatGeneratorRepository(ITerminalRepository terminalRepository)
    {
      this.terminalRepository = terminalRepository;
    }
    public async Task<string[]> GetList(int licenseCount)
    {
      List<string> ips = new List<string>();
      List<string> atms =  await terminalRepository.GetAllIp();
      foreach(var atm in atms)
      {
        if (ips.Count < licenseCount)
          ips.Add(atm);
      }
      return ips.ToArray();
    }

    public async Task<int> GetUsedCount() => await terminalRepository.GetIpCount();
  
  }
}
