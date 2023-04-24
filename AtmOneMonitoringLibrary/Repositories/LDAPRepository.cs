using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class LDAPRepository : ILDAPRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    public LDAPRepository(AtmOneMonitorContext dbContext)
    {
      this.dbContext = dbContext;
    }

    public async Task<bool> AddLdap(LdapDTO ldap)
    {
      var ldapFromDB = await dbContext.Ldap.FirstOrDefaultAsync();
      if (ldapFromDB.LdapId > 0)
        return await Update(ldap);
      else
        return await Insert(ldap);
    }

    private async Task<bool> Update(LdapDTO ldap)
    {
      var ldapFromDB = await dbContext.Ldap.FirstOrDefaultAsync();
      if (ldapFromDB != null)
      {
        ldapFromDB.Domain = ldap.Domain;
        ldapFromDB.Ldapstring = ldap.Ldapstring;
        ldapFromDB.Filter = ldap.Filter;
        dbContext.Update(ldapFromDB);
        return await dbContext.SaveChangesAsync() > 0;
      }
      return false;
    }

    private async Task<bool> Insert(LdapDTO ldap)
    {
      Ldap newLdap = new Ldap {Filter = ldap.Filter, Domain = ldap.Domain, Ldapstring = ldap.Ldapstring };
      await dbContext.Ldap.AddAsync(newLdap);
      return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<Ldap> GetLdap() => await dbContext.Ldap.FirstOrDefaultAsync();
  }
}
