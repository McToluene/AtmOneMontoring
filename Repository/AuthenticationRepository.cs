using System.Threading.Tasks;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;

namespace AtmOneMonitorMVC.Repository
{
  public class AuthenticationRepository : IAuthenticationRepository
  {
    private readonly ILDAPRepository ldapRepository;
    private readonly IAppUserRepository appUserRepository;
    private readonly IActiveDirectoryRepository activeDirectory;

    public AuthenticationRepository(ILDAPRepository ldapRepository, IAppUserRepository appUserRepository, IActiveDirectoryRepository activeDirectory)
    {
      this.ldapRepository = ldapRepository;
      this.appUserRepository = appUserRepository;
      this.activeDirectory = activeDirectory;
    }

    public async Task<AppUserDTO> Login(string username, string password, string ipAddress)
    {
      bool login = false;
      Ldap ldap = await ldapRepository.GetLdap();
      AppUserDTO appUser = await appUserRepository.GetUser(username, password, ipAddress);
      if (appUser == null && !string.IsNullOrEmpty(ldap.Ldapstring))
      {
        appUser = await appUserRepository.GetUser(username, null, ipAddress);
        if (appUser != null)
        {
          login = await Task.Run(() => activeDirectory.Login(ldap.Ldapstring, appUser.UserName, password));
          if (!login && !string.IsNullOrEmpty(ldap.Domain))
            login = await Task.Run(() => activeDirectory.Validate(appUser.UserName, password, ldap.Domain));
        }
        if (!login)
          appUser = null;
      }
      return appUser;
    }

    public async Task<AppUserDTO> RefreshToken(string refreshToken, string ipAddress)
    {
      var user = await appUserRepository.RefreshToken(refreshToken, ipAddress);
      if (user == null)
        return null;

      return new AppUserDTO() { FullName = user.Fullname, UserId = user.UserId, RoleName = user.Role.Rolename, RoleId = user.RoleId, UserName = user.Username, RefreshTokens = user.RefreshTokens };
    }

    public async Task<bool> RevokeToken(string token, string ipAddress) => await appUserRepository.RevokeToken(token, ipAddress);
  }

}