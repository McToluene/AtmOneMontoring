using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class VendorConfigRepository : IVendorConfigRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    private readonly ITerminalConfigRepository terminalConfigRepository;

    public VendorConfigRepository(AtmOneMonitorContext dbContext, ITerminalConfigRepository terminalConfigRepository)
    {
      this.dbContext = dbContext;
      this.terminalConfigRepository = terminalConfigRepository;
    }

    public async Task<bool> Add(VendorConfigurationCreateDTO vendorConfigurationCreate)
    {
      var vendorConfig = await dbContext.VendorConfiguration.FirstOrDefaultAsync(vendor => vendor.VendorId == vendorConfigurationCreate.VendorId && vendor.AppId == vendor.AppId);
      if (vendorConfig != null)
        return await Update(vendorConfigurationCreate);

      VendorConfiguration vendorConfiguration = new VendorConfiguration()
      {
        VendorConfigName = vendorConfigurationCreate.VendorConfigName,
        AppId = vendorConfigurationCreate.AppId,
        VendorId = vendorConfigurationCreate.VendorId,
        ImagePath = vendorConfigurationCreate.ImagePath,
        ImageFilter = vendorConfigurationCreate.ImageFilter,
        AtmlogPath = vendorConfigurationCreate.AtmLogPath,
        AtmlogFilter = vendorConfigurationCreate.AtmLogFilter,
        EjFilter = vendorConfigurationCreate.EjFilter,
        EjPath = vendorConfigurationCreate.EjPath,
        EjectMode = vendorConfigurationCreate.EjectMode,
        RemoteIp = vendorConfigurationCreate.RemoteIp,
        RemotePort = vendorConfigurationCreate.RemotePort,
        WniServiceTimeout = vendorConfigurationCreate.WniServiceTimeout,
        EventsExclude = vendorConfigurationCreate.EventsExclude,
        FwsControl = false,
      };

      await dbContext.AddAsync(vendorConfiguration);
      return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<List<VendorConfigurationDTO>> Get() => await dbContext.VendorConfiguration
      .Select(vendor => new VendorConfigurationDTO()
      {
        VendorConfigId = vendor.VendorConfigId,
        AppId = vendor.AppId,
        AtmLogFilter = vendor.AtmlogFilter,
        AtmLogPath = vendor.AtmlogPath,
        ImageFilter = vendor.ImageFilter,
        ImagePath = vendor.ImagePath,
        VendorConfigName = vendor.VendorConfigName,
        VendorName = vendor.Vendor.Vendor1,
        EjectMode = (vendor.EjectMode == "aandc" ? "AANDC" : (vendor.EjectMode == "ext_fws" ? "FWS-MANAGER" : (vendor.EjectMode == "ext_adpt" ? "NT-MANAGER" : (vendor.EjectMode == "xfs" ? "XFS" : (vendor.EjectMode == "switch" ? "HOST" : "ejectMode2")))))
      })
      .ToListAsync();

    public async Task<List<VendorConfigurationDTO>> Get(string item, string value)
    {
      if (item != null)
      {
        if (item.ToLower() == "vendor")
          return await dbContext.VendorConfiguration
          .Where(vendor => EF.Functions.Like(vendor.Vendor.Vendor1.ToLower(), value.ToLower()))
            .Select(vendor => new VendorConfigurationDTO()
            {
              VendorConfigId = vendor.VendorConfigId,
              AppId = vendor.AppId,
              AtmLogFilter = vendor.AtmlogFilter,
              AtmLogPath = vendor.AtmlogPath,
              ImageFilter = vendor.ImageFilter,
              ImagePath = vendor.ImagePath,
              VendorConfigName = vendor.VendorConfigName,
              VendorName = vendor.Vendor.Vendor1,
              EjectMode = (vendor.EjectMode == "aandc" ? "AANDC" : (vendor.EjectMode == "ext_fws" ? "FWS-MANAGER" : (vendor.EjectMode == "ext_adpt" ? "NT-MANAGER" : (vendor.EjectMode == "xfs" ? "XFS" : (vendor.EjectMode == "switch" ? "HOST" : "ejectMode2")))))
            }).ToListAsync();


        if (item.ToLower() == "app id")
          return await dbContext.VendorConfiguration
            .Where(vendor => EF.Functions.Like(vendor.AppId.ToLower(), value.ToLower()))
              .Select(vendor => new VendorConfigurationDTO()
              {
                VendorConfigId = vendor.VendorConfigId,
                AppId = vendor.AppId,
                AtmLogFilter = vendor.AtmlogFilter,
                AtmLogPath = vendor.AtmlogPath,
                ImageFilter = vendor.ImageFilter,
                ImagePath = vendor.ImagePath,
                VendorConfigName = vendor.VendorConfigName,
                VendorName = vendor.Vendor.Vendor1,
                EjectMode = (vendor.EjectMode == "aandc" ? "AANDC" : (vendor.EjectMode == "ext_fws" ? "FWS-MANAGER" : (vendor.EjectMode == "ext_adpt" ? "NT-MANAGER" : (vendor.EjectMode == "xfs" ? "XFS" : (vendor.EjectMode == "switch" ? "HOST" : "ejectMode2")))))
              }).ToListAsync();
      }
      return null;
    }

    public async Task<List<VendorConfigurationDTO>> Get(int pageNumber, int pageSize) => await dbContext.VendorConfiguration.Skip((pageNumber - 1) * pageSize).Take(pageSize)
      .Select(vendor => new VendorConfigurationDTO()
      {
        VendorConfigId = vendor.VendorConfigId,
        AppId = vendor.AppId,
        AtmLogFilter = vendor.AtmlogFilter,
        AtmLogPath = vendor.AtmlogPath,
        ImageFilter = vendor.ImageFilter,
        ImagePath = vendor.ImagePath,
        VendorConfigName = vendor.VendorConfigName,
        VendorName = vendor.Vendor.Vendor1,
        EjectMode = (vendor.EjectMode == "aandc" ? "AANDC" : (vendor.EjectMode == "ext_fws" ? "FWS-MANAGER" : (vendor.EjectMode == "ext_adpt" ? "NT-MANAGER" : (vendor.EjectMode == "xfs" ? "XFS" : (vendor.EjectMode == "switch" ? "HOST" : "ejectMode2")))))
      })
      .Skip((pageNumber - 1) * pageSize).Take(pageSize)
      .ToListAsync();

    public async Task<List<VendorConfigurationDTO>> Get(string item, string value, int pageNumber, int pageSize)
    {
      if (item != null)
      {
        if (item.ToLower() == "vendor")
          return await dbContext.VendorConfiguration
          .Where(vendor => EF.Functions.Like(vendor.Vendor.Vendor1.ToLower(), value.ToLower()))
            .Select(vendor => new VendorConfigurationDTO()
            {
              VendorConfigId = vendor.VendorConfigId,
              AppId = vendor.AppId,
              AtmLogFilter = vendor.AtmlogFilter,
              AtmLogPath = vendor.AtmlogPath,
              ImageFilter = vendor.ImageFilter,
              ImagePath = vendor.ImagePath,
              VendorConfigName = vendor.VendorConfigName,
              VendorName = vendor.Vendor.Vendor1,
              EjectMode = (vendor.EjectMode == "aandc" ? "AANDC" : (vendor.EjectMode == "ext_fws" ? "FWS-MANAGER" : (vendor.EjectMode == "ext_adpt" ? "NT-MANAGER" : (vendor.EjectMode == "xfs" ? "XFS" : (vendor.EjectMode == "switch" ? "HOST" : "ejectMode2")))))
            }).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();


        if (item.ToLower() == "app id")
          return await dbContext.VendorConfiguration
            .Where(vendor => EF.Functions.Like(vendor.AppId.ToLower(), value.ToLower()))
              .Select(vendor => new VendorConfigurationDTO()
              {
                VendorConfigId = vendor.VendorConfigId,
                AppId = vendor.AppId,
                AtmLogFilter = vendor.AtmlogFilter,
                AtmLogPath = vendor.AtmlogPath,
                ImageFilter = vendor.ImageFilter,
                ImagePath = vendor.ImagePath,
                VendorConfigName = vendor.VendorConfigName,
                VendorName = vendor.Vendor.Vendor1,
                EjectMode = (vendor.EjectMode == "aandc" ? "AANDC" : (vendor.EjectMode == "ext_fws" ? "FWS-MANAGER" : (vendor.EjectMode == "ext_adpt" ? "NT-MANAGER" : (vendor.EjectMode == "xfs" ? "XFS" : (vendor.EjectMode == "switch" ? "HOST" : "ejectMode2")))))
              }).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      }
      return null;
    }

    public async Task<VendorConfigurationCreateDTO> Get(int id) => await dbContext.VendorConfiguration
      .Where(vendor => vendor.VendorConfigId == id)
      .Select(vendor => new VendorConfigurationCreateDTO () {
        VendorConfigId = vendor.VendorConfigId,
        AppId = vendor.AppId, 
        AtmLogFilter = vendor.AtmlogFilter, 
        AtmLogPath = vendor.AtmlogPath, 
        EjectMode=vendor.EjectMode, 
        EjFilter = vendor.EjFilter, 
        EjPath = vendor.EjPath, 
        EventsExclude=vendor.EventsExclude, 
        ImageFilter = vendor.ImageFilter,
        ImagePath = vendor.ImagePath,
        RemoteIp = vendor.RemoteIp,
        RemotePort = vendor.RemotePort,
        VendorConfigName = vendor.VendorConfigName,
        VendorId = vendor.VendorId,
        WniServiceTimeout = vendor.WniServiceTimeout
      }).FirstOrDefaultAsync();
 
    public async Task<int> GetConfigId(int? vendorId)
    {
      var vendorConfig = await dbContext.VendorConfiguration.Select(x => new { x.VendorConfigId, x.VendorId, x.AppId }).FirstOrDefaultAsync(x => x.VendorId == vendorId && x.AppId == "IC");
      return vendorConfig.VendorConfigId;
    }

    public async Task<int> TotalRecords() => await dbContext.VendorConfiguration.CountAsync();

    public async Task<int> TotalRecords(string item, string value)
    {
      int count = 0;
      if (item != null)
      {
        if (item.ToLower() == "vendor")
          count = await dbContext.VendorConfiguration.Where(vendor => EF.Functions.Like(vendor.Vendor.Vendor1.ToLower(), value.ToLower())).CountAsync();
        if (item.ToLower() == "app id")
          count = await dbContext.VendorConfiguration.Where(vendor => EF.Functions.Like(vendor.AppId.ToLower(), value.ToLower())).CountAsync();
      }

      return count;
    }

    public async Task<bool> Update(VendorConfigurationCreateDTO vendorConfigurationCreate)
    {
      var vendorConfig =
        await dbContext.VendorConfiguration
        .FirstOrDefaultAsync(vendor => vendor.VendorId == vendorConfigurationCreate.VendorId && vendor.AppId == vendor.AppId);

      if (vendorConfig != null)
      {
        vendorConfig.VendorConfigName = vendorConfigurationCreate.VendorConfigName;
        vendorConfig.AppId = vendorConfigurationCreate.AppId;
        vendorConfig.VendorId = vendorConfigurationCreate.VendorId;
        vendorConfig.ImagePath = vendorConfigurationCreate.ImagePath;
        vendorConfig.ImageFilter = vendorConfigurationCreate.ImageFilter;
        vendorConfig.AtmlogPath = vendorConfigurationCreate.AtmLogPath;
        vendorConfig.AtmlogFilter = vendorConfigurationCreate.AtmLogFilter;
        vendorConfig.EjFilter = vendorConfigurationCreate.EjFilter;
        vendorConfig.EjPath = vendorConfigurationCreate.EjPath;
        vendorConfig.EjectMode = vendorConfigurationCreate.EjectMode;
        vendorConfig.RemoteIp = vendorConfigurationCreate.RemoteIp;
        vendorConfig.RemotePort = vendorConfigurationCreate.RemotePort;
        vendorConfig.WniServiceTimeout = vendorConfigurationCreate.WniServiceTimeout;
        vendorConfig.EventsExclude = vendorConfigurationCreate.EventsExclude;
        vendorConfig.FwsControl = false;

        dbContext.VendorConfiguration.Update(vendorConfig);
        return await dbContext.SaveChangesAsync() > 0;
      }
      return false;
    }

    public async Task<bool> Update(VendorConfigurationCreateDTO vendorConfiguration, int userId, bool configloaded)
    {
      bool isUpdated = await Update(vendorConfiguration);

      if (isUpdated && configloaded)
      {
        var configApproval = await terminalConfigRepository.GetByVendorConfigId(vendorConfiguration.VendorConfigId);
        if (configApproval.Count > 0)
          isUpdated = await terminalConfigRepository.OpenIncidentForApproval(false, configApproval, userId);
      }
      return isUpdated;
    }
  }
}
