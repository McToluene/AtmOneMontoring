using System.Collections.Generic;
using AtmOneMonitoringLibrary.Dtos;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Models;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface IAppUserRepository
  {
    Task<AppUserDTO> GetUser(string username, string password, string ipAddress);
    Task<List<UsersDTO>> GetUsersList(string userName);
    Task<List<UsersDTO>> GetPaginatedUsersList(int pageNumber, int pageSize, string roleName);
    Task<UserEditDto> GetUser(int id);
    Task<bool> ApproveUser(UsersDTO user);
    Task<bool> Update(UserEditDto user);
    Task<Ldap> GetLdap();
    Task<bool> TestConnection(TestConnectionDTO testConnection);
    Task<List<LdapUser>> GetUserDetails(string userName, string ldapString, string userId, string password);
    Task<List<LdapUser>> GetADUsers(string ldapString, string userId, string password);
    Task<List<LdapUser>> GetActiveDirectoryUsers(string ldapString, string userId, string password);
    Task<List<LdapUser>> GetADUsers(string domain, string userId, string password, string ldap);
    Task<int> TotalRecords(string roleName);
    Task<List<UsersDTO>> SearchUsers(string item, string value, int pageNumber, int pageSize, string roleName);
    Task<List<UsersDTO>> SearchUsers(string item, string value, string roleName);
    Task<bool> AddUsers(List<UserCreateDTO> users, string userName);
    Task<int> TotalRecords(string item, string value, string roleName);
    Task<AppUser> RefreshToken(string token, string ipAddress);
    Task<bool> RevokeToken(string token, string ipAddress);
    Task<bool> SaveLdap(LdapDTO ldap);
  }
}
