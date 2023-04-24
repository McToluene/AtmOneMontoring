using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using AtmOneMonitorMVC.Dtos;
using AtmOneMonitorMVC.Helpers;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Models;
using ClosedXML.Excel;
using CsvHelper;
using Microsoft.AspNetCore.Authorization;
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
  [Authorize("VendorConfigPolicy")]
  [Route("api/[controller]")]
  [ApiController]
  public class VendorConfigController : ControllerBase
  {
    private const string URL = "vendorconfiguration";
    private readonly IRolePrivilegeRepository rolePrivilegeRepository;
    private readonly IActionContextAccessor accessor;
    private readonly IVendorConfigRepository vendorConfigRepository;
    private readonly IAuditTrailRepository auditTrailRepository;
    private readonly IUriService uriService;

    public VendorConfigController(IVendorConfigRepository vendorConfigRepository, IRolePrivilegeRepository rolePrivilegeRepository,
      IActionContextAccessor accessor, IAuditTrailRepository auditTrailRepository,
      IUriService uriService)
    {
      this.rolePrivilegeRepository = rolePrivilegeRepository;
      this.accessor = accessor;
      this.vendorConfigRepository = vendorConfigRepository;
      this.auditTrailRepository = auditTrailRepository;
      this.uriService = uriService;
    }


    [HttpPost]
    public async Task<IActionResult> Create(VendorConfigurationCreateDTO vendorConfigurationCreate)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid))
        return Unauthorized();

      string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      var privilege = await GetPrivilege(int.Parse(roleIdString), URL);

      if (privilege.Add != true)
        return Unauthorized();

      string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ToString();
      int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);
      bool result = await vendorConfigRepository.Add(vendorConfigurationCreate);

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
    public async Task<IActionResult> Get([FromQuery]ItemValueSearch itemValueSearch)
    {
      List<VendorConfigurationDTO> vendorConfigurations;
      if (!string.IsNullOrEmpty(itemValueSearch.Item) && !string.IsNullOrEmpty(itemValueSearch.Value))
        vendorConfigurations = await vendorConfigRepository.Get(itemValueSearch.Item, itemValueSearch.Value);
      else
        vendorConfigurations = await vendorConfigRepository.Get();

      var response = new Response<List<VendorConfigurationDTO>>(vendorConfigurations);
      return Ok(response);
    }

    [HttpGet("paging")]
    public async Task<IActionResult> Get([FromQuery] ItemValueFilter itemValueFilter)
    {
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(itemValueFilter.PageNumber, itemValueFilter.PageSize);

      int totalRecords;
      List<VendorConfigurationDTO> vendorConfigurations;

      if (!string.IsNullOrEmpty(itemValueFilter.Item) && !string.IsNullOrEmpty(itemValueFilter.Value))
      {
        vendorConfigurations = await vendorConfigRepository.Get(itemValueFilter.Item, itemValueFilter.Value, validFilter.PageNumber, validFilter.PageSize);
        totalRecords = await vendorConfigRepository.TotalRecords(itemValueFilter.Item, itemValueFilter.Value);
      }

      else
      {
        vendorConfigurations = await vendorConfigRepository.Get(validFilter.PageNumber, validFilter.PageSize);
        totalRecords = await vendorConfigRepository.TotalRecords();
      }

      var response = PaginationHelper.CreatePageResponse(vendorConfigurations, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] ItemValueSearch itemValueSearch)
    {
      List<VendorConfigurationDTO> vendorConfigurations;
      if (!string.IsNullOrEmpty(itemValueSearch.Item) && !string.IsNullOrEmpty(itemValueSearch.Value))
        vendorConfigurations = await vendorConfigRepository.Get(itemValueSearch.Item, itemValueSearch.Value);
      else
        vendorConfigurations = await vendorConfigRepository.Get();

      if (vendorConfigurations == null)
        return NoContent();
      return ExportVendorConfiguration(vendorConfigurations);
    }

    [HttpGet("detail")]
    public async Task<IActionResult> Get([FromQuery] int id)
    {
      VendorConfigurationCreateDTO vendorConfigurationCreate = await vendorConfigRepository.Get(id);

      var response = new Response<VendorConfigurationCreateDTO>(vendorConfigurationCreate);
      return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Update(VendorConfigurationCreateDTO vendorConfiguration)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid) || !HttpContext.User.HasClaim(claim => claim.Type == "RoleId"))
        return Unauthorized();

      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.Role))
        return Unauthorized();

      var roleName = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role).Value;

      string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      string userId = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.PrimarySid).Value;
      var privilege = await GetPrivilege(int.Parse(roleIdString), URL);

      if (privilege.Add != true)
        return Unauthorized();

      string ip = accessor.ActionContext.HttpContext.Connection.RemoteIpAddress.ToString();
      int privilegeId = await rolePrivilegeRepository.GetPrivilegeId(URL);

      var oldVendorConfig = await vendorConfigRepository.Get(vendorConfiguration.VendorConfigId);
      bool result;

      if (roleName.ToLower().Contains("system"))
        result = await vendorConfigRepository.Update(vendorConfiguration, int.Parse(userId), false);
      else
        result = await vendorConfigRepository.Update(vendorConfiguration, int.Parse(userId), true);

      if (result)
      {
        string oldValues = $"Vendor={vendorConfiguration.VendorId}\r\nVendorConfigName={vendorConfiguration.VendorConfigName}\r\nEjectMode={vendorConfiguration.EjectMode}\r\n" + $"ImagePath={vendorConfiguration.ImagePath}\r\nAtmLogPath={vendorConfiguration.AtmLogPath}";
        string newValues = $"Vendor={vendorConfiguration.VendorId}\r\nVendorConfigName={vendorConfiguration.VendorConfigName}\r\nEjectMode={vendorConfiguration.EjectMode}\r\n" + $"ImagePath={vendorConfiguration.ImagePath}\r\nAtmLogPath={vendorConfiguration.AtmLogPath}";

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

    private IActionResult GenerateFile(List<VendorConfigurationDTO> vendorConfigurations)
    {
      using var workbook = new XLWorkbook();
      var worksheet = workbook.Worksheets.Add("Vendor Configuration");
      var currentRow = 1;

      worksheet.Cell(currentRow, 1).Value = "AppID";
      worksheet.Cell(currentRow, 2).Value = "Config Name";
      worksheet.Cell(currentRow, 3).Value = "Vendor";
      worksheet.Cell(currentRow, 4).Value = "Image Path";
      worksheet.Cell(currentRow, 5).Value = "File Extension";
      worksheet.Cell(currentRow, 6).Value = "ATM Log Path";
      worksheet.Cell(currentRow, 7).Value = "Extension Filter";
      worksheet.Cell(currentRow, 8).Value = "Eject Mode";


      foreach (var vendorConfig in vendorConfigurations)
      {
        currentRow++;
        worksheet.Cell(currentRow, 1).Value = vendorConfig.AppId;
        worksheet.Cell(currentRow, 2).Value = vendorConfig.VendorConfigName;
        worksheet.Cell(currentRow, 3).Value = vendorConfig.VendorName;
        worksheet.Cell(currentRow, 4).Value = vendorConfig.ImagePath;
        worksheet.Cell(currentRow, 5).Value = vendorConfig.ImageFilter;
        worksheet.Cell(currentRow, 6).Value = vendorConfig.AtmLogPath;
        worksheet.Cell(currentRow, 7).Value = vendorConfig.AtmLogFilter;
        worksheet.Cell(currentRow, 8).Value = vendorConfig.EjectMode;
      }

      using var stream = new MemoryStream();
      workbook.SaveAs(stream);
      var content = stream.ToArray();
      return File(content, "appplication/vnd.openxmlformats.officedocument.spreadsheetml.sheet", "VendorConfiguration.xlsx");
    }

    public FileStreamResult ExportVendorConfiguration(List<VendorConfigurationDTO> vendorConfigurations)
    {
      var result = WriteCsvToMemory(vendorConfigurations);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "VendorConfiguration.csv" };
    }

    public byte[] WriteCsvToMemory(List<VendorConfigurationDTO> vendorConfigurations)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(vendorConfigurations);
      streamWriter.Flush();
      return memoryStream.ToArray();
    }
  }
}
