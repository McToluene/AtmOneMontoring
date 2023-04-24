using System;
using AtmOneMonitorMVC.Models;

namespace AtmOneMonitorMVC.Interfaces
{
  public interface IUriService
  {
    public Uri GetPageUri(PaginationFilter filter, string route);
  }
}