using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Utils;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IOperationLogRepository
  {
    Task<byte[]> GetImageBytes(int logId);
    Task<List<OperationLogDTO>> GetLogs(int pageNumber, int pageSize);
    Task<List<OperationLogDTO>> GetLogs();
    Task<List<OperationLogDTO>> GetLogsWithDate(int pageNumber, int pageSize, DateTime date);
    Task<List<OperationLogDTO>> GetLogsWithDate(DateTime date);
    Task<List<OperationLogDTO>> GetLogs(string item, string value, int pageNumber, int pageSize);
    Task<List<OperationLogDTO>> SearchLogs(string item, string value);
    Task<List<OperationLogDTO>> SearchLogs(string item, string value, int pageNumber, int pageSize);
    Task<int> TotalRecordsWithDate(DateTime date);
    Task<int> TotalRecords();
    Task<int> TotalRecords(string item, string value);
    Task<List<TerminalLogDTO>> GetBlockedCamera();
    Task<List<TerminalLogDTO>> GetBlockedCamera(int minutes);
    Task<List<TerminalLogDTO>> GetBlockedCamera(DateTime? dateFrom, DateTime? dateTo, string item, string value, int pageNumber, int pageSize, LogMode bLURRED_IMAGE);
    Task<int> GetBlockedCameraTotalRecords(DateTime? dateFrom, DateTime? dateTo, string item, string value, LogMode bLURRED_IMAGE);
    Task<List<TerminalLogDTO>> GetBlockedCamera(DateTime? dateFrom, DateTime? dateTo, int pageNumber, int pageSize, LogMode bLURRED_IMAGE);
    Task<int> GetBlockedCameraTotalRecords(DateTime? dateFrom, DateTime? dateTo, LogMode bLURRED_IMAGE);
    Task<List<TerminalLogDTO>> GetBlockedCamera(DateTime? dateFrom, DateTime? dateTo, string item, string value, LogMode bLURRED_IMAGE);
    
  }
}
