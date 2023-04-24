export interface IRolePrivileges {
  id: number;
  rolename: string;
  privilege: IPrivileges[];
}

export interface IRolePrivilege {
  rolePrivilegeId: number;
  privilegeId: number;
  privilege: string;
  roleId: number;
  roleName: string;
  add: boolean;
  edit: boolean;
  view: boolean;
  url: string;
  denied: boolean;
}

export interface IPrivileges {
  id: number;
  privilege: string;
}

export interface IRemovePrivileges {}
