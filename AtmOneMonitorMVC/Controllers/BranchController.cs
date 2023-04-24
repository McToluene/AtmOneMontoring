using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using AtmOneMonitoringLibrary.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using AtmOneMonitorMVC.Dtos;
using AtmOneMonitorMVC.Models;
using AtmOneMonitorMVC.Helpers;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Models;
using System;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Security.Claims;
using System.Linq;
using System.IO;
using CsvHelper;

namespace AtmOneMonitorMVC.Controllers
{

  [Route("api/[controller]")]
  [ApiController]
  public class BranchController : ControllerBase
  {
    private readonly IBranchRepository branchRepository;
    private readonly IUriService uriService;
    private readonly IAuditTrailRepository auditTrailRepository;
    private readonly IActionContextAccessor accessor;
    private readonly IRolePrivilegeRepository rolePrivilegeRepository;
    private const string URL = "addbranch";

    public BranchController(IBranchRepository branchRepository, IActionContextAccessor accessor, IUriService uriService, IAuditTrailRepository auditTrailRepository, IRolePrivilegeRepository rolePrivilegeRepository)
    {
      this.branchRepository = branchRepository;
      this.uriService = uriService;
      this.auditTrailRepository = auditTrailRepository;
      this.accessor = accessor;
      this.rolePrivilegeRepository = rolePrivilegeRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetBranches()
    {
      List<Branch> branches = await branchRepository.GetBranches();

      var response = new Response<List<Branch>>(branches);
      return Ok(response);
    }

    [Authorize("BranchPolicy")]
    [HttpGet("search")]
    public async Task<IActionResult> GetBranches([FromQuery] ItemValueSearch itemValueSearch)
    {
      List<Branch> branches = await branchRepository.GetBranches(itemValueSearch.Item, itemValueSearch.Value);

      var response = new Response<List<Branch>>(branches);
      return Ok(response);
    }

    [Authorize("BranchPolicy")]
    [HttpGet("paging")]
    public async Task<IActionResult> GetBranches([FromQuery] PaginationFilter paginationFilter)
    {
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(paginationFilter.PageNumber, paginationFilter.PageSize);
      List<Branch> branches = await branchRepository.GetBranches(validFilter.PageNumber, validFilter.PageSize);
      int totalRecords = await branchRepository.TotalRecords();

      var response = PaginationHelper.CreatePageResponse(branches, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [Authorize("BranchPolicy")]
    [HttpGet("paging/search")]
    public async Task<IActionResult> GetBranches([FromQuery] ItemValueFilter itemValueFilter)
    {
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(itemValueFilter.PageNumber, itemValueFilter.PageSize);
      List<Branch> branches = await branchRepository.GetBranches(itemValueFilter.Item, itemValueFilter.Value, validFilter.PageNumber, validFilter.PageSize);
      int totalRecords = await branchRepository.TotalRecords(itemValueFilter.Item, itemValueFilter.Value);

      var response = PaginationHelper.CreatePageResponse(branches, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [Authorize("BranchPolicy")]
    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] ItemValueSearch itemValueSearch)
    {
      List<Branch> branches;
      if (!string.IsNullOrEmpty(itemValueSearch.Item) && !string.IsNullOrEmpty(itemValueSearch.Value))
        branches = await branchRepository.GetBranches(itemValueSearch.Item, itemValueSearch.Value);
      else
        branches = await branchRepository.GetBranches();

      if (branches == null)
        return NoContent();
      return ExportBranches(branches);
    }

    [Authorize("BranchPolicy")]
    [HttpPost]
    public async Task<IActionResult> AddBranch(BranchDTO branch)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid))
        return Unauthorized();

      string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      var privilege = await GetPrivilege(int.Parse(roleIdString), URL);

      if (privilege.Add != true)
        return Unauthorized();

      string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ToString();
      int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);
      bool result = await branchRepository.AddBranch(branch);

      if (result)
      {
        string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;
        AppAudit auditTrail = new AppAudit() { Action = "Create", SysIp = ip, UserId = int.Parse(userId), PrivilegeId = privilegeId, LogDate = DateTime.Now };
        await auditTrailRepository.Add(auditTrail);
      }
      var response = new Response<bool>(result);
      return Ok(response);
    }

