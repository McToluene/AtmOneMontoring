﻿namespace AtmOneMonitorMVC.Models
{
  public class IssueFilter
  {
    public string AppId { get; set; }
    public int Range { get; set; } // 1 for 2 months data and 2 for a year data
    public string Item { get; set; }
    public string Value { get; set; }
  }

  public class SelectedIssueFilter: IssueFilter
  {
    public string MsgCat { get; set; }
  }
}
