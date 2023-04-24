using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Utils;
using System.Collections.Generic;
using System;
using System.Security.Cryptography;

namespace AtmOneMonitoringLibrary.Repositories
{
  public class AppUserRepository : IAppUserRepository
  {
    private readonly AtmOneMonitorContext dbContext;
    private readonly ILDAPRepository ldapRepository;
    private readonly IActiveDirectoryRepository activeDirectory;
    public AppUserRepository(AtmOneMonitorContext dbContext, ILDAPRepository ldapRepository, IActiveDirectoryRepository activeDirectory)
    {
      this.dbContext = dbContext;
      this.ldapRepository = ldapRepository;
      this.activeDirectory = activeDirectory;
    }

    public async Task<bool> AddUsers(List<UserCreateDTO> users, string userName)
    {
      bool result = false;
      foreach (var user in users)
      {
        AppUser newUser = new AppUser
        {
          RoleId = user.RoleId,
          Username = user.UserName,
          Fullname = user.FullName,
          Email = user.Email,
          CreatedBy = userName,
          CreatedDate = DateTime.Now,
          Approved = false
        };
        result = await Add(newUser);
      }
      return result;
    }

    private async Task<bool> Add(AppUser user)
    {
      var userFromDb = await dbContext.AppUser.FirstOrDefaultAsync(x => x.Username == user.Username);
      if (userFromDb != null)
        return false;

      await dbContext.AppUser.AddAsync(user);
      return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<bool> ApproveUser(UsersDTO user)
    {
      AppUser userFromDB = await dbContext.AppUser.FirstOrDefaultAsync(x => x.UserId == user.UserID);
      if (userFromDB != null)
      {
        userFromDB.Approved = user.Approved;
        userFromDB.ApprovedDate = DateTime.Now;
        return await dbContext.SaveChangesAsync() > 0;
      }
      return false;
    }

    public async Task<List<LdapUser>> GetActiveDirectoryUsers(string ldapString, string userId, string password)
    {
      try
      {
        return await activeDirectory.GetActiveDirectoryUsers(ldapString, userId, password);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return null;
      }
    }

    public async Task<List<LdapUser>> GetADUsers(string ldapString, string userId, string password)
    {
      try
      {
        return await activeDirectory.GetADUsers(ldapString, userId, password);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return null;
      }
    }

    public async Task<List<LdapUser>> GetADUsers(string domain, string userId, string password, string ldap)
    {
      try
      {
        return await Task.Run(() => activeDirectory.GetADUsers(domain, userId, password, ldap));
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return null;
      }
    }

    public async Task<Ldap> GetLdap() => await ldapRepository.GetLdap();

    public async Task<List<UsersDTO>> GetPaginatedUsersList(int pageNumber, int pageSize, string roleName)
    {
      var query = dbContext.AppUser.Skip((pageNumber - 1) * pageSize).Take(pageSize)
        .Select(user => new UsersDTO() { UserName = user.Username, FullName = user.Fullname, UserID = user.UserId, Approved = user.Approved, CreatedBy = user.CreatedBy, Email = user.Email, RoleName = user.Role.Rolename, Status = user.Status });

      if (roleName.ToLower() != "system administrator")
        query = query.Where(user => user.CreatedBy != roleName || (user.CreatedBy == roleName && user.Approved == true));
      return await query.ToListAsync();
    }

    public async Task<AppUserDTO> GetUser(string username, string password, string ipAddress)
    {
      var query = dbContext.AppUser
        .Select(user => new AppUserDTO() { UserId = user.UserId, RoleId = user.RoleId, RoleName = user.Role.Rolename, UserName = user.Username, FullName = user.Fullname, Approved = user.Approved, Status = user.Status, Pswd = user.Pswd, RefreshTokens = user.RefreshTokens })
        .Select(user => string.IsNullOrEmpty(password) ? user : new AppUserDTO() { UserId = user.UserId, RoleId = user.RoleId, RoleName = user.RoleName, UserName = user.UserName, FullName = user.FullName, Approved = user.Approved, Status = user.Status, Pswd = user.Pswd });

      if (username.ToLower() != "system")
        query = query.Where(user => user.Approved == true && user.Status == true);

      AppUserDTO appUser = await query.FirstOrDefaultAsync(user => user.UserName == username && user.Pswd == Encryption.Encode(password));
      if (appUser != null)
      {
        RefreshToken refreshToken = GenerateRefreshToken(ipAddress);
        appUser.RefreshTokens = refreshToken;
        await UpdateUserRefreshToken(appUser, refreshToken);
      }
      return appUser;
    }

    private async Task UpdateUserRefreshToken(AppUserDTO user, RefreshToken refreshToken)
    {
      var appUser = await dbContext.AppUser.FirstOrDefaultAsync(x => x.UserId == user.UserId);
      if (appUser != null)
      {
        appUser.RefreshTokens = refreshToken;
        dbContext.Update(appUser);
        await dbContext.SaveChangesAsync();
      }
    }

    private RefreshToken GenerateRefreshToken(string ipAddress)
    {
      using (var rngCryptoServiceProvider = new RNGCryptoServiceProvider())
      {
        var randomBytes = new byte[64];
        rngCryptoServiceProvider.GetBytes(randomBytes);
        return new RefreshToken
        {
          Token = Convert.ToBase64String(randomBytes),
          Expires = DateTime.UtcNow.AddDays(7),
          Created = DateTime.UtcNow,
          CreatedByIp = ipAddress
        };
      }
    }

    public async Task<UserEditDto> GetUser(int id) => await dbContext.AppUser
      .Where(user => user.UserId == id)
      .Select(user => new UserEditDto() { RoleId = user.RoleId, Approved = Convert.ToBoolean(user.Approved), ApprovedBy = user.ApprovedBy, ApprovedDate = Convert.ToDateTime(user.ApprovedDate).ToString("dd-MM-yyyy  hh-mm-ss"), UserName = user.Username, FullName = user.Fullname, CreatedBy = user.CreatedBy, CreatedDate = Convert.ToDateTime(user.CreatedDate).ToString("dd-MM-yyyy HH:mm:ss"), Email = user.Email, Status = Convert.ToBoolean(user.Status) })
      .FirstOrDefaultAsync();

    public async Task<List<LdapUser>> GetUserDetails(string userName, string ldapString, string userId, string password)
    {
      List<LdapUser> users = new List<LdapUser>();
      try
      {
        users = await Task.Run(() => activeDirectory.GetUserDetail(userName, ldapString, userId, password));
        return users;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return null;
      }
    }

    public async Task<List<UsersDTO>> GetUsersList(string userName)
    {
      var query = dbContext.AppUser
        .Select(user => new UsersDTO() { UserName = user.Username, FullName = user.Fullname, UserID = user.UserId, Approved = user.Approved, CreatedBy = user.CreatedBy, Email = user.Email, RoleName = user.Role.Rolename, Status = user.Status });

      if (!string.IsNullOrEmpty(userName))
        query = query.Where(user => !user.CreatedBy.ToLower().Equals(userName.ToLower()));

      return await query.ToListAsync();
    }

    public async Task<List<UsersDTO>> SearchUsers(string item, string value, int pageNumber, int pageSize, string userName)
    {
      List<UsersDTO> users = new List<UsersDTO>();
      var query = dbContext.AppUser
        .Select(user => new UsersDTO() { UserName = user.Username, FullName = user.Fullname, UserID = user.UserId, Approved = user.Approved, CreatedBy = user.CreatedBy, Email = user.Email, RoleName = user.Role.Rolename, Status = user.Status });

      if (!string.IsNullOrEmpty(userName))
        query = query.Where(user => user.CreatedBy != userName);

      if (item != null && value != null)
      {
        if (item.ToLower() == "rolename")
          users = await query.Where(user => user.RoleName == value).ToListAsync();

        if (item.ToLower() == "username")
          users = await query.Where(user => user.UserName == value).ToListAsync();
      }
      return users;
    }

    public async Task<List<UsersDTO>> SearchUsers(string item, string value, string userName)
    {
      List<UsersDTO> users = new List<UsersDTO>();
      var query = dbContext.AppUser
        .Select(user => new UsersDTO() { UserName = user.Username, FullName = user.Fullname, UserID = user.UserId, Approved = user.Approved, CreatedBy = user.CreatedBy, Email = user.Email, RoleName = user.Role.Rolename, Status = user.Status });

      if (!string.IsNullOrEmpty(userName))
        query = query.Where(user => user.CreatedBy != userName || (user.CreatedBy == userName && user.Approved == true));

      if (item.ToLower() == "rolename")
        users = await query.Where(user => user.RoleName == value).ToListAsync();

      if (item.ToLower() == "username")
        users = await query.Where(user => user.UserName == value).ToListAsync();
      return users;
    }

    public async Task<bool> TestConnection(TestConnectionDTO testConnection)
    {
      try
      {
        bool login = false;
        login = await Task.Run(() => activeDirectory.Login(testConnection.LdapString, testConnection.Username, testConnection.Password));

        if (!login && !string.IsNullOrEmpty(testConnection.Domain))
          login = await Task.Run(() => activeDirectory.Validate(testConnection.Username, testConnection.Password, testConnection.Domain));
        return login;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        return false;
      }
    }

    public async Task<int> TotalRecords(string roleName)
    {

      if (roleName.ToLower() != "system administrator")
        return await dbContext.AppUser.Where(user => user.CreatedBy != roleName || (user.CreatedBy == roleName && user.Approved == true)).CountAsync();
      return await dbContext.AppUser.CountAsync();
    }

    public async Task<int> TotalRecords(string item, string value, string roleName)
    {
      int count = 0;
      if (item.ToLower() == "rolename")
      {
        if (roleName.ToLower() != "system administrator")
          count = await dbContext.AppUser.Where(user => user.CreatedBy != roleName || (user.CreatedBy == roleName && user.Approved == true)).Where(user => user.Role.Rolename == value).CountAsync();
        else
          count = await dbContext.AppUser.Where(user => user.Role.Rolename == value).CountAsync();
      }

      if (item.ToLower() == "username")
      {
        if (roleName.ToLower() != "system administrator")
          count = await dbContext.AppUser.Where(user => user.CreatedBy != roleName || (user.CreatedBy == roleName && user.Approved == true)).Where(user => user.Username == value).CountAsync();
        else
          count = await dbContext.AppUser.Where(user => user.Username == value).CountAsync();
      }

      return count;
    }

    public async Task<bool> Update(UserEditDto user)
    {
      bool isUpdated = false;
      try
      {
        AppUser appUser = await dbContext.AppUser.FirstOrDefaultAsync(x => x.Username == user.UserName);
        appUser.RoleId = user.RoleId;
        appUser.Status = user.Status;
        await dbContext.SaveChangesAsync();
        isUpdated = true;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex);
        isUpdated = false;
      }
      return isUpdated;
    }

