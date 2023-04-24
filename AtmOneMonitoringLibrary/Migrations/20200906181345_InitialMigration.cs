using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace AtmOneMonitoringLibrary.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "alert",
                columns: table => new
                {
                    alertId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ip = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    appID = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    msgCat = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    message = table.Column<string>(unicode: false, maxLength: 400, nullable: true),
                    statusId = table.Column<int>(nullable: true),
                    aDate = table.Column<DateTime>(nullable: true),
                    uDate = table.Column<DateTime>(nullable: true),
                    sent = table.Column<bool>(nullable: true, defaultValueSql: "((0))"),
                    report_sent = table.Column<bool>(nullable: true, defaultValueSql: "((0))"),
                    branch_sent = table.Column<bool>(nullable: true, defaultValueSql: "((0))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_alert", x => x.alertId);
                });

            migrationBuilder.CreateTable(
                name: "appPrivilege",
                columns: table => new
                {
                    privilegeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    privilege = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    url = table.Column<string>(unicode: false, maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__appPrivi__49A199917580734F", x => x.privilegeId);
                });

            migrationBuilder.CreateTable(
                name: "appRole",
                columns: table => new
                {
                    roleId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rolename = table.Column<string>(unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__appRole__CD98462A8E988D62", x => x.roleId);
                });

            migrationBuilder.CreateTable(
                name: "branch",
                columns: table => new
                {
                    branchId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    branchCode = table.Column<string>(unicode: false, maxLength: 10, nullable: true),
                    branchName = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    emails = table.Column<string>(unicode: false, maxLength: 4000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_branch", x => x.branchId);
                });

            migrationBuilder.CreateTable(
                name: "configApproval",
                columns: table => new
                {
                    configApprovalId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    configId = table.Column<int>(nullable: true),
                    updatedBy = table.Column<int>(nullable: true),
                    updatedDate = table.Column<DateTime>(type: "date", nullable: true),
                    approvedBy = table.Column<int>(nullable: true),
                    approvedDate = table.Column<DateTime>(type: "date", nullable: true),
                    approved = table.Column<bool>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_configApproval", x => x.configApprovalId);
                });

            migrationBuilder.CreateTable(
                name: "ldap",
                columns: table => new
                {
                    ldapId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ldapstring = table.Column<string>(unicode: false, maxLength: 400, nullable: true),
                    filter = table.Column<string>(unicode: false, maxLength: 400, nullable: true),
                    domain = table.Column<string>(unicode: false, maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ldap", x => x.ldapId);
                });

            migrationBuilder.CreateTable(
                name: "licInfo",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    info = table.Column<string>(unicode: false, maxLength: 5000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_licInfo", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "operationLog",
                columns: table => new
                {
                    logid = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ip = table.Column<string>(unicode: false, maxLength: 20, nullable: true),
                    logMsg = table.Column<string>(unicode: false, maxLength: 400, nullable: true),
                    imgBytes = table.Column<byte[]>(nullable: true),
                    incidentDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__operatio__7838F26561065E57", x => x.logid);
                });

            migrationBuilder.CreateTable(
                name: "vendor",
                columns: table => new
                {
                    vendorId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    vendor = table.Column<string>(unicode: false, maxLength: 30, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_vendor", x => x.vendorId);
                });

            migrationBuilder.CreateTable(
                name: "appRolePrivilege",
                columns: table => new
                {
                    rolePrivilegeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    privilegeId = table.Column<int>(nullable: true),
                    roleId = table.Column<int>(nullable: true),
                    add = table.Column<bool>(nullable: true),
                    update = table.Column<bool>(nullable: true),
                    view = table.Column<bool>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__appRoleP__CC91E9C52CC8E2EF", x => x.rolePrivilegeId);
                    table.ForeignKey(
                        name: "FK__appRolePr__privi__19DFD96B",
                        column: x => x.privilegeId,
                        principalTable: "appPrivilege",
                        principalColumn: "privilegeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK__appRolePr__roleI__29221CFB",
                        column: x => x.roleId,
                        principalTable: "appRole",
                        principalColumn: "roleId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "appUser",
                columns: table => new
                {
                    userId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    roleId = table.Column<int>(nullable: true),
                    username = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    fullname = table.Column<string>(unicode: false, maxLength: 200, nullable: true),
                    pswd = table.Column<string>(unicode: false, maxLength: 500, nullable: true),
                    email = table.Column<string>(unicode: false, maxLength: 200, nullable: true),
                    createdBy = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    createdDate = table.Column<DateTime>(nullable: true),
                    approvedBy = table.Column<string>(unicode: false, maxLength: 100, nullable: true),
                    approvedDate = table.Column<DateTime>(nullable: true),
                    approved = table.Column<bool>(nullable: true),
                    status = table.Column<bool>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__appUser__CB9A1CFF4CAD1926", x => x.userId);
                    table.ForeignKey(
                        name: "FK__appUser__roleId__2A164134",
                        column: x => x.roleId,
                        principalTable: "appRole",
                        principalColumn: "roleId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "terminal",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ip = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    terminalid = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    title = table.Column<string>(unicode: false, maxLength: 200, nullable: true),
                    vendorid = table.Column<int>(nullable: true),
                    branchId = table.Column<int>(nullable: true),
                    online_date = table.Column<DateTime>(nullable: true),
                    createddate = table.Column<DateTime>(nullable: true),
                    updateddate = table.Column<DateTime>(nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_terminal", x => x.id);
                    table.ForeignKey(
                        name: "FK__terminal__vendor__2B0A656D",
                        column: x => x.vendorid,
                        principalTable: "vendor",
                        principalColumn: "vendorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "vendorConfiguration",
                columns: table => new
                {
                    vendorConfigId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    vendorConfigName = table.Column<string>(unicode: false, maxLength: 30, nullable: true),
                    appId = table.Column<string>(unicode: false, maxLength: 5, nullable: true),
                    vendorId = table.Column<int>(nullable: true),
                    imagePath = table.Column<string>(unicode: false, maxLength: 400, nullable: true),
                    imageFilter = table.Column<string>(unicode: false, maxLength: 4, nullable: true),
                    atmlogPath = table.Column<string>(unicode: false, maxLength: 400, nullable: true),
                    atmlogFilter = table.Column<string>(unicode: false, maxLength: 20, nullable: true),
                    ejPath = table.Column<string>(unicode: false, maxLength: 400, nullable: true),
                    ejFilter = table.Column<string>(unicode: false, maxLength: 20, nullable: true),
                    ejectMode = table.Column<string>(unicode: false, maxLength: 20, nullable: true),
                    eventsExclude = table.Column<string>(unicode: false, maxLength: 400, nullable: true),
                    fwsControl = table.Column<bool>(nullable: true),
                    wniServiceTimeout = table.Column<int>(nullable: true),
                    remotePort = table.Column<string>(unicode: false, maxLength: 40, nullable: true),
                    remoteIp = table.Column<string>(unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__vendorCo__28AF1DD22979756D", x => x.vendorConfigId);
                    table.ForeignKey(
                        name: "FK__vendorCon__vendo__2F10007B",
                        column: x => x.vendorId,
                        principalTable: "vendor",
                        principalColumn: "vendorId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "appAudit",
                columns: table => new
                {
                    auditId = table.Column<long>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    privilegeId = table.Column<int>(nullable: true),
                    userId = table.Column<int>(nullable: true),
                    oldValues = table.Column<string>(unicode: false, nullable: true),
                    newValues = table.Column<string>(unicode: false, nullable: true),
                    action = table.Column<string>(unicode: false, maxLength: 200, nullable: true),
                    sysIP = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    sysName = table.Column<string>(unicode: false, maxLength: 50, nullable: true),
                    logDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__appAudit__43D17399CA9C1727", x => x.auditId);
                    table.ForeignKey(
                        name: "FK__appAudit__privil__2A164134",
                        column: x => x.privilegeId,
                        principalTable: "appPrivilege",
                        principalColumn: "privilegeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK__appAudit__userId__2739D489",
                        column: x => x.userId,
                        principalTable: "appUser",
                        principalColumn: "userId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "terminalConfig",
                columns: table => new
                {
                    configId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    id = table.Column<int>(nullable: true),
                    vendorConfigId = table.Column<int>(nullable: true),
                    imageBrightness = table.Column<double>(nullable: true),
                    nightSensitivity = table.Column<double>(nullable: true),
                    manageCapturing = table.Column<bool>(nullable: true),
                    escalationDelayTimeInMin = table.Column<double>(nullable: true),
                    facedetect = table.Column<bool>(nullable: true),
                    sendAlert = table.Column<bool>(nullable: true),
                    debuglevel = table.Column<int>(nullable: true),
                    intelliCamEnabled = table.Column<bool>(nullable: true),
                    excludeFaceForNight = table.Column<bool>(nullable: true),
                    validationMode = table.Column<string>(unicode: false, maxLength: 150, nullable: true),
                    configloaded = table.Column<bool>(nullable: true),
                    updateddate = table.Column<DateTime>(nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__terminal__3FEDA8E64112D0AD", x => x.configId);
                    table.ForeignKey(
                        name: "FK__terminalC__vendo__3A81B327",
                        column: x => x.vendorConfigId,
                        principalTable: "vendorConfiguration",
                        principalColumn: "vendorConfigId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_appAudit_privilegeId",
                table: "appAudit",
                column: "privilegeId");

            migrationBuilder.CreateIndex(
                name: "IX_appAudit_userId",
                table: "appAudit",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_appRolePrivilege_privilegeId",
                table: "appRolePrivilege",
                column: "privilegeId");

            migrationBuilder.CreateIndex(
                name: "IX_appRolePrivilege_roleId",
                table: "appRolePrivilege",
                column: "roleId");

            migrationBuilder.CreateIndex(
                name: "IX_appUser_roleId",
                table: "appUser",
                column: "roleId");

            migrationBuilder.CreateIndex(
                name: "IX_CheckDupIndexOnAppUser",
                table: "appUser",
                column: "username",
                unique: true,
                filter: "[username] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CheckDupIndexOnBranch",
                table: "branch",
                column: "branchName",
                unique: true,
                filter: "[branchName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_terminal_vendorid",
                table: "terminal",
                column: "vendorid");

            migrationBuilder.CreateIndex(
                name: "ix_uniq_ip_terminal_",
                table: "terminal",
                columns: new[] { "terminalid", "ip" },
                unique: true,
                filter: "[terminalid] IS NOT NULL AND [ip] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_terminalConfig_vendorConfigId",
                table: "terminalConfig",
                column: "vendorConfigId");

            migrationBuilder.CreateIndex(
                name: "IX_CheckDupIndexOnTerminalConfig",
                table: "terminalConfig",
                columns: new[] { "id", "vendorConfigId" },
                unique: true,
                filter: "[id] IS NOT NULL AND [vendorConfigId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_vendorConfiguration_vendorId",
                table: "vendorConfiguration",
                column: "vendorId");

            migrationBuilder.CreateIndex(
                name: "IX_CheckDupIndexOnVendorConfig",
                table: "vendorConfiguration",
                columns: new[] { "appId", "vendorId" },
                unique: true,
                filter: "[appId] IS NOT NULL AND [vendorId] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "alert");

            migrationBuilder.DropTable(
                name: "appAudit");

            migrationBuilder.DropTable(
                name: "appRolePrivilege");

            migrationBuilder.DropTable(
                name: "branch");

            migrationBuilder.DropTable(
                name: "configApproval");

            migrationBuilder.DropTable(
                name: "ldap");

            migrationBuilder.DropTable(
                name: "licInfo");

            migrationBuilder.DropTable(
                name: "operationLog");

            migrationBuilder.DropTable(
                name: "terminal");

            migrationBuilder.DropTable(
                name: "terminalConfig");

            migrationBuilder.DropTable(
                name: "appUser");

            migrationBuilder.DropTable(
                name: "appPrivilege");

            migrationBuilder.DropTable(
                name: "vendorConfiguration");

            migrationBuilder.DropTable(
                name: "appRole");

            migrationBuilder.DropTable(
                name: "vendor");
        }
    }
}
