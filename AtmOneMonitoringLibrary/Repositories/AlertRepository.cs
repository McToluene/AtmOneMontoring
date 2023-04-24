using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;


namespace AtmOneMonitoringLibrary.Repositories
{
  public class AlertRepository : IAlertRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    private readonly List<string> camIssueList = new List<string> { "currently", "indeterminate", "stopped" };
    private readonly List<string> ejIssueList = new List<string> { "empty", "blank", "skipping" };
    public AlertRepository(AtmOneMonitorContext dbContext)
    {
      this.dbContext = dbContext;
    }

    public async Task<CameraDto> CameraIssue()
    {
      CameraDto cameraDto = new CameraDto();
      foreach (var issue in camIssueList)
      {
        int a = await GetCurrentIssues("IC", issue);
        switch (issue)
        {
          case "currently":
            cameraDto.NotCapturing = a;
            break;
          case "indeterminate":
            cameraDto.Indeterminate = a;
            break;
          case "stopped":
            cameraDto.Stopped = a;
            break;
        }
      }
      cameraDto.LineChart = await LoadLineChart("IC");
      return cameraDto;
    }

    public async Task<EjectDTO> EjectIssue()
    {
      EjectDTO ejectDTO = new EjectDTO();
      foreach (string ejectIssue in ejIssueList)
      {
        int a = await GetCurrentIssues("EJ", ejectIssue);
        switch (ejectIssue)
        {
          case "empty":
            ejectDTO.Empty = a;
            break;
          case "blank":
            ejectDTO.Blank = a;
            break;
          case "skipping":
            ejectDTO.Skipping = a;
            break;
        }
      }
      ejectDTO.LineChart = await LoadLineChart("EJ");
      return ejectDTO;
    }

    private async Task<string> LoadLineChart(string type)
    {
      string value = "";
      for (int i = 0; i < 7; i++)
      {
        DateTime date = (DateTime.Now.AddDays(-i));
        string data = await GetHistoryForLineChart(type, date);
        value = $"{value.TrimStart('_')}_{data.Trim(',')}";
      }
      return $"{value.TrimStart('_').Trim(',').Trim()}";
    }

    private async Task<int> GetCurrentIssues(string appId, string message)
    {
      try
      {
        int atm = 0;
        DateTime date = DateTime.Today;
        var alertsCount = await dbContext.Alert.Where(alert => alert.StatusId == 0 && alert.AppId == appId && EF.Functions.Like(alert.MsgCat, message) && alert.ADate.Value.Date == date.Date).CountAsync();

        if (alertsCount > 0)
        {
          atm = alertsCount;
        }
        return atm;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        return 0;
      }
    }

    private async Task<string> GetHistoryForLineChart(string appId, DateTime date)
    {
      string data = $"{{'date':'{date.ToString("yyyy-MM-dd").Trim()}', 'empty': 0, 'blank': 0, 'skipping': 0,}}";
      if (!appId.Equals("EJ"))
        data = $"{{'date':'{date.ToString("yyyy-MM-dd").Trim()}', 'currently': 0, 'indeterminate': 0, 'stopped': 0,}}";
      try
      {

        var alertsList = await dbContext.Alert.Where(alert => alert.AppId == appId && alert.ADate.Value.Date == date.Date).GroupBy(x => x.MsgCat).Select(x => new { Count = x.Count(), x.Key }).ToListAsync();
        if (alertsList != null)
        {
          if (alertsList.Count > 0)
          {
            foreach (var alert in alertsList)
            {
              string message = "";
              string msg = alert.Key;
              int count = alert.Count;
              if (appId.Equals("EJ"))
                message = $"'{Find(ejIssueList, msg)}'";
              else
                message = $"'{Find(camIssueList, msg)}'";

              if (!string.IsNullOrEmpty(message))
                data = Set(data, message, count);
            }
          }
        }
        if (appId.Equals("EJ"))
          data = Validate(ejIssueList, data);
        else
          data = Validate(camIssueList, data);
        return data.Trim();
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return "";
      }

    }

