using System.Collections.Generic;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Models;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface ITerminalConfigRepository
  {
    Task Insert(TerminalConfig terminalConfig);
    Task<bool> Insert(List<TerminalConfig> terminalConfigs);
    Task Update(int vendorConfigId, int? id);
    Task<List<ConfigurationApprovalDTO>> GetByVendorConfigId(int vendorConfigId);
    Task<bool> OpenIncidentForApproval(bool approved, List<ConfigurationApprovalDTO> configApproval, int userId);
    Task<bool> Add(TerminalConfigurationCreateDTO terminalConfigurationCreate);
    Task<List<TerminalConfigurationDTO>> Get(string item, string value);
    Task<List<TerminalConfigurationDTO>> Get();
    Task<int> TotalRecords(string item, string value);
    Task<List<TerminalConfigurationDTO>> Get(string item, string value, int pageNumber, int pageSize);
    Task<int> TotalRecords();
    Task<List<TerminalConfigurationDTO>> Get(int pageNumber, int pageSize);
    Task<TerminalConfigurationCreateDTO> Get(int id);
    Task<ApproveTerminal> GetConfiguration(int id);
    Task<bool> Approve(int userId, int configId);
    Task<List<TerminalConfigApprovalDTO>> GetTerminalApprovals(string item, string value, int userId);
    Task<List<TerminalConfigApprovalDTO>> GetTerminalApprovals(int userId);
    Task<int> TotalTerminalApprovalRecords(string item, string value, int userId);
    Task<List<TerminalConfigApprovalDTO>> GetTerminalApprovals(string item, string value, int pageNumber, int pageSize, int userId);
    Task<List<TerminalConfigApprovalDTO>> GetTerminalApprovals(int pageNumber, int pageSize, int id);
    Task<int> TotalTerminalApprovalRecords(int userId);
  }
}
