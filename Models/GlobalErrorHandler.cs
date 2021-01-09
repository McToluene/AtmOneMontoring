using Newtonsoft.Json;

namespace AtmOneMonitorMVC.Models
{
  public class GlobalErrorHandler
  {
    public int StatusCode { get; set; }
    public string Message { get; set; }
    public override string ToString()
    {
      return JsonConvert.SerializeObject(this);
    }
  }
}
