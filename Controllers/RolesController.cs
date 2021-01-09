using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Dtos;
using System.Collections.Generic;
using System.IO;
using CsvHelper;

namespace AtmOneMonitorMVC.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class RolesController : ControllerBase
  {
    private readonly IRoleRepository roleRepository;
    private readonly IAppPrivilegeRepository appPrivilegeRepository;
    private readonly IRolePrivilegeRepository rolePrivilegeRepository;

    public RolesController(IRoleRepository roleRepository, IAppPrivilegeRepository appPrivilegeRepository, IRolePrivilegeRepository rolePrivilegeRepository)
    {
      this.roleRepository = roleRepository;
      this.appPrivilegeRepository = appPrivilegeRepository;
      this.rolePrivilegeRepository = rolePrivilegeRepository;
    }

    [HttpGet("privilegerights")]
    public async Task<IActionResult> GetRolePrivilegeRights([FromQuery] int roleId)
    {
      var rolePrivileges = await rolePrivilegeRepository.GetRolePrivilegeRights(roleId);
      return Ok(rolePrivileges);
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
      List<RoleDTO> roles = await roleRepository.GetRoles();
      return Ok(roles);
    }

    [HttpGet("privileges")]
    public async Task<IActionResult> GetPrivileges()
    {
      List<PrivilegeDTO> rolePrivileges = await appPrivilegeRepository.GetPrivileges();
      return Ok(rolePrivileges);
    }

    [Authorize("RolePrivilegePolicy")]
    [HttpGet("accessrights")]
    public async Task<IActionResult> GetAccessRight()
    {
      List<AccessRightDTO> accessRights = await rolePrivilegeRepository.GetAccessRight();
      return Ok(accessRights);
    }

    [Authorize("RolePrivilegePolicy")]
    [HttpGet("accessrights/export")]
    public async Task<IActionResult> Export()
    {
      List<AccessRightDTO> accessRights = await rolePrivilegeRepository.GetAccessRight();
      return ExportAccessRights(accessRights);
    }

    [Authorize("RolePrivilegePolicy")]
    [HttpPut("accessrights")]
    public async Task<IActionResult> UpdateAccessRights(List<AccessRightDTO> accessRights)
    {
      bool response = await rolePrivilegeRepository.UpdateAccessRights(accessRights);
      return Ok(response);
    }

    [Authorize("RolePrivilegePolicy")]
    [HttpPost("privileges")]
    public async Task<IActionResult> AddRolePrivilege(RoleAddRemoveDTO role)
    {
      bool message = await appPrivilegeRepository.AddRolePrivilege(role);
      return Ok(message);
    }

    [Authorize("RolePrivilegePolicy")]
    [HttpPut("privileges")]
    public async Task<IActionResult> UpdateRolePrivilege(RoleUpdatePrivilegeDTO role)
    {
      bool message = await appPrivilegeRepository.UpdateRolePrivilege(role);
      return Ok(message);
    }

    [Authorize("RolePrivilegePolicy")]
    [HttpDelete("privileges")]
    public async Task<IActionResult> DeleteRolePrivilege([FromQuery] RoleAddRemoveDTO role)
    {
      bool message = await appPrivilegeRepository.RemoveRolePrivilege(role);
      return Ok(message);
    }

    [Authorize("RolePrivilegePolicy")]
    [HttpPut]
    public async Task<IActionResult> AddRolPrivileges(RolePrivilegeForAddDTO rolePrivileges)
    {
      bool message = await appPrivilegeRepository.AddRolPrivileges(rolePrivileges);
      return Ok(message);
    }

    //private IActionResult GenerateFile(List<AccessRightDTO> accessRights)
    //{
    //  using var workbook = new XLWorkbook();
    //  var worksheet = workbook.Worksheets.Add("Access Right");
    //  var currentRow = 1;

    //  worksheet.Cell(currentRow, 1).Value = "Rolename";
    //  worksheet.Cell(currentRow, 2).Value = "Privilege";
    //  worksheet.Cell(currentRow, 3).Value = "Add";
    //  worksheet.Cell(currentRow, 4).Value = "Edit";
    //  worksheet.Cell(currentRow, 5).Value = "View";


    //  foreach (var accessRight in accessRights)
    //  {
    //    worksheet.Cell(currentRow, 1).Value = accessRight.RoleName;
    //    worksheet.Cell(currentRow, 2).Value = accessRight.PrivilegeName;
    //    worksheet.Cell(currentRow, 3).Value = accessRight.Add;
    //    worksheet.Cell(currentRow, 4).Value = accessRight.Update;
    //    worksheet.Cell(currentRow, 5).Value = accessRight.View;
    //  }

    //  using var stream = new MemoryStream();
    //  workbook.SaveAs(stream);
    //  var content = stream.ToArray();
    //  return File(content, "appplication/vnd.openxmlformats.officedocument.spreadsheetml.sheet", "AccessRights.xlsx");
    //}

    private FileStreamResult ExportAccessRights(List<AccessRightDTO> accessRights)
    {
      var result = WriteCsvToMemory(accessRights);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "AccessRight.csv" };
    }

    private byte[] WriteCsvToMemory(List<AccessRightDTO> accessRights)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(accessRights);
      streamWriter.Flush();
      return memoryStream.ToArray();
    }
  }
}