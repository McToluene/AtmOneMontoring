
using AtmOneMonitoringLibrary.Models;
using System.Collections.Generic;

namespace AtmOneMonitoringLibrary.Dtos
{
  public class AppUserDTO
  {
    public int UserId { get; set; }
    public string UserName { get; set; }
    public string FullName { get; set; }
    public string Pswd { get; set; }
    public int? RoleId { get; set; }
    public string RoleName { get; set; }
    public string Email { get; set; }
    public bool? Approved { get; set; }
    public bool? Status { get; set; }
    public RefreshToken RefreshTokens { get; set; }
  }
}
