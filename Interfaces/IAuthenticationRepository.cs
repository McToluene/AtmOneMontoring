using AtmOneMonitoringLibrary.Dtos;
using System.Threading.Tasks;

namespace AtmOneMonitorMVC.Interfaces
{
  public interface IAuthenticationRepository
  {
    Task<AppUserDTO> Login(string username, string password, string ipAddress);
    Task<AppUserDTO> RefreshToken(string refreshToken, string ipAddress);
    Task<bool> RevokeToken(string token, string v);
  }
}