using Microsoft.EntityFrameworkCore;

namespace AtmOneMonitoringLibrary.Models
{
  public partial class AtmOneMonitorContext : DbContext
  {
    public AtmOneMonitorContext(DbContextOptions<AtmOneMonitorContext> options) : base(options){}
    public virtual DbSet<Alert> Alert { get; set; }
    public virtual DbSet<AppAudit> AppAudit { get; set; }
    public virtual DbSet<AppPrivilege> AppPrivilege { get; set; }
    public virtual DbSet<AppRole> AppRole { get; set; }
    public virtual DbSet<AppRolePrivilege> AppRolePrivilege { get; set; }
    public virtual DbSet<AppUser> AppUser { get; set; }
    public virtual DbSet<Branch> Branch { get; set; }
    public virtual DbSet<ConfigApproval> ConfigApproval { get; set; }
    public virtual DbSet<Ldap> Ldap { get; set; }
    public virtual DbSet<LicInfo> LicInfo { get; set; }
    public virtual DbSet<OperationLog> OperationLog { get; set; }
    public virtual DbSet<Terminal> Terminal { get; set; }
    public virtual DbSet<TerminalConfig> TerminalConfig { get; set; }
    public virtual DbSet<Vendor> Vendor { get; set; }
    public virtual DbSet<VendorConfiguration> VendorConfiguration { get; set; }
    public virtual DbSet<VwAlert> VwAlert { get; set; }
    public virtual DbSet<VwConfiguration> VwConfiguration { get; set; }
    public virtual DbSet<VwConfigurationApproval> VwConfigurationApproval { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Alert>(entity =>
      {
        entity.ToTable("alert");

        entity.Property(e => e.AlertId).HasColumnName("alertId");

        entity.Property(e => e.ADate).HasColumnName("aDate");

        entity.Property(e => e.AppId)
            .HasColumnName("appID")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.BranchSent)
            .HasColumnName("branch_sent")
            .HasDefaultValueSql("((0))");

        entity.Property(e => e.Ip)
            .HasColumnName("ip")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.Message)
            .HasColumnName("message")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.MsgCat)
            .HasColumnName("msgCat")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.ReportSent)
            .HasColumnName("report_sent")
            .HasDefaultValueSql("((0))");

        entity.Property(e => e.Sent)
            .HasColumnName("sent")
            .HasDefaultValueSql("((0))");

        entity.Property(e => e.StatusId).HasColumnName("statusId");

