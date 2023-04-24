using AtmOneMonitoringLibrary.Interfaces;
using System;
using System.DirectoryServices;
using System.DirectoryServices.Protocols;
using System.Net;
using AtmOneMonitoringLibrary.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using System.DirectoryServices.AccountManagement;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class ActiveDirectoryRepository : IActiveDirectoryRepository
  {
    private readonly ILDAPRepository lDAPRepository;
    public ActiveDirectoryRepository(ILDAPRepository lDAPRepository)
    {
      this.lDAPRepository = lDAPRepository;
    }

    public bool Login(string ldpaString, string username, string password)
    {
      bool login = false;
      try
      {
        DirectoryEntry directoryEntry = new DirectoryEntry(ldpaString, username, password, AuthenticationTypes.Secure);
        if (directoryEntry != null)
        {
          object nObj = directoryEntry.NativeObject;
          login = true;
        }
      }
      catch (Exception)
      {
        login = false;
      }
      return login;
    }

    public bool Validate(string userId, string password, string domain)
    {
      bool validation;
      try
      {
        LdapConnection ldapConnection = new LdapConnection(new LdapDirectoryIdentifier((string)null, false, false));

        NetworkCredential networkCredential = new NetworkCredential(userId, password, domain);
        ldapConnection.Credential = networkCredential;
        ldapConnection.AuthType = AuthType.Negotiate;
        ldapConnection.Bind(networkCredential); // user has been authenticated at this point, as the credentials were used to login to the dc.
        validation = true;
      }
      catch (Exception)
      {
        validation = false;
      }
      return validation;
    }

    public async Task<List<LdapUser>> GetADUsers(string ldap, string userId = null, string password = null)
    {
      try
      {
        Ldap ldapFromDB =  await lDAPRepository.GetLdap();
        string filter = ldapFromDB.Filter;

        List<LdapUser> lstADUsers = new List<LdapUser>();

        //string DomainPath = "LDAP://DC=xxxx,DC=com";
        DirectoryEntry searchRoot = null; // new DirectoryEntry(DomainPath);

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(password))
          searchRoot = new DirectoryEntry(ldap);
        else searchRoot = new DirectoryEntry(ldap, userId, password);

        using (var search = new DirectorySearcher(searchRoot))
        {
          search.PageSize = 1000;
          search.Filter = string.IsNullOrEmpty(filter) ? "(&(objectClass=user)(objectCategory=person))" : filter;
          search.PropertiesToLoad.Add("samaccountname");
          search.PropertiesToLoad.Add("mail");
          search.PropertiesToLoad.Add("usergroup");
          search.PropertiesToLoad.Add("displayname");//first name
          SearchResult result;
          using (SearchResultCollection results = search.FindAll())
          {
            for (int counter = 0; counter < results.Count; counter++)
            {
              string UserNameEmailString = string.Empty;
              result = results[counter];
              if (result.Properties.Contains("samaccountname") && result.Properties.Contains("mail") && result.Properties.Contains("displayname"))
              {
                LdapUser user = new LdapUser();
                user.Email = $"{result.Properties["mail"][0]}";
                user.UserName = $"{result.Properties["samaccountname"][0]}";
                user.FullName = $"{result.Properties["displayname"][0]}";
                lstADUsers.Add(user);
              }
            }
          }
        }
        return lstADUsers;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public List<LdapUser> GetUserDetail(string userName, string ldap, string userId = null, string password = null)
    {
      try
      {
        List<LdapUser> appUsers = new List<LdapUser>();
        DirectoryEntry searchRoot = null;

        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(password))
          searchRoot = new DirectoryEntry(ldap);
        else searchRoot = new DirectoryEntry(ldap, userId, password);
        DirectorySearcher search = new DirectorySearcher(searchRoot)
        {
          // specify the search filter sAMAccountName / (anr=" + account + ")
          Filter = $"(&(objectClass=user)(objectCategory=person)(sAMAccountName={userName}))"
        };
        search.PropertiesToLoad.Add("samaccountname");
        search.PropertiesToLoad.Add("mail");
        search.PropertiesToLoad.Add("displayname");//first name

        // perform the search
        SearchResult result = search.FindOne();
        LdapUser user = new LdapUser
        {
          Email = $"{result.Properties["mail"][0]}",
          UserName = $"{result.Properties["samaccountname"][0]}",
          FullName = $"{result.Properties["displayname"][0]}"
        };
        appUsers.Add(user);
        return appUsers;
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }

    public async Task<List<LdapUser>> GetActiveDirectoryUsers(string ldap, string userId, string password)
    {
      Ldap ldapFromDB = await lDAPRepository.GetLdap();
      string filter = ldapFromDB.Filter;
      var dirEntry = new DirectoryEntry();
      List<LdapUser> users = new List<LdapUser>();

      if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(password))
        dirEntry = new DirectoryEntry(ldap);
      else dirEntry = new DirectoryEntry(ldap, userId, password);

      using (var searcher = new DirectorySearcher(dirEntry))
      {
        searcher.PageSize = 1000;
        searcher.Filter = string.IsNullOrEmpty(filter) ? "(&(objectClass=user)(objectCategory=person))" : filter;

        using (SearchResultCollection resultCollection = searcher.FindAll())
        {
          foreach (SearchResult searchResult in resultCollection)
          {
            LdapUser usersDTO = new LdapUser
            {
              UserName = (GetProperty(searchResult, "CN")),
              FullName = string.Format("{0} {1}", (GetProperty(searchResult, "givenName")), (GetProperty(searchResult, "sn"))),
              Email = (GetProperty(searchResult, "mail")),
              RoleName = " "
            };
            users.Add(usersDTO);
          }
        }
      }
      return users;
    }
    
    private string GetProperty(SearchResult searchResult, string propertyName)
    {
      if (searchResult.Properties.Contains(propertyName))
        return searchResult.Properties[propertyName][0].ToString();
      else
        return string.Empty;
    }

    public List<LdapUser> GetADUsers(string domain, string userId, string password = null, string ldap = null)
    {
      try
      {
        List<LdapUser> users = new List<LdapUser>();
        using(var context = new PrincipalContext(ContextType.Domain, domain, userId, password))
        {
          using (var searcher = new PrincipalSearcher(new UserPrincipal(context)))
          {
            foreach (var result in searcher.FindAll())
            {
              DirectoryEntry directory = result.GetUnderlyingObject() as DirectoryEntry;
              try
              {
                LdapUser user = new LdapUser
                {
                  UserName = directory.Properties["cn"].Value.ToString(),
                  FullName = string.Format("{0} {1}", directory.Properties["givenName"].Value, directory.Properties["sn"].Value),
                  Email = directory.Properties["mail"].Value.ToString(),
                  RoleName = " "
                };
              }
              catch (Exception){ }
            }
          }
        }
        return users;
      }
      catch (Exception)
      {
        throw;
      }
    }
  }
}
