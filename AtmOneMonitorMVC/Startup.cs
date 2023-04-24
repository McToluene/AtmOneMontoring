using System;
using System.Text;
using AtmOneMonitoringLibrary.Interfaces;
using AtmOneMonitoringLibrary.Models;
using AtmOneMonitoringLibrary.Repositories;
using AtmOneMonitorMVC.Extensions;
using AtmOneMonitorMVC.Handlers;
using AtmOneMonitorMVC.Interfaces;
using AtmOneMonitorMVC.Repository;
using AtmOneMonitorMVC.Services;
using AtmOneMonitorMVC.utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace AtmOneMonitorMVC
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {

      services.AddControllersWithViews();
      services.AddCors();
      services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();

      services.AddHttpContextAccessor();

      services.AddSingleton<IUriService>(service =>
      {
        var accessor = service.GetRequiredService<IHttpContextAccessor>();
        HttpRequest request = accessor.HttpContext.Request;
        string uri = string.Concat(request.Scheme, "://", request.Host.ToUriComponent());
        return new UriService(uri);
      });

      services.AddControllers().AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
      // For database context and connection
      services.AddDbContext<AtmOneMonitorContext>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

      //Application configuration
      services.AddSingleton<IApplicationConfig, ApplicationConfig>();

      // From classlibrary AtmoneMonitorLibrary
      services.AddScoped<IActiveDirectoryRepository, ActiveDirectoryRepository>();
      services.AddScoped<IAppUserRepository, AppUserRepository>();
      services.AddScoped<ILDAPRepository, LDAPRepository>();
      services.AddScoped<IAuthenticationRepository, AuthenticationRepository>();
      services.AddScoped<IAuditTrailRepository, AuditTrailRepository>();
      services.AddScoped<IRolePrivilegeRepository, RolePrivilegeRepository>();
      services.AddScoped<IAlertRepository, AlertRepository>();
      services.AddScoped<IRoleRepository, RoleRepository>();
      services.AddScoped<IAppPrivilegeRepository, AppPrivilegeRepository>();
      services.AddScoped<IVendorRepository, VendorRepository>();
      services.AddScoped<IBranchRepository, BranchRepository>();
      services.AddScoped<ITerminalRepository, TerminalRepository>();
      services.AddScoped<IVendorConfigRepository, VendorConfigRepository>();
      services.AddScoped<ITerminalConfigRepository, TerminalConfigRepository>();
      services.AddScoped<IOperationLogRepository, OperationLogRepository>();
      services.AddScoped<ILicenseInfoRepository, LicenseInfoRepository>();
      services.AddScoped<IAppDatGeneratorRepository, AppDatGeneratorRepository>();

      var key = Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value);
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
      {
        options.TokenValidationParameters = new TokenValidationParameters
        {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(key),
          ValidateIssuer = false,
          ValidateAudience = false,
          ClockSkew = TimeSpan.Zero
        };
      });

      services.AddAuthorizationCore(config =>
      {
        config.AddPolicy("AuditTrailPolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("audittrail"));
        });

        config.AddPolicy("AuditTrailDetailPolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("viewaudittrail"));
        });

        config.AddPolicy("ViewLogPolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("viewlog"));
        });

        config.AddPolicy("UserPolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("user"));
        });

        config.AddPolicy("RolePrivilegePolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("roleprivilege"));
        });

        config.AddPolicy("TerminalPolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("addterminal"));
        });

        config.AddPolicy("OnlineTerminalPolicy", options => {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("connectedterminal"));
        });

        config.AddPolicy("LicenseInfoPolicy", options => 
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("licenseinfo"));
        });

        config.AddPolicy("VendorConfigPolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("vendorconfiguration"));
        });

        config.AddPolicy("BranchPolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("addbranch"));
        });

        config.AddPolicy("ReportPolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("report"));
        });

        config.AddPolicy("AddUserPolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("createuser"));
        });

        config.AddPolicy("ViewTerminalPolicy", options =>
        {
          options.RequireAuthenticatedUser();
          options.AuthenticationSchemes.Add(JwtBearerDefaults.AuthenticationScheme);
          options.Requirements.Add(new AppPrivilegePolicy("viewterminal"));
        });

      });

      services.AddScoped<IAuthorizationHandler, AppPrivilegePolicyHandler>();

      // In production, the React files will be served from this directory
      services.AddSpaStaticFiles(configuration =>
      {
        configuration.RootPath = "ClientApp/build";
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/Error");
        app.ConfigureExceptionHandler();
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }

      app.ConfigureExceptionHandler();
      app.UseHttpsRedirection();
      app.UseStaticFiles();
      app.UseSpaStaticFiles();

      app.UseRouting();
      app.UseCors(x => x.SetIsOriginAllowed(origin => true).AllowAnyMethod().AllowAnyHeader().AllowCredentials());
      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
                  name: "default",
                  pattern: "{controller}/{action=Index}/{id?}");
      });

      app.UseSpa(spa =>
      {
        spa.Options.SourcePath = "ClientApp";

        if (env.IsDevelopment())
        {
          spa.UseReactDevelopmentServer(npmScript: "start");
        }
      });
    }
  }
}
