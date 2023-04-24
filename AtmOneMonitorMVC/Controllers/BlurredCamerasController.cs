using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitorMVC.Dtos;
using AtmOneMonitorMVC.Helpers;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Utils;
using System.IO;
using CsvHelper;

namespace AtmOneMonitorMVC.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]

  public class BlurredCamerasController : ControllerBase
  {
    private readonly IOperationLogRepository operationLogRepository;
    private readonly IUriService uriService;

    public BlurredCamerasController(IOperationLogRepository operationLogRepository, IUriService uriService)
    {
      this.operationLogRepository = operationLogRepository;
      this.uriService = uriService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] DateItemValueSearch search)
    {
      List<TerminalLogDTO> blurredCameras;

      DateTime? dateFrom = null;
      DateTime? dateTo = null;

      if (!string.IsNullOrEmpty(search.DateFrom))
        dateFrom = DateTime.Parse(search.DateFrom);
      if (!string.IsNullOrEmpty(search.DateTo))
        dateTo = DateTime.Parse(search.DateTo);

      if (!string.IsNullOrEmpty(search.Item) && !string.IsNullOrEmpty(search.Value))
        blurredCameras = await operationLogRepository.GetBlockedCamera(dateFrom, dateTo, search.Item, search.Value, LogMode.BLURRED_IMAGE);
      else
        blurredCameras = await operationLogRepository.GetBlockedCamera();

      var response = new Response<List<TerminalLogDTO>>(blurredCameras);
      return Ok(response);
    }

    [HttpGet("minutes")]
    public async Task<IActionResult> Get([FromQuery] int minutes)
    {
      List<TerminalLogDTO> blurredCameras = await operationLogRepository.GetBlockedCamera(minutes);
      var response = new Response<List<TerminalLogDTO>>(blurredCameras);
      return Ok(response);
    }

    [HttpGet("paging")]
    public async Task<IActionResult> Get([FromQuery] DateItemValueFilter filter)
    {
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
      List<TerminalLogDTO> blurredCameras;
      int totalRecords;

      DateTime? dateFrom = null;
      DateTime? dateTo = null;
      if (!string.IsNullOrEmpty(filter.DateFrom))
        dateFrom = DateTime.Parse(filter.DateFrom);
      if (!string.IsNullOrEmpty(filter.DateTo))
        dateTo = DateTime.Parse(filter.DateTo);

      if (!string.IsNullOrEmpty(filter.Item) && !string.IsNullOrEmpty(filter.Value))
      {
        blurredCameras = await operationLogRepository.GetBlockedCamera(dateFrom, dateTo, filter.Item, filter.Value, validFilter.PageNumber, validFilter.PageSize, LogMode.BLURRED_IMAGE);
        totalRecords = await operationLogRepository.GetBlockedCameraTotalRecords(dateFrom, dateTo, filter.Item, filter.Value, LogMode.BLURRED_IMAGE);
      }

      else
      {
        blurredCameras = await operationLogRepository.GetBlockedCamera(dateFrom, dateTo, validFilter.PageNumber, validFilter.PageSize, LogMode.BLURRED_IMAGE);
        totalRecords = await operationLogRepository.GetBlockedCameraTotalRecords(dateFrom, dateTo, LogMode.BLURRED_IMAGE);
      }

      var response = PaginationHelper.CreatePageResponse(blurredCameras, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }


    [HttpGet("export")]
    public async Task<IActionResult> Export([FromQuery] DateItemValueSearch search)
    {
      List<TerminalLogDTO> blurredCameras;

      DateTime? dateFrom = null;
      DateTime? dateTo = null;

      if (!string.IsNullOrEmpty(search.DateFrom))
        dateFrom = DateTime.Parse(search.DateFrom);
      if (!string.IsNullOrEmpty(search.DateTo))
        dateTo = DateTime.Parse(search.DateTo);

      if (!string.IsNullOrEmpty(search.Item) && !string.IsNullOrEmpty(search.Value))
        blurredCameras = await operationLogRepository.GetBlockedCamera(dateFrom, dateTo, search.Item, search.Value, LogMode.BLURRED_IMAGE);
      else
        blurredCameras = await operationLogRepository.GetBlockedCamera();

      return ExportBlurredCameras(blurredCameras);
    }

    private FileStreamResult ExportBlurredCameras(List<TerminalLogDTO> blurredCameras)
    {
      var result = WriteCsvToMemory(blurredCameras);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "BlurredCameras.csv" };
    }

    private byte[] WriteCsvToMemory(List<TerminalLogDTO> blurredCameras)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(blurredCameras);
      streamWriter.Flush();
      return memoryStream.ToArray();
    }
  }
}
