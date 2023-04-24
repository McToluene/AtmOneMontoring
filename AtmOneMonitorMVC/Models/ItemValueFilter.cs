namespace AtmOneMonitorMVC.Models
{
  public class ItemValueFilter: PaginationFilter
  {
    public string Item { get; set; }
    public string Value { get; set; }
  }
}
