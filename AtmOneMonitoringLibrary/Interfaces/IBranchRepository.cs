using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IBranchRepository
  {
    Task<List<Branch>> GetBranches();
    Task<List<Branch>> GetBranches(int pageNumber, int pageSize);
    Task<List<Branch>> GetBranches(string item, string value);
    Task<List<Branch>> GetBranches(string item, string value, int pageNumber, int pageSize);
    Task<int> TotalRecords();
    Task<int> TotalRecords(string item, string value);
    Task<bool> AddBranch(BranchDTO branch);
    Task<BranchDTO> GetBranch(int id);
    Task<bool> Update(BranchDTO branch);
    Task<bool> AddBranch(List<BranchDTO> branches);
  }
}