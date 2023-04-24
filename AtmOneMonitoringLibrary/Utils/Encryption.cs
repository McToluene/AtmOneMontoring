using System;

namespace AtmOneMonitoringLibrary.Utils
{
  class Encryption
  {
    public static string Encode(string plaintext)
    {
      try
      {
        return new AppSecure.Identity("IntelligentCAM").EncryptStream(plaintext);
      }
      catch (Exception)
      {
        return "";
      }
    }

    public static string Decode(string encrypted)
    {
      try
      {
        return new AppSecure.Identity("IntelligentCAM").DecryptStream(encrypted);
      }
      catch (Exception)
      {
        return "";
      }
    }
  }
}
