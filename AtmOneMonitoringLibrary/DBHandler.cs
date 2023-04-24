using AtmOneMonitoringLibrary.Config;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using AtmOneMonitoringLibrary.Models;

namespace AtmOneMonitorigLibrary
{
  public class DBHandler : IDesignTimeDbContextFactory<AtmOneMonitorContext>
  {
    public AtmOneMonitorContext CreateDbContext(string[] args)
    {
      var optionsBuilder = new DbContextOptionsBuilder<AtmOneMonitorContext>();

      optionsBuilder.UseSqlServer(ConfigurationManager.Configuration.GetConnectionString("DefaultConnection"));
      return new AtmOneMonitorContext(optionsBuilder.Options);
    }
  }
}
