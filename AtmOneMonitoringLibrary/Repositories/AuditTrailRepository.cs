using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class AuditTrailRepository : IAuditTrailRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    public AuditTrailRepository(AtmOneMonitorContext dbContext)
    {
      this.dbContext = dbContext;
    }
    public async Task Add(AppAudit auditTrail)
    {
      await dbContext.AppAudit.AddAsync(auditTrail);
      await dbContext.SaveChangesAsync();
    }

    public async Task<List<AuditTrailDTO>> GetList() => await dbContext.AppAudit.Select(audit => new AuditTrailDTO() { AuditId = audit.AuditId, Action = audit.Action, Activity = audit.Privilege.Privilege, LogDate = audit.LogDate , PrivilegeId = audit.PrivilegeId, SysIp = audit.SysIp, UserId = audit.UserId, UserName = audit.User.Username }).ToListAsync();

    public async Task<AuditTrailDetailDTO> GetByAuditId(int auditId) => await dbContext.AppAudit.Select(audit => new AuditTrailDetailDTO() { AuditId = audit.AuditId, Action = audit.Action, Activity = audit.Privilege.Privilege, LogDate = audit.LogDate, PrivilegeId = audit.PrivilegeId, SysIp = audit.SysIp, UserId = audit.UserId, UserName = audit.User.Username, NewValues = audit.NewValues, OldValues = audit.OldValues, SysName = audit.SysName }).FirstOrDefaultAsync(audit => audit.AuditId == auditId);

    public  Task<List<AuditTrailDTO>> GetListDate(DateTime date)
    {
      //await dbContext.AppAudit.Select(audit => new AuditTrailDTO() { AuditId = audit.AuditId, Action = audit.Action, Activity = audit.Privilege.Privilege, LogDate = Convert.ToDateTime(audit.LogDate).ToString("dd-MM-yyyy  hh-mm-ss"),  PrivilegeId = audit.PrivilegeId, SysIp = audit.SysIp, UserId = audit.UserId, UserName = audit.User.Username }).Where(audit => audit.LogDate.Value.Date == date.Date).ToListAsync();
      throw new System.NotImplementedException();
    }

    public async Task<List<AuditTrailDTO>> GetList(int pageNumber, int pageSize) => 
      await dbContext.AppAudit
      .Skip((pageNumber - 1) * pageSize)
      .Take(pageSize)
      .Select(audit => new AuditTrailDTO() { AuditId = audit.AuditId, Action = audit.Action, Activity = audit.Privilege.Privilege, LogDate = audit.LogDate, PrivilegeId = audit.PrivilegeId, SysIp = audit.SysIp, UserId = audit.UserId, UserName = audit.User.Username })
      .ToListAsync();

    public async Task<int> TotalRecords() => await dbContext.AppAudit.CountAsync();

    public async Task<List<AuditTrailDTO>> GetFilteredList(int userId, int privilegeId, DateTime? dateFrom, DateTime? dateTo)
    {
      
      var query = dbContext.AppAudit.Select(audit => new AuditTrailDTO() { AuditId = audit.AuditId, Action = audit.Action, Activity = audit.Privilege.Privilege, LogDate = audit.LogDate, PrivilegeId = audit.PrivilegeId, SysIp = audit.SysIp, UserId = audit.UserId, UserName = audit.User.Username });

      if (dateFrom.HasValue)
        query = query.Where(audit => audit.LogDate.Value.Date >= dateFrom.Value.Date);

      if (dateTo.HasValue)
        query = query.Where(audit => audit.LogDate <= dateTo);
   

      if (userId > 0)
        query = query.Where(audit => audit.UserId == userId);

      if (privilegeId > 0)
        query = query.Where(audit => audit.PrivilegeId == privilegeId);
      return await query.ToListAsync();
    }
  }
}
