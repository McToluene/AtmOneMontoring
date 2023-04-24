using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AtmOneMonitoringLibrary.Models
{
  public partial class AppUser
  {
    public AppUser()
    {
      AppAudit = new HashSet<AppAudit>();
    }
    public int UserId { get; set; }
    public int? RoleId { get; set; }
    public string Username { get; set; }
    public string Fullname { get; set; }
    public string Pswd { get; set; }
    public string Email { get; set; }
    public string CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }
    public string ApprovedBy { get; set; }
    public DateTime? ApprovedDate { get; set; }
    public bool? Approved { get; set; }
    public bool? Status { get; set; }
    public virtual AppRole Role { get; set; }
    public virtual ICollection<AppAudit> AppAudit { get; set; }
    [JsonIgnore]
    public RefreshToken RefreshTokens { get; set; }
  }
}
