using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitorMVC.Dtos;
using AtmOneMonitorMVC.Helpers;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Models;
using CsvHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace AtmOneMonitorMVC.Controllers
{

  [Route("api/[controller]")]
  [ApiController]
  public class OnlineTerminalsController : ControllerBase
  {
    private readonly ITerminalRepository terminalRepository;
    private readonly IUriService uriService;

    public OnlineTerminalsController(ITerminalRepository terminalRepository, IUriService uriService)
    {
      this.terminalRepository = terminalRepository;
      this.uriService = uriService;
    }

    [Authorize("OnlineTerminalPolicy")]
    [HttpGet("paging")]
    public async Task<IActionResult> Get([FromQuery] DateItemValueFilter filter)
    {
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
      List<OnlineTerminalDTO> onlineTerminals;
      int totalRecords;

      DateTime? dateFrom = null;
      DateTime? dateTo = null;
      if (!string.IsNullOrEmpty(filter.DateFrom))
        dateFrom = DateTime.Parse(filter.DateFrom);
      if (!string.IsNullOrEmpty(filter.DateTo))
        dateTo = DateTime.Parse(filter.DateTo);

      if (!string.IsNullOrEmpty(filter.Item) && !string.IsNullOrEmpty(filter.Value))
      {
        onlineTerminals = await terminalRepository.GetOnline(dateFrom, dateTo, filter.Item, filter.Value, validFilter.PageNumber, validFilter.PageSize);
        totalRecords = await terminalRepository.GetOnlineTotalRecords(dateFrom, dateTo, filter.Item, filter.Value);
      } 
      
      else
      {
        onlineTerminals = await terminalRepository.GetOnline(validFilter.PageNumber, validFilter.PageSize);
        totalRecords = await terminalRepository.TotalRecords();
      }
      var response = PaginationHelper.CreatePageResponse(onlineTerminals, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [Authorize("OnlineTerminalPolicy")]
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] DateItemValueSearch search)
    {
      List<OnlineTerminalDTO> onlineTerminals;

      DateTime? dateFrom = null;
      DateTime? dateTo = null;

      if (!string.IsNullOrEmpty(search.DateFrom))
        dateFrom = DateTime.Parse(search.DateFrom);
      if (!string.IsNullOrEmpty(search.DateTo))
        dateTo = DateTime.Parse(search.DateTo);

      if (!string.IsNullOrEmpty(search.Item) && !string.IsNullOrEmpty(search.Value))
        onlineTerminals = await terminalRepository.GetOnline(dateFrom, dateTo, search.Item, search.Value);
      else
        onlineTerminals = await terminalRepository.GetOnline();

      var response = new Response<List<OnlineTerminalDTO>>(onlineTerminals);
      return Ok(response);
    }

    [HttpGet("online")]
    public async Task<IActionResult> GetOnline()
    {
      int stats = await terminalRepository.GetOnlineTerminals();
      int totalTerminals = await terminalRepository.TotalRecords();
      OnlineStats onlineStats = new OnlineStats
      {
        OnlineTerminals = stats,
        TotalTerminals = totalTerminals
      };
      var response = new Response<OnlineStats>(onlineStats);
      return Ok(response);
    }

    [Authorize("OnlineTerminalPolicy")]
    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] DateItemValueSearch search)
    {
      List<OnlineTerminalDTO> onlineTerminals;

      DateTime? dateFrom = null;
      DateTime? dateTo = null;

      if (!string.IsNullOrEmpty(search.DateFrom))
        dateFrom = DateTime.Parse(search.DateFrom);
      if (!string.IsNullOrEmpty(search.DateTo))
        dateTo = DateTime.Parse(search.DateTo);

      if (!string.IsNullOrEmpty(search.Item) && !string.IsNullOrEmpty(search.Value))
        onlineTerminals = await terminalRepository.GetOnline(dateFrom, dateTo, search.Item, search.Value);
      else
        onlineTerminals = await terminalRepository.GetOnline();

      return ExportOnlineTerminals(onlineTerminals);
    }

    //private IActionResult GenerateFile(List<OnlineTerminalDTO> terminals)
    //{
    //  using var workbook = new XLWorkbook();
    //  var worksheet = workbook.Worksheets.Add("OnlineTerminals");
    //  var currentRow = 1;

    //  worksheet.Cell(currentRow, 1).Value = "Terminal ID";
    //  worksheet.Cell(currentRow, 2).Value = "IP";
    //  worksheet.Cell(currentRow, 3).Value = "Vendor";
    //  worksheet.Cell(currentRow, 4).Value = "Last Connected Date";

    //  foreach (var terminal in terminals)
    //  {
    //    currentRow++;
    //    worksheet.Cell(currentRow, 1).Value = terminal.TerminalId;
    //    worksheet.Cell(currentRow, 2).Value = terminal.Ip;
    //    worksheet.Cell(currentRow, 3).Value = terminal.Vendor;
    //    worksheet.Cell(currentRow, 4).Style.DateFormat.Format = "yyyy-MM-dd hh:mm:ss tt";
    //    worksheet.Cell(currentRow, 4).Value = terminal.OnlineDate;
    //  }
    //  using var stream = new MemoryStream();
    //  workbook.SaveAs(stream);
    //  var content = stream.ToArray();
    //  return File(content, "appplication/vnd.openxmlformats.officedocument.spreadsheetml.sheet", "OnlineTerminals.xlsx");
    //}

    private FileStreamResult ExportOnlineTerminals(List<OnlineTerminalDTO> terminals)
    {
      var result = WriteCsvToMemory(terminals);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "OnlineTerminals.csv" };
    }

    private byte[] WriteCsvToMemory(List<OnlineTerminalDTO> terminals)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(terminals);
      streamWriter.Flush();
      return memoryStream.ToArray();
    }
  }
}
