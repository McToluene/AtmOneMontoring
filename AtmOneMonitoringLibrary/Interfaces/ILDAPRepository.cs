using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Models;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Interfaces
{
  public interface ILDAPRepository
  {
    Task<Ldap> GetLdap();
    Task<bool> AddLdap(LdapDTO ldap);
  }
}
