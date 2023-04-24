namespace AtmOneMonitoringLibrary.Dtos
{
  public class CameraDto
  {
    public int NotCapturing { get; set; }
    public int Indeterminate { get; set; }
    public int Stopped { get; set; }
    public string LineChart { get; set; }
  }

  public class EjectDTO
  {
    public int Empty { get; set; }
    public int Blank { get; set; }
    public int Skipping { get; set; }
    public string LineChart { get; set; }
  }

}