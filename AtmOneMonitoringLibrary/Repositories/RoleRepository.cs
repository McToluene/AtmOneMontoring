using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class RoleRepository : IRoleRepository
  {
    private readonly AtmOneMonitorContext dbContext;

    public RoleRepository(AtmOneMonitorContext dbContext)
    {
      this.dbContext = dbContext;
    }
    public async Task<List<RoleDTO>> GetRoles() => await dbContext.AppRole.Include(role => role.AppRolePrivilege).Select(role => new RoleDTO() { Rolename = role.Rolename, Id = role.RoleId, Privilege = role.AppRolePrivilege.Select(privilege => new PrivilegeDTO() { Id = privilege.PrivilegeId, Privilege = privilege.Privilege.Privilege }).ToList() }).ToListAsync();
 
  }
}