        entity.Property(e => e.UDate).HasColumnName("uDate");
      });

      modelBuilder.Entity<AppAudit>(entity =>
      {
        entity.HasKey(e => e.AuditId)
            .HasName("PK__appAudit__43D17399CA9C1727");

        entity.ToTable("appAudit");

        entity.Property(e => e.AuditId).HasColumnName("auditId");

        entity.Property(e => e.Action)
            .HasColumnName("action")
            .HasMaxLength(200)
            .IsUnicode(false);

        entity.Property(e => e.LogDate).HasColumnName("logDate");

        entity.Property(e => e.NewValues)
            .HasColumnName("newValues")
            .IsUnicode(false);

        entity.Property(e => e.OldValues)
            .HasColumnName("oldValues")
            .IsUnicode(false);

        entity.Property(e => e.PrivilegeId).HasColumnName("privilegeId");

        entity.Property(e => e.SysIp)
            .HasColumnName("sysIP")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.SysName)
            .HasColumnName("sysName")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.UserId).HasColumnName("userId");

        entity.HasOne(d => d.Privilege)
            .WithMany(p => p.AppAudit)
            .HasForeignKey(d => d.PrivilegeId)
            .HasConstraintName("FK__appAudit__privil__2A164134");

        entity.HasOne(d => d.User)
            .WithMany(p => p.AppAudit)
            .HasForeignKey(d => d.UserId)
            .HasConstraintName("FK__appAudit__userId__2739D489");
      });

      modelBuilder.Entity<AppPrivilege>(entity =>
      {
        entity.HasKey(e => e.PrivilegeId)
            .HasName("PK__appPrivi__49A199917580734F");

        entity.ToTable("appPrivilege");

        entity.Property(e => e.PrivilegeId).HasColumnName("privilegeId");

        entity.Property(e => e.Privilege)
            .HasColumnName("privilege")
            .HasMaxLength(100)
            .IsUnicode(false);

        entity.Property(e => e.Url)
            .HasColumnName("url")
            .HasMaxLength(400)
            .IsUnicode(false);
      });

      modelBuilder.Entity<AppRole>(entity =>
      {
        entity.HasKey(e => e.RoleId)
            .HasName("PK__appRole__CD98462A8E988D62");

        entity.ToTable("appRole");

        entity.Property(e => e.RoleId).HasColumnName("roleId");

        entity.Property(e => e.Rolename)
            .HasColumnName("rolename")
            .HasMaxLength(50)
            .IsUnicode(false);
      });

      modelBuilder.Entity<AppRolePrivilege>(entity =>
      {
        entity.HasKey(e => e.RolePrivilegeId)
            .HasName("PK__appRoleP__CC91E9C52CC8E2EF");

        entity.ToTable("appRolePrivilege");

        entity.Property(e => e.RolePrivilegeId).HasColumnName("rolePrivilegeId");

        entity.Property(e => e.Add).HasColumnName("add");

        entity.Property(e => e.PrivilegeId).HasColumnName("privilegeId");

        entity.Property(e => e.RoleId).HasColumnName("roleId");

        entity.Property(e => e.Update).HasColumnName("update");

        entity.Property(e => e.View).HasColumnName("view");

        entity.HasOne(d => d.Privilege)
            .WithMany(p => p.AppRolePrivilege)
            .HasForeignKey(d => d.PrivilegeId)
            .HasConstraintName("FK__appRolePr__privi__19DFD96B");

        entity.HasOne(d => d.Role)
            .WithMany(p => p.AppRolePrivilege)
            .HasForeignKey(d => d.RoleId)
            .HasConstraintName("FK__appRolePr__roleI__29221CFB");
      });

      modelBuilder.Entity<AppUser>(entity =>
      {
        entity.HasKey(e => e.UserId)
            .HasName("PK__appUser__CB9A1CFF4CAD1926");

        entity.ToTable("appUser");

        entity.HasIndex(e => e.Username)
            .HasName("IX_CheckDupIndexOnAppUser")
            .IsUnique();

        entity.Property(e => e.UserId).HasColumnName("userId");

        entity.Property(e => e.Approved).HasColumnName("approved");

        entity.Property(e => e.ApprovedBy)
            .HasColumnName("approvedBy")
            .HasMaxLength(100)
            .IsUnicode(false);

        entity.Property(e => e.ApprovedDate).HasColumnName("approvedDate");

        entity.Property(e => e.CreatedBy)
            .HasColumnName("createdBy")
            .HasMaxLength(100)
            .IsUnicode(false);

        entity.Property(e => e.CreatedDate).HasColumnName("createdDate");

        entity.Property(e => e.Email)
            .HasColumnName("email")
            .HasMaxLength(200)
            .IsUnicode(false);

        entity.Property(e => e.Fullname)
            .HasColumnName("fullname")
            .HasMaxLength(200)
            .IsUnicode(false);

        entity.Property(e => e.Pswd)
            .HasColumnName("pswd")
            .HasMaxLength(500)
            .IsUnicode(false);

        entity.Property(e => e.RoleId).HasColumnName("roleId");

        entity.Property(e => e.Status).HasColumnName("status");

        entity.Property(e => e.Username)
            .HasColumnName("username")
            .HasMaxLength(100)
            .IsUnicode(false);

        entity.HasOne(d => d.Role)
            .WithMany(p => p.AppUser)
            .HasForeignKey(d => d.RoleId)
            .HasConstraintName("FK__appUser__roleId__2A164134");
      });

      modelBuilder.Entity<Branch>(entity =>
      {
        entity.ToTable("branch");

        entity.HasIndex(e => e.BranchName)
            .HasName("IX_CheckDupIndexOnBranch")
            .IsUnique();

        entity.Property(e => e.BranchId).HasColumnName("branchId");

        entity.Property(e => e.BranchCode)
            .HasColumnName("branchCode")
            .HasMaxLength(10)
            .IsUnicode(false);

        entity.Property(e => e.BranchName)
            .HasColumnName("branchName")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.Emails)
            .HasColumnName("emails")
            .HasMaxLength(4000)
            .IsUnicode(false);
      });

      modelBuilder.Entity<ConfigApproval>(entity =>
      {
        entity.ToTable("configApproval");

        entity.Property(e => e.ConfigApprovalId).HasColumnName("configApprovalId");

        entity.Property(e => e.Approved).HasColumnName("approved");

        entity.Property(e => e.ApprovedBy).HasColumnName("approvedBy");

        entity.Property(e => e.ApprovedDate)
            .HasColumnName("approvedDate")
            .HasColumnType("date");

        entity.Property(e => e.ConfigId).HasColumnName("configId");

        entity.Property(e => e.UpdatedBy).HasColumnName("updatedBy");

        entity.Property(e => e.UpdatedDate)
            .HasColumnName("updatedDate")
            .HasColumnType("date");
      });

      modelBuilder.Entity<Ldap>(entity =>
      {
        entity.ToTable("ldap");

        entity.Property(e => e.LdapId).HasColumnName("ldapId");

        entity.Property(e => e.Domain)
            .HasColumnName("domain")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.Filter)
            .HasColumnName("filter")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.Ldapstring)
            .HasColumnName("ldapstring")
            .HasMaxLength(400)
            .IsUnicode(false);
      });

      modelBuilder.Entity<LicInfo>(entity =>
      {
        entity.ToTable("licInfo");

        entity.Property(e => e.Id).HasColumnName("id");

        entity.Property(e => e.Info)
            .HasColumnName("info")
            .HasMaxLength(5000)
            .IsUnicode(false);
      });

      modelBuilder.Entity<OperationLog>(entity =>
      {
        entity.HasKey(e => e.Logid)
            .HasName("PK__operatio__7838F26561065E57");

        entity.ToTable("operationLog");

        entity.Property(e => e.Logid).HasColumnName("logid");

        entity.Property(e => e.ImgBytes).HasColumnName("imgBytes");

        entity.Property(e => e.IncidentDate).HasColumnName("incidentDate");

        entity.Property(e => e.Ip)
            .HasColumnName("ip")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.LogMsg)
            .HasColumnName("logMsg")
            .HasMaxLength(400)
            .IsUnicode(false);
      });

      modelBuilder.Entity<Terminal>(entity =>
      {
        entity.ToTable("terminal");

        entity.HasIndex(e => new { e.Terminalid, e.Ip })
            .HasName("ix_uniq_ip_terminal_")
            .IsUnique();

        entity.Property(e => e.Id).HasColumnName("id");

        entity.Property(e => e.BranchId).HasColumnName("branchId");

        entity.Property(e => e.Createddate).HasColumnName("createddate");

        entity.Property(e => e.Ip)
            .HasColumnName("ip")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.OnlineDate).HasColumnName("online_date");

        entity.Property(e => e.Terminalid)
            .HasColumnName("terminalid")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.Title)
            .HasColumnName("title")
            .HasMaxLength(200)
            .IsUnicode(false);

        entity.Property(e => e.Updateddate)
            .HasColumnName("updateddate")
            .HasDefaultValueSql("(getdate())");

        entity.Property(e => e.Vendorid).HasColumnName("vendorid");

        entity.HasOne(d => d.Vendor)
            .WithMany(p => p.Terminal)
            .HasForeignKey(d => d.Vendorid)
            .HasConstraintName("FK__terminal__vendor__2B0A656D");
      });

      modelBuilder.Entity<TerminalConfig>(entity =>
      {
        entity.HasKey(e => e.ConfigId)
            .HasName("PK__terminal__3FEDA8E64112D0AD");

        entity.ToTable("terminalConfig");

        entity.HasIndex(e => new { e.Id, e.VendorConfigId })
            .HasName("IX_CheckDupIndexOnTerminalConfig")
            .IsUnique();

        entity.Property(e => e.ConfigId).HasColumnName("configId");

        entity.Property(e => e.Configloaded).HasColumnName("configloaded");

        entity.Property(e => e.Debuglevel).HasColumnName("debuglevel");

        entity.Property(e => e.EscalationDelayTimeInMin).HasColumnName("escalationDelayTimeInMin");

        entity.Property(e => e.ExcludeFaceForNight).HasColumnName("excludeFaceForNight");

        entity.Property(e => e.Facedetect).HasColumnName("facedetect");

        entity.Property(e => e.Id).HasColumnName("id");

        entity.Property(e => e.ImageBrightness).HasColumnName("imageBrightness");

        entity.Property(e => e.IntelliCamEnabled).HasColumnName("intelliCamEnabled");

        entity.Property(e => e.ManageCapturing).HasColumnName("manageCapturing");

        entity.Property(e => e.NightSensitivity).HasColumnName("nightSensitivity");

        entity.Property(e => e.SendAlert).HasColumnName("sendAlert");

        entity.Property(e => e.Updateddate)
            .HasColumnName("updateddate")
            .HasDefaultValueSql("(getdate())");

        entity.Property(e => e.ValidationMode)
            .HasColumnName("validationMode")
            .HasMaxLength(150)
            .IsUnicode(false);

        entity.Property(e => e.VendorConfigId).HasColumnName("vendorConfigId");

        entity.HasOne(d => d.VendorConfig)
            .WithMany(p => p.TerminalConfig)
            .HasForeignKey(d => d.VendorConfigId)
            .HasConstraintName("FK__terminalC__vendo__3A81B327");
      });

      modelBuilder.Entity<Vendor>(entity =>
      {
        entity.ToTable("vendor");

        entity.Property(e => e.VendorId).HasColumnName("vendorId");

        entity.Property(e => e.Vendor1)
            .HasColumnName("vendor")
            .HasMaxLength(30)
            .IsUnicode(false);
      });

      modelBuilder.Entity<VendorConfiguration>(entity =>
      {
        entity.HasKey(e => e.VendorConfigId)
            .HasName("PK__vendorCo__28AF1DD22979756D");

        entity.ToTable("vendorConfiguration");

        entity.HasIndex(e => new { e.AppId, e.VendorId })
            .HasName("IX_CheckDupIndexOnVendorConfig")
            .IsUnique();

        entity.Property(e => e.VendorConfigId).HasColumnName("vendorConfigId");

        entity.Property(e => e.AppId)
            .HasColumnName("appId")
            .HasMaxLength(5)
            .IsUnicode(false);

        entity.Property(e => e.AtmlogFilter)
            .HasColumnName("atmlogFilter")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.AtmlogPath)
            .HasColumnName("atmlogPath")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.EjFilter)
            .HasColumnName("ejFilter")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.EjPath)
            .HasColumnName("ejPath")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.EjectMode)
            .HasColumnName("ejectMode")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.EventsExclude)
            .HasColumnName("eventsExclude")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.FwsControl).HasColumnName("fwsControl");

        entity.Property(e => e.ImageFilter)
            .HasColumnName("imageFilter")
            .HasMaxLength(4)
            .IsUnicode(false);

        entity.Property(e => e.ImagePath)
            .HasColumnName("imagePath")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.RemoteIp)
            .HasColumnName("remoteIp")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.RemotePort)
            .HasColumnName("remotePort")
            .HasMaxLength(40)
            .IsUnicode(false);

        entity.Property(e => e.VendorConfigName)
            .HasColumnName("vendorConfigName")
            .HasMaxLength(30)
            .IsUnicode(false);

        entity.Property(e => e.VendorId).HasColumnName("vendorId");

        entity.Property(e => e.WniServiceTimeout).HasColumnName("wniServiceTimeout");

        entity.HasOne(d => d.Vendor)
            .WithMany(p => p.VendorConfiguration)
            .HasForeignKey(d => d.VendorId)
            .HasConstraintName("FK__vendorCon__vendo__2F10007B");
      });

      modelBuilder.Entity<VwAlert>(entity =>
      {
        entity.HasNoKey();

        entity.ToView("vw_alert");

        entity.Property(e => e.ADate).HasColumnName("aDate");

        entity.Property(e => e.AppId)
            .HasColumnName("appID")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.Ip)
            .HasColumnName("ip")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.Message)
            .HasColumnName("message")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.MsgCat)
            .HasColumnName("msgCat")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.Sent).HasColumnName("sent");

        entity.Property(e => e.Status)
            .IsRequired()
            .HasColumnName("status")
            .HasMaxLength(6)
            .IsUnicode(false);

        entity.Property(e => e.StatusId).HasColumnName("statusId");

        entity.Property(e => e.TerminalId)
            .IsRequired()
            .HasColumnName("terminalId")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.Title)
            .IsRequired()
            .HasColumnName("title")
            .HasMaxLength(200)
            .IsUnicode(false);

        entity.Property(e => e.UDate).HasColumnName("uDate");
      });

      modelBuilder.Entity<VwConfiguration>(entity =>
      {
        entity.HasNoKey();

        entity.ToView("vw_configuration");

        entity.Property(e => e.AppId)
            .HasColumnName("appId")
            .HasMaxLength(5)
            .IsUnicode(false);

        entity.Property(e => e.AtmlogFilter)
            .HasColumnName("atmlogFilter")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.AtmlogPath)
            .HasColumnName("atmlogPath")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.ConfigId).HasColumnName("configId");

        entity.Property(e => e.Configloaded).HasColumnName("configloaded");

        entity.Property(e => e.Debuglevel).HasColumnName("debuglevel");

        entity.Property(e => e.EjFilter)
            .HasColumnName("ejFilter")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.EjPath)
            .HasColumnName("ejPath")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.EjectMode)
            .HasColumnName("ejectMode")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.EscalationDelayTimeInMin).HasColumnName("escalationDelayTimeInMin");

        entity.Property(e => e.EventsExclude)
            .HasColumnName("eventsExclude")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.ExcludeFaceForNight).HasColumnName("excludeFaceForNight");

        entity.Property(e => e.Facedetect).HasColumnName("facedetect");

        entity.Property(e => e.FwsControl).HasColumnName("fwsControl");

        entity.Property(e => e.Id).HasColumnName("id");

        entity.Property(e => e.ImageBrightness).HasColumnName("imageBrightness");

        entity.Property(e => e.ImageFilter)
            .HasColumnName("imageFilter")
            .HasMaxLength(4)
            .IsUnicode(false);

        entity.Property(e => e.ImagePath)
            .HasColumnName("imagePath")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.IntelliCamEnabled).HasColumnName("intelliCamEnabled");

        entity.Property(e => e.Ip)
            .HasColumnName("ip")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.ManageCapturing).HasColumnName("manageCapturing");

        entity.Property(e => e.NightSensitivity).HasColumnName("nightSensitivity");

        entity.Property(e => e.RemoteIp)
            .HasColumnName("remoteIp")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.RemotePort)
            .HasColumnName("remotePort")
            .HasMaxLength(40)
            .IsUnicode(false);

        entity.Property(e => e.SendAlert).HasColumnName("sendAlert");

        entity.Property(e => e.Terminalid)
            .HasColumnName("terminalid")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.ValidationMode)
            .HasColumnName("validationMode")
            .HasMaxLength(150)
            .IsUnicode(false);

        entity.Property(e => e.VendorConfigId).HasColumnName("vendorConfigId");

        entity.Property(e => e.VendorConfigName)
            .HasColumnName("vendorConfigName")
            .HasMaxLength(30)
            .IsUnicode(false);

        entity.Property(e => e.VendorId).HasColumnName("vendorId");

        entity.Property(e => e.WniServiceTimeout).HasColumnName("wniServiceTimeout");
      });

      modelBuilder.Entity<VwConfigurationApproval>(entity =>
      {
        entity.HasNoKey();

        entity.ToView("vw_configuration_approval");

        entity.Property(e => e.AppId)
            .HasColumnName("appId")
            .HasMaxLength(5)
            .IsUnicode(false);

        entity.Property(e => e.Approved).HasColumnName("approved");

        entity.Property(e => e.ApprovedBy).HasColumnName("approvedBy");

        entity.Property(e => e.ApprovedDate)
            .HasColumnName("approvedDate")
            .HasColumnType("date");

        entity.Property(e => e.AtmlogFilter)
            .HasColumnName("atmlogFilter")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.AtmlogPath)
            .HasColumnName("atmlogPath")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.ConfigId).HasColumnName("configId");

        entity.Property(e => e.Configloaded).HasColumnName("configloaded");

        entity.Property(e => e.Debuglevel).HasColumnName("debuglevel");

        entity.Property(e => e.EjFilter)
            .HasColumnName("ejFilter")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.EjPath)
            .HasColumnName("ejPath")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.EjectMode)
            .HasColumnName("ejectMode")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.EscalationDelayTimeInMin).HasColumnName("escalationDelayTimeInMin");

        entity.Property(e => e.EventsExclude)
            .HasColumnName("eventsExclude")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.ExcludeFaceForNight).HasColumnName("excludeFaceForNight");

        entity.Property(e => e.Facedetect).HasColumnName("facedetect");

        entity.Property(e => e.FwsControl).HasColumnName("fwsControl");

        entity.Property(e => e.Id).HasColumnName("id");

        entity.Property(e => e.ImageBrightness).HasColumnName("imageBrightness");

        entity.Property(e => e.ImageFilter)
            .HasColumnName("imageFilter")
            .HasMaxLength(4)
            .IsUnicode(false);

        entity.Property(e => e.ImagePath)
            .HasColumnName("imagePath")
            .HasMaxLength(400)
            .IsUnicode(false);

        entity.Property(e => e.IntelliCamEnabled).HasColumnName("intelliCamEnabled");

        entity.Property(e => e.Ip)
            .HasColumnName("ip")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.ManageCapturing).HasColumnName("manageCapturing");

        entity.Property(e => e.NightSensitivity).HasColumnName("nightSensitivity");

        entity.Property(e => e.RemoteIp)
            .HasColumnName("remoteIp")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.RemotePort)
            .HasColumnName("remotePort")
            .HasMaxLength(40)
            .IsUnicode(false);

        entity.Property(e => e.SendAlert).HasColumnName("sendAlert");

        entity.Property(e => e.Terminalid)
            .HasColumnName("terminalid")
            .HasMaxLength(50)
            .IsUnicode(false);

        entity.Property(e => e.UpdatedBy).HasColumnName("updatedBy");

        entity.Property(e => e.UpdatedDate)
            .HasColumnName("updatedDate")
            .HasColumnType("date");

        entity.Property(e => e.ValidationMode)
            .HasColumnName("validationMode")
            .HasMaxLength(150)
            .IsUnicode(false);

        entity.Property(e => e.Vendor)
            .HasColumnName("vendor")
            .HasMaxLength(30)
            .IsUnicode(false);

        entity.Property(e => e.VendorConfigId).HasColumnName("vendorConfigId");

        entity.Property(e => e.VendorConfigName)
            .HasColumnName("vendorConfigName")
            .HasMaxLength(30)
            .IsUnicode(false);

        entity.Property(e => e.VendorId).HasColumnName("vendorId");

        entity.Property(e => e.WniServiceTimeout).HasColumnName("wniServiceTimeout");
      });

      OnModelCreatingPartial(modelBuilder);
    }
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
   }
}
