using AtmOneMonitorMVC.Interfaces;
using Microsoft.Extensions.Configuration;
using System;

namespace AtmOneMonitorMVC.utils
{
  public class ApplicationConfig: IApplicationConfig
  {
    private readonly IConfiguration configuration;
    public ApplicationConfig(IConfiguration configuration)
    {
      this.configuration = configuration;
    }

    public AdMethod AdMethodToUse()
    {
      string method = @"";
      try
      {
        method = configuration.GetSection("AdMethod").Value;
      }
      catch (Exception) { }
      try
      {
        return GetMethod(method);
      }
      catch (Exception)
      {
        return AdMethod.GetADUsers;
      }
    }

    public AdMethod GetMethod(string method)
    {
      switch (method.ToLower())
      {
        case "1":
        case "getadusers":
          return AdMethod.GetADUsers;
        case "2":
        case "getactivedirectoryusers":
          return AdMethod.GetActiveDirectoryUsers;
        default: return AdMethod.GetADUsers;
      }
    }
  }
}
