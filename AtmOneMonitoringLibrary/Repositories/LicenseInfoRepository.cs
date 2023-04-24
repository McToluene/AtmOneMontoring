using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class LicenseInfoRepository : ILicenseInfoRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    
    public LicenseInfoRepository(AtmOneMonitorContext dbContext)
    {
      this.dbContext = dbContext;
    }

    public async Task<bool> Add(string info)
    {
      dbContext.Database.ExecuteSqlRaw("TRUNCATE TABLE [licinfo]");
      await dbContext.LicInfo.AddAsync(new LicInfo() { Info = info} );
      return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<string> Get() 
    {
      var info = await dbContext.LicInfo.Select(info => info.Info).FirstOrDefaultAsync();
      return Decrypt(info);
    } 
    private string Decrypt(string encrypted)
    {
      string str = DeHex(encrypted);
      reCheck: string _decodedStr = Decode(str);
      string[] info = _decodedStr.Split(new[] { ',', ';', '_' }, StringSplitOptions.RemoveEmptyEntries);
      bool decoded = IsIpValid(_decodedStr);

      if (!decoded)
      {
        if (string.IsNullOrEmpty(_decodedStr))
        {
          str = encrypted;
          goto reCheck;
        }

        else if (info.Length >= 1)
        {
          decoded = IsInteger(info[0]);
          if (!decoded)
          {
            str = encrypted;
            goto reCheck;
          }
        }
      }
      return _decodedStr;
    }

    private string DeHex(string hex) => SecurityStudio.HexTranslator.HexDecode(hex.Trim());

    private string Decode(string encrypted) => new AppSecure.Identity("IntelligentCAM").DecryptStream(encrypted);

    private bool IsIpValid(string value)
    {
      Regex regex = new Regex(@"\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}");
      return regex.IsMatch(value);
    }

    private bool IsInteger(string value)
    {
      try
      {
        int.Parse(value);
        return true;
      }
      catch (Exception) { return false; }
    }
  }
}
