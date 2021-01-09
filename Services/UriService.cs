using System;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Models;
using Microsoft.AspNetCore.WebUtilities;

namespace AtmOneMonitorMVC.Services
{
  public class UriService : IUriService
  {
    private readonly string baseUrl;

    public UriService(string baseUrl)
    {
      this.baseUrl = baseUrl;
    }

    public Uri GetPageUri(PaginationFilter filter, string route)
    {
      Uri endPointUri = new Uri(string.Concat(baseUrl, route));
      string modifiedUri = QueryHelpers.AddQueryString(endPointUri.ToString(), "pageNumber", filter.PageNumber.ToString());
      modifiedUri = QueryHelpers.AddQueryString(modifiedUri, "pageSize", filter.PageSize.ToString());
      return new Uri(modifiedUri);
    }
  }
}