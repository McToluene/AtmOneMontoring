using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using AtmOneMonitorMVC.Dtos;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AtmOneMonitorMVC.Controllers
{

  [Route("[controller]")]
  [ApiController]
  public class AuthenticationController : ControllerBase
  {
    private readonly IAuthenticationRepository authRepository;
    private readonly IConfiguration configuration;
    private readonly IRolePrivilegeRepository rolePrivilegeRepository;
    private readonly IAuditTrailRepository auditTrailRepository;

    public AuthenticationController(IAuthenticationRepository authRepository, IConfiguration configuration,
      IRolePrivilegeRepository rolePrivilegeRepository,IAuditTrailRepository auditTrailRepository)
    {
      this.authRepository = authRepository;
      this.configuration = configuration;
      this.rolePrivilegeRepository = rolePrivilegeRepository;
      this.auditTrailRepository = auditTrailRepository;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto userLogin)
    {
      try
      {
        int privilegeId = await rolePrivilegeRepository.GetPrivilegeId("login");
        if (InputValidator.IsSQLInjected(userLogin.Username) || InputValidator.IsSQLInjected(userLogin.Password))
          return Unauthorized();

        string ipAddress = IpAddress();
        AppUserDTO appUser = await authRepository.Login(userLogin.Username, userLogin.Password, ipAddress);

        if (appUser == null || appUser.RoleId < 1)
          return Unauthorized();

        if (appUser.Status == false || appUser.Approved == false)
          return Unauthorized();

        AppAudit auditTrail = new AppAudit() { Action = "Signin", UserId = appUser.UserId, SysIp = ipAddress, PrivilegeId = privilegeId, LogDate = DateTime.Now };
        await auditTrailRepository.Add(auditTrail);

        SetTokenCookie(appUser.RefreshTokens.Token);
        string token = GenerateToken(appUser);
        return Ok(new { token, appUser.RefreshTokens });
      }
      catch (Exception)
      {
        return Unauthorized();
      }
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
      var refreshToken = Request.Cookies["refreshToken"];
      var appUser = await authRepository.RefreshToken(refreshToken, IpAddress());

      if (appUser == null)
        return Unauthorized(new { message = "Invalid token" });

      SetTokenCookie(appUser.RefreshTokens.Token);
      string token = GenerateToken(appUser);
      return Ok(new { token, appUser.RefreshTokens });
    }

    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken([FromHeader] string userToken)
    {
      // accept token from request body or cookie
      var token = userToken ?? Request.Cookies["refreshToken"];

      if (string.IsNullOrEmpty(token))
        return BadRequest(new { message = "Token is required" });

      var response = await authRepository.RevokeToken(token, IpAddress());

      if (!response)
        return NotFound(new { message = "Token not found" });

      return Ok(new { message = "Token revoked" });
    }

    private void SetTokenCookie(string token)
    {
      var cookieOptions = new CookieOptions
      {
        HttpOnly = true,
        Expires = DateTime.UtcNow.AddDays(7)
      };
      Response.Cookies.Append("refreshToken", token, cookieOptions);
    }

    private string IpAddress()
    {
      if (Request.Headers.ContainsKey("X-Forwarded-For"))
        return Request.Headers["X-Forwarded-For"];
      else
        return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
    }

    private string GenerateToken(AppUserDTO user)
    {
      JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
      byte[] key = Encoding.ASCII.GetBytes(configuration.GetSection("AppSettings:Token").Value);
      SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(new Claim[] { new Claim(ClaimTypes.PrimarySid, user.UserId.ToString()), new Claim(ClaimTypes.Name, user.FullName), new Claim(ClaimTypes.Role, user.RoleName), new Claim("RoleId", user.RoleId.ToString()), new Claim(ClaimTypes.Actor, user.UserName) }),
        Expires = DateTime.Now.AddMinutes(15),
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
      };

      SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
      string tokenString = tokenHandler.WriteToken(token);
      return tokenString;
    }
  }
}