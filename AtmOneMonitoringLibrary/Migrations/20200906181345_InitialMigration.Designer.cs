﻿// <auto-generated />
using System;
using AtmOneMonitoringLibrary.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AtmOneMonitoringLibrary.Migrations
{
    [DbContext(typeof(AtmOneMonitorContext))]
    [Migration("20200906181345_InitialMigration")]
    partial class InitialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.Alert", b =>
                {
                    b.Property<int>("AlertId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("alertId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime?>("ADate")
                        .HasColumnName("aDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("AppId")
                        .HasColumnName("appID")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50)
                        .IsUnicode(false);

                    b.Property<bool?>("BranchSent")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("branch_sent")
                        .HasColumnType("bit")
                        .HasDefaultValueSql("((0))");

                    b.Property<string>("Ip")
                        .HasColumnName("ip")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50)
                        .IsUnicode(false);

                    b.Property<string>("Message")
                        .HasColumnName("message")
                        .HasColumnType("varchar(400)")
                        .HasMaxLength(400)
                        .IsUnicode(false);

                    b.Property<string>("MsgCat")
                        .HasColumnName("msgCat")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50)
                        .IsUnicode(false);

                    b.Property<bool?>("ReportSent")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("report_sent")
                        .HasColumnType("bit")
                        .HasDefaultValueSql("((0))");

                    b.Property<bool?>("Sent")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("sent")
                        .HasColumnType("bit")
                        .HasDefaultValueSql("((0))");

                    b.Property<int?>("StatusId")
                        .HasColumnName("statusId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UDate")
                        .HasColumnName("uDate")
                        .HasColumnType("datetime2");

                    b.HasKey("AlertId");

                    b.ToTable("alert");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.AppAudit", b =>
                {
                    b.Property<long>("AuditId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("auditId")
                        .HasColumnType("bigint")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Action")
                        .HasColumnName("action")
                        .HasColumnType("varchar(200)")
                        .HasMaxLength(200)
                        .IsUnicode(false);

                    b.Property<DateTime?>("LogDate")
                        .HasColumnName("logDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("NewValues")
                        .HasColumnName("newValues")
                        .HasColumnType("varchar(max)")
                        .IsUnicode(false);

                    b.Property<string>("OldValues")
                        .HasColumnName("oldValues")
                        .HasColumnType("varchar(max)")
                        .IsUnicode(false);

                    b.Property<int?>("PrivilegeId")
                        .HasColumnName("privilegeId")
                        .HasColumnType("int");

                    b.Property<string>("SysIp")
                        .HasColumnName("sysIP")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50)
                        .IsUnicode(false);

                    b.Property<string>("SysName")
                        .HasColumnName("sysName")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50)
                        .IsUnicode(false);

                    b.Property<int?>("UserId")
                        .HasColumnName("userId")
                        .HasColumnType("int");

                    b.HasKey("AuditId")
                        .HasName("PK__appAudit__43D17399CA9C1727");

                    b.HasIndex("PrivilegeId");

                    b.HasIndex("UserId");

                    b.ToTable("appAudit");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.AppPrivilege", b =>
                {
                    b.Property<int>("PrivilegeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("privilegeId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Privilege")
                        .HasColumnName("privilege")
                        .HasColumnType("varchar(100)")
                        .HasMaxLength(100)
                        .IsUnicode(false);

                    b.Property<string>("Url")
                        .HasColumnName("url")
                        .HasColumnType("varchar(400)")
                        .HasMaxLength(400)
                        .IsUnicode(false);

                    b.HasKey("PrivilegeId")
                        .HasName("PK__appPrivi__49A199917580734F");

                    b.ToTable("appPrivilege");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.AppRole", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("roleId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Rolename")
                        .HasColumnName("rolename")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50)
                        .IsUnicode(false);

                    b.HasKey("RoleId")
                        .HasName("PK__appRole__CD98462A8E988D62");

                    b.ToTable("appRole");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.AppRolePrivilege", b =>
                {
                    b.Property<int>("RolePrivilegeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("rolePrivilegeId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool?>("Add")
                        .HasColumnName("add")
                        .HasColumnType("bit");

                    b.Property<int?>("PrivilegeId")
                        .HasColumnName("privilegeId")
                        .HasColumnType("int");

                    b.Property<int?>("RoleId")
                        .HasColumnName("roleId")
                        .HasColumnType("int");

                    b.Property<bool?>("Update")
                        .HasColumnName("update")
                        .HasColumnType("bit");

                    b.Property<bool?>("View")
                        .HasColumnName("view")
                        .HasColumnType("bit");

                    b.HasKey("RolePrivilegeId")
                        .HasName("PK__appRoleP__CC91E9C52CC8E2EF");

                    b.HasIndex("PrivilegeId");

                    b.HasIndex("RoleId");

                    b.ToTable("appRolePrivilege");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.AppUser", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("userId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool?>("Approved")
                        .HasColumnName("approved")
                        .HasColumnType("bit");

                    b.Property<string>("ApprovedBy")
                        .HasColumnName("approvedBy")
                        .HasColumnType("varchar(100)")
                        .HasMaxLength(100)
                        .IsUnicode(false);

                    b.Property<DateTime?>("ApprovedDate")
                        .HasColumnName("approvedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("CreatedBy")
                        .HasColumnName("createdBy")
                        .HasColumnType("varchar(100)")
                        .HasMaxLength(100)
                        .IsUnicode(false);

                    b.Property<DateTime?>("CreatedDate")
                        .HasColumnName("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .HasColumnName("email")
                        .HasColumnType("varchar(200)")
                        .HasMaxLength(200)
                        .IsUnicode(false);

                    b.Property<string>("Fullname")
                        .HasColumnName("fullname")
                        .HasColumnType("varchar(200)")
                        .HasMaxLength(200)
                        .IsUnicode(false);

                    b.Property<string>("Pswd")
                        .HasColumnName("pswd")
                        .HasColumnType("varchar(500)")
                        .HasMaxLength(500)
                        .IsUnicode(false);

                    b.Property<int?>("RoleId")
                        .HasColumnName("roleId")
                        .HasColumnType("int");

                    b.Property<bool?>("Status")
                        .HasColumnName("status")
                        .HasColumnType("bit");

                    b.Property<string>("Username")
                        .HasColumnName("username")
                        .HasColumnType("varchar(100)")
                        .HasMaxLength(100)
                        .IsUnicode(false);

                    b.HasKey("UserId")
                        .HasName("PK__appUser__CB9A1CFF4CAD1926");

                    b.HasIndex("RoleId");

                    b.HasIndex("Username")
                        .IsUnique()
                        .HasName("IX_CheckDupIndexOnAppUser")
                        .HasFilter("[username] IS NOT NULL");

                    b.ToTable("appUser");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.Branch", b =>
                {
                    b.Property<int>("BranchId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("branchId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("BranchCode")
                        .HasColumnName("branchCode")
                        .HasColumnType("varchar(10)")
                        .HasMaxLength(10)
                        .IsUnicode(false);

                    b.Property<string>("BranchName")
                        .HasColumnName("branchName")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50)
                        .IsUnicode(false);

                    b.Property<string>("Emails")
                        .HasColumnName("emails")
                        .HasColumnType("varchar(4000)")
                        .HasMaxLength(4000)
                        .IsUnicode(false);

                    b.HasKey("BranchId");

                    b.HasIndex("BranchName")
                        .IsUnique()
                        .HasName("IX_CheckDupIndexOnBranch")
                        .HasFilter("[branchName] IS NOT NULL");

                    b.ToTable("branch");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.ConfigApproval", b =>
                {
                    b.Property<int>("ConfigApprovalId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("configApprovalId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool?>("Approved")
                        .HasColumnName("approved")
                        .HasColumnType("bit");

                    b.Property<int?>("ApprovedBy")
                        .HasColumnName("approvedBy")
                        .HasColumnType("int");

                    b.Property<DateTime?>("ApprovedDate")
                        .HasColumnName("approvedDate")
                        .HasColumnType("date");

                    b.Property<int?>("ConfigId")
                        .HasColumnName("configId")
                        .HasColumnType("int");

                    b.Property<int?>("UpdatedBy")
                        .HasColumnName("updatedBy")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnName("updatedDate")
                        .HasColumnType("date");

                    b.HasKey("ConfigApprovalId");

                    b.ToTable("configApproval");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.Ldap", b =>
                {
                    b.Property<int>("LdapId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("ldapId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Domain")
                        .HasColumnName("domain")
                        .HasColumnType("varchar(400)")
                        .HasMaxLength(400)
                        .IsUnicode(false);

                    b.Property<string>("Filter")
                        .HasColumnName("filter")
                        .HasColumnType("varchar(400)")
                        .HasMaxLength(400)
                        .IsUnicode(false);

                    b.Property<string>("Ldapstring")
                        .HasColumnName("ldapstring")
                        .HasColumnType("varchar(400)")
                        .HasMaxLength(400)
                        .IsUnicode(false);

                    b.HasKey("LdapId");

                    b.ToTable("ldap");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.LicInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Info")
                        .HasColumnName("info")
                        .HasColumnType("varchar(5000)")
                        .HasMaxLength(5000)
                        .IsUnicode(false);

                    b.HasKey("Id");

                    b.ToTable("licInfo");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.OperationLog", b =>
                {
                    b.Property<int>("Logid")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("logid")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<byte[]>("ImgBytes")
                        .HasColumnName("imgBytes")
                        .HasColumnType("varbinary(max)");

                    b.Property<DateTime?>("IncidentDate")
                        .HasColumnName("incidentDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Ip")
                        .HasColumnName("ip")
                        .HasColumnType("varchar(20)")
                        .HasMaxLength(20)
                        .IsUnicode(false);

                    b.Property<string>("LogMsg")
                        .HasColumnName("logMsg")
                        .HasColumnType("varchar(400)")
                        .HasMaxLength(400)
                        .IsUnicode(false);

                    b.HasKey("Logid")
                        .HasName("PK__operatio__7838F26561065E57");

                    b.ToTable("operationLog");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.Terminal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("id")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("BranchId")
                        .HasColumnName("branchId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("Createddate")
                        .HasColumnName("createddate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Ip")
                        .HasColumnName("ip")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50)
                        .IsUnicode(false);

                    b.Property<DateTime?>("OnlineDate")
                        .HasColumnName("online_date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Terminalid")
                        .HasColumnName("terminalid")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50)
                        .IsUnicode(false);

                    b.Property<string>("Title")
                        .HasColumnName("title")
                        .HasColumnType("varchar(200)")
                        .HasMaxLength(200)
                        .IsUnicode(false);

                    b.Property<DateTime?>("Updateddate")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("updateddate")
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(getdate())");

                    b.Property<int?>("Vendorid")
                        .HasColumnName("vendorid")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("Vendorid");

                    b.HasIndex("Terminalid", "Ip")
                        .IsUnique()
                        .HasName("ix_uniq_ip_terminal_")
                        .HasFilter("[terminalid] IS NOT NULL AND [ip] IS NOT NULL");

                    b.ToTable("terminal");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.TerminalConfig", b =>
                {
                    b.Property<int>("ConfigId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("configId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<bool?>("Configloaded")
                        .HasColumnName("configloaded")
                        .HasColumnType("bit");

                    b.Property<int?>("Debuglevel")
                        .HasColumnName("debuglevel")
                        .HasColumnType("int");

                    b.Property<double?>("EscalationDelayTimeInMin")
                        .HasColumnName("escalationDelayTimeInMin")
                        .HasColumnType("float");

                    b.Property<bool?>("ExcludeFaceForNight")
                        .HasColumnName("excludeFaceForNight")
                        .HasColumnType("bit");

                    b.Property<bool?>("Facedetect")
                        .HasColumnName("facedetect")
                        .HasColumnType("bit");

                    b.Property<int?>("Id")
                        .HasColumnName("id")
                        .HasColumnType("int");

                    b.Property<double?>("ImageBrightness")
                        .HasColumnName("imageBrightness")
                        .HasColumnType("float");

                    b.Property<bool?>("IntelliCamEnabled")
                        .HasColumnName("intelliCamEnabled")
                        .HasColumnType("bit");

                    b.Property<bool?>("ManageCapturing")
                        .HasColumnName("manageCapturing")
                        .HasColumnType("bit");

                    b.Property<double?>("NightSensitivity")
                        .HasColumnName("nightSensitivity")
                        .HasColumnType("float");

                    b.Property<bool?>("SendAlert")
                        .HasColumnName("sendAlert")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("Updateddate")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("updateddate")
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("(getdate())");

                    b.Property<string>("ValidationMode")
                        .HasColumnName("validationMode")
                        .HasColumnType("varchar(150)")
                        .HasMaxLength(150)
                        .IsUnicode(false);

                    b.Property<int?>("VendorConfigId")
                        .HasColumnName("vendorConfigId")
                        .HasColumnType("int");

                    b.HasKey("ConfigId")
                        .HasName("PK__terminal__3FEDA8E64112D0AD");

                    b.HasIndex("VendorConfigId");

                    b.HasIndex("Id", "VendorConfigId")
                        .IsUnique()
                        .HasName("IX_CheckDupIndexOnTerminalConfig")
                        .HasFilter("[id] IS NOT NULL AND [vendorConfigId] IS NOT NULL");

                    b.ToTable("terminalConfig");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.Vendor", b =>
                {
                    b.Property<int>("VendorId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("vendorId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Vendor1")
                        .HasColumnName("vendor")
                        .HasColumnType("varchar(30)")
                        .HasMaxLength(30)
                        .IsUnicode(false);

                    b.HasKey("VendorId");

                    b.ToTable("vendor");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.VendorConfiguration", b =>
                {
                    b.Property<int>("VendorConfigId")
                        .ValueGeneratedOnAdd()
                        .HasColumnName("vendorConfigId")
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AppId")
                        .HasColumnName("appId")
                        .HasColumnType("varchar(5)")
                        .HasMaxLength(5)
                        .IsUnicode(false);

                    b.Property<string>("AtmlogFilter")
                        .HasColumnName("atmlogFilter")
                        .HasColumnType("varchar(20)")
                        .HasMaxLength(20)
                        .IsUnicode(false);

                    b.Property<string>("AtmlogPath")
                        .HasColumnName("atmlogPath")
                        .HasColumnType("varchar(400)")
                        .HasMaxLength(400)
                        .IsUnicode(false);

                    b.Property<string>("EjFilter")
                        .HasColumnName("ejFilter")
                        .HasColumnType("varchar(20)")
                        .HasMaxLength(20)
                        .IsUnicode(false);

                    b.Property<string>("EjPath")
                        .HasColumnName("ejPath")
                        .HasColumnType("varchar(400)")
                        .HasMaxLength(400)
                        .IsUnicode(false);

                    b.Property<string>("EjectMode")
                        .HasColumnName("ejectMode")
                        .HasColumnType("varchar(20)")
                        .HasMaxLength(20)
                        .IsUnicode(false);

                    b.Property<string>("EventsExclude")
                        .HasColumnName("eventsExclude")
                        .HasColumnType("varchar(400)")
                        .HasMaxLength(400)
                        .IsUnicode(false);

                    b.Property<bool?>("FwsControl")
                        .HasColumnName("fwsControl")
                        .HasColumnType("bit");

                    b.Property<string>("ImageFilter")
                        .HasColumnName("imageFilter")
                        .HasColumnType("varchar(4)")
                        .HasMaxLength(4)
                        .IsUnicode(false);

                    b.Property<string>("ImagePath")
                        .HasColumnName("imagePath")
                        .HasColumnType("varchar(400)")
                        .HasMaxLength(400)
                        .IsUnicode(false);

                    b.Property<string>("RemoteIp")
                        .HasColumnName("remoteIp")
                        .HasColumnType("varchar(50)")
                        .HasMaxLength(50)
                        .IsUnicode(false);

                    b.Property<string>("RemotePort")
                        .HasColumnName("remotePort")
                        .HasColumnType("varchar(40)")
                        .HasMaxLength(40)
                        .IsUnicode(false);

                    b.Property<string>("VendorConfigName")
                        .HasColumnName("vendorConfigName")
                        .HasColumnType("varchar(30)")
                        .HasMaxLength(30)
                        .IsUnicode(false);

                    b.Property<int?>("VendorId")
                        .HasColumnName("vendorId")
                        .HasColumnType("int");

                    b.Property<int?>("WniServiceTimeout")
                        .HasColumnName("wniServiceTimeout")
                        .HasColumnType("int");

                    b.HasKey("VendorConfigId")
                        .HasName("PK__vendorCo__28AF1DD22979756D");

                    b.HasIndex("VendorId");

                    b.HasIndex("AppId", "VendorId")
                        .IsUnique()
                        .HasName("IX_CheckDupIndexOnVendorConfig")
                        .HasFilter("[appId] IS NOT NULL AND [vendorId] IS NOT NULL");

                    b.ToTable("vendorConfiguration");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.AppAudit", b =>
                {
                    b.HasOne("AtmOneMonitoringLibrary.Models.AppPrivilege", "Privilege")
                        .WithMany("AppAudit")
                        .HasForeignKey("PrivilegeId")
                        .HasConstraintName("FK__appAudit__privil__2A164134");

                    b.HasOne("AtmOneMonitoringLibrary.Models.AppUser", "User")
                        .WithMany("AppAudit")
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK__appAudit__userId__2739D489");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.AppRolePrivilege", b =>
                {
                    b.HasOne("AtmOneMonitoringLibrary.Models.AppPrivilege", "Privilege")
                        .WithMany("AppRolePrivilege")
                        .HasForeignKey("PrivilegeId")
                        .HasConstraintName("FK__appRolePr__privi__19DFD96B");

                    b.HasOne("AtmOneMonitoringLibrary.Models.AppRole", "Role")
                        .WithMany("AppRolePrivilege")
                        .HasForeignKey("RoleId")
                        .HasConstraintName("FK__appRolePr__roleI__29221CFB");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.AppUser", b =>
                {
                    b.HasOne("AtmOneMonitoringLibrary.Models.AppRole", "Role")
                        .WithMany("AppUser")
                        .HasForeignKey("RoleId")
                        .HasConstraintName("FK__appUser__roleId__2A164134");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.Terminal", b =>
                {
                    b.HasOne("AtmOneMonitoringLibrary.Models.Vendor", "Vendor")
                        .WithMany("Terminal")
                        .HasForeignKey("Vendorid")
                        .HasConstraintName("FK__terminal__vendor__2B0A656D");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.TerminalConfig", b =>
                {
                    b.HasOne("AtmOneMonitoringLibrary.Models.VendorConfiguration", "VendorConfig")
                        .WithMany("TerminalConfig")
                        .HasForeignKey("VendorConfigId")
                        .HasConstraintName("FK__terminalC__vendo__3A81B327");
                });

            modelBuilder.Entity("AtmOneMonitoringLibrary.Models.VendorConfiguration", b =>
                {
                    b.HasOne("AtmOneMonitoringLibrary.Models.Vendor", "Vendor")
                        .WithMany("VendorConfiguration")
                        .HasForeignKey("VendorId")
                        .HasConstraintName("FK__vendorCon__vendo__2F10007B");
                });
#pragma warning restore 612, 618
        }
    }
}
