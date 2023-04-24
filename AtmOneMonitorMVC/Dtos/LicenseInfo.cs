namespace AtmOneMonitorMVC.Dtos
{
  public class LicenseInfo
  {
    public string Used { get; set; }
    public string LIC { get; set; }

    public LicenseInfo(string Used, string LIC)
    {
      this.Used = Used;
      this.LIC = LIC;
    }
  }
}
