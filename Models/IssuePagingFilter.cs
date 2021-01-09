namespace AtmOneMonitorMVC.Models
{
  public class IssuePagingFilter: PaginationFilter
  {
    public string AppId { get; set; }
    public int Range { get; set; } // 1 for 2 months data and 2 for a year data
    public string Item { get; set; }
    public string Value { get; set; }
  }

  public class SelectedPagingFilter: IssuePagingFilter
  {
    public string MsgCat { get; set; }
  }
}
