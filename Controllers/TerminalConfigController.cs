using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using AtmOneMonitorMVC.Dtos;
using AtmOneMonitorMVC.Helpers;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Models;
using ClosedXML.Excel;
using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace AtmOneMonitorMVC.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class TerminalConfigController : ControllerBase
  {
    private const string URL = "terminalconfiguration";
    private readonly ITerminalConfigRepository terminalConfigRepository;
    private readonly IRolePrivilegeRepository rolePrivilegeRepository;
    private readonly IAuditTrailRepository auditTrailRepository;
    private readonly IActionContextAccessor accessor;
    private readonly IUriService uriService;

    public TerminalConfigController(ITerminalConfigRepository terminalConfigRepository, IRolePrivilegeRepository rolePrivilegeRepository,
      IActionContextAccessor accessor, IAuditTrailRepository auditTrailRepository, IUriService uriService)
    {
      this.terminalConfigRepository = terminalConfigRepository;
      this.rolePrivilegeRepository = rolePrivilegeRepository;
      this.auditTrailRepository = auditTrailRepository;
      this.accessor = accessor;
      this.uriService = uriService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(TerminalConfigurationCreateDTO terminalConfigurationCreate)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid))
        return Unauthorized();

      string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      var privilege = await GetPrivilege(int.Parse(roleIdString), URL);

      if (privilege.Add != true)
        return Unauthorized();

      string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ToString();
      int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);
      bool result = await terminalConfigRepository.Add(terminalConfigurationCreate);

      if (result)
      {
        string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;
        AppAudit auditTrail = new AppAudit() { Action = "Create", SysIp = ip, UserId = int.Parse(userId), PrivilegeId = privilegeId, LogDate = DateTime.Now };
        await auditTrailRepository.Add(auditTrail);
      }
      var response = new Response<bool>(result);
      return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] ItemValueSearch itemValueSearch)
    {
      List<TerminalConfigurationDTO> terminalConfigurations;
      if (!string.IsNullOrEmpty(itemValueSearch.Item) && !string.IsNullOrEmpty(itemValueSearch.Value))
        terminalConfigurations = await terminalConfigRepository.Get(itemValueSearch.Item, itemValueSearch.Value);
      else
        terminalConfigurations = await terminalConfigRepository.Get();

      var response = new Response<List<TerminalConfigurationDTO>>(terminalConfigurations);
      return Ok(response);
    }

    //[HttpGet("paging")]
    //public async Task<IActionResult> Get([FromQuery] ItemValueFilter itemValueFilter)
    //{
    //  string route = Request.Path.Value;
    //  PaginationFilter validFilter = new PaginationFilter(itemValueFilter.PageNumber, itemValueFilter.PageSize);

    //  int totalRecords;
    //  List<TerminalConfigurationDTO> terminalConfigurations;

    //  if (!string.IsNullOrEmpty(itemValueFilter.Item) && !string.IsNullOrEmpty(itemValueFilter.Value))
    //  {
    //    terminalConfigurations = await terminalConfigRepository.Get(itemValueFilter.Item, itemValueFilter.Value, validFilter.PageNumber, validFilter.PageSize);
    //    totalRecords = await terminalConfigRepository.TotalRecords(itemValueFilter.Item, itemValueFilter.Value);
    //  }

    //  else
    //  {
    //    terminalConfigurations = await terminalConfigRepository.Get(validFilter.PageNumber, validFilter.PageSize);
    //    totalRecords = await terminalConfigRepository.TotalRecords();
    //  }

    //  var response = PaginationHelper.CreatePageResponse(terminalConfigurations, validFilter, totalRecords, uriService, route);
    //  return Ok(response);
    //}

    [HttpGet("detail")]
    public async Task<IActionResult> Get([FromQuery] int id)
    {
      TerminalConfigurationCreateDTO terminal = await terminalConfigRepository.Get(id);
      var response = new Response<TerminalConfigurationCreateDTO>(terminal);
      return Ok(response);
    }

    [HttpGet("approval")]
    public async Task<IActionResult> GetTerminalApprovals([FromQuery] ItemValueSearch itemValueSearch)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.Role) || !HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid))
        return Unauthorized();

      string roleName = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Role).Value;
      string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;

      if (roleName.ToLower().Contains("admin"))
      {
        int id = roleName.ToLower() == "system administrator" ? 0 : int.Parse(userId);

        List<TerminalConfigApprovalDTO> terminalConfigurations;
        if (!string.IsNullOrEmpty(itemValueSearch.Item) && !string.IsNullOrEmpty(itemValueSearch.Value))
          terminalConfigurations = await terminalConfigRepository.GetTerminalApprovals(itemValueSearch.Item, itemValueSearch.Value, id);
        else
          terminalConfigurations = await terminalConfigRepository.GetTerminalApprovals(id);

        var response = new Response<List<TerminalConfigApprovalDTO>>(terminalConfigurations);
        return Ok(response);
      }

      return Unauthorized();
    }

    //[HttpGet("approval/paging")]
    //public async Task<IActionResult> GetTerminalApprovals([FromQuery] ItemValueFilter itemValueFilter)
    //{
    //  if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.Role) || !HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid))
    //    return Unauthorized();

    //  string roleName = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Role).Value;
    //  string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;

    //  if (roleName.ToLower().Contains("admin"))
    //  {
    //    int id = roleName.ToLower() == "system administrator" ? 0 : int.Parse(userId);
    //    string route = Request.Path.Value;
    //    PaginationFilter validFilter = new PaginationFilter(itemValueFilter.PageNumber, itemValueFilter.PageSize);

    //    int totalRecords;
    //    List<TerminalConfigApprovalDTO> terminalConfigurations;
    //    if (!string.IsNullOrEmpty(itemValueFilter.Item) && !string.IsNullOrEmpty(itemValueFilter.Value))
    //    {
    //      terminalConfigurations = await terminalConfigRepository.GetTerminalApprovals(itemValueFilter.Item, itemValueFilter.Value, validFilter.PageNumber, validFilter.PageSize, id);
    //      totalRecords = await terminalConfigRepository.TotalTerminalApprovalRecords(itemValueFilter.Item, itemValueFilter.Value, id);
    //    }

    //    else
    //    {
    //      terminalConfigurations = await terminalConfigRepository.GetTerminalApprovals(validFilter.PageNumber, validFilter.PageSize, id);
    //      totalRecords = await terminalConfigRepository.TotalTerminalApprovalRecords(id);
    //    }
    //    var response = PaginationHelper.CreatePageResponse(terminalConfigurations, validFilter, totalRecords, uriService, route);
    //    return Ok(response);

    //  }
    //  return Unauthorized();
    //}

    [HttpGet("approval-detail")]
    public async Task<IActionResult> GetConfiguration([FromQuery] int id)
    {
      ApproveTerminal terminal = await terminalConfigRepository.GetConfiguration(id);

      var response = new Response<ApproveTerminal>(terminal);
      return Ok(response);
    }

    [HttpPost("approve")]
    public async Task<IActionResult> Approve(ApproveDTO approve)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid))
        return Unauthorized();

      string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ToString();
      int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);
      string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;
      bool result = await terminalConfigRepository.Approve(int.Parse(userId), approve.ConfigId);

      if (result)
      {
        AppAudit auditTrail = new AppAudit()
        {
          Action = "Configuration Approval",
          SysIp = ip,
          UserId = int.Parse(userId),
          PrivilegeId = privilegeId,
          LogDate = DateTime.Now,
          OldValues = $"TerminalID = {approve.TerminalId}\r\nNot Approved",
          NewValues = $"TerminalID = {approve.TerminalId}\r\nApproved"
        };
        await auditTrailRepository.Add(auditTrail);
      }
      var response = new Response<bool>(result);
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

    [HttpGet ("export")]
    public async Task<IActionResult> Export([FromQuery] ItemValueSearch itemValueSearch)
    {
      List<TerminalConfigurationDTO> terminalConfigurations;
      if (!string.IsNullOrEmpty(itemValueSearch.Item) && !string.IsNullOrEmpty(itemValueSearch.Value))
        terminalConfigurations = await terminalConfigRepository.Get(itemValueSearch.Item, itemValueSearch.Value);
      else
        terminalConfigurations = await terminalConfigRepository.Get();

      return ExportTerminalConfigs(terminalConfigurations);
    }

    [HttpGet("approval/export")]
    public async Task<IActionResult> ExportApproval([FromQuery] ItemValueSearch itemValueSearch)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.Role) || !HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid))
        return Unauthorized();

      string roleName = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Role).Value;
      string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;

      if (roleName.ToLower().Contains("admin"))
      {
        int id = roleName.ToLower() == "system administrator" ? 0 : int.Parse(userId);

        List<TerminalConfigApprovalDTO> terminalConfigurations;
        if (!string.IsNullOrEmpty(itemValueSearch.Item) && !string.IsNullOrEmpty(itemValueSearch.Value))
          terminalConfigurations = await terminalConfigRepository.GetTerminalApprovals(itemValueSearch.Item, itemValueSearch.Value, id);
        else
          terminalConfigurations = await terminalConfigRepository.GetTerminalApprovals(id);

        
        return ExportApproveConfigs(terminalConfigurations);
      }

      return Unauthorized();
    }

    //private IActionResult GenerateTerminalConfig(List<TerminalConfigurationDTO> terminalConfigurations)
    //{
    //  using var workbook = new XLWorkbook();
    //  var worksheet = workbook.Worksheets.Add("ATM Configuration");
    //  var currentRow = 1;

    //  worksheet.Cell(currentRow, 1).Value = "App ID";
    //  worksheet.Cell(currentRow, 2).Value = "IP";
    //  worksheet.Cell(currentRow, 3).Value = "Vendor";
    //  worksheet.Cell(currentRow, 4).Value = "Image Path";
    //  worksheet.Cell(currentRow, 5).Value = "Manage Capturing";

    //  foreach (var terminal in terminalConfigurations)
    //  {
    //    currentRow++;
    //    worksheet.Cell(currentRow, 1).Value = terminal.AppId;
    //    worksheet.Cell(currentRow, 2).Value = terminal.Ip;
    //    worksheet.Cell(currentRow, 3).Value = terminal.Vendor;
    //    worksheet.Cell(currentRow, 4).Value = terminal.ImagePath;
    //    worksheet.Cell(currentRow, 5).Value = terminal.ManageCapturing.ToString().ToUpper();
    //  }
      
    //  using var stream = new MemoryStream();
    //  workbook.SaveAs(stream);
    //  var content = stream.ToArray();
    //  return File(content, "appplication/vnd.openxmlformats.officedocument.spreadsheetml.sheet", "ATMConfiguration.xlsx");
    //}

    public FileStreamResult ExportTerminalConfigs(List<TerminalConfigurationDTO> terminalConfigurations)
    {
      var result = WriteCsvToMemory(terminalConfigurations);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "ATMConfiguration.csv" };
    }

    private FileStreamResult ExportApproveConfigs(List<TerminalConfigApprovalDTO> terminalConfigurations)
    {
      var result = WriteCsvToMemory(terminalConfigurations);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "ATMConfigurationApproval.csv" };
    }

    private byte[] WriteCsvToMemory<T>(List<T> terminals)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(terminals);
      streamWriter.Flush();
      return memoryStream.ToArray();
    }

    private IActionResult GenerateApproveConfig(List<TerminalConfigApprovalDTO> terminalConfigurations)
    {
      using var workbook = new XLWorkbook();
      var worksheet = workbook.Worksheets.Add("ATM Configuration Approval");
      var currentRow = 1;

      worksheet.Cell(currentRow, 1).Value = "ID";
      worksheet.Cell(currentRow, 2).Value = "Terminal ID";
      worksheet.Cell(currentRow, 3).Value = "Vendor";
      worksheet.Cell(currentRow, 4).Value = "Eject Mode";
      worksheet.Cell(currentRow, 5).Value = "Validation Mode";
      worksheet.Cell(currentRow, 6).Value = "Intellicam Enabled";
      worksheet.Cell(currentRow, 7).Value = "Manage Capturing";
      worksheet.Cell(currentRow, 8).Value = "Image Brightness";
      worksheet.Cell(currentRow, 9).Value = "Night sensitity";
      worksheet.Cell(currentRow, 10).Value = "Approved";

      foreach (var terminal in terminalConfigurations)
      {
        currentRow++;
        worksheet.Cell(currentRow, 1).Value = terminal.ConfigId;
        worksheet.Cell(currentRow, 2).Value = terminal.TerminalId;
        worksheet.Cell(currentRow, 3).Value = terminal.VendorName;
        worksheet.Cell(currentRow, 4).Value = terminal.EjectMode;
        worksheet.Cell(currentRow, 5).Value = terminal.ValidationMode;
        worksheet.Cell(currentRow, 6).Value = terminal.IntelliCamEnabled.ToString().ToUpper();
        worksheet.Cell(currentRow, 7).Value = terminal.ManageCapturing.ToString().ToUpper();
        worksheet.Cell(currentRow, 8).Value = terminal.ImageBrightness;
        worksheet.Cell(currentRow, 9).Value = terminal.NightSensitivity;
        worksheet.Cell(currentRow, 10).Value = terminal.Approved.ToString().ToUpper();
      }

      using var stream = new MemoryStream();
      workbook.SaveAs(stream);
      var content = stream.ToArray();
      return File(content, "appplication/vnd.openxmlformats.officedocument.spreadsheetml.sheet", "ATMConfigurationApproval.xlsx");
    }
  }
}
