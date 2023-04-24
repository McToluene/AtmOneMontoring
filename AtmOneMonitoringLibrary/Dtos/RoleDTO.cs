using System.Collections.Generic;


namespace AtmOneMonitoringLibrary.Dtos
{
  public class RoleDTO
  {
    public int Id { get; set; }
    public string Rolename { get; set; }
    public List<PrivilegeDTO> Privilege { get; set; }
  }

  public class PrivilegeDTO
  {
    public int? Id { get; set; }
    public string Privilege { get; set; }
  }

  public class RoleAddRemoveDTO
  {
    public int RoleId { get; set; }
    public int PrivilegeId { get; set; }
  }

  public class RoleUpdatePrivilegeDTO : RoleAddRemoveDTO
  {
    public int PrevPrivilegeId { get; set; }
  }

  public class RolePrivilegeForAddDTO
  {
    public List<RoleAddRemoveDTO> RemovedPrivileges { get; set; }
    public List<RoleAddRemoveDTO> RolePrivileges { get; set; }
  }

  public class RolePrivilegesForAddDTO
  {
    public int RoleId { get; set; }
    public List<int> Privileges { get; set; }
  }
}