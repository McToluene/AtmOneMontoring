using AtmOneMonitoringLibrary.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IRoleRepository
  {
    Task<List<RoleDTO>> GetRoles();
  }
}
