using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitorMVC.Dtos;
using AtmOneMonitorMVC.Helpers;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Models;
using CsvHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtmOneMonitorMVC.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class IssuesController : ControllerBase
  {
    private readonly IAlertRepository alertRepository;
    private readonly IUriService uriService;
    public IssuesController(IAlertRepository alertRepository, IUriService uriService)
    {
      this.alertRepository = alertRepository;
      this.uriService = uriService;
    }

    [HttpGet("cameras")]
    public async Task<IActionResult> GetCameraIssues()
    {
      CameraDto result = await alertRepository.CameraIssue();
      return Ok(result);
    }

    [HttpGet("ejs")]
    public async Task<IActionResult> GetEJIssues()
    {
      EjectDTO result = await alertRepository.EjectIssue();
      return Ok(result);
    }

    [HttpGet("{issueType}")]
    public async Task<IActionResult> GetIssuesDetails(string issueType)
    {
      List<IssueDTO> issues = await alertRepository.GetDataHistory(issueType);
      var response = new Response<List<IssueDTO>>(issues);
      return Ok(response);
    }

    [Authorize("ReportPolicy")]
    [HttpGet]
    public async Task<IActionResult> GetIssuesDetails([FromQuery] IssueFilter filter)
    {
      List<IssueDTO> issues;
      if (filter.Item == null || filter.Value == null)
        issues = await alertRepository.GetDataHistory(filter.AppId, filter.Range);
      else
        issues = await alertRepository.GetIssuesDetails(filter.AppId, filter.Range, filter.Item, filter.Value);

      var response = new Response<List<IssueDTO>>(issues);
      return Ok(response);
    }

    [HttpGet("selected")]
    public async Task<IActionResult> GetSelectedIssues([FromQuery] SelectedIssueFilter filter)
    {
      List<IssueDTO> issues;
      if (filter.Item == null || filter.Value == null)
        issues = await alertRepository.GetSelectedDataHistory(filter.AppId, filter.MsgCat);
      else
        issues = await alertRepository.GetIssuesDetails(filter.AppId, filter.Range, filter.Item, filter.Value);

      var response = new Response<List<IssueDTO>>(issues);
      return Ok(response);
    }

    [Authorize("ReportPolicy")]
    [HttpGet("paging")]
    public async Task<IActionResult> GetIssuesDetailsPaging([FromQuery] IssuePagingFilter filter)
    {
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
      List<IssueDTO> issues;
      int totalRecords;
      if (filter.Item == null || filter.Value == null)
      {
        issues = await alertRepository.GetDataHistory(filter.AppId, filter.Range, validFilter.PageNumber, validFilter.PageSize);
        totalRecords = await alertRepository.TotalRecords(filter.AppId, filter.Range);
      }
      else
      {
        issues = await alertRepository.GetIssuesDetails(filter.AppId, filter.Range, filter.Item, filter.Value, validFilter.PageNumber, validFilter.PageSize);
        totalRecords = await alertRepository.TotalRecords(filter.AppId, filter.Range, filter.Item, filter.Value);
      }
      var response = PaginationHelper.CreatePageResponse(issues, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [HttpGet("selected/paging")]
    public async Task<IActionResult> GetSelectedIssuesPaging([FromQuery] SelectedPagingFilter filter)
    {
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
      List<IssueDTO> issues;

      int totalRecords;
      if (filter.Item == null || filter.Value == null)
      {
        issues = await alertRepository.GetSelectedDataHistory(filter.AppId, validFilter.PageNumber, validFilter.PageSize, filter.MsgCat);
        totalRecords = await alertRepository.TotalSelectedRecords(filter.AppId, filter.MsgCat);
      }
      else
      {
        issues = await alertRepository.GetSelectedIssuesDetails(filter.AppId, filter.Item, filter.Value, validFilter.PageNumber, validFilter.PageSize, filter.MsgCat);
        totalRecords = await alertRepository.TotalSelectedRecords(filter.AppId, filter.Item, filter.Value, filter.MsgCat);
      }
      var response = PaginationHelper.CreatePageResponse(issues, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] IssueFilter filter)
    {
      List<IssueDTO> issues;
      if (filter.Item == null && filter.Value == null)
        issues = await alertRepository.GetDataHistory(filter.AppId, filter.Range);
      else
        issues = await alertRepository.GetIssuesDetails(filter.AppId, filter.Range, filter.Item, filter.Value);

      if (issues == null)
        return NoContent();
      return ExportIssues(issues, filter.AppId);
    }

    //private IActionResult GenerateFile(List<IssueDTO> issues, string AppId)
    //{
    //  using var workbook = new XLWorkbook();
    //  var worksheet = workbook.Worksheets.Add("Issues");
    //  var currentRow = 1;

    //  worksheet.Cell(currentRow, 1).Value = "Terminal ID";
    //  worksheet.Cell(currentRow, 2).Value = "IP";
    //  worksheet.Cell(currentRow, 3).Value = "Issue";
    //  worksheet.Cell(currentRow, 4).Value = "Incident Date";
    //  worksheet.Cell(currentRow, 5).Value = "Update Date";
    //  worksheet.Cell(currentRow, 6).Value = "Status";

    //  foreach (var issue in issues)
    //  {
    //    currentRow++;
    //    worksheet.Cell(currentRow, 1).Value = issue.TerminalID;
    //    worksheet.Cell(currentRow, 2).Value = issue.Ip;
    //    worksheet.Cell(currentRow, 3).Value = issue.Title;
    //    worksheet.Cell(currentRow, 4).Value = issue.IncidentDate.ToString();
    //    worksheet.Cell(currentRow, 5).Value = issue.UpdatedDate;
    //    worksheet.Cell(currentRow, 6).Value = issue.Status;
    //  }

    //  using var stream = new MemoryStream();
    //  workbook.SaveAs(stream);
    //  var content = stream.ToArray();
    //  string fileName = AppId == "IC" ? "CameraIssues.xlsx" : "EJIssues.xlsx";
    //  return File(content, "appplication/vnd.openxmlformats.officedocument.spreadsheetml.sheet", fileName);
    //}

    private FileStreamResult ExportIssues(List<IssueDTO> issues, string AppId)
    {
      var result = WriteCsvToMemory(issues);
      var memoryStream = new MemoryStream(result);
      string fileName = AppId == "IC" ? "CameraIssues.csv" : "EJIssues.csv";
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = fileName};
    }

    private byte[] WriteCsvToMemory(List<IssueDTO> issues)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(issues);
      streamWriter.Flush();
      return memoryStream.ToArray();
    }
  }
}
