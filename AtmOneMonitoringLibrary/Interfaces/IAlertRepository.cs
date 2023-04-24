using System.Collections.Generic;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IAlertRepository
  {
    bool Purge();
    Task<CameraDto> CameraIssue();
    Task<EjectDTO> EjectIssue();
    Task<List<IssueDTO>> GetDataHistory(string appId);
    Task<List<IssueDTO>> GetDataHistory(string appId, int range);
    Task<List<IssueDTO>> GetSelectedDataHistory(string appId, string msgCat);
    Task<List<IssueDTO>> GetDataHistory(string appId, int range, int pageNumber, int pageSize);
    Task<List<IssueDTO>> GetSelectedDataHistory(string appId, int pageNumber, int pageSize, string msgCat);
    Task<List<IssueDTO>> GetIssuesDetails(string appId, int range, string item, string value);
    Task<List<IssueDTO>> GetSelectedIssuesDetails(string appId, string item, string value, string msgCat);
    Task<List<IssueDTO>> GetIssuesDetails(string appId, int range, string item, string value, int pageNumber, int pageSize);
    Task<List<IssueDTO>> GetSelectedIssuesDetails(string appId, string item, string value, int pageNumber, int pageSize, string msgCat);
    Task<int> TotalRecords(string appId, int range);
    Task<int> TotalSelectedRecords(string appId, string msgCat);
    Task<int> TotalRecords(string appId, int range, string item, string value);
    Task<int> TotalSelectedRecords(string appId, string item, string value, string msgCat);
  }
}