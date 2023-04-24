using System;
using System.Collections.Generic;

namespace AtmOneMonitoringLibrary.Models
{
    public partial class AppRole
    {
        public AppRole()
        {
            AppRolePrivilege = new HashSet<AppRolePrivilege>();
            AppUser = new HashSet<AppUser>();
        }

        public int RoleId { get; set; }
        public string Rolename { get; set; }

        public virtual ICollection<AppRolePrivilege> AppRolePrivilege { get; set; }
        public virtual ICollection<AppUser> AppUser { get; set; }
    }
}
