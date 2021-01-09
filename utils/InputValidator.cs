using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace AtmOneMonitorMVC.utils
{
  public class InputValidator
  {
    public static bool IsSQLInjected(string input)
    {
      bool check = false;
      try
      {
        string[] tokens = { "select", "insert", "update ", "--", "create", "alter", "try", "truncate", "case ", "execute ", "exec ", "drop", "procedure", "function", "package", "trigger" };
        check = tokens.All(x => input.ToLower().Contains(x));
        bool found = Array.Exists(tokens, x => input.ToLower().Contains(x));
        return found;
      }
      catch (Exception) { return false; }
    }
    public static bool IsInteger(string number)
    {
      if (string.IsNullOrEmpty(number)) return false;
      return number.All(Char.IsDigit);
      //number.All(x => Char.IsDigit(x));
    }
    public static bool IsEmail(string input)
    {
      // new MailAddress(input).Address;
      Regex regex = new Regex(@"^[_a-z0-9-]+(.[a-z0-9-]+)@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$");
      return regex.IsMatch(input);
    }
    public static bool IsIp(string input)
    {
      Regex regex = new Regex(@"\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}");
      return regex.IsMatch(input);
    }
  }
}