using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AtmOneMonitoringLibrary.Interfaces;
using System.Threading.Tasks;
using AtmOneMonitorMVC.Models;
using AtmOneMonitoringLibrary.Dtos;
using System.Collections.Generic;
using System;
using AtmOneMonitorMVC.Helpers;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Dtos;
using System.IO;
using CsvHelper;

namespace AtmOneMonitorMVC.Controllers
{
  [Authorize("ViewLogPolicy")]
  [Route("api/[controller]")]
  [ApiController]
  public class OperationLogsController : ControllerBase
  {
    private readonly IOperationLogRepository operationLogRepository;
    private readonly IUriService uriService;
    public OperationLogsController(IOperationLogRepository operationLogRepository, IUriService uriService)
    {
      this.operationLogRepository = operationLogRepository;
      this.uriService = uriService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] ItemValueSearch search)
    {
      List<OperationLogDTO> logs;
      if (!string.IsNullOrEmpty(search.Item) && !string.IsNullOrEmpty(search.Value))
        logs = await operationLogRepository.SearchLogs(search.Item, search.Value);
      else
      {
        DateTime date = DateTime.Now;
        logs = await operationLogRepository.GetLogsWithDate(date);
        if (logs.Count == 0)
        {
          logs = await operationLogRepository.GetLogs();
        }
      }

      var response = new Response<List<OperationLogDTO>>(logs);
      return Ok(response);
    }

    [HttpGet("paging")]
    public async Task<IActionResult> GetLogs([FromQuery] PaginationFilter paginationFilter)
    {
      string route = Request.Path.Value;
      DateTime date = DateTime.Now;
      PaginationFilter validFilter = new PaginationFilter(paginationFilter.PageNumber, paginationFilter.PageSize);
      List<OperationLogDTO> logs = await operationLogRepository.GetLogsWithDate(validFilter.PageNumber, validFilter.PageSize, date);
      int totalRecords = await operationLogRepository.TotalRecordsWithDate(date);

      if (logs.Count == 0)
      {
        logs = await operationLogRepository.GetLogs(validFilter.PageNumber, validFilter.PageSize);
        totalRecords = await operationLogRepository.TotalRecords();
      }

      var response = PaginationHelper.CreatePageResponse(logs, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [HttpGet("paging/search")]
    public async Task<IActionResult> SearchLogs([FromQuery] ItemValueFilter itemValueFilter)
    {
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(itemValueFilter.PageNumber, itemValueFilter.PageSize);
      List<OperationLogDTO> logs = await operationLogRepository.SearchLogs(itemValueFilter.Item, itemValueFilter.Value, validFilter.PageNumber, validFilter.PageSize);
      int totalRecords = await operationLogRepository.TotalRecords(itemValueFilter.Item, itemValueFilter.Value);

      var response = PaginationHelper.CreatePageResponse(logs, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] ItemValueSearch search)
    {
      List<OperationLogDTO> logs;
      if (!string.IsNullOrEmpty(search.Item) && !string.IsNullOrEmpty(search.Value))
        logs = await operationLogRepository.SearchLogs(search.Item, search.Value);
      else
      {
        DateTime date = DateTime.Now;
        logs = await operationLogRepository.GetLogsWithDate(date);
        if (logs.Count == 0)
        {
          logs = await operationLogRepository.GetLogs();
        }
      }
      return ExportOperationLogs(logs);
    }

    //private IActionResult GenerateFile(List<OperationLogDTO> operationLogs)
    //{
    //  using var workbook = new XLWorkbook();
    //  var worksheet = workbook.Worksheets.Add("Operation Logs");
    //  var currentRow = 1;

    //  worksheet.Cell(currentRow, 1).Value = "Terminal ID";
    //  worksheet.Cell(currentRow, 2).Value = "IP";
    //  worksheet.Cell(currentRow, 3).Value = "Log";
    //  worksheet.Cell(currentRow, 4).Value = "Date";

    //  foreach (var log in operationLogs)
    //  {
    //    currentRow++;
    //    worksheet.Cell(currentRow, 1).Value = log.TerminalId;
    //    worksheet.Cell(currentRow, 2).Value = log.Ip;
    //    worksheet.Cell(currentRow, 3).Value = log.LogMsg;
    //    worksheet.Cell(currentRow, 4).Style.DateFormat.Format = "yyyy-MM-dd hh:mm:ss tt";
    //    worksheet.Cell(currentRow, 4).Value = log.IncidentDate;
    //  }

    //  using var stream = new MemoryStream();
    //  workbook.SaveAs(stream);
    //  var content = stream.ToArray();
    //  return File(content, "appplication/vnd.openxmlformats.officedocument.spreadsheetml.sheet", "Logs.xlsx");
    //}

    private FileStreamResult ExportOperationLogs(List<OperationLogDTO> operationLogs)
    {
      var result = WriteCsvToMemory(operationLogs);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "Logs.csv" };
    }

    private byte[] WriteCsvToMemory(List<OperationLogDTO> operationLogs)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(operationLogs);
      streamWriter.Flush();
      return memoryStream.ToArray();
    }
  }
}