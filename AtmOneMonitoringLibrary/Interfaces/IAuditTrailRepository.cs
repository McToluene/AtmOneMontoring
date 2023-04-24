using AtmOneMonitoringLibrary.Models;
using AtmOneMonitoringLibrary.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IAuditTrailRepository
  {
    Task Add(AppAudit auditTrail);
    Task<List<AuditTrailDTO>> GetList();
    Task<List<AuditTrailDTO>> GetList(int pageNumber, int pageSize);
    Task<AuditTrailDetailDTO> GetByAuditId(int auditId);
    Task<List<AuditTrailDTO>> GetListDate(DateTime date);
    Task<int> TotalRecords();
    Task<List<AuditTrailDTO>> GetFilteredList(int userId, int privilegeId, DateTime? dateFrom, DateTime? dateTo);

  }
}
