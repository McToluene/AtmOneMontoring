using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using AtmOneMonitoringLibrary.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class OperationLogRepository : IOperationLogRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    private readonly ITerminalRepository terminalRepository;

    public OperationLogRepository(AtmOneMonitorContext dbContext, ITerminalRepository terminalRepository)
    {
      this.dbContext = dbContext;
      this.terminalRepository = terminalRepository;
    }

    public Task<byte[]> GetImageBytes(int logId)
    {
      throw new NotImplementedException();
    }

    public async Task<List<OperationLogDTO>> GetLogs(int pageNumber, int pageSize) => await dbContext.OperationLog
      .Skip((pageNumber - 1) * pageSize)
      .Take(pageSize)
      .Where(log => log.ImgBytes == null)
      .Select(log => new OperationLogDTO { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss tt"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault() })
      .ToListAsync();

    public async Task<List<OperationLogDTO>> GetLogs(string item, string value, int pageNumber, int pageSize)
    {
      List<OperationLogDTO> operationLogs = new List<OperationLogDTO>();
      if (string.IsNullOrEmpty(item) && item.ToLower() == "ip")
      {
        string terminalId = await terminalRepository.GetTerminalId(value);
        operationLogs = await dbContext.OperationLog
          .Select(log => new OperationLogDTO() { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss tt"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = terminalId })
          .Where(log => log.Ip == value)
          .ToListAsync();
      }
      return operationLogs;
    }

    public async Task<List<OperationLogDTO>> GetLogsWithDate(int pageNumber, int pageSize, DateTime date) => await dbContext.OperationLog
      .Skip((pageNumber - 1) * pageSize)
      .Take(pageSize)
      .Where(log => log.IncidentDate == date.Date && log.ImgBytes == null)
      .Select(log => new OperationLogDTO { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss tt"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault() })
      .ToListAsync();

    public async Task<int> TotalRecordsWithDate(DateTime date) => await dbContext.OperationLog
      .Where(log => log.IncidentDate == date.Date && log.ImgBytes == null)
      .CountAsync();

    public async Task<List<OperationLogDTO>> SearchLogs(string item, string value)
    {
      List<OperationLogDTO> logs = new List<OperationLogDTO>();
      if (item.ToLower() == "ip")
      {
        logs = await dbContext.OperationLog
          .Where(log => log.Ip == value && log.IncidentDate.Value.Date == DateTime.Now.Date)
          .Select(log => new OperationLogDTO { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss tt"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault() })
          .ToListAsync();
      }

      if (item.ToLower() == "incident date")
      {
        logs = await dbContext.OperationLog
          .Where(log => log.IncidentDate.Value.Date == DateTime.Parse(value))
          .Select(log => new OperationLogDTO { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss tt"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault() })
          .ToListAsync();
      }

      if (item.ToLower() == "log message")
      {
        logs = await dbContext.OperationLog
          .Where(log => log.LogMsg.Contains(value))
          .Select(log => new OperationLogDTO { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss tt"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault() })
          .ToListAsync();
      }

      return logs;
    }

    public async Task<int> TotalRecords() => await dbContext.OperationLog.Where(log => log.ImgBytes == null).CountAsync();

    public async Task<List<OperationLogDTO>> GetLogsWithDate(DateTime date) => await dbContext.OperationLog
      .Where(log => log.IncidentDate == date.Date && log.ImgBytes == null)
      .Select(log => new OperationLogDTO { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault() })
      .ToListAsync();

    public async Task<List<OperationLogDTO>> GetLogs() => await dbContext.OperationLog
      .Where(log => log.ImgBytes == null)
      .Select(log => new OperationLogDTO { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault() })
      .ToListAsync();

    public async Task<List<OperationLogDTO>> SearchLogs(string item, string value, int pageNumber, int pageSize)
    {
      List<OperationLogDTO> logs = new List<OperationLogDTO>();
      if (item.ToLower() == "ip")
      {
        logs = await dbContext.OperationLog
          .Skip((pageNumber - 1) * pageSize)
          .Take(pageSize)
          .Where(log => log.Ip == value && log.IncidentDate.Value.Date == DateTime.Now.Date)
          .Select(log => new OperationLogDTO { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss tt"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault() })
          .ToListAsync();
      }

      if (item.ToLower() == "incident date")
      {
        logs = await dbContext.OperationLog
          .Skip((pageNumber - 1) * pageSize)
          .Take(pageSize)
          .Where(log => log.IncidentDate.Value.Date == DateTime.Parse(value))
          .Select(log => new OperationLogDTO { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss tt"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault() })
          .ToListAsync();
      }

      if (item.ToLower() == "log message")
      {
        logs = await dbContext.OperationLog
          .Where(log => log.LogMsg.ToLower().Contains(value.ToLower()))
          .Select(log => new OperationLogDTO { IncidentDate = Convert.ToDateTime(log.IncidentDate).ToString("dd-MM-yyyy  hh-mm-ss tt"), Ip = log.Ip, LogMsg = log.LogMsg, TerminalId = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault() })
          .Skip((pageNumber - 1) * pageSize)
          .Take(pageSize)
          .ToListAsync();
      }
      return logs;
    }

    public async Task<int> TotalRecords(string item, string value)
    {
      int count = 0;
      if (item.ToLower() == "ip")
        count = await dbContext.OperationLog.Where(log => log.Ip == value && log.IncidentDate.Value.Date == DateTime.Now.Date).CountAsync();
      if (item.ToLower() == "incident date")
        count = await dbContext.OperationLog.Where(log => log.IncidentDate.Value.Date == DateTime.Parse(value)).CountAsync();
      if (item.ToLower() == "log message")
        count = await dbContext.OperationLog.Where(log => log.LogMsg.ToLower().Contains(value.ToLower())).CountAsync();
      return count;
    }

    public async Task<List<TerminalLogDTO>> GetBlockedCamera() => await dbContext.OperationLog
      .Select(log => new TerminalLogDTO()
      {
        ImgBytes = log.ImgBytes,
        IncidentDate = log.IncidentDate,
        Ip = log.Ip,
        LogId = log.Logid,
        LogMsg = log.LogMsg,
        TerminalID = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault()
      })
      .Where(operationLog => operationLog.IncidentDate.Value.Date == DateTime.Now.Date && operationLog.ImgBytes != null)
      .ToListAsync();

    public async Task<List<TerminalLogDTO>> GetBlockedCamera(DateTime? dateFrom, DateTime? dateTo, string item, string value, int pageNumber, int pageSize, LogMode bLURRED_IMAGE)
    {
      DateTime localDateFrom = dateFrom ?? DateTime.Now;
      var query = dbContext.OperationLog
        .Select(log => new TerminalLogDTO()
        {
          ImgBytes = log.ImgBytes,
          IncidentDate = log.IncidentDate,
          Ip = log.Ip,
          LogId = log.Logid,
          LogMsg = log.LogMsg,
          TerminalID = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault()
        });

      if (LogMode.BLURRED_IMAGE == bLURRED_IMAGE)
        query = query.Where(log => log.ImgBytes != null);
      else
        query = query.Where(log => log.ImgBytes == null);

      if (item.ToLower() == "ip")
        query = query.Where(log => EF.Functions.Like(log.Ip.ToLower(), value.ToLower()));
      if (item.ToLower() == "terminal id")
        query = query.Where(log => EF.Functions.Like(log.TerminalID.ToLower(), value.ToLower()));

      if (dateTo.HasValue)
        query = query.Where(config => config.IncidentDate.Value.Date >= localDateFrom.Date && config.IncidentDate <= dateTo);
      else
        query = query.Where(config => config.IncidentDate.Value.Date == localDateFrom.Date);

      query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
      return await query.ToListAsync();
    }

    public async Task<int> GetBlockedCameraTotalRecords(DateTime? dateFrom, DateTime? dateTo, string item, string value, LogMode bLURRED_IMAGE)
    {
      DateTime localDateFrom = dateFrom ?? DateTime.Now;
      var query = dbContext.OperationLog
        .Select(log => new TerminalLogDTO()
        {
          ImgBytes = log.ImgBytes,
          IncidentDate = log.IncidentDate,
          Ip = log.Ip,
          LogId = log.Logid,
          LogMsg = log.LogMsg,
          TerminalID = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault()
        });

      if (LogMode.BLURRED_IMAGE == bLURRED_IMAGE)
        query = query.Where(log => log.ImgBytes != null);
      else
        query = query.Where(log => log.ImgBytes == null);

      if (item.ToLower() == "ip")
        query = query.Where(log => EF.Functions.Like(log.Ip.ToLower(), value.ToLower()));
      if (item.ToLower() == "terminal id")
        query = query.Where(log => EF.Functions.Like(log.TerminalID.ToLower(), value.ToLower()));

      if (dateTo.HasValue)
        query = query.Where(config => config.IncidentDate.Value.Date >= localDateFrom.Date && config.IncidentDate <= dateTo);
      else
        query = query.Where(config => config.IncidentDate.Value.Date == localDateFrom.Date);


      return await query.CountAsync();
    }

    public async Task<int> GetBlockedCameraTotalRecords(DateTime? dateFrom, DateTime? dateTo, LogMode bLURRED_IMAGE)
    {
      DateTime localDateFrom = dateFrom ?? DateTime.Now;
      var query = dbContext.OperationLog
       .Select(log => new TerminalLogDTO()
       {
         ImgBytes = log.ImgBytes,
         IncidentDate = log.IncidentDate,
         Ip = log.Ip,
         LogId = log.Logid,
         LogMsg = log.LogMsg,
         TerminalID = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault()
       });

      if (LogMode.BLURRED_IMAGE == bLURRED_IMAGE)
        query = query.Where(log => log.ImgBytes != null);
      else
        query = query.Where(log => log.ImgBytes == null);

      if (dateTo.HasValue)
        query = query.Where(config => config.IncidentDate.Value.Date >= localDateFrom.Date && config.IncidentDate <= dateTo);
      else
        query = query.Where(config => config.IncidentDate.Value.Date == localDateFrom.Date);

      return await query.CountAsync();
    }

    public async Task<List<TerminalLogDTO>> GetBlockedCamera(DateTime? dateFrom, DateTime? dateTo, string item, string value, LogMode bLURRED_IMAGE)
    {
      DateTime localDateFrom = dateFrom ?? DateTime.Now;
      var query = dbContext.OperationLog
        .Select(log => new TerminalLogDTO()
        {
          ImgBytes = log.ImgBytes,
          IncidentDate = log.IncidentDate,
          Ip = log.Ip,
          LogId = log.Logid,
          LogMsg = log.LogMsg,
          TerminalID = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault()
        });

      if (LogMode.BLURRED_IMAGE == bLURRED_IMAGE)
        query = query.Where(log => log.ImgBytes != null);
      else
        query = query.Where(log => log.ImgBytes == null);

      if (item.ToLower() == "ip")
        query = query.Where(log => EF.Functions.Like(log.Ip.ToLower(), value.ToLower()));
      if (item.ToLower() == "terminal id")
        query = query.Where(log => EF.Functions.Like(log.TerminalID.ToLower(), value.ToLower()));

      if (dateTo.HasValue)
        query = query.Where(config => config.IncidentDate.Value.Date >= localDateFrom.Date && config.IncidentDate <= dateTo);
      else
        query = query.Where(config => config.IncidentDate.Value.Date == localDateFrom.Date);
      return await query.ToListAsync();
    }

    public async Task<List<TerminalLogDTO>> GetBlockedCamera(DateTime? dateFrom, DateTime? dateTo, int pageNumber, int pageSize, LogMode bLURRED_IMAGE)
    {
      DateTime localDateFrom = dateFrom ?? DateTime.Now;
      var query = dbContext.OperationLog
      .Select(log => new TerminalLogDTO()
      {
        ImgBytes = log.ImgBytes,
        IncidentDate = log.IncidentDate,
        Ip = log.Ip,
        LogId = log.Logid,
        LogMsg = log.LogMsg,
        TerminalID = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault()
      });

      if (LogMode.BLURRED_IMAGE == bLURRED_IMAGE)
        query = query.Where(log => log.ImgBytes != null);
      else
        query = query.Where(log => log.ImgBytes == null);

      if (dateTo.HasValue)
        query = query.Where(config => config.IncidentDate.Value.Date >= localDateFrom.Date && config.IncidentDate <= dateTo);
      else
        query = query.Where(config => config.IncidentDate.Value.Date == localDateFrom.Date);

      query.Skip((pageNumber - 1) * pageSize).Take(pageSize);

      return await query.ToListAsync();
    }

    public async Task<List<TerminalLogDTO>> GetBlockedCamera(int minutes)
    {

      return await dbContext.OperationLog.Where(operationLog => operationLog.ImgBytes != null)
        .Select(log => new TerminalLogDTO
        {
          ImgBytes = log.ImgBytes,
          IncidentDate = log.IncidentDate,
          LogId = log.Logid,
          LogMsg = log.LogMsg,
          TerminalID = dbContext.Terminal.Where(terminal => terminal.Ip == log.Ip).Select(terminal => terminal.Terminalid).FirstOrDefault(),
          Ip = log.Ip
        })
        .OrderByDescending(log => log.IncidentDate)
        .Take(10)
        .ToListAsync();
    }

  }
}