    [HttpPost("list")]
    public async Task<IActionResult> AddBranch(List<BranchDTO> branches)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid))
        return Unauthorized();

      string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      var privilege = await GetPrivilege(int.Parse(roleIdString), URL);

      if (privilege.Add != true)
        return Unauthorized();

      string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ToString();
      int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);
      bool result = await branchRepository.AddBranch(branches);

      if (result)
      {
        string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;
        AppAudit auditTrail = new AppAudit() { Action = "Create", SysIp = ip, UserId = int.Parse(userId), PrivilegeId = privilegeId, LogDate = DateTime.Now };
        await auditTrailRepository.Add(auditTrail);
      }
      var response = new Response<bool>(result);
      return Ok(response);
    }

    [Authorize("BranchPolicy")]
    [HttpPut]
    public async Task<IActionResult> UpdateBranch(BranchDTO branch)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid) || !HttpContext.User.HasClaim(claim => claim.Type == "RoleId"))
        return Unauthorized();

      string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      var privilege = await GetPrivilege(int.Parse(roleIdString), URL);

      if (privilege.Edit != true)
        return Unauthorized();

      string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ToString();
      int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);

      var oldBranch = await branchRepository.GetBranch(branch.BranchId);

      bool result = await branchRepository.Update(branch);
      if (result)
      {
        string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;
        string oldValues = $"BranchName={oldBranch.BranchName}\r\nBranchCode={oldBranch.BranchCode}\r\nEmails={oldBranch.Emails}";
        string newValues = $"BranchName={branch.BranchName}\r\nBranchCode={branch.BranchCode}\r\nEmails={branch.Emails}";
        AppAudit auditTrail = new AppAudit()
        {
          Action = "Update",
          SysIp = ip,
          UserId = int.Parse(userId),
          PrivilegeId = privilegeId,
          LogDate = DateTime.Now,
          OldValues = oldValues,
          NewValues = newValues,

        };
        await auditTrailRepository.Add(auditTrail);
      }
      var response = new Response<bool>(result);
      return Ok(response);
    }

    [Authorize("BranchPolicy")]
    [HttpGet("detail")]
    public async Task<IActionResult> GetDetails([FromQuery] int id)
    {
      BranchDTO branch = await branchRepository.GetBranch(id);
      var response = new Response<BranchDTO>(branch);
      return Ok(response);
    }

    private async Task<RolePrivilegeDTO> GetPrivilege(int roleId, string url)
    {
      RolePrivilegeDTO role = new RolePrivilegeDTO();
      List<RolePrivilegeDTO> rolePrivileges = await rolePrivilegeRepository.GetRolePrivilegeRights(roleId);
      foreach (RolePrivilegeDTO rolePrivilege in rolePrivileges)
      {
        if (string.IsNullOrEmpty(rolePrivilege.Url)) continue;
        if (url.ToLower().Contains(rolePrivilege.Url))
        {
          role = rolePrivilege;
          break;
        }
      }
      return role;
    }

    //private IActionResult GenerateFile(List<Branch> branches)
    //{
    //  using var workbook = new XLWorkbook();
    //  var worksheet = workbook.Worksheets.Add("Branches");
    //  var currentRow = 1;

    //  worksheet.Cell(currentRow, 1).Value = "Branch Code";
    //  worksheet.Cell(currentRow, 2).Value = "Branch Name";
    //  worksheet.Cell(currentRow, 3).Value = "Emails";

    //  foreach (var branch in branches)
    //  {
    //    currentRow++;
    //    worksheet.Cell(currentRow, 1).Value = branch.BranchCode;
    //    worksheet.Cell(currentRow, 2).Value = branch.BranchName;
    //    worksheet.Cell(currentRow, 3).Value = branch.Emails;
    //  }

    //  using var stream = new MemoryStream();
    //  workbook.SaveAs(stream);
    //  var content = stream.ToArray();
    //  return File(content, "appplication/vnd.openxmlformats.officedocument.spreadsheetml.sheet", "Branches.xlsx");
    //}

    private FileStreamResult ExportBranches(List<Branch> branches)
    {
      var result = WriteCsvToMemory(branches);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "Branches.csv" };
    }

    private byte[] WriteCsvToMemory(List<Branch> branches)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(branches);
      streamWriter.Flush();
      return memoryStream.ToArray();
    }
  }
}