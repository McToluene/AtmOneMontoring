using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using AtmOneMonitorMVC.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AtmOneMonitorMVC.Controllers
{
  [Authorize("LicenseInfoPolicy")]
  [Route("api/[controller]")]
  [ApiController]
  public class LicenseController : ControllerBase
  {
    private readonly ILicenseInfoRepository licenseInfoRepository;
    private readonly IAppDatGeneratorRepository appDatGeneratorRepository;
    private readonly IActionContextAccessor accessor;
    private readonly IRolePrivilegeRepository rolePrivilegeRepository;
    private readonly IAuditTrailRepository auditTrailRepository;

    private const string URL = "licenseinfo";

    public LicenseController(ILicenseInfoRepository licenseInfoRepository, IAppDatGeneratorRepository appDatGeneratorRepository, IActionContextAccessor accessor, IRolePrivilegeRepository rolePrivilegeRepository, IAuditTrailRepository auditTrailRepository)
    {
      this.licenseInfoRepository = licenseInfoRepository;
      this.appDatGeneratorRepository = appDatGeneratorRepository;
      this.rolePrivilegeRepository = rolePrivilegeRepository;
      this.auditTrailRepository = auditTrailRepository;
      this.accessor = accessor;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
      string licenseInfo = await GetCount();
      if (string.IsNullOrEmpty(licenseInfo))
        licenseInfo = "0";
      int used = await appDatGeneratorRepository.GetUsedCount();

      LicenseInfo license = new LicenseInfo(used.ToString(), licenseInfo);
      var response = new Response<LicenseInfo>(license);
      return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(string info)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid) || !HttpContext.User.HasClaim(claim => claim.Type == "RoleId"))
        return Unauthorized();

      if (!string.IsNullOrEmpty(info) && info.Length > 20)
      {
        string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
        string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ScopeId.ToString();
        int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);

        bool result = await licenseInfoRepository.Add(info);
        if (result)
        {
          string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;
          AppAudit auditTrail = new AppAudit() { Action = "Add", SysIp = ip, UserId = int.Parse(userId), PrivilegeId = privilegeId, LogDate = DateTime.Now };
          await auditTrailRepository.Add(auditTrail);
        }

        var response = new Response<bool>(result);
        return Ok(response);
      }

      else
      {
        var response = new Response<bool>(false)
        {
          Succeeded = false,
          Message = "Wrong License Data"
        };

        return Ok(response);
      }
    }

    private async Task<string> GetCount()
    {
      string rawInfo = await licenseInfoRepository.Get();
      string[] info = rawInfo.Split(new[] { ',', ';', '_' }, StringSplitOptions.RemoveEmptyEntries);
      if (info.Length > 1)
        return info[0].Trim();
      else
        return rawInfo.Trim();
    }
  }
}
