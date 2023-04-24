using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;

namespace AtmOneMonitorMVC.Repository
{
  public class BranchRepository : IBranchRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    public BranchRepository(AtmOneMonitorContext atmOneMonitorDashBoardContext)
    {
      dbContext = atmOneMonitorDashBoardContext;
    }

    public async Task<bool> AddBranch(BranchDTO branch)
    {

      try
      {
        Branch branchFromDb = await dbContext.Branch.FirstOrDefaultAsync(x => x.BranchCode == branch.BranchCode);
        if (branchFromDb != null) return false;

        Branch newbranch = new Branch
        {
          BranchCode = branch.BranchCode,
          BranchName = branch.BranchName,
          Emails = branch.Emails
        };

        await dbContext.Branch.AddAsync(newbranch);
        return await dbContext.SaveChangesAsync() > 0;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return false;
      }

    }

    public async Task<bool> AddBranch(List<BranchDTO> branches)
    {
      bool result = false;
      foreach (var branch in branches)
      {
        if (string.IsNullOrEmpty(branch.BranchName) || string.IsNullOrEmpty(branch.Emails)) continue;
        result = await AddBranch(branch);
      }
      return result;
    }

    public async Task<BranchDTO> GetBranch(int id) => await dbContext.Branch.Where(branch => branch.BranchId == id).Select(branch => new BranchDTO() { BranchId = branch.BranchId, BranchCode = branch.BranchCode, BranchName = branch.BranchName, Emails = branch.Emails }).FirstOrDefaultAsync();

    public async Task<List<Branch>> GetBranches() => await dbContext.Branch.ToListAsync();

    public async Task<List<Branch>> GetBranches(int pageNumber, int pageSize) => await dbContext.Branch.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

    public async Task<List<Branch>> GetBranches(string item, string value)
    {
      if (item != null)
      {
        if (item.ToLower() == "branch name")
          return await dbContext.Branch
            .Where(branch => EF.Functions.Like(branch.BranchName.ToLower(), value.ToLower())).ToListAsync();
        if (item.ToLower() == "branch code")
          return await dbContext.Branch
            .Where(branch => EF.Functions.Like(branch.BranchCode.ToLower(), value.ToLower())).ToListAsync();
      }
      return null;
    }

    public async Task<List<Branch>> GetBranches(string item, string value, int pageNumber, int pageSize)
    {
      List<Branch> branches = new List<Branch>();
      if (item != null)
      {
        if (item.ToLower() == "branch name")
          branches = await dbContext.Branch
            .Where(branch => EF.Functions.Like(branch.BranchName.ToLower(), value.ToLower())).Skip((pageNumber - 1) * pageSize)
            .Take(pageSize).ToListAsync();
        if (item.ToLower() == "branch code")
          branches = await dbContext.Branch
            .Where(branch => EF.Functions.Like(branch.BranchCode.ToLower(), value.ToLower())).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      }
      return branches;
    }

    public async Task<int> TotalRecords() => await dbContext.Branch.CountAsync();

    public async Task<int> TotalRecords(string item, string value)
    {
      int count = 0;
      if (item != null)
      {
        if (item.ToLower() == "branch name")
          count = await dbContext.Branch.Where(branch => EF.Functions.Like(branch.BranchName.ToLower(), value.ToLower())).CountAsync();
        if (item.ToLower() == "branch code")
          count = await dbContext.Branch.Where(branch => EF.Functions.Like(branch.BranchCode.ToLower(), value.ToLower())).CountAsync();
      }
      return count;
    }

    public async Task<bool> Update(BranchDTO branch)
    {
      Branch branchFromDb = await dbContext.Branch.FirstOrDefaultAsync(x => x.BranchId == branch.BranchId);
      if (branchFromDb == null) return false;

      branchFromDb.BranchCode = branch.BranchCode;
      branchFromDb.BranchName = branch.BranchName;
      branchFromDb.Emails = branch.Emails;

      dbContext.Branch.Update(branchFromDb);

      return await dbContext.SaveChangesAsync() > 0;
    }
  }
}