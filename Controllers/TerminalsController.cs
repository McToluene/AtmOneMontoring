using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using AtmOneMonitorMVC.Dtos;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Models;
using CsvHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace AtmOneMonitorMVC.Controllers
{
  [Authorize("TerminalPolicy")]
  [Route("api/[controller]")]
  [ApiController]
  public class TerminalsController : ControllerBase
  {
    private readonly ITerminalRepository terminalRepository;
    private readonly IAuditTrailRepository auditTrailRepository;
    private readonly IRolePrivilegeRepository rolePrivilegeRepository;
    private readonly IActionContextAccessor accessor;


    private const string URL = "terminal";
    public TerminalsController(ITerminalRepository terminalRepository, IAuditTrailRepository auditTrailRepository, IRolePrivilegeRepository rolePrivilegeRepository, IActionContextAccessor accessor)
    {
      this.terminalRepository = terminalRepository;
      this.auditTrailRepository = auditTrailRepository;
      this.rolePrivilegeRepository = rolePrivilegeRepository;
      this.accessor = accessor;
    }

    [HttpGet]
    public async Task<IActionResult> GetTerminals([FromQuery] ItemValueSearch search)
    {
      List<TerminalForResponsDTO> terminals;
      if (!string.IsNullOrEmpty(search.Item) && !string.IsNullOrEmpty(search.Value))
        terminals = await terminalRepository.GetAll(search.Item, search.Value);
      else
        terminals = await terminalRepository.GetAll();

      var response = new Response<List<TerminalForResponsDTO>>(terminals);
      return Ok(response);
    }

    //[HttpGet("paging")]
    //public async Task<IActionResult> GetTerminals([FromQuery] ItemValueFilter filter)
    //{
    //  string route = Request.Path.Value;
    //  PaginationFilter validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);

    //  int totalRecords;
    //  List<TerminalForResponsDTO> terminals;
    //  if (!string.IsNullOrEmpty(filter.Item) && !string.IsNullOrEmpty(filter.Value))
    //  {
    //    terminals = await terminalRepository.GetAll(filter.Item, filter.Value, validFilter.PageNumber, validFilter.PageSize);
    //    totalRecords = await terminalRepository.TotalRecords(filter.Item, filter.Value);
    //  }
    //  else
    //  {
    //    terminals = await terminalRepository.GetAll(validFilter.PageNumber, validFilter.PageSize);
    //    totalRecords = await terminalRepository.TotalRecords();
    //  }

    //  var response = PaginationHelper.CreatePageResponse(terminals, validFilter, totalRecords, uriService, route);
    //  return Ok(response);
    //}

    [HttpGet("detail")]
    public async Task<IActionResult> GetTerminal([FromQuery] string id)
    {
      TerminalDTO terminal = await terminalRepository.GetTerminalById(id);
      var response = new Response<TerminalDTO>(terminal);
      return Ok(response);
    }

    [HttpGet("vendor")]
    public async Task<IActionResult> GetTerminal([FromQuery] int VendorId)
    {
      List<TerminalVendor> terminals = await terminalRepository.GetByVendorId(VendorId);
      var response = new Response<List<TerminalVendor>>(terminals);
      return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> AddTerminal(TerminalDTO terminal)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid) || !HttpContext.User.HasClaim(claim => claim.Type == "RoleId"))
        return Unauthorized();

      string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      var privilege = await GetPrivilege(int.Parse(roleIdString), URL);

      if (privilege.Add != true)
        return Unauthorized();

      string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ScopeId.ToString();
      int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);
      bool result = await terminalRepository.Add(terminal);

      if (result)
      {
        string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;
        AppAudit auditTrail = new AppAudit() { Action = "Add", SysIp = ip, UserId = int.Parse(userId), PrivilegeId = privilegeId, LogDate = DateTime.Now };
        await auditTrailRepository.Add(auditTrail);
      }
      var response = new Response<bool>(result);
      return Ok(response);
    }

    [HttpPost("list")]
    public async Task<IActionResult> AddTerminals(List<TerminalDTO> terminals)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid) || !HttpContext.User.HasClaim(claim => claim.Type == "RoleId"))
        return Unauthorized();

      string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      var privilege = await GetPrivilege(int.Parse(roleIdString), URL);

      if (privilege.Add != true)
        return Unauthorized();

      string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ScopeId.ToString();
      int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);
      bool result = await terminalRepository.Add(terminals);

      if (result)
      {
        string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;
        AppAudit auditTrail = new AppAudit() { Action = "Batch Upload", SysIp = ip, UserId = int.Parse(userId), PrivilegeId = privilegeId, LogDate = DateTime.Now };
        await auditTrailRepository.Add(auditTrail);
      }
      var response = new Response<bool>(result);
      return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTerminal(TerminalDTO terminal)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid) || !HttpContext.User.HasClaim(claim => claim.Type == "RoleId"))
        return Unauthorized();

      string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      var privilege = await GetPrivilege(int.Parse(roleIdString), URL);

      if (privilege.Add != true)
        return Unauthorized();

      string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ToString();
      int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);

      var oldTerminal = await terminalRepository.GetById(terminal.Id);

      bool result = await terminalRepository.Update(terminal);

      if (result)
      {
        string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;
        string oldValues = $"TerminalID={oldTerminal.Terminalid}\r\nIP={oldTerminal.Ip}\r\nTitle={oldTerminal.Title}";
        string newValues = $"TerminalID={terminal.TerminalId}\r\nIP={terminal.Ip}\r\nTitle={terminal.Title}";

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

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] ItemValueSearch search)
    {
      List<TerminalForResponsDTO> terminals;
      if (!string.IsNullOrEmpty(search.Item) && !string.IsNullOrEmpty(search.Value))
        terminals = await terminalRepository.GetAll(search.Item, search.Value);
      else
        terminals = await terminalRepository.GetAll();

      return ExportTerminals(terminals);
    }

    //private IActionResult GenerateFile(List<TerminalForResponsDTO> terminals)
    //{
    //  using var workbook = new XLWorkbook();
    //  var worksheet = workbook.Worksheets.Add("Terminals");
    //  var currentRow = 1;

    //  worksheet.Cell(currentRow, 1).Value = "Terminal ID";
    //  worksheet.Cell(currentRow, 2).Value = "IP";
    //  worksheet.Cell(currentRow, 3).Value = "Vendor";
    //  worksheet.Cell(currentRow, 4).Value = "Title";

    //  foreach (var terminal in terminals)
    //  {
    //    currentRow++;
    //    worksheet.Cell(currentRow, 1).Value = terminal.TerminalId;
    //    worksheet.Cell(currentRow, 2).Value = terminal.Ip;
    //    worksheet.Cell(currentRow, 3).Value = terminal.Vendor;
    //    worksheet.Cell(currentRow, 4).Value = terminal.Title;
    //  }
    //  using var stream = new MemoryStream();
    //  workbook.SaveAs(stream);
    //  var content = stream.ToArray();
    //  return File(content, "appplication/vnd.openxmlformats.officedocument.spreadsheetml.sheet", "Terminals.xlsx");
    //}

    private FileStreamResult ExportTerminals(List<TerminalForResponsDTO> terminals)
    {
      var result = WriteCsvToMemory(terminals);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "Terminals.csv" };
    }

    private byte[] WriteCsvToMemory(List<TerminalForResponsDTO> terminals)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(terminals);
      streamWriter.Flush();
      return memoryStream.ToArray();
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
  }
}
