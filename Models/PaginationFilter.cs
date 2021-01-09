namespace AtmOneMonitorMVC.Models
{
  public class PaginationFilter
  {
    public int PageNumber { get; set; }
    public int PageSize { get; set; }

    public PaginationFilter()
    {
      PageNumber = 1;
      PageSize = 10;
    }

    public PaginationFilter(int pageNumber, int PageSize)
    {
      PageNumber = pageNumber < 1 ? 1 : pageNumber;
      this.PageSize = PageSize < 10 ? 10 : PageSize;
    }
  }
}