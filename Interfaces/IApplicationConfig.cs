using AtmOneMonitorMVC.utils;
namespace AtmOneMonitorMVC.Interfaces
{
  public interface IApplicationConfig
  {
    AdMethod GetMethod(string method);
    AdMethod AdMethodToUse();
  }
}
