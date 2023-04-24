using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class RolePrivilegeRepository : IRolePrivilegeRepository
  {
    private readonly AtmOneMonitorContext dbContext;

    public RolePrivilegeRepository(AtmOneMonitorContext dbContext)
    {
      this.dbContext = dbContext;
    }

    public async Task<List<AccessRightDTO>> GetAccessRight() => await dbContext.AppRolePrivilege.Include(x => x.Role).Include(x => x.Privilege)
       .Select(x => new AccessRightDTO() { RoleId = x.RoleId, PrivilegeId = x.PrivilegeId, RoleName = x.Role.Rolename, PrivilegeName = x.Privilege.Privilege, Add = x.Add, Update = x.Update, View = x.View }).ToListAsync();

    public async Task<int> GetPrivilegeId(string url)
    {
      var appRole = await dbContext.AppPrivilege.FirstOrDefaultAsync(app => app.Url == url);
      return appRole.PrivilegeId;
    }

    public async Task<List<RolePrivilegeDTO>> GetRolePrivilegeRights(int? roleId) =>
      await dbContext.AppRolePrivilege
        .Include(privilege => privilege.Role)
        .Include(privilege => privilege.Privilege)
        .Select(privilege => new RolePrivilegeDTO() { RolePrivilegeId = privilege.RolePrivilegeId, RoleId = privilege.RoleId, PrivilegeId = privilege.Privilege.PrivilegeId, View = privilege.View, Edit = privilege.Update, Add = privilege.Add, Url = privilege.Privilege.Url, RoleName = privilege.Role.Rolename, Privilege = privilege.Privilege.Privilege })
        .Where(privilege => privilege.RoleId == roleId)
        .ToListAsync();

    public async Task<List<RolePrivilegeDTO>> GetRolePrivilegeRights(int? roleId, int? privilegeId) => 
      await dbContext.AppRolePrivilege
      .Include(privilege => privilege.Role)
      .Include(privilege => privilege.Privilege)
      .Select(privilege => new RolePrivilegeDTO() { RolePrivilegeId = privilege.RolePrivilegeId, RoleId = privilege.RoleId, PrivilegeId = privilege.Privilege.PrivilegeId, View = privilege.View, Edit = privilege.Update, Add = privilege.Add, Url = privilege.Privilege.Url, RoleName = privilege.Role.Rolename, Privilege = privilege.Privilege.Privilege })
      .Where(privilege => privilege.RoleId == roleId)
      .Where(privilege => privilege.PrivilegeId == privilegeId)
      .ToListAsync();


    public Task<RolePrivilegeDTO> GetRolePrivileges()
    {
      throw new NotImplementedException();
    }

    public Task<RolePrivilegeDTO> GetRolePrivilgeRights()
    {
      throw new NotImplementedException();
    }

    public async Task<bool> UpdateAccessRights(List<AccessRightDTO> accessRights)
    {
      bool message = false;
      if (accessRights.Count > 0)
      {
        foreach (var accessRight in accessRights)
        {
          message = await UpdateAccessRight(accessRight);
        }
      }
      return message;
    }

    public async Task<bool> UpdateAccessRight(AccessRightDTO accessRight)
    {
      AppRolePrivilege value = await dbContext.AppRolePrivilege.Include(x => x.Role).Include(x => x.Privilege).Where(access => access.RoleId == accessRight.RoleId && access.PrivilegeId == accessRight.PrivilegeId).FirstOrDefaultAsync();
      if (value == null)
        return false;
      
      value.Add = accessRight.Add;
      value.Update = accessRight.Update;
      value.View = accessRight.View;
      await dbContext.SaveChangesAsync();
      return true;
    }
  }
}
