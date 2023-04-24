using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class TerminalRepository : ITerminalRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    private readonly IVendorConfigRepository vendorConfigRepository;
    private readonly ITerminalConfigRepository terminalConfigRepository;

    public TerminalRepository(AtmOneMonitorContext dbContext, IVendorConfigRepository vendorConfigRepository, ITerminalConfigRepository terminalConfigRepository)
    {
      this.dbContext = dbContext;
      this.vendorConfigRepository = vendorConfigRepository;
      this.terminalConfigRepository = terminalConfigRepository;
    }
    public async Task<bool> Add(TerminalDTO terminal)
    {
      bool result = false;
      Terminal terminalFromDb = await dbContext.Terminal.FirstOrDefaultAsync(x => x.Ip == terminal.Ip || x.Terminalid == terminal.TerminalId);
      if (terminalFromDb == null)
      {
        Terminal createdTerminal = new Terminal()
        {
          Ip = terminal.Ip,
          Terminalid = terminal.TerminalId,
          Title = terminal.Title,
          Vendorid = terminal.VendorId,
          BranchId = terminal.BranchId > 0 ? terminal.BranchId : null,
          Createddate = DateTime.Now
        };

        var savedTerminal = await dbContext.Terminal.AddAsync(createdTerminal);
        await dbContext.SaveChangesAsync();
        int vendorConfigId = await vendorConfigRepository.GetConfigId(terminal.VendorId);

        if (vendorConfigId > 0)
        {
          TerminalConfig terminalConfig = new TerminalConfig() {
            Id = savedTerminal.Entity.Id,
            VendorConfigId = vendorConfigId,
            ImageBrightness = 0.17,
            NightSensitivity = 0.085,
            ManageCapturing = true,
            EscalationDelayTimeInMin = 1.85,
            ValidationMode = "blockage_only",
            SendAlert = true,
            Debuglevel = 0,
            Configloaded = false,
            IntelliCamEnabled = true,
            ExcludeFaceForNight = true
          };
          await terminalConfigRepository.Insert(terminalConfig);
        }
        return await dbContext.SaveChangesAsync() > 0;

      } else {
        result = await Update(terminal);
      }
      return result;
    }

    public async Task<bool> AddRange(List<TerminalDTO> terminals)
    {
      var results = new List<Task>();
      foreach (var terminal in terminals)
      {
        var task = Add(terminal);
        results.Add(task);
      }
      await Task.WhenAll();
      return true;
    }

    public async Task<List<TerminalForResponsDTO>> GetAll() => await dbContext.Terminal.Select(terminal => new TerminalForResponsDTO () { TerminalId = terminal.Terminalid, Ip = terminal.Ip, Vendor = terminal.Vendor.Vendor1, VendorId = terminal.Vendorid, Title = terminal.Title }).ToListAsync();
   
    public async Task<List<string>> GetAllIp() => await dbContext.Terminal.Select(terminal => terminal.Ip).Distinct().ToListAsync();

    public async Task<bool> Update(TerminalDTO terminal)
    {
      Terminal terminalFromDB = await dbContext.Terminal.FirstOrDefaultAsync(t => t.Id == terminal.Id);
      if (terminalFromDB == null) return false;

      terminalFromDB.Ip = terminal.Ip;
      terminalFromDB.Terminalid = terminal.TerminalId;
      terminalFromDB.Title = terminal.Title;
      terminalFromDB.Vendorid = terminal.VendorId;
      terminalFromDB.BranchId = terminal.BranchId > 0 ? terminal.BranchId : null;

      dbContext.Terminal.Update(terminalFromDB);

      int vendorConfigId = await vendorConfigRepository.GetConfigId(terminal.VendorId);
      if (vendorConfigId > 0)
        await terminalConfigRepository.Update(vendorConfigId, terminal.Id);

      return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<string> GetTerminalId(string Ip) => await dbContext.Terminal.Where(terminal => terminal.Ip == Ip).Select(terminal => terminal.Terminalid).FirstOrDefaultAsync();

    public async Task<List<TerminalForResponsDTO>> GetAll(string item, string value)
    {
      List<TerminalForResponsDTO> terminals = new List<TerminalForResponsDTO>();
      var query = dbContext.Terminal.Select(terminal => new TerminalForResponsDTO() { TerminalId = terminal.Terminalid, Ip = terminal.Ip, Title = terminal.Title, Vendor = terminal.Vendor.Vendor1, VendorId = terminal.Vendorid });
      if (item.ToLower() == "vendor")
        terminals = await query.Where(terminal => EF.Functions.Like(terminal.Vendor.ToLower(), value.ToLower())).ToListAsync();
      if (item.ToLower() == "ip")
        terminals = await query.Where(terminal => EF.Functions.Like(terminal.Ip.ToLower(), value.ToLower())).ToListAsync();
      if (item.ToLower() == "terminal id")
        terminals = await query.Where(terminal => EF.Functions.Like(terminal.TerminalId.ToLower(), value.ToLower())).ToListAsync();
      return terminals;
    }

    public async Task<List<TerminalForResponsDTO>> GetAll(string item, string value, int pageNumber, int pageSize)
    {
      List<TerminalForResponsDTO> terminals = new List<TerminalForResponsDTO>();
      var query = dbContext.Terminal.Select(terminal => new TerminalForResponsDTO() { TerminalId = terminal.Terminalid, Ip = terminal.Ip, Title = terminal.Title, Vendor = terminal.Vendor.Vendor1, VendorId = terminal.Vendorid });
      if (item.ToLower() == "vendor")
        terminals = await query.Where(terminal => EF.Functions.Like(terminal.Vendor.ToLower(), value.ToLower())).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      if (item.ToLower() == "ip")
        terminals = await query.Where(terminal => EF.Functions.Like(terminal.Ip.ToLower(), value.ToLower())).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      if (item.ToLower() == "terminal id")
        terminals = await query.Where(terminal => EF.Functions.Like(terminal.TerminalId.ToLower(), value.ToLower())).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      return terminals;
    }

    public async Task<List<TerminalForResponsDTO>> GetAll(int pageNumber, int pageSize) => await dbContext.Terminal
      .Select(terminal => new TerminalForResponsDTO() { TerminalId = terminal.Terminalid, Ip = terminal.Ip, Vendor = terminal.Vendor.Vendor1, VendorId = terminal.Vendorid, Title = terminal.Title })
      .Skip((pageNumber - 1) * pageSize).Take(pageSize)
      .ToListAsync();

    public async Task<int> TotalRecords(string item, string value)
    {
      int count = 0;
      if (item.ToLower() == "vendor")
        count = await dbContext.Terminal.Where(terminal => EF.Functions.Like(terminal.Vendor.Vendor1.ToLower(), value.ToLower())).CountAsync();
      if (item.ToLower() == "ip")
        count = await dbContext.Terminal.Where(terminal => EF.Functions.Like(terminal.Ip.ToLower(), value.ToLower())).CountAsync();
      if (item.ToLower() == "terminal ip")
        count = await dbContext.Terminal.Where(terminal => EF.Functions.Like(terminal.Terminalid.ToLower(), value.ToLower())).CountAsync();
      return count;
    }

    public async Task<int> TotalRecords() => await dbContext.Terminal.CountAsync();

    public async Task<TerminalDTO> GetTerminalById(string id) => await dbContext.Terminal.Select(terminal => new TerminalDTO() { BranchId = terminal.BranchId, Ip = terminal.Ip, Title = terminal.Title, TerminalId = terminal.Terminalid, VendorId = terminal.Vendor.VendorId, Id = terminal.Id }).FirstOrDefaultAsync(terminal => terminal.TerminalId == id);

    public async Task<Terminal> GetById(int? id) => await dbContext.Terminal.FirstOrDefaultAsync(t => t.Id == id);

    public async Task<List<OnlineTerminalDTO>> GetOnline(DateTime? dateFrom, DateTime? dateTo, string item, string value, int pageNumber, int pageSize)
    {
      DateTime localDateFrom = dateFrom ?? DateTime.Now ;
      var query = dbContext.Terminal.Select(terminal => new OnlineTerminalDTO() { Ip = terminal.Ip, OnlineDate = terminal.OnlineDate, TerminalId = terminal.Terminalid, Vendor = terminal.Vendor.Vendor1 });

      if (item.ToLower() == "ip")
        query = query.Where(terminal => EF.Functions.Like(terminal.Ip.ToLower(), value.ToLower()));
      if (item.ToLower() == "vendor")
        query = query.Where(terminal => EF.Functions.Like(terminal.Vendor.ToLower(), value.ToLower()));
      if (item.ToLower() == "terminal id")
        query = query.Where(terminal => EF.Functions.Like(terminal.TerminalId.ToLower(), value.ToLower()));

      if (dateTo.HasValue)
        query = query.Where(terminal => terminal.OnlineDate.Value.Date >= localDateFrom.Date && terminal.OnlineDate <= dateTo);
      else
        query = query.Where(terminal => terminal.OnlineDate.Value.Date == localDateFrom.Date);

      query.Skip((pageNumber - 1) * pageSize).Take(pageSize);

      return await query.ToListAsync();
    }

    public async Task<int> GetOnlineTotalRecords(DateTime? dateFrom, DateTime? dateTo, string item, string value)
    {
      DateTime localDateFrom = dateFrom ?? DateTime.Now ;
      var query = dbContext.Terminal.Select(terminal => new OnlineTerminalDTO() { Ip = terminal.Ip, OnlineDate = terminal.OnlineDate, TerminalId = terminal.Terminalid, Vendor = terminal.Vendor.Vendor1 });

      if (item.ToLower() == "ip")
        query = query.Where(terminal => EF.Functions.Like(terminal.Ip.ToLower(), value.ToLower()));
      if (item.ToLower() == "vendor")
        query = query.Where(terminal => EF.Functions.Like(terminal.Vendor.ToLower(), value.ToLower()));
      if (item.ToLower() == "terminal id")
        query = query.Where(terminal => EF.Functions.Like(terminal.TerminalId.ToLower(), value.ToLower()));

      if (dateTo.HasValue)
        query = query.Where(terminal => terminal.OnlineDate.Value.Date >= localDateFrom.Date && terminal.OnlineDate <= dateTo);
      else
        query = query.Where(terminal => terminal.OnlineDate.Value.Date == localDateFrom.Date);
      return await query.CountAsync();
    }

    public async Task<List<OnlineTerminalDTO>> GetOnline(int pageNumber, int pageSize) => await dbContext.Terminal
      .Select(terminal => new OnlineTerminalDTO() { Ip = terminal.Ip, OnlineDate = terminal.OnlineDate, TerminalId = terminal.Terminalid, Vendor = terminal.Vendor.Vendor1 })
      .Skip((pageNumber - 1) * pageSize).Take(pageSize)
      .ToListAsync();

    public async Task<List<OnlineTerminalDTO>> GetOnline() => await dbContext.Terminal.Select(terminal => new OnlineTerminalDTO() { TerminalId = terminal.Terminalid, Ip = terminal.Ip, Vendor = terminal.Vendor.Vendor1, OnlineDate = terminal.OnlineDate }).ToListAsync();

    public async Task<List<OnlineTerminalDTO>> GetOnline(DateTime? dateFrom, DateTime? dateTo, string item, string value)
    {
      DateTime localDateFrom = dateFrom ?? DateTime.Now;
      var query = dbContext.Terminal.Select(terminal => new OnlineTerminalDTO() { Ip = terminal.Ip, OnlineDate = terminal.OnlineDate, TerminalId = terminal.Terminalid, Vendor = terminal.Vendor.Vendor1 });

      if (item.ToLower() == "ip")
        query = query.Where(terminal => EF.Functions.Like(terminal.Ip.ToLower(), value.ToLower()));
      if (item.ToLower() == "vendor")
        query = query.Where(terminal => EF.Functions.Like(terminal.Vendor.ToLower(), value.ToLower()));
      if (item.ToLower() == "terminal id")
        query = query.Where(terminal => EF.Functions.Like(terminal.TerminalId.ToLower(), value.ToLower()));

      if (dateTo.HasValue)
        query = query.Where(terminal => terminal.OnlineDate.Value.Date >= localDateFrom.Date && terminal.OnlineDate <= dateTo);
      else
        query = query.Where(terminal => terminal.OnlineDate.Value.Date == localDateFrom.Date);
      return await query.ToListAsync();
    }

    public async Task<int> GetIpCount() => await dbContext.Terminal.Select(terminal => terminal.Ip).Distinct().CountAsync();

    public async Task<List<TerminalVendor>> GetByVendorId(int id) => await dbContext.Terminal.Where(terminal => terminal.Vendorid == id).Select(terminal => new TerminalVendor() { Ip = terminal.Ip, TerminalId = terminal.Terminalid }).ToListAsync();

    public async Task<bool> Add(List<TerminalDTO> terminals)
    {
      bool result = false;
      foreach (var terminal in terminals)
      {
        if (string.IsNullOrEmpty(terminal.Ip) || string.IsNullOrEmpty(terminal.TerminalId)) continue;
        terminal.Title.Replace("'", "''");
        result = await Add(terminal);
      }
      return result;
    }

    public async Task<int> GetOnlineTerminals() => await dbContext.Terminal.Where(terminal => terminal.OnlineDate.Value.Date == DateTime.Now.Date).CountAsync();
     
  }
}
