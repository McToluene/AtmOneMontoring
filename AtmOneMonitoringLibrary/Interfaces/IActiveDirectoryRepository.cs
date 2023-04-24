using AtmOneMonitoringLibrary.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IActiveDirectoryRepository
  {
    bool Validate(string userId, string password, string domain);
    bool Login(string ldpaString, string username, string password);
    List<LdapUser> GetUserDetail(string userName, string ldap, string userId, string password);
    Task<List<LdapUser>> GetADUsers(string ldap, string userId, string password);
    Task<List<LdapUser>> GetActiveDirectoryUsers(string ldap, string userId, string password);
    List<LdapUser> GetADUsers(string domain, string userId, string password, string ldap);
  }
}