    private string Validate(List<string> issueList, string data)
    {
      foreach (var issue in issueList)
      {
        if (!data.Contains(issue))
          data = $"{data.TrimStart(',')}, {issue}: 0";
      }
      return data;
    }

    private string Set(string data, string msg, int value)
    {
      string adjusted = "";
      string rec = $"{msg}: {value}";
      string[] _data = data.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
      int datalength = _data.Length;
      for (int i = 0; i < datalength; i++)
      {
        if (_data[i].Contains(msg))
          _data[i] = rec;
        adjusted = $"{adjusted.TrimStart(',').Trim()}, {_data[i].Trim()}";
      }

      return adjusted;
    }

    private string Find(List<string> issueList, string message)
    {
      return Array.Find(issueList.ToArray(), x => message.ToLower().Contains(x));
    }

    public bool Purge()
    {
      throw new NotImplementedException();
    }

    public async Task<List<IssueDTO>> GetDataHistory(string appId)
    {
      try
      {
        DateTime twoMonths = DateTime.Now.AddMonths(-2);
        List<IssueDTO> alertsList = await dbContext.VwAlert
        .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= twoMonths.Date)
        .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss"), Status = alert.Status })
        .ToListAsync();

        if (alertsList == null) return null;

        return alertsList;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        return null;
      }
    }

    public async Task<List<IssueDTO>> GetIssuesDetails(string appId, int range, string item, string value)
    {
      try
      {
        List<IssueDTO> issuesDetail = new List<IssueDTO>();

        if (item.ToLower() == "status")
          issuesDetail = await GetIssuesByStatus(range, appId, value, false);

        if (item.ToLower() == "terminal id")
          issuesDetail = await GetIssuesByTerminalID(range, appId, value, false);

        if (item.ToLower() == "ip")
          issuesDetail = await GetIssuesByIp(range, appId, value, false);

        if (item.ToLower() == "issue")
          issuesDetail = await GetIssuesByTitle(range, appId, value, false);

        if (item.ToLower() == "incident date")
          issuesDetail = await GetIssuesByIncidentDate(range, appId, DateTime.Parse(value), false);

        return issuesDetail;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        return null;
      }

    }

    public async Task<List<IssueDTO>> GetSelectedIssuesDetails(string appId, string item, string value, string msgCat)
    {
      try
      {
        List<IssueDTO> issuesDetail = new List<IssueDTO>();

        if (item.ToLower() == "status")
          issuesDetail = await GetIssuesByStatus(appId, value, false, msgCat);

        if (item.ToLower() == "terminal id")
          issuesDetail = await GetIssuesByTerminalID(appId, value, false, msgCat);

        if (item.ToLower() == "ip")
          issuesDetail = await GetIssuesByIp(appId, value, false, msgCat);

        if (item.ToLower() == "issue")
          issuesDetail = await GetIssuesByTitle(appId, value, false, msgCat);

        if (item.ToLower() == "incident date")
          issuesDetail = await GetIssuesByIncidentDate(appId, DateTime.Parse(value), false, msgCat);

        return issuesDetail;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        return null;
      }
    }

    public async Task<List<IssueDTO>> GetIssuesDetails(string appId, int range, string item, string value, int pageNumber, int pageSize)
    {
      try
      {
        List<IssueDTO> issuesDetail = new List<IssueDTO>();

        if (item.ToLower() == "status")
          issuesDetail = await GetIssuesByStatus(range, appId, value, true, pageNumber, pageSize);

        if (item.ToLower() == "terminal id")
          issuesDetail = await GetIssuesByTerminalID(range, appId, value, true, pageNumber, pageSize);

        if (item.ToLower() == "ip")
          issuesDetail = await GetIssuesByIp(range, appId, value, true, pageNumber, pageSize);

        if (item.ToLower() == "issue")
          issuesDetail = await GetIssuesByTitle(range, appId, value, true, pageNumber, pageSize);

        if (item.ToLower() == "incident date")
          issuesDetail = await GetIssuesByIncidentDate(range, appId, DateTime.Parse(value), true, pageNumber, pageSize);

        return issuesDetail;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        return null;
      }
    }

    public async Task<List<IssueDTO>> GetSelectedIssuesDetails(string appId, string item, string value, int pageNumber, int pageSize, string msgCat)
    {
      try
      {
        List<IssueDTO> issuesDetail = new List<IssueDTO>();

        if (item.ToLower() == "status")
          issuesDetail = await GetIssuesByStatus(appId, value, true, msgCat, pageNumber, pageSize);

        if (item.ToLower() == "terminal id")
          issuesDetail = await GetIssuesByTerminalID(appId, value, true, msgCat, pageNumber, pageSize);

        if (item.ToLower() == "ip")
          issuesDetail = await GetIssuesByIp(appId, value, true, msgCat, pageNumber, pageSize);

        if (item.ToLower() == "issue")
          issuesDetail = await GetIssuesByTitle(appId, value, true, msgCat, pageNumber, pageSize);

        if (item.ToLower() == "incident date")
          issuesDetail = await GetIssuesByIncidentDate(appId, DateTime.Parse(value), true, msgCat, pageNumber, pageSize);

        return issuesDetail;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        return null;
      }
    }

    private async Task<List<IssueDTO>> GetIssuesByStatus(int range, string appId, string status, bool isPaginate, int pageNumber = 0, int pageSize = 0)
    {
      List<IssueDTO> issuesDetail = new List<IssueDTO>();
      DateTime date = DateTime.Now;
      if (range == 1)
      {
        var query = dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date && alert.Status.ToLower().Contains(status.ToLower()))
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

        if (isPaginate)
          issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        else
          issuesDetail = await query.ToListAsync();
      }

      if (range == 2)
      {
        var query = dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date.Year >= date.Date.Year && alert.Status.ToLower().Contains(status.ToLower()))
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

        if (isPaginate)
          issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        else
          issuesDetail = await query.ToListAsync();
      }

      return issuesDetail;
    }

    private async Task<List<IssueDTO>> GetIssuesByStatus(string appId, string status, bool isPaginate, string msgCat, int pageNumber = 0, int pageSize = 0)
    {
      List<IssueDTO> issuesDetail = new List<IssueDTO>();
      DateTime date = DateTime.Now;

      var query = dbContext.VwAlert
        .Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date && alert.Status.ToLower().Contains(status.ToLower()) && alert.MsgCat == msgCat)
        .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status, MsgCat = alert.MsgCat });

      if (msgCat != null)
        query = query.Where(alert => alert.MsgCat == msgCat);


      if (isPaginate)
        issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      else
        issuesDetail = await query.ToListAsync();

      return issuesDetail;
    }

    private async Task<List<IssueDTO>> GetIssuesByTerminalID(int range, string appId, string terminal, bool isPaginate, int pageNumber = 0, int pageSize = 0)
    {
      List<IssueDTO> issuesDetail = new List<IssueDTO>();
      DateTime date = DateTime.Now;
      if (range == 1)
      {
        var query = dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date && alert.TerminalId.ToLower().Contains(terminal.ToLower()))
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

        if (isPaginate)
          issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        else
          issuesDetail = await query.ToListAsync();
      }

      if (range == 2)
      {
        var query = dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date.Year >= date.Date.Year && alert.TerminalId.ToLower().Contains(terminal.ToLower()))
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

        if (isPaginate)
          issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        else
          issuesDetail = await query.ToListAsync();
      }

      return issuesDetail;
    }

    private async Task<List<IssueDTO>> GetIssuesByTerminalID(string appId, string terminal, bool isPaginate, string msgCat, int pageNumber = 0, int pageSize = 0)
    {
      List<IssueDTO> issuesDetail = new List<IssueDTO>();
      DateTime date = DateTime.Now;
      var query = dbContext.VwAlert
        .Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date && alert.TerminalId.ToLower().Contains(terminal.ToLower()))
        .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

      if (msgCat != null)
        query = query.Where(alert => alert.MsgCat == msgCat);

      if (isPaginate)
        issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      else
        issuesDetail = await query.ToListAsync();
      return issuesDetail;
    }

    private async Task<List<IssueDTO>> GetIssuesByIp(int range, string appId, string ip, bool isPaginate, int pageNumber = 0, int pageSize = 0)
    {
      List<IssueDTO> issuesDetail = new List<IssueDTO>();
      DateTime date = DateTime.Now;
      if (range == 1)
      {
        var query = dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date && alert.Ip.ToLower().Contains(ip.ToLower()))
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

        if (isPaginate)
          issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        else
          issuesDetail = await query.ToListAsync();
      }

      if (range == 2)
      {
        var query = dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date.Year >= date.Date.Year && alert.Ip.ToLower().Contains(ip.ToLower()))
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

        if (isPaginate)
          issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        else
          issuesDetail = await query.ToListAsync();
      }

      return issuesDetail;
    }

    private async Task<List<IssueDTO>> GetIssuesByIp(string appId, string ip, bool isPaginate, string msgCat, int pageNumber = 0, int pageSize = 0)
    {
      List<IssueDTO> issuesDetail = new List<IssueDTO>();
      DateTime date = DateTime.Now;

      var query = dbContext.VwAlert
        .Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date && alert.Ip.ToLower().Contains(ip.ToLower()))
        .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status, MsgCat = alert.MsgCat });

      if (msgCat != null)
        query = query.Where(alert => alert.MsgCat == msgCat);

      if (isPaginate)
        issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      else
        issuesDetail = await query.ToListAsync();

      return issuesDetail;
    }

    private async Task<List<IssueDTO>> GetIssuesByTitle(int range, string appId, string title, bool isPaginate, int pageNumber = 0, int pageSize = 0)
    {
      List<IssueDTO> issuesDetail = new List<IssueDTO>();
      DateTime date = DateTime.Now;
      if (range == 1)
      {
        var query = dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date && alert.Message.ToLower().Contains(title.ToLower()))
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

        if (isPaginate)
          issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        else
          issuesDetail = await query.ToListAsync();
      }

      if (range == 2)
      {
        var query = dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date.Year >= date.Date.Year && alert.Message.ToLower().Contains(title.ToLower()))
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

        if (isPaginate)
          issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        else
          issuesDetail = await query.ToListAsync();
      }

      return issuesDetail;
    }

    private async Task<List<IssueDTO>> GetIssuesByTitle(string appId, string title, bool isPaginate, string msgCat, int pageNumber = 0, int pageSize = 0)
    {
      List<IssueDTO> issuesDetail = new List<IssueDTO>();
      DateTime date = DateTime.Now;

      var query = dbContext.VwAlert
        .Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date && alert.Message.ToLower().Contains(title.ToLower()))
        .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status, MsgCat = alert.MsgCat });

      if (msgCat != null)
        query = query.Where(alert => alert.MsgCat == msgCat);

      if (isPaginate)
        issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      else
        issuesDetail = await query.ToListAsync();

      return issuesDetail;
    }

    private async Task<List<IssueDTO>> GetIssuesByIncidentDate(int range, string appId, DateTime date, bool isPaginate, int pageNumber = 0, int pageSize = 0)
    {
      List<IssueDTO> issuesDetail = new List<IssueDTO>();
      if (range == 1)
      {
        var query = dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date)
          .Where(alert => alert.IncidentDate.Value.Date == date.Date)
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

        if (isPaginate)
          issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        else
          issuesDetail = await query.ToListAsync();
      }

      if (range == 2)
      {
        var query = dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date.Year == date.Date.Year)
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status });

        if (isPaginate)
          issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        else
          issuesDetail = await query.ToListAsync();
      }

      return issuesDetail;
    }

    private async Task<List<IssueDTO>> GetIssuesByIncidentDate(string appId, DateTime date, bool isPaginate, string msgCat, int pageNumber = 0, int pageSize = 0)
    {
      List<IssueDTO> issuesDetail = new List<IssueDTO>();
      var query = dbContext.VwAlert
        .Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date)
        .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status, MsgCat = alert.MsgCat });

      if (msgCat != null)
        query = query.Where(alert => alert.MsgCat == msgCat);

      if (isPaginate)
        issuesDetail = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
      else
        issuesDetail = await query.ToListAsync();

      return issuesDetail;
    }

    public async Task<List<IssueDTO>> GetDataHistory(string appId, int range)
    {
      try
      {
        List<IssueDTO> alertsList = new List<IssueDTO>();
        DateTime date = DateTime.Now;

        if (range == 1)
        {
          alertsList = await dbContext.VwAlert
            .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date)
            .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status, MsgCat = alert.MsgCat })
            .ToListAsync();
        }

        if (range == 2)
        {
          alertsList = await dbContext.VwAlert
            .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Year == date.Date.Year)
            .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status })
            .ToListAsync();
        }

        if (alertsList == null) return null;

        return alertsList;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        return null;
      }
    }

    public async Task<List<IssueDTO>> GetSelectedDataHistory(string appId, string msgCat)
    {
      try
      {
        DateTime date = DateTime.Now;

        var query = dbContext.VwAlert.Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date);

        if (msgCat != null)
          query = query.Where(alert => alert.MsgCat == msgCat);

        List<IssueDTO> alertsList = await query.Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status })
          .ToListAsync();

        if (alertsList == null) return null;

        return alertsList;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        return null;
      }
    }

    public async Task<List<IssueDTO>> GetDataHistory(string appId, int range, int pageNumber, int pageSize)
    {
      try
      {
        List<IssueDTO> alertsList = new List<IssueDTO>();
        DateTime date = DateTime.Now;

        if (range == 1)
        {
          alertsList = await dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date)
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status })
          .Skip((pageNumber - 1) * pageSize)
          .Take(pageSize)
          .ToListAsync();
        }

        if (range == 2)
        {
          alertsList = await dbContext.VwAlert
          .Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Year == date.Date.Year)
          .Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status })
          .Skip((pageNumber - 1) * pageSize)
          .Take(pageSize)
          .ToListAsync();
        }

        if (alertsList == null) return null;

        return alertsList;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        return null;
      }
    }

    public async Task<List<IssueDTO>> GetSelectedDataHistory(string appId, int pageNumber, int pageSize, string msgCat)
    {
      try
      {
        DateTime date = DateTime.Now;
        var query = dbContext.VwAlert.Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date);

        if (msgCat != null)
          query = query.Where(alert => alert.MsgCat == msgCat);

        List<IssueDTO> alertsList = await query.Select(alert => new IssueDTO() { TerminalID = alert.TerminalId, Ip = alert.Ip, Title = alert.Message, IncidentDate = Convert.ToDateTime(alert.IncidentDate).ToString("yyyy-MM-dd hh:mm:ss tt"), UpdatedDate = Convert.ToDateTime(alert.UpdatedDate).ToString("yyyy-MM-dd hh:mm:ss tt"), Status = alert.Status })
        .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        if (alertsList == null) return null;

        return alertsList;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        return null;
      }
    }

    public async Task<int> TotalRecords(string appId, int range)
    {
      try
      {
        int count = 0;
        DateTime date = DateTime.Now;
        if (range == 1)
          count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date).CountAsync();

        if (range == 2)
          count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Year == date.Date.Year).CountAsync();

        return count;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return 0;
      }

    }

    public async Task<int> TotalRecords(string appId, int range, string item, string value)
    {
      try
      {
        int count = 0;
        DateTime date = DateTime.Now;

        if (item.ToLower() == "status")
        {
          if (range == 1)
            count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date && alert.Status.ToLower().Contains(value.ToLower())).CountAsync();

          if (range == 2)
            count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date.Year >= date.Date.Year && alert.Status.ToLower().Contains(value.ToLower())).CountAsync();
        }

        if (item.ToLower() == "terminal id")
        {
          if (range == 1)
            count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date && alert.TerminalId.ToLower().Contains(value.ToLower())).CountAsync();
          if (range == 2)
            count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date.Year >= date.Date.Year && alert.TerminalId.ToLower().Contains(value.ToLower())).CountAsync();
        }

        if (item.ToLower() == "ip")
        {
          if (range == 1)
            count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date && alert.Ip.ToLower().Contains(value.ToLower())).CountAsync();
          if (range == 1)
            count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date.Year >= date.Date.Year && alert.Ip.ToLower().Contains(value.ToLower())).CountAsync();
        }

        if (item.ToLower() == "issue")
        {
          if (range == 1)
            count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= date.AddMonths(-2).Date && alert.Message.ToLower().Contains(value.ToLower())).CountAsync();
          if (range == 2)
            count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date.Year >= date.Date.Year && alert.Message.ToLower().Contains(value.ToLower())).CountAsync();
        }

        if (item.ToLower() == "incident date")
        {
          if (range == 1)
            count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date >= DateTime.Parse(value).AddMonths(-2).Date).CountAsync();
          if (range == 2)
            count = await dbContext.VwAlert.Where(alert => alert.AppId == appId && alert.IncidentDate.Value.Date.Year == DateTime.Parse(value).Date.Year).CountAsync();
        }

        return count;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return 0;
      }

    }

    public async Task<int> TotalSelectedRecords(string appId, string msgCat)
    {
      try
      {
        DateTime date = DateTime.Now;
        var query = dbContext.VwAlert.Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date);
        if (msgCat != null)
          query = query.Where(alert => alert.MsgCat == msgCat);
        return await query.CountAsync();

      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return 0;
      }
    }

    public async Task<int> TotalSelectedRecords(string appId, string item, string value, string msgCat)
    {
      try
      {
        int count = 0;
        DateTime date = DateTime.Now;

        if (item.ToLower() == "status")
        {
          var query = dbContext.VwAlert.Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date && alert.Status.ToLower().Contains(value.ToLower()));
          if (msgCat != null)
            query = query.Where(alert => alert.MsgCat == msgCat);
          count = await query.CountAsync();
        }

        if (item.ToLower() == "terminal id")
        {
          var query = dbContext.VwAlert.Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date && alert.TerminalId.ToLower().Contains(value.ToLower()));
          if (msgCat != null)
            query = query.Where(alert => alert.MsgCat == msgCat);
          count = await query.CountAsync();

        }

        if (item.ToLower() == "ip")
        {
          var query = dbContext.VwAlert.Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date && alert.Ip.ToLower().Contains(value.ToLower()));
          if (msgCat != null)
            query = query.Where(alert => alert.MsgCat == msgCat);
          count = await query.CountAsync();
        }

        if (item.ToLower() == "issue")
        {
          var query = dbContext.VwAlert.Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date == date.Date && alert.Message.ToLower().Contains(value.ToLower()));
          if (msgCat != null)
            query = query.Where(alert => alert.MsgCat == msgCat);
          count = await query.CountAsync();
        }

        if (item.ToLower() == "incident date")
        {
          var query = dbContext.VwAlert.Where(alert => alert.StatusId == 0 && alert.AppId == appId && alert.IncidentDate.Value.Date.Year == DateTime.Parse(value).Date.Year);
          if (msgCat != null)
            query = query.Where(alert => alert.MsgCat == msgCat);
          count = await query.CountAsync();
        }

        return count;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return 0;
      }
    }

  }
}