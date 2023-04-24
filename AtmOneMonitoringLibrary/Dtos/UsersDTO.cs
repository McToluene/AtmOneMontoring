
namespace AtmOneMonitoringLibrary.Dtos
{
  public class UsersDTO
  {
    public int UserID { get; set; }
    public string UserName { get; set; }
    public string FullName { get; set; }
    public string RoleName { get; set; }
    public string Email { get; set; }
    public string CreatedBy { get; set; }
    public bool? Status { get; set; }
    public bool? Approved { get; set; }
  }

  public class UserEditDto
  {
    public string UserName { get; set; }
    public string FullName { get; set; }
    public bool Status { get; set; }
    public string Email { get; set; }
    public string CreatedBy { get; set; }
    public string CreatedDate { get; set; }
    public string ApprovedBy { get; set; }
    public string ApprovedDate { get; set; }
    public bool Approved { get; set; }
    public int? RoleId { get; set; }
  }

  public class LdapUser
  {
    public bool IsSelected { get; set; }
    public string UserName { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string RoleName { get; set; }
  }

  public class UserCreateDTO
  {
    public string UserName { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public int? RoleId { get; set; }
    public bool Status { get; set; }
  }

}