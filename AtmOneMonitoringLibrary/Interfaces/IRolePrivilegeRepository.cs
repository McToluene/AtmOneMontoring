using AtmOneMonitoringLibrary.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IRolePrivilegeRepository
  {
    Task<RolePrivilegeDTO> GetRolePrivileges();
    Task<List<RolePrivilegeDTO>> GetRolePrivilegeRights(int? roleId);
    Task<RolePrivilegeDTO> GetRolePrivilgeRights();
    Task<List<RolePrivilegeDTO>> GetRolePrivilegeRights(int? roleId, int? privilegeId);
    Task<int> GetPrivilegeId(string id);
    Task<bool> UpdateAccessRights(List<AccessRightDTO> accessRights);
    Task<List<AccessRightDTO>> GetAccessRight();
  }
}
