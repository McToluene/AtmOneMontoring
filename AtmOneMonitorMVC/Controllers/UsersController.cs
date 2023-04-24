using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AtmOneMonitoringLibrary.Dtos;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using AtmOneMonitorMVC.Helpers;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Models;
using AtmOneMonitorMVC.utils;
using CsvHelper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AtmOneMonitorMVC.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UsersController : ControllerBase
  {
    private readonly IAppUserRepository appUserRepository;
    private readonly IApplicationConfig applicationConfig;
    private readonly IRolePrivilegeRepository rolePrivilegeRepository;
    private readonly IUriService uriService;
    private const string URL = "createuser";

    public UsersController(IAppUserRepository appUserRepository, IApplicationConfig applicationConfig,
      IRolePrivilegeRepository rolePrivilegeRepository, IUriService uriService)
    {
      this.appUserRepository = appUserRepository;
      this.applicationConfig = applicationConfig;
      this.rolePrivilegeRepository = rolePrivilegeRepository;
      this.uriService = uriService;
    }

    [Authorize("AddUserPolicy")]
    [HttpPost]
    public async Task<IActionResult> Add(List<UserCreateDTO> users)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.PrimarySid) || !HttpContext.User.HasClaim(claim => claim.Type == "RoleId") || !HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.Actor))
        return Unauthorized();

      string userName = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Actor).Value;
      string roleIdString = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "RoleId").Value;
      var privilege = await GetPrivilege(int.Parse(roleIdString), URL);

      if (privilege.Edit != true)
        return Unauthorized();

      bool result = await appUserRepository.AddUsers(users, userName);
      var response = new Dtos.Response<bool>(result);
      return Ok(response);
    }

    [Authorize("UserPolicy")]
    public async Task<IActionResult> Get()
    {
      string actor = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Actor).Value;
      string roleName = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Role).Value;

      if (string.IsNullOrEmpty(actor) || string.IsNullOrEmpty(roleName))
        return Unauthorized();

      string userName = null;
      if (roleName.ToLower() != "system administrator")
        userName = actor;

      List<UsersDTO> users = await appUserRepository.GetUsersList(userName);
      var response = new Dtos.Response<List<UsersDTO>>(users);
      return Ok(response);
    }

    [Authorize("UserPolicy")]
    [HttpGet("export")]
    public async Task<IActionResult> Export()
    {
      string actor = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Actor).Value;
      string roleName = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Role).Value;

      if (string.IsNullOrEmpty(actor) || string.IsNullOrEmpty(roleName))
        return Unauthorized();

      string userName = null;
      if (roleName.ToLower() != "system administrator")
        userName = actor;

      List<UsersDTO> users = await appUserRepository.GetUsersList(userName);
      return ExportUsers(users);
    }

    [Authorize("UserPolicy")]
    [HttpGet("search")]
    public async Task<IActionResult> Get([FromQuery] ItemValueSearch search)
    {
      string actor = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Actor).Value;
      string roleName = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Role).Value;

      if (string.IsNullOrEmpty(actor) || string.IsNullOrEmpty(roleName))
        return Unauthorized();

      string userName = null;
      if (roleName.ToLower() != "system administrator")
        userName = actor;

      List<UsersDTO> users = await appUserRepository.SearchUsers(search.Item, search.Value, userName);
      var response = new Dtos.Response<List<UsersDTO>>(users);
      return Ok(response);
    }

    [Authorize("UserPolicy")]
    [HttpGet("search/export")]
    public async Task<IActionResult> Export([FromQuery] ItemValueSearch search)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.Role))
        return Unauthorized();

      string roleName = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Role).Value;
      List<UsersDTO> users = await appUserRepository.SearchUsers(search.Item, search.Value, roleName);
      return ExportUsers(users);
    }

    [Authorize("UserPolicy")]
    [HttpGet("paging")]
    public async Task<IActionResult> Get([FromQuery] PaginationFilter paginationFilter)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.Role))
        return Unauthorized();

      string roleName = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Role).Value;
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(paginationFilter.PageNumber, paginationFilter.PageSize);
      List<UsersDTO> users = await appUserRepository.GetPaginatedUsersList(validFilter.PageNumber, validFilter.PageSize, roleName);
      int totalRecords = await appUserRepository.TotalRecords(roleName);
      var response = PaginationHelper.CreatePageResponse(users, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [Authorize("UserPolicy")]
    [HttpGet("paging/search")]
    public async Task<IActionResult> SearchUsers([FromQuery] ItemValueFilter itemValueFilter)
    {
      if (!HttpContext.User.HasClaim(claim => claim.Type == ClaimTypes.Role))
        return Unauthorized();

      string roleName = HttpContext.User.FindFirst(claim => claim.Type == ClaimTypes.Role).Value;
      string route = Request.Path.Value;
      PaginationFilter validFilter = new PaginationFilter(itemValueFilter.PageNumber, itemValueFilter.PageSize);
      List<UsersDTO> users = await appUserRepository.SearchUsers(itemValueFilter.Item, itemValueFilter.Value, validFilter.PageNumber, validFilter.PageSize, roleName);
      int totalRecords = await appUserRepository.TotalRecords(itemValueFilter.Item, itemValueFilter.Value, roleName);

      var response = PaginationHelper.CreatePageResponse(users, validFilter, totalRecords, uriService, route);
      return Ok(response);
    }

    [Authorize("UserPolicy")]
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
      UserEditDto user = await appUserRepository.GetUser(id);
      var response = new Dtos.Response<UserEditDto>(user);
      return Ok(response);
    }

    [Authorize("UserPolicy")]
    [HttpPost("approved")]
    public async Task<IActionResult> Post(UsersDTO user)
    {
      bool message = await appUserRepository.ApproveUser(user);
      var response = new Dtos.Response<bool>(message);
      return Ok(response);
    }

    [Authorize("UserPolicy")]
    [HttpPost("edit")]
    public async Task<IActionResult> Edit(UserEditDto user)
    {
      bool result = await appUserRepository.Update(user);
      var response = new Dtos.Response<bool>(result);
      return Ok(response);
    }

    [Authorize("AddUserPolicy")]
    [HttpGet("ldap")]
    public async Task<IActionResult> Ldap()
    {
      Ldap ldap = await appUserRepository.GetLdap();
      return Ok(ldap);
    }

    [HttpPost("ldap")]
    public async Task<IActionResult> SaveLdap(LdapDTO ldap)
    {
      bool result = await appUserRepository.SaveLdap(ldap);
      return Ok(result);
    }

    [Authorize("AddUserPolicy")]
    [HttpPost("testconnection")]
    public async Task<IActionResult> TestConnection(TestConnectionDTO testConnection)
    {
      bool result = await appUserRepository.TestConnection(testConnection);
      var response = new Dtos.Response<bool>(result);
      return Ok(response);
    }

    [Authorize("UserPolicy")]
    [HttpGet("ldap/search")]
    public async Task<IActionResult> Search([FromQuery] SearchLdap search)
    {
      List<LdapUser> users = new List<LdapUser>();
      if (!string.IsNullOrEmpty(search.LdapString))
      {
        if (!string.IsNullOrEmpty(search.UserProfile))
          users = await appUserRepository.GetUserDetails(search.UserProfile, search.LdapString, search.Username, search.Password);
        else if (applicationConfig.AdMethodToUse() == AdMethod.GetADUsers)
          users = await appUserRepository.GetADUsers(search.LdapString, search.Username, search.Password);
        else
          users = await appUserRepository.GetActiveDirectoryUsers(search.LdapString, search.Username, search.Password);
      }
      else if (!string.IsNullOrEmpty(search.Domain))
        users = await appUserRepository.GetADUsers(search.Domain, search.Username, search.Password);

      if (users == null)
        users = GetUsersList();

      var response = new Dtos.Response<List<LdapUser>>(users);
      return Ok(response);
    }

    private List<LdapUser> GetUsersList()
    {
      List<LdapUser> users;
      users = new List<LdapUser> {
         new LdapUser{ UserName="ho250019", Email="ho250019@test.com", FullName="John Doe" }};

      for (int i = 0; i < 50000; i++)
      {
        users.Add(new LdapUser { UserName = $"ho23001{i}", Email = $"ho23001{i}@test.com", FullName = "John Doe" });
      }

      return users;
    }

    private FileStreamResult ExportUsers(List<UsersDTO> users)
    {
      var result = WriteCsvToMemory(users);
      var memoryStream = new MemoryStream(result);
      return new FileStreamResult(memoryStream, "text/csv") { FileDownloadName = "Users.csv" };
    }

    private byte[] WriteCsvToMemory(List<UsersDTO> users)
    {
      using var memoryStream = new MemoryStream();
      using var streamWriter = new StreamWriter(memoryStream);
      using var csvWriter = new CsvWriter(streamWriter, System.Globalization.CultureInfo.CurrentCulture);
      csvWriter.WriteRecords(users);
      streamWriter.Flush();
      return memoryStream.ToArray();
    }

    private async Task<RolePrivilegeDTO> GetPrivilege(int roleId, string url)
    {
      RolePrivilegeDTO role = new RolePrivilegeDTO();
      List<RolePrivilegeDTO> rolePrivileges = await rolePrivilegeRepository.GetRolePrivilegeRights(roleId);
      foreach (RolePrivilegeDTO rolePrivilege in rolePrivileges)
      {
        if (string.IsNullOrEmpty(rolePrivilege.Url)) continue;
        if (url.ToLower().Contains(rolePrivilege.Url))
        {
          role = rolePrivilege;
          break;
        }
      }
      return role;
    }
  }
}
