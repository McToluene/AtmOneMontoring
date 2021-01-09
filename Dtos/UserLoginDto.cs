using System.ComponentModel.DataAnnotations;

namespace AtmOneMonitorMVC.Dtos
{
  public class UserLoginDto
  {
    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }
  }

  public class UserResponseDTO
  {
    public string Username { get; set; }
    public string Fullname { get; set; }
    public byte[] PswdSalt { get; set; }
    public byte[] PswdHash { get; set; }
    public string Rolename { get; set; }
  }

}