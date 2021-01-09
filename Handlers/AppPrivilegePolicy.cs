using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace AtmOneMonitorMVC.Handlers
{
  public class AppPrivilegePolicy : IAuthorizationRequirement
  {
    public readonly string url;
    public AppPrivilegePolicy(string url)
    {
      this.url = url;
    }
  }

  public class AppPrivilegePolicyHandler : AuthorizationHandler<AppPrivilegePolicy>
  {
    //private const string URL = "audittrail.aspx";
    private readonly IRolePrivilegeRepository rolePrivilegeRepository;

    public AppPrivilegePolicyHandler(IRolePrivilegeRepository rolePrivilegeRepository)
    {
      this.rolePrivilegeRepository = rolePrivilegeRepository;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, AppPrivilegePolicy requirement)
    {
      if (!context.User.HasClaim(claim => claim.Type == "RoleId"))
      {
        context.Fail();
        return;
      };

      var user = context.User;
      string roleIdString = user.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      if (int.TryParse(roleIdString, out int roleId))
      {
        bool isDenied = await IsDenied(roleId, requirement.url);
        if (isDenied)
          context.Fail();
        else
          context.Succeed(requirement);
      }
      return;
    }

    private async Task<bool> IsDenied(int roleId, string url)
    {
      bool isDenied = true;
      List<RolePrivilegeDTO> rolePrivileges = await rolePrivilegeRepository.GetRolePrivilegeRights(roleId);
      foreach (RolePrivilegeDTO rolePrivilege in rolePrivileges)
      {
        if (string.IsNullOrEmpty(rolePrivilege.Url)) continue;
        if (url.ToLower().Contains(rolePrivilege.Url))
        {
          isDenied = false;
          break;
        }
      }
      return isDenied;
    }
  }
}