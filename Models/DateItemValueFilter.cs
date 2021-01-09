namespace AtmOneMonitorMVC.Models
{
  public class DateItemValueFilter: PaginationFilter
  {
    public string DateFrom { get; set; }
    public string DateTo { get; set; }
    public string Item { get; set; }
    public string Value { get; set; }
  }
}
