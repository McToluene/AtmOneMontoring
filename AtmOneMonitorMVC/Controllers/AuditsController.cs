using System.Collections.Generic;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitorMVC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Helpers;
using AtmOneMonitorMVC.Dtos;
using System.IO;
using CsvHelper;
using System;

namespace AtmOneMonitorMVC.Controllers
{
  [Authorize("AuditTrailPolicy")]
  [Route("api/[controller]")]
  [ApiController]
  public class AuditsController : ControllerBase
  {
    private readonly IAuditTrailRepository auditTrailRepository;
    private readonly IUriService uriService;
    public AuditsController(IAuditTrailRepository auditTrailRepository, IUriService uriService)
    {
      this.auditTrailRepository = auditTrailRepository;
      this.uriService = uriService;
    }

    [HttpGet("paging")]
    public async Task<IActionResult> Get([FromQuery] PaginationFilter filter)
    {
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
      List<AuditTrailDTO> auditTrails = await auditTrailRepository.GetList(validFilter.PageNumber, validFilter.PageSize);
      int totalRecords = await auditTrailRepository.TotalRecords();
      var response = PaginationHelper.CreatePageResponse(auditTrails, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      List<AuditTrailDTO> auditTrails = await auditTrailRepository.GetList();
      var response = new Response<List<AuditTrailDTO>>(auditTrails);
      return Ok(response);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> Get([FromQuery] AuditFilter filter)
    {
      DateTime? dateFrom = null;
      DateTime? dateTo = null;

      if (!string.IsNullOrEmpty(filter.DateFrom))
        dateFrom = DateTime.Parse(filter.DateFrom);
      if (!string.IsNullOrEmpty(filter.DateTo))
        dateTo = DateTime.Parse(filter.DateTo);

      List<AuditTrailDTO> auditTrails = await auditTrailRepository.GetFilteredList(filter.UserId, filter.PrivilegeId, dateFrom, dateTo);
      var response = new Response<List<AuditTrailDTO>>(auditTrails);
      return Ok(response);
    }

    [Authorize("AuditTrailDetailPolicy")]
    [HttpGet("detail")]
    public async Task<IActionResult> GetDetail([FromQuery] int auditId)
    {
      AuditTrailDetailDTO auditTrailDetail = await auditTrailRepository.GetByAuditId(auditId);
      var response = new Response<AuditTrailDetailDTO>(auditTrailDetail);
      return Ok(response);
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] AuditFilter filter)
    {
      DateTime? dateFrom = null;
      DateTime? dateTo = null;

      if (!string.IsNullOrEmpty(filter.DateFrom))
        dateFrom = DateTime.Parse(filter.DateFrom);
      if (!string.IsNullOrEmpty(filter.DateTo))
        dateTo = DateTime.Parse(filter.DateTo);

      List<AuditTrailDTO> auditTrails;
      if (filter.PrivilegeId <= 0 && filter.UserId <= 0)
        auditTrails = await auditTrailRepository.GetFilteredList(filter.UserId, filter.PrivilegeId, dateFrom, dateTo);
      else
        auditTrails = await auditTrailRepository.GetList();
      
      return ExportBlurredCameras(auditTrails);
    }

    //public IActionResult GenerateFile(List<AuditTrailDTO> auditTrails)
    //{
    //  using var workbook = new XLWorkbook();
    //  var worksheet = workbook.Worksheets.Add("Audits");
    //  var currentRow = 1;

    //  worksheet.Cell(currentRow, 1).Value = "ID";
    //  worksheet.Cell(currentRow, 2).Value = "Username";
    //  worksheet.Cell(currentRow, 3).Value = "Activity";
    //  worksheet.Cell(currentRow, 4).Value = "Action";
    //  worksheet.Cell(currentRow, 5).Value = "System IP";
    //  worksheet.Cell(currentRow, 6).Value = "Date";

    //  foreach(var auditTrail in auditTrails)
    //  {
    //    currentRow++;
    //    worksheet.Cell(currentRow, 1).Value = auditTrail.AuditId;
    //    worksheet.Cell(currentRow, 2).Value = auditTrail.UserName;
    //    worksheet.Cell(currentRow, 3).Value = auditTrail.Activity;
    //    worksheet.Cell(currentRow, 4).Value = auditTrail.Action;
    //    worksheet.Cell(currentRow, 5).Value = auditTrail.SysIp;
    //    worksheet.Cell(currentRow, 6).Style.DateFormat.Format = "yyyy-MM-dd hh:mm:ss tt";
    //    worksheet.Cell(currentRow, 6).Value = auditTrail.LogDate;
    //  }

    //  using var stream = new MemoryStream();
    //  workbook.SaveAs(stream);
    //  var content = stream.ToArray();
    //  return File(content, "appplication/vnd.openxmlformats.officedocument.spreadsheetml.sheet", "AuditTrails.xlsx");
    //}

    private FileStreamResult ExportBlurredCameras(List<AuditTrailDTO> auditTrails)
    {
      var result = WriteCsvToMemory(auditTrails);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "AuditTrails.csv" };
    }

    private byte[] WriteCsvToMemory(List<AuditTrailDTO> auditTrails)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(auditTrails);
      streamWriter.Flush();
      return memoryStream.ToArray();
    }

  }
}
