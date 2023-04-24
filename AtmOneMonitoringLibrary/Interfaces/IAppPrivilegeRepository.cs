using System.Collections.Generic;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Models;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IAppPrivilegeRepository
  {
    Task<List<PrivilegeDTO>> GetPrivileges();
    Task<List<AppPrivilege>> GetRolePrivileges(int? role);
    Task<bool> AddRolePrivilege(RoleAddRemoveDTO role);
    Task<bool> UpdateRolePrivilege(RoleUpdatePrivilegeDTO role);
    Task<bool> RemoveRolePrivilege(RoleAddRemoveDTO role);
    Task<bool> AddRolPrivileges(RolePrivilegeForAddDTO rolePrivileges);
  }
}