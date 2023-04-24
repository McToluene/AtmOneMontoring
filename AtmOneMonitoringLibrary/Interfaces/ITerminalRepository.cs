using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface ITerminalRepository
  {
    Task<bool> AddRange(List<TerminalDTO> terminals);
    Task<bool> Add(TerminalDTO terminal);
    Task<bool> Update(TerminalDTO terminal);
    Task<List<TerminalForResponsDTO>> GetAll();
    Task<List<string>> GetAllIp();
    Task<List<OnlineTerminalDTO>> GetOnline();
    Task<string> GetTerminalId(string Ip);
    Task<List<TerminalForResponsDTO>> GetAll(string item, string value);
    Task<int> GetIpCount();
    Task<List<TerminalForResponsDTO>> GetAll(string item, string value, int pageNumber, int pageSize);
    Task<List<TerminalForResponsDTO>> GetAll(int pageNumber, int pageSize);
    Task<int> TotalRecords(string item, string value);
    Task<int> TotalRecords();
    Task<TerminalDTO> GetTerminalById(string id);
    Task<Terminal> GetById(int? id);
    Task<List<OnlineTerminalDTO>> GetOnline(DateTime? dateFrom, DateTime? dateTo, string item, string value, int pageNumber, int pageSize);
    Task<int> GetOnlineTotalRecords(DateTime? dateFrom, DateTime? dateTo, string item, string value);
    Task<List<OnlineTerminalDTO>> GetOnline(int pageNumber, int pageSize);
    Task<List<OnlineTerminalDTO>> GetOnline(DateTime? dateFrom, DateTime? dateTo, string item, string value);
    Task<List<TerminalVendor>> GetByVendorId(int id);
    Task<bool> Add(List<TerminalDTO> terminals);
    Task<int> GetOnlineTerminals();
  }
}