    public async Task<bool> RevokeToken(string token, string ipAddress)
    {
      var user = await dbContext.AppUser.FirstOrDefaultAsync(u => u.RefreshTokens.Token == token);

      // return false if no user found with token
      if (user == null) return false;

      var refreshToken = user.RefreshTokens;

      // return false if token is not active
      if (!refreshToken.IsActive) return false;

      // revoke token and save
      refreshToken.Revoked = DateTime.UtcNow;
      refreshToken.RevokedByIp = ipAddress;
      dbContext.Update(user);
      await dbContext.SaveChangesAsync();

      return true;
    }

    public async Task<AppUser> RefreshToken(string token, string ipAddress)
    {
      var user = await dbContext.AppUser.Include(u => u.Role).FirstOrDefaultAsync(u => u.RefreshTokens.Token == token);

      // return null if no user found with token
      if (user == null) return null;

      var refreshToken = user.RefreshTokens;

      // return null if token is no longer active
      if (!refreshToken.IsActive) return null;

      // replace old refresh token with a new one and save
      var newRefreshToken = GenerateRefreshToken(ipAddress);
      refreshToken.Revoked = DateTime.UtcNow;
      refreshToken.RevokedByIp = ipAddress;
      refreshToken.ReplacedByToken = newRefreshToken.Token;
      user.RefreshTokens = newRefreshToken;
      dbContext.Update(user);
      await dbContext.SaveChangesAsync();

      return user;
    }

    public async Task<bool> SaveLdap(LdapDTO ldap) => await ldapRepository.AddLdap(ldap);
  }
}
