using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class TerminalConfigRepository : ITerminalConfigRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    private readonly IAppUserRepository appUserRepository;

    public TerminalConfigRepository(AtmOneMonitorContext dbContext, IAppUserRepository appUserRepository)
    {
      this.dbContext = dbContext;
      this.appUserRepository = appUserRepository;
    }

    public async Task<List<ConfigurationApprovalDTO>> GetByVendorConfigId(int vendorConfigId) =>
      await dbContext.VwConfigurationApproval
      .Where(vendorConfig => vendorConfig.VendorConfigId == vendorConfigId)
      .Select(vendorConfig => new ConfigurationApprovalDTO() { Approved = vendorConfig.Approved, ApprovedBy = vendorConfig.ApprovedBy, ApprovedDate = vendorConfig.ApprovedDate, ConfigId = vendorConfig.ConfigId, UpdatedBy = vendorConfig.UpdatedBy, UpdatedDate = vendorConfig.UpdatedDate })
      .ToListAsync();


    public async Task Insert(TerminalConfig terminalConfig) => await dbContext.TerminalConfig.AddAsync(terminalConfig);

    public async Task<bool> OpenIncidentForApproval(bool approved, List<ConfigurationApprovalDTO> configApprovals, int userId)
    {
      bool result = false;

      foreach (var configApproval in configApprovals)
      {
        result = await AddConfigApproval(configApproval, approved, userId);
      }
      return result;
    }

    private async Task<bool> AddConfigApproval(ConfigurationApprovalDTO configurationApproval, bool approved, int userId)
    {
      var configApprovalFromDB = await dbContext.ConfigApproval.FirstOrDefaultAsync(x => x.ConfigId == configurationApproval.ConfigId);
      if (configApprovalFromDB != null)
        await UpdateConfigApproval(configurationApproval, approved, userId);

      ConfigApproval configApproval = new ConfigApproval()
      {
        ConfigId = configurationApproval.ConfigId,
        UpdatedBy = userId,
        Approved = approved,
        UpdatedDate = DateTime.Now
      };

      await dbContext.ConfigApproval.AddAsync(configApproval);
      return await dbContext.SaveChangesAsync() > 0;
    }

    private async Task<bool> UpdateConfigApproval(ConfigurationApprovalDTO configurationApproval, bool approved, int userId)
    {
      var configApprovalFromDB = await dbContext.ConfigApproval.FirstOrDefaultAsync(x => x.ConfigId == configurationApproval.ConfigId);
      if (configApprovalFromDB != null)
      {
        configApprovalFromDB.UpdatedBy = userId;
        configApprovalFromDB.UpdatedDate = DateTime.Now;
        configApprovalFromDB.Approved = approved;

        dbContext.ConfigApproval.Update(configApprovalFromDB);
        return await dbContext.SaveChangesAsync() > 0;
      }
      return false;
    }

    public async Task Update(int vendorConfigId, int? id)
    {
      TerminalConfig config = await dbContext.TerminalConfig.FirstOrDefaultAsync(config => config.Id == id);
      config.VendorConfigId = vendorConfigId;
      dbContext.TerminalConfig.Update(config);
    }

    public async Task<bool> Add(TerminalConfigurationCreateDTO terminalConfigurationCreate)
    {
      bool result = false;
      List<TerminalConfig> terminalConfigs = new List<TerminalConfig>();
      foreach (var terminal in terminalConfigurationCreate.SelectedTerminals)
      {
        TerminalDTO terminalFromDB = await dbContext.Terminal.Select(terminal => new TerminalDTO() { BranchId = terminal.BranchId, Ip = terminal.Ip, Title = terminal.Title, TerminalId = terminal.Terminalid, VendorId = terminal.Vendor.VendorId, Id = terminal.Id }).FirstOrDefaultAsync(terminal => terminal.TerminalId == terminal.TerminalId);
        if (terminalFromDB != null)
        {
          TerminalConfig terminalConfig = new TerminalConfig
          {
            VendorConfigId = terminalConfigurationCreate.VendorConfigId,
            ImageBrightness = terminalConfigurationCreate.ImageBrightness,
            NightSensitivity = terminalConfigurationCreate.NightSensitivity,
            ManageCapturing = terminalConfigurationCreate.ManageCapturing,
            ValidationMode = terminalConfigurationCreate.ValidationMode,
            IntelliCamEnabled = terminalConfigurationCreate.IntelliCamEnabled,
            EscalationDelayTimeInMin = terminalConfigurationCreate.EscalationDelayTimeInMin,
            SendAlert = terminalConfigurationCreate.SendAlert,
            Debuglevel = terminalConfigurationCreate.Debuglevel,
            Configloaded = false,
            Id = terminalFromDB.Id,

          };
          terminalConfigs.Add(terminalConfig);
        }
      }
      if (terminalConfigs.Count > 0)
        result = await Insert(terminalConfigs);
      return result;
    }

    public async Task<bool> Insert(List<TerminalConfig> terminalConfigs)
    {
      foreach (var terminalConfig in terminalConfigs)
      {
        var terminalConfigFromDB = await dbContext.TerminalConfig.FirstOrDefaultAsync(x => x.Id == terminalConfig.Id && x.VendorConfigId == terminalConfig.VendorConfigId);
        if (terminalConfigFromDB == null)
          await Insert(terminalConfig);
        else
          await Update(terminalConfig);
      }

      return await dbContext.SaveChangesAsync() > 0;
    }

    private async Task Update(TerminalConfig terminalConfig)
    {
      var terminalConfigFromDB = await dbContext.TerminalConfig.FirstOrDefaultAsync(x => x.Id == terminalConfig.Id && x.VendorConfigId == terminalConfig.VendorConfigId);
      if (terminalConfigFromDB != null)
      {
        terminalConfigFromDB.ImageBrightness = terminalConfig.ImageBrightness;
        terminalConfigFromDB.NightSensitivity = terminalConfig.NightSensitivity;
        terminalConfigFromDB.ManageCapturing = terminalConfig.ManageCapturing;
        terminalConfigFromDB.SendAlert = terminalConfig.SendAlert;
        terminalConfigFromDB.ValidationMode = terminalConfig.ValidationMode;
        terminalConfigFromDB.EscalationDelayTimeInMin = terminalConfig.EscalationDelayTimeInMin;
        terminalConfigFromDB.Debuglevel = terminalConfig.Debuglevel;
        terminalConfigFromDB.Configloaded = terminalConfig.Configloaded;
        terminalConfigFromDB.IntelliCamEnabled = terminalConfig.IntelliCamEnabled;
        terminalConfigFromDB.ExcludeFaceForNight = terminalConfig.ExcludeFaceForNight;
        terminalConfigFromDB.Updateddate = DateTime.Now;

        dbContext.TerminalConfig.Update(terminalConfigFromDB);
      }
    }

    public async Task<List<TerminalConfigurationDTO>> Get(string item, string value)
    {
      if (item != null)
      {
        if (item.ToLower() == "ip")
          return await dbContext.VwConfiguration.Where(terminal => EF.Functions.Like(terminal.Ip.ToLower(), value.ToLower()))
            .Select(terminal => new TerminalConfigurationDTO
            {
              Ip = terminal.Ip,
              AppId = terminal.AppId,
              ConfigId = terminal.ConfigId,
              ImagePath = terminal.ImagePath,
              ManageCapturing = terminal.ManageCapturing,
              VendorConfigId = terminal.VendorConfigId,
              Vendor = dbContext.Vendor.Where(vendor => vendor.VendorId == terminal.VendorId).Select(vendor => vendor.Vendor1).FirstOrDefault()
            })
            .ToListAsync();

        if (item.ToLower() == "vendor")
          return await dbContext.VwConfiguration.Select(terminal => new TerminalConfigurationDTO
          {
            Ip = terminal.Ip,
            AppId = terminal.AppId,
            ConfigId = terminal.ConfigId,
            ImagePath = terminal.ImagePath,
            ManageCapturing = terminal.ManageCapturing,
            VendorConfigId = terminal.VendorConfigId,
            Vendor = dbContext.Vendor.Where(vendor => vendor.VendorId == terminal.VendorId).Select(vendor => vendor.Vendor1).FirstOrDefault()
          })
             .Where(terminal => EF.Functions.Like(terminal.Vendor.ToLower(), value.ToLower()))
            .ToListAsync();

        if (item.ToLower() == "app id")
          return await dbContext.VwConfiguration.Where(terminal => EF.Functions.Like(terminal.AppId.ToLower(), value.ToLower()))
              .Select(terminal => new TerminalConfigurationDTO
              {
                Ip = terminal.Ip,
                AppId = terminal.AppId,
                ConfigId = terminal.ConfigId,
                ImagePath = terminal.ImagePath,
                ManageCapturing = terminal.ManageCapturing,
                VendorConfigId = terminal.VendorConfigId,
                Vendor = dbContext.Vendor.Where(vendor => vendor.VendorId == terminal.VendorId).Select(vendor => vendor.Vendor1).FirstOrDefault()
              })
             .ToListAsync();
      }
      return null;
    }

    public async Task<List<TerminalConfigurationDTO>> Get() => await dbContext.VwConfiguration
      .Select(terminal => new TerminalConfigurationDTO
      {
        Ip = terminal.Ip,
        AppId = terminal.AppId,
        ConfigId = terminal.ConfigId,
        ImagePath = terminal.ImagePath,
        ManageCapturing = terminal.ManageCapturing,
        VendorConfigId = terminal.VendorConfigId,
        Vendor = dbContext.Vendor.Where(vendor => vendor.VendorId == terminal.VendorId).Select(vendor => vendor.Vendor1).FirstOrDefault()
      }).ToListAsync();

    public async Task<int> TotalRecords(string item, string value)
    {
      int count = 0;
      if (item != null)
      {
        if (item.ToLower() == "ip")
          count = await dbContext.VwConfiguration.Where(terminal => EF.Functions.Like(terminal.Ip.ToLower(), value.ToLower())).CountAsync();
        if (item.ToLower() == "vendor")
          count = await dbContext.VwConfiguration.Where(terminal => EF.Functions.Like(terminal.VendorConfigName.ToLower(), value.ToLower())).CountAsync();
        if (item.ToLower() == "app id")
          count = await dbContext.VwConfiguration.Where(terminal => EF.Functions.Like(terminal.AppId.ToLower(), value.ToLower())).CountAsync();
      }
      return count;
    }

    public async Task<List<TerminalConfigurationDTO>> Get(string item, string value, int pageNumber, int pageSize)
    {
      if (item != null)
      {
        if (item.ToLower() == "ip")
          return await dbContext.VwConfiguration.Where(terminal => EF.Functions.Like(terminal.Ip.ToLower(), value.ToLower()))
            .Select(terminal => new TerminalConfigurationDTO
            {
              Ip = terminal.Ip,
              AppId = terminal.AppId,
              ConfigId = terminal.ConfigId,
              ImagePath = terminal.ImagePath,
              ManageCapturing = terminal.ManageCapturing,
              VendorConfigId = terminal.VendorConfigId,
              Vendor = dbContext.Vendor.Where(vendor => vendor.VendorId == terminal.VendorId).Select(vendor => vendor.Vendor1).FirstOrDefault()
            })
            .Skip((pageNumber - 1) * pageSize).Take(pageSize)
            .ToListAsync();

        if (item.ToLower() == "vendor")
          return await dbContext.VwConfiguration.Where(terminal => EF.Functions.Like(terminal.VendorConfigName.ToLower(), value.ToLower()))
             .Select(terminal => new TerminalConfigurationDTO
             {
               Ip = terminal.Ip,
               AppId = terminal.AppId,
               ConfigId = terminal.ConfigId,
               ImagePath = terminal.ImagePath,
               ManageCapturing = terminal.ManageCapturing,
               VendorConfigId = terminal.VendorConfigId,
               Vendor = dbContext.Vendor.Where(vendor => vendor.VendorId == terminal.VendorId).Select(vendor => vendor.Vendor1).FirstOrDefault()
             })
             .Skip((pageNumber - 1) * pageSize).Take(pageSize)
             .ToListAsync();

        if (item.ToLower() == "app id")
          return await dbContext.VwConfiguration.Where(terminal => EF.Functions.Like(terminal.AppId.ToLower(), value.ToLower()))
              .Select(terminal => new TerminalConfigurationDTO
              {
                Ip = terminal.Ip,
                AppId = terminal.AppId,
                ConfigId = terminal.ConfigId,
                ImagePath = terminal.ImagePath,
                ManageCapturing = terminal.ManageCapturing,
                VendorConfigId = terminal.VendorConfigId,
                Vendor = dbContext.Vendor.Where(vendor => vendor.VendorId == terminal.VendorId).Select(vendor => vendor.Vendor1).FirstOrDefault()
              })
              .Skip((pageNumber - 1) * pageSize).Take(pageSize)
              .ToListAsync();
      }
      return null;
    }

    public async Task<int> TotalRecords() => await dbContext.VwConfiguration.CountAsync();

    public async Task<List<TerminalConfigurationDTO>> Get(int pageNumber, int pageSize) => await dbContext.VwConfiguration
      .Select(terminal => new TerminalConfigurationDTO
      {
        Ip = terminal.Ip,
        AppId = terminal.AppId,
        ConfigId = terminal.ConfigId,
        ImagePath = terminal.ImagePath,
        ManageCapturing = terminal.ManageCapturing,
        VendorConfigId = terminal.VendorConfigId,
        Vendor = dbContext.Vendor.Where(vendor => vendor.VendorId == terminal.VendorId).Select(vendor => vendor.Vendor1).FirstOrDefault()
      })
      .Skip((pageNumber - 1) * pageSize).Take(pageSize)
      .ToListAsync();

    public async Task<TerminalConfigurationCreateDTO> Get(int id) =>
      await dbContext.TerminalConfig
      .Where(terminal => terminal.Id == id)
      .Select(terminal => new TerminalConfigurationCreateDTO
      {
        Debuglevel = terminal.Debuglevel,
        EscalationDelayTimeInMin = terminal.EscalationDelayTimeInMin,
        ImageBrightness = terminal.ImageBrightness,
        IntelliCamEnabled = terminal.IntelliCamEnabled,
        ManageCapturing = terminal.ManageCapturing,
        NightSensitivity = terminal.NightSensitivity,
        SendAlert = terminal.SendAlert,
        ValidationMode = terminal.ValidationMode,
        VendorConfigId = terminal.VendorConfigId,
        VendorId = terminal.VendorConfig.VendorId
      }).FirstOrDefaultAsync();

    public async Task<ApproveTerminal> GetConfiguration(int id)
    {
      ApproveTerminal approveTerminal = await dbContext.VwConfigurationApproval
        .Where(config => config.ConfigId == id)
        .Select(config => new ApproveTerminal
        {
          ConfigId = config.ConfigId,
          EjectMode = config.EjectMode,
          EjPath = config.EjPath,
          EscalationDelayTimeInMin = config.EscalationDelayTimeInMin,
          ImageBrightness = config.ImageBrightness,
          ImagePath = config.ImagePath,
          IntelliCamEnabled = config.IntelliCamEnabled,
          Ip = config.Ip,
          ManageCapturing = config.ManageCapturing,
          NightSensitivity = config.NightSensitivity,
          SendAlert = config.SendAlert,
          TerminalId = config.Terminalid,
          UpdatedBy = config.UpdatedBy.ToString(),
          UpdatedDate = config.UpdatedDate,
          ValidationMode = config.ValidationMode,
          VendorConfigName = config.VendorConfigName,
          VendorName = config.Vendor
        }).FirstOrDefaultAsync();
      if (approveTerminal != null)
      {
        var user = await appUserRepository.GetUser(int.Parse(approveTerminal.UpdatedBy));
        approveTerminal.UpdatedBy = user.UserName;
      }
      return approveTerminal;
    }

    public async Task<bool> Approve(int userId, int configId)
    {

      var configApproval = await dbContext.ConfigApproval.FirstOrDefaultAsync(config => config.ConfigId == configId);
      if (configApproval != null)
      {
        configApproval.Approved = true;
        configApproval.ApprovedDate = DateTime.Now;
        configApproval.ApprovedBy = userId;
        dbContext.ConfigApproval.Update(configApproval);
        await dbContext.SaveChangesAsync();
      }

      var terminalConfig = await dbContext.TerminalConfig.FirstOrDefaultAsync(config => config.ConfigId == configId);
      if (terminalConfig != null)
      {
        terminalConfig.Configloaded = false;
        dbContext.TerminalConfig.Update(terminalConfig);
      }

      return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<List<TerminalConfigApprovalDTO>> GetTerminalApprovals(string item, string value, int userId)
    {

      if (userId == 0)
      {
        if (item != null)
        {
          if (item.ToLower() == "ip")
            return await dbContext.VwConfigurationApproval.Where(config => config.Approved == false)
              .Where(config => EF.Functions.Like(config.Ip.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              }).ToListAsync();

          if (item.ToLower() == "vendor")
            return await dbContext.VwConfigurationApproval.Where(config => config.Approved == false)
              .Where(config => EF.Functions.Like(config.Vendor.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              }).ToListAsync();

          if (item.ToLower() == "terminal id")
            return await dbContext.VwConfigurationApproval.Where(config => config.Approved == false)
              .Where(config => EF.Functions.Like(config.Terminalid.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              }).ToListAsync();
        }
        return null;
      }

      else
      {
        if (item != null)
        {
          if (item.ToLower() == "ip")
            return await dbContext.VwConfigurationApproval.Where(config => config.UpdatedBy != userId && config.Approved == false)
              .Where(config => EF.Functions.Like(config.Ip.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              }).ToListAsync();

          if (item.ToLower() == "vendor")
            return await dbContext.VwConfigurationApproval.Where(config => config.UpdatedBy != userId && config.Approved == false)
              .Where(config => EF.Functions.Like(config.VendorConfigName.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              }).ToListAsync();

          if (item.ToLower() == "app id")
            return await dbContext.VwConfigurationApproval.Where(config => config.UpdatedBy != userId && config.Approved == false)
             .Where(config => EF.Functions.Like(config.AppId.ToLower(), value.ToLower()))
             .Select(config => new TerminalConfigApprovalDTO
             {
               Approved = config.Approved,
               ConfigId = config.ConfigId,
               EjectMode = config.EjectMode,
               ImageBrightness = config.ImageBrightness,
               IntelliCamEnabled = config.IntelliCamEnabled,
               Ip = config.Ip,
               ManageCapturing = config.ManageCapturing,
               NightSensitivity = config.NightSensitivity,
               TerminalId = config.Terminalid,
               ValidationMode = config.ValidationMode,
               VendorName = config.Vendor
             }).ToListAsync();
        }
        return null;
      }
    }

    public async Task<List<TerminalConfigApprovalDTO>> GetTerminalApprovals(int userId)
    {
      if (userId == 0)
        return await dbContext.VwConfigurationApproval.Where(config => config.Approved == false)
        .Select(config => new TerminalConfigApprovalDTO
        {
          Approved = config.Approved,
          ConfigId = config.ConfigId,
          EjectMode = config.EjectMode,
          ImageBrightness = config.ImageBrightness,
          IntelliCamEnabled = config.IntelliCamEnabled,
          Ip = config.Ip,
          ManageCapturing = config.ManageCapturing,
          NightSensitivity = config.NightSensitivity,
          TerminalId = config.Terminalid,
          ValidationMode = config.ValidationMode,
          VendorName = config.Vendor
        })
        .ToListAsync();
      else
        return await dbContext.VwConfigurationApproval.Where(config => config.UpdatedBy != userId && config.Approved == false)
        .Select(config => new TerminalConfigApprovalDTO
        {
          Approved = config.Approved,
          ConfigId = config.ConfigId,
          EjectMode = config.EjectMode,
          ImageBrightness = config.ImageBrightness,
          IntelliCamEnabled = config.IntelliCamEnabled,
          Ip = config.Ip,
          ManageCapturing = config.ManageCapturing,
          NightSensitivity = config.NightSensitivity,
          TerminalId = config.Terminalid,
          ValidationMode = config.ValidationMode,
          VendorName = config.Vendor
        })
        .ToListAsync();
    }

    public async Task<int> TotalTerminalApprovalRecords(string item, string value, int userId)
    {
      int count = 0;
      if (userId == 0)
      {
        if (item != null)
        {
          if (item.ToLower() == "ip")
            count = await dbContext.VwConfigurationApproval
              .Where(config => config.Approved == false)
              .Where(config => EF.Functions.Like(config.Ip.ToLower(), value.ToLower()))
              .CountAsync();

          if (item.ToLower() == "vendor")
            count = await dbContext.VwConfigurationApproval
              .Where(config => config.Approved == false)
              .Where(config => EF.Functions.Like(config.VendorConfigName.ToLower(), value.ToLower()))
              .CountAsync();

          if (item.ToLower() == "app id")
            count = await dbContext.VwConfigurationApproval
             .Where(config => config.Approved == false)
             .Where(config => EF.Functions.Like(config.AppId.ToLower(), value.ToLower()))
             .CountAsync();
        }
      }
      else
      {
        if (item != null)
        {
          if (item.ToLower() == "ip")
            count = await dbContext.VwConfigurationApproval
              .Where(config => config.UpdatedBy != userId && config.Approved == false)
              .Where(config => EF.Functions.Like(config.Ip.ToLower(), value.ToLower()))
              .CountAsync();

          if (item.ToLower() == "vendor")
            count = await dbContext.VwConfigurationApproval
              .Where(config => config.UpdatedBy != userId && config.Approved == false)
              .Where(config => EF.Functions.Like(config.VendorConfigName.ToLower(), value.ToLower()))
              .CountAsync();

          if (item.ToLower() == "app id")
            count = await dbContext.VwConfigurationApproval
             .Where(config => config.UpdatedBy != userId && config.Approved == false)
             .Where(config => EF.Functions.Like(config.AppId.ToLower(), value.ToLower()))
             .CountAsync();
        }
      }
      return count;
    }

    public async Task<List<TerminalConfigApprovalDTO>> GetTerminalApprovals(string item, string value, int pageNumber, int pageSize, int userId)
    {
      if (userId == 0)
      {
        if (item != null)
        {
          if (item.ToLower() == "ip")
            return await dbContext.VwConfigurationApproval
              .Where(config => config.Approved == false)
              .Where(config => EF.Functions.Like(config.Ip.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              })
              .Skip((pageNumber - 1) * pageSize).Take(pageSize)
              .ToListAsync();

          if (item.ToLower() == "vendor")
            return await dbContext.VwConfigurationApproval
              .Where(config => config.Approved == false)
              .Where(config => EF.Functions.Like(config.VendorConfigName.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              })
              .Skip((pageNumber - 1) * pageSize).Take(pageSize)
              .ToListAsync();

          if (item.ToLower() == "app id")
            return await dbContext.VwConfigurationApproval
              .Where(config => config.Approved == false)
              .Where(config => EF.Functions.Like(config.AppId.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              })
              .Skip((pageNumber - 1) * pageSize).Take(pageSize)
              .ToListAsync();
        }
        return null;
      }

      else
      {
        if (item != null)
        {
          if (item.ToLower() == "ip")
            return await dbContext.VwConfigurationApproval
              .Where(config => config.UpdatedBy != userId && config.Approved == false)
              .Where(config => EF.Functions.Like(config.Ip.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              })
              .Skip((pageNumber - 1) * pageSize).Take(pageSize)
              .ToListAsync();

          if (item.ToLower() == "vendor")
            return await dbContext.VwConfigurationApproval
              .Where(config => config.UpdatedBy != userId && config.Approved == false)
              .Where(config => EF.Functions.Like(config.VendorConfigName.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              })
              .Skip((pageNumber - 1) * pageSize).Take(pageSize)
              .ToListAsync();

          if (item.ToLower() == "app id")
            return await dbContext.VwConfigurationApproval
              .Where(config => config.UpdatedBy != userId && config.Approved == false)
              .Where(config => EF.Functions.Like(config.AppId.ToLower(), value.ToLower()))
              .Select(config => new TerminalConfigApprovalDTO
              {
                Approved = config.Approved,
                ConfigId = config.ConfigId,
                EjectMode = config.EjectMode,
                ImageBrightness = config.ImageBrightness,
                IntelliCamEnabled = config.IntelliCamEnabled,
                Ip = config.Ip,
                ManageCapturing = config.ManageCapturing,
                NightSensitivity = config.NightSensitivity,
                TerminalId = config.Terminalid,
                ValidationMode = config.ValidationMode,
                VendorName = config.Vendor
              })
              .Skip((pageNumber - 1) * pageSize).Take(pageSize)
              .ToListAsync();
        }
        return null;
      }
    }

    public async Task<List<TerminalConfigApprovalDTO>> GetTerminalApprovals(int pageNumber, int pageSize, int userId)
    {
      if (userId == 0)
        return await dbContext.VwConfigurationApproval
          .Where(config => config.Approved == false)
          .Select(config => new TerminalConfigApprovalDTO
          {
            Approved = config.Approved,
            ConfigId = config.ConfigId,
            EjectMode = config.EjectMode,
            ImageBrightness = config.ImageBrightness,
            IntelliCamEnabled = config.IntelliCamEnabled,
            Ip = config.Ip,
            ManageCapturing = config.ManageCapturing,
            NightSensitivity = config.NightSensitivity,
            TerminalId = config.Terminalid,
            ValidationMode = config.ValidationMode,
            VendorName = config.Vendor
          })
          .Skip((pageNumber - 1) * pageSize)
          .Take(pageSize)
          .ToListAsync();

      else
        return await dbContext.VwConfigurationApproval
          .Where(config => config.UpdatedBy != userId && config.Approved == false)
          .Select(config => new TerminalConfigApprovalDTO
          {
            Approved = config.Approved,
            ConfigId = config.ConfigId,
            EjectMode = config.EjectMode,
            ImageBrightness = config.ImageBrightness,
            IntelliCamEnabled = config.IntelliCamEnabled,
            Ip = config.Ip,
            ManageCapturing = config.ManageCapturing,
            NightSensitivity = config.NightSensitivity,
            TerminalId = config.Terminalid,
            ValidationMode = config.ValidationMode,
            VendorName = config.Vendor
          })
          .Skip((pageNumber - 1) * pageSize).Take(pageSize)
          .ToListAsync();
    }

    public async Task<int> TotalTerminalApprovalRecords(int userId)
    {
      int count = 0;
      if (userId == 0)
        count = await dbContext.VwConfigurationApproval.Where(config => config.Approved == false).CountAsync();
      else
        count = await dbContext.VwConfigurationApproval.Where(config => config.UpdatedBy != userId && config.Approved == false).CountAsync();
      return count;
    }
  }
}
