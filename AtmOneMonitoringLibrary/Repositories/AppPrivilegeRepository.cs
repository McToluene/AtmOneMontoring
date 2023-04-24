using System.Collections.Generic;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using AtmOneMonitoringLibrary.Dtos;
using System;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class AppPrivilegeRepository : IAppPrivilegeRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    public AppPrivilegeRepository(AtmOneMonitorContext dbContext)
    {
      this.dbContext = dbContext;
    }

    public async Task<bool> AddRolePrivilege(RoleAddRemoveDTO role)
    {
      bool message;
      AppRolePrivilege appRolePrivilege = await dbContext.AppRolePrivilege.FirstOrDefaultAsync(approle => approle.PrivilegeId == role.PrivilegeId && approle.RoleId == role.RoleId);
      if (appRolePrivilege == null)
      {
        AppRolePrivilege newAppRolePrivilege = new AppRolePrivilege() { PrivilegeId = role.PrivilegeId, RoleId = role.RoleId };
        await dbContext.AppRolePrivilege.AddAsync(newAppRolePrivilege);
        await dbContext.SaveChangesAsync();
        message = true;
      }
      else message = false;
      return message;
    }

    public async Task<bool> RemoveRolePrivilege(RoleAddRemoveDTO role)
    {
      bool message;
      AppRolePrivilege appRolePrivilege = await dbContext.AppRolePrivilege.FirstOrDefaultAsync(approle => approle.PrivilegeId == role.PrivilegeId && approle.RoleId == role.RoleId);
      if (appRolePrivilege != null)
      {
        dbContext.AppRolePrivilege.Remove(appRolePrivilege);
        await dbContext.SaveChangesAsync();
        message = true;
      }

      else message = false;
      return message;
    }

    public async Task<bool> AddRolPrivileges(RolePrivilegeForAddDTO rolePrivileges)
    {
      bool message = false;
      if (rolePrivileges.RemovedPrivileges.Count > 0)
      {
        foreach (var rolePrivilege in rolePrivileges.RemovedPrivileges)
        {
          await RemoveRolePrivilege(rolePrivilege);
          message = true;
        }
      }

      if (rolePrivileges.RolePrivileges.Count > 0)
      {
        foreach (var rolePrivilege in rolePrivileges.RolePrivileges)
        {
          await AddRolePrivilege(rolePrivilege);
          message = true;
        }
      }
      return message;
    }

    public async Task<List<PrivilegeDTO>> GetPrivileges() => await dbContext.AppPrivilege.Select(privilege => new PrivilegeDTO() { Id = privilege.PrivilegeId, Privilege = privilege.Privilege }).ToListAsync();
    public async Task<List<AppPrivilege>> GetRolePrivileges(int roleID) => await dbContext.AppPrivilege.Where(appRole => appRole.PrivilegeId == roleID).ToListAsync();

    public Task<List<AppPrivilege>> GetRolePrivileges(int? role)
    {
      throw new NotImplementedException();
    }

    public async Task<bool> UpdateRolePrivilege(RoleUpdatePrivilegeDTO role)
    {
      bool message = false;
      AppRolePrivilege appRolePrivilege = await dbContext.AppRolePrivilege.FirstOrDefaultAsync(approle => approle.PrivilegeId == role.PrevPrivilegeId && approle.RoleId == role.RoleId);

      if (appRolePrivilege != null)
      {
        appRolePrivilege.PrivilegeId = role.PrivilegeId;
        dbContext.AppRolePrivilege.Update(appRolePrivilege);
        await dbContext.SaveChangesAsync();
        message = true;
      }
      return message;
    }
  }
}